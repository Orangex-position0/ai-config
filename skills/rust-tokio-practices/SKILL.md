---
name: rust-tokio-practices
description: Review, design, and refactor Rust Tokio async code using practical Tokio conventions. Use when working with tokio::spawn, JoinHandle, JoinSet, select!, CancellationToken, TaskTracker, async workers, request handler background jobs, graceful shutdown, bounded channels, fire-and-forget tasks, blocking work in async code, or suspected Tokio task leaks.
---

# Rust Tokio Practices

Follow `rules/rust/rust-tokio-conventions.md` as the hard baseline. This skill expands practical Tokio usage, especially task lifecycle, into concrete review and refactor patterns.

## Core Rule

Treat every `tokio::spawn` as a managed task, not as a background thread.

Before spawning, answer:

1. Who owns this task?
2. Who observes its result, error, and panic?
3. Who tells it to stop?
4. Does shutdown wait for it?

If any answer is unclear, do not add a naked `tokio::spawn`.

## Review Workflow

When reviewing Tokio task code:

1. Find every `tokio::spawn`, `JoinHandle`, `JoinSet`, `CancellationToken`, `TaskTracker`, and worker loop.
2. Classify each task as request-scoped, bounded background work, or service-level long-running work.
3. Check whether the task has owner, observation, cancellation, and joining.
4. Check whether task creation is bounded by a queue, semaphore, pool, or fixed configuration.
5. Check shutdown: cancel first, wait second, timeout third, abort last.
6. Check whether blocking or CPU-heavy work uses `spawn_blocking`.

## Fire-and-forget Boundary

Dropping a `JoinHandle` is acceptable only when all are true:

- The task is short-lived.
- It holds no critical resource.
- Failure does not affect business correctness.
- No retry or result feedback is needed.
- Task count has an explicit upper bound.
- Shutdown does not need task cleanup.

Examples that may qualify: best-effort metrics, non-critical logging notifications, disposable cache warmup.

## Request Handler Anti-pattern

Bad: handler returns before the business action is known.

```rust
async fn handler(user_id: u64) -> &'static str {
    tokio::spawn(async move {
        send_email(user_id).await;
    });

    "ok"
}
```

Problems:

- The response does not mean the email was sent.
- Client cancellation does not cancel the email task.
- Failure and panic are not reported to the caller.
- Shutdown may interrupt the task.
- Request bursts can create unbounded tasks.

If the request needs the result, await directly:

```rust
async fn handler(user_id: u64) -> Result<&'static str, Error> {
    send_email(user_id).await?;
    Ok("sent")
}
```

If async processing is acceptable, submit to a bounded queue:

```rust
use tokio::sync::mpsc;

#[derive(Debug)]
struct EmailJob {
    user_id: u64,
}

async fn handler(
    tx: mpsc::Sender<EmailJob>,
    user_id: u64,
) -> Result<&'static str, &'static str> {
    tx.send(EmailJob { user_id })
        .await
        .map_err(|_| "email worker stopped")?;

    Ok("accepted")
}
```

Use a durable queue or task table when jobs must survive process crashes.

## CancellationToken Worker Pattern

Long-running tasks need a cooperative cancellation path.

```rust
use tokio_util::sync::CancellationToken;

async fn worker(shutdown: CancellationToken) {
    loop {
        tokio::select! {
            _ = shutdown.cancelled() => {
                flush_pending_data().await;
                break;
            }
            result = receive_job() => {
                handle_job(result).await;
            }
        }
    }
}
```

The token only signals shutdown. The task still owns safe cleanup: ack, flush, release leases, and write final state.

## JoinSet Pattern

Use `JoinSet` when tasks are dynamic and results should be handled by completion order.

```rust
use tokio::task::JoinSet;

let mut tasks = JoinSet::new();

for id in 0..10 {
    tasks.spawn(async move {
        process(id).await
    });
}

while let Some(result) = tasks.join_next().await {
    match result {
        Ok(value) => handle_result(value),
        Err(error) => tracing::error!(?error, "task failed"),
    }
}
```

Important semantics:

- Dropping `JoinSet` aborts unfinished tasks.
- `abort_all()` only submits cancellation.
- Keep calling `join_next()` until empty if you need cancellation completion.
- Do not rely on `Drop JoinSet` for business cleanup.

## Service-level Tasks

For long-lived service tasks, prefer central tracking with `TaskTracker` or an equivalent local supervisor.

Typical service-level tasks:

- Config refresh
- Periodic cleanup
- Message consumption
- Metrics collection

Expected shutdown shape:

```text
send cancellation signal
wait for task cleanup
timeout if cleanup hangs
abort as fallback
await handle to confirm completion
```

## Refactor Checklist

Use this checklist before finishing a Tokio task lifecycle change:

- Every `tokio::spawn` is saved, registered, or explicitly fire-and-forget.
- Long-lived tasks receive a cancellation signal.
- Shutdown waits for tasks that need cleanup.
- Background queues are bounded.
- Task result, error, and panic are observed where they matter.
- `abort()` appears only as timeout fallback.
- Blocking or CPU-heavy work uses `spawn_blocking`.
- Jobs that must survive crashes use durable storage, not only in-process `mpsc`.


