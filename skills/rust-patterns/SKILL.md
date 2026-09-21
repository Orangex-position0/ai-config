---
name: rust-patterns
description: Idiomatic Rust patterns, ownership, error handling, traits, concurrency, and best practices for building safe, performant applications.
metadata:
  origin: ECC
---

# Rust Development Patterns

Idiomatic Rust patterns and best practices for building safe, performant, and maintainable applications.

## When to Use

- Writing new Rust code
- Reviewing Rust code
- Refactoring existing Rust code
- Designing crate structure and module layout

## How It Works

This skill enforces idiomatic Rust conventions across six key areas: ownership and borrowing to prevent data races at compile time, `Result`/`?` error propagation with `thiserror` for libraries and `anyhow` for applications, enums and exhaustive pattern matching to make illegal states unrepresentable, traits and generics for zero-cost abstraction, safe concurrency via `Arc<Mutex<T>>`, channels, and async/await, and minimal `pub` surfaces organized by domain. For type-driven domain primitives, typestate, smart constructors, const generics, and pattern selection, follow `rules/rust/patterns.md`.

## Core Principles

### 1. Ownership and Borrowing

Rust's ownership system prevents data races and memory bugs at compile time.

```rust
// Good: Pass references when you don't need ownership
fn process(data: &[u8]) -> usize {
    data.len()
}

// Good: Take ownership only when you need to store or consume
fn store(data: Vec<u8>) -> Record {
    Record { payload: data }
}

// Bad: Cloning unnecessarily to avoid borrow checker
fn process_bad(data: &Vec<u8>) -> usize {
    let cloned = data.clone(); // Wasteful — just borrow
    cloned.len()
}
```

### Use `Cow` for Flexible Ownership

```rust
use std::borrow::Cow;

fn normalize(input: &str) -> Cow<'_, str> {
    if input.contains(' ') {
        Cow::Owned(input.replace(' ', "_"))
    } else {
        Cow::Borrowed(input) // Zero-cost when no mutation needed
    }
}
```

## Error Handling

错误处理的首要问题不是“选 `thiserror` 还是 `anyhow`”，而是**错误最终由谁消费**。完整规则见 [`rules/rust/rust-error-handling.md`](../../rules/rust/rust-error-handling.md)。

### Decision Flow

1. Library caller 需要按类型分支处理：定义模块自己的 `thiserror` error。
2. Application boundary 只需报告失败：使用 `anyhow`，在边界补充 context。
3. 底层错误跨模块传播前：转换为当前模块语义，避免把数据库、网络或框架类型写进稳定 public API。
4. Variant 按调用方处理策略设计，例如重试、等待或终止，而不是按底层协议栈拆分。
5. 跨 crate 的 public error enum 默认加 `#[non_exhaustive]`；内部错误不为此增加无用复杂度。
6. 只在语义边界转换错误；多层包装或大量 `From` 实现说明边界可能过细。

### Typed Library Error

```rust
use thiserror::Error;

#[derive(Debug, Error)]
#[non_exhaustive]
pub enum CacheError {
    #[error("key `{0}` not found")]
    NotFound(String),
    #[error("cache backend failed")]
    Backend {
        #[source]
        source: Box<dyn std::error::Error + Send + Sync>,
    },
}
```

### Application Error with Lazy Context

```rust
use anyhow::{Context, Result};

fn load_config(path: &str) -> Result<Config> {
    let content = std::fs::read_to_string(path)
        .with_context(|| format!("failed to read config from {path}"))?;
    toml::from_str(&content).context("failed to parse config")
}
```

Use `.context("...")` for fixed text and `.with_context(|| ...)` for dynamic or expensive text. Use `unwrap_or*` only when the fallback is valid business behavior; use `expect("reason")` only when an invariant makes failure impossible.

### `Option` Combinators Over Nested Matching

```rust
// Good: Combinator chain
fn find_user_email(users: &[User], id: u64) -> Option<String> {
    users.iter()
        .find(|u| u.id == id)
        .map(|u| u.email.clone())
}

// Bad: Deeply nested matching
fn find_user_email_bad(users: &[User], id: u64) -> Option<String> {
    match users.iter().find(|u| u.id == id) {
        Some(user) => match &user.email {
            email => Some(email.clone()),
        },
        None => None,
    }
}
```

## Enums and Pattern Matching

### Model States as Enums

```rust
// Good: Impossible states are unrepresentable
enum ConnectionState {
    Disconnected,
    Connecting { attempt: u32 },
    Connected { session_id: String },
    Failed { reason: String, retries: u32 },
}

fn handle(state: &ConnectionState) {
    match state {
        ConnectionState::Disconnected => connect(),
        ConnectionState::Connecting { attempt } if *attempt > 3 => abort(),
        ConnectionState::Connecting { .. } => wait(),
        ConnectionState::Connected { session_id } => use_session(session_id),
        ConnectionState::Failed { retries, .. } if *retries < 5 => retry(),
        ConnectionState::Failed { reason, .. } => log_failure(reason),
    }
}
```

### Exhaustive Matching — No Catch-All for Business Logic

```rust
// Good: Handle every variant explicitly
match command {
    Command::Start => start_service(),
    Command::Stop => stop_service(),
    Command::Restart => restart_service(),
    // Adding a new variant forces handling here
}

// Bad: Wildcard hides new variants
match command {
    Command::Start => start_service(),
    _ => {} // Silently ignores Stop, Restart, and future variants
}
```

## Traits and Generics

### Accept Generics, Return Concrete Types

```rust
// Good: Generic input, concrete output
fn read_all(reader: &mut impl Read) -> std::io::Result<Vec<u8>> {
    let mut buf = Vec::new();
    reader.read_to_end(&mut buf)?;
    Ok(buf)
}

// Good: Trait bounds for multiple constraints
fn process<T: Display + Send + 'static>(item: T) -> String {
    format!("processed: {item}")
}
```

### Trait Objects for Dynamic Dispatch

```rust
// Use when you need heterogeneous collections or plugin systems
trait Handler: Send + Sync {
    fn handle(&self, request: &Request) -> Response;
}

struct Router {
    handlers: Vec<Box<dyn Handler>>,
}

// Use generics when you need performance (monomorphization)
fn fast_process<H: Handler>(handler: &H, request: &Request) -> Response {
    handler.handle(request)
}
```

### Newtype Pattern for Type Safety

```rust
// Good: Distinct types prevent mixing up arguments
struct UserId(u64);
struct OrderId(u64);

fn get_order(user: UserId, order: OrderId) -> Result<Order> {
    // Can't accidentally swap user and order IDs
    todo!()
}

// Bad: Easy to swap arguments
fn get_order_bad(user_id: u64, order_id: u64) -> Result<Order> {
    todo!()
}
```

## Structs and Data Modeling

### Builder Pattern for Complex Construction

```rust
struct ServerConfig {
    host: String,
    port: u16,
    max_connections: usize,
}

impl ServerConfig {
    fn builder(host: impl Into<String>, port: u16) -> ServerConfigBuilder {
        ServerConfigBuilder { host: host.into(), port, max_connections: 100 }
    }
}

struct ServerConfigBuilder { host: String, port: u16, max_connections: usize }

impl ServerConfigBuilder {
    fn max_connections(mut self, n: usize) -> Self { self.max_connections = n; self }
    fn build(self) -> ServerConfig {
        ServerConfig { host: self.host, port: self.port, max_connections: self.max_connections }
    }
}

// Usage: ServerConfig::builder("localhost", 8080).max_connections(200).build()
```

## Iterators and Closures

### Prefer Iterator Chains Over Manual Loops

```rust
// Good: Declarative, lazy, composable
let active_emails: Vec<String> = users.iter()
    .filter(|u| u.is_active)
    .map(|u| u.email.clone())
    .collect();

// Bad: Imperative accumulation
let mut active_emails = Vec::new();
for user in &users {
    if user.is_active {
        active_emails.push(user.email.clone());
    }
}
```

### Use `collect()` with Type Annotation

```rust
// Collect into different types
let names: Vec<_> = items.iter().map(|i| &i.name).collect();
let lookup: HashMap<_, _> = items.iter().map(|i| (i.id, i)).collect();
let combined: String = parts.iter().copied().collect();

// Collect Results — short-circuits on first error
let parsed: Result<Vec<i32>, _> = strings.iter().map(|s| s.parse()).collect();
```

## Concurrency

### `Arc<Mutex<T>>` for Shared Mutable State

```rust
use std::sync::{Arc, Mutex};

let counter = Arc::new(Mutex::new(0));
let handles: Vec<_> = (0..10).map(|_| {
    let counter = Arc::clone(&counter);
    std::thread::spawn(move || {
        let mut num = counter.lock().expect("mutex poisoned");
        *num += 1;
    })
}).collect();

for handle in handles {
    handle.join().expect("worker thread panicked");
}
```

### Channels for Message Passing

```rust
use std::sync::mpsc;

let (tx, rx) = mpsc::sync_channel(16); // Bounded channel with backpressure

for i in 0..5 {
    let tx = tx.clone();
    std::thread::spawn(move || {
        tx.send(format!("message {i}")).expect("receiver disconnected");
    });
}
drop(tx); // Close sender so rx iterator terminates

for msg in rx {
    println!("{msg}");
}
```

### Async with Tokio

```rust
use tokio::time::Duration;

async fn fetch_with_timeout(url: &str) -> Result<String> {
    let response = tokio::time::timeout(
        Duration::from_secs(5),
        reqwest::get(url),
    )
    .await
    .context("request timed out")?
    .context("request failed")?;

    response.text().await.context("failed to read body")
}

// Spawn concurrent tasks
async fn fetch_all(urls: Vec<String>) -> Vec<Result<String>> {
    let handles: Vec<_> = urls.into_iter()
        .map(|url| tokio::spawn(async move {
            fetch_with_timeout(&url).await
        }))
        .collect();

    let mut results = Vec::with_capacity(handles.len());
    for handle in handles {
        results.push(handle.await.unwrap_or_else(|e| panic!("spawned task panicked: {e}")));
    }
    results
}
```

## Unsafe Code

### When Unsafe Is Acceptable

```rust
// Acceptable: FFI boundary with documented invariants (Rust 2024+)
/// # Safety
/// `ptr` must be a valid, aligned pointer to an initialized `Widget`.
unsafe fn widget_from_raw<'a>(ptr: *const Widget) -> &'a Widget {
    // SAFETY: caller guarantees ptr is valid and aligned
    unsafe { &*ptr }
}

// Acceptable: Performance-critical path with proof of correctness
// SAFETY: index is always < len due to the loop bound
unsafe { slice.get_unchecked(index) }
```

### When Unsafe Is NOT Acceptable

```rust
// Bad: Using unsafe to bypass borrow checker
// Bad: Using unsafe for convenience
// Bad: Using unsafe without a Safety comment
// Bad: Transmuting between unrelated types
```

## Module System and Crate Structure

### Organize by Domain, Not by Type

New projects must use the Rust 2024 Edition module layout: a module entry is a same-named file (`auth.rs`) beside its subdirectory (`auth/`). `mod.rs` is banned in new code — see `rules/rust/rust-conventions.md` §8.

```text
my_app/
├── src/
│   ├── main.rs
│   ├── lib.rs
│   ├── auth.rs        # mod auth; declared here
│   ├── auth/
│   │   ├── token.rs
│   │   └── middleware.rs
│   ├── orders.rs      # mod orders; declared here
│   ├── orders/
│   │   ├── model.rs
│   │   └── service.rs
│   ├── db.rs          # mod db; declared here
│   └── db/
│       └── pool.rs
├── tests/             # Integration tests
├── benches/           # Benchmarks
└── Cargo.toml
```

### Boundary-First Crate Structure

Use a boundary-first decision flow before changing Rust project structure:

1. Name the domain or capability boundary that owns the code.
2. Start with a module inside the existing crate while the boundary is still changing.
3. Keep `main.rs` thin; move testable application behavior into `lib.rs` and domain modules.
4. Promote a module to a crate only for independent compilation, reuse across binaries or repositories, dependency isolation, a stable API, or team ownership.
5. Introduce a workspace only when multiple real crates need shared development, testing, dependency policy, or release coordination.
6. Put heavy or replaceable dependencies behind adapter or infrastructure crates when they would otherwise leak into core logic.
7. Keep dependencies one-way: API, CLI, worker, and infrastructure depend inward on application or domain code; domain code does not depend on infrastructure.
8. Define external capabilities as traits in the inner layer that needs them, then implement them in outer adapters.
9. Avoid `common` and `utils` as ownership buckets; rename the code by the business or capability boundary it serves.

Complete the structure decision by stating:

- Whether the chosen boundary is a module, crate, or workspace.
- Why a heavier boundary was not chosen.
- Where the public API is re-exported or intentionally kept private.
- How dependency direction stays one-way.

### Visibility — Expose Minimally

```rust
// Good: pub(crate) for internal sharing
pub(crate) fn validate_input(input: &str) -> bool {
    !input.is_empty()
}

// Good: Re-export public API from lib.rs
pub mod auth;
pub use auth::AuthMiddleware;

// Bad: Making everything pub
pub fn internal_helper() {} // Should be pub(crate) or private
```

## Tooling Integration

### Essential Commands

```bash
# Build and check
cargo build
cargo check              # Fast type checking without codegen
cargo clippy             # Lints and suggestions
cargo fmt                # Format code

# Testing
cargo test
cargo test -- --nocapture    # Show println output
cargo test --lib             # Unit tests only
cargo test --test integration # Integration tests only

# Dependencies
cargo audit              # Security audit
cargo tree               # Dependency tree
cargo update             # Update dependencies

# Performance
cargo bench              # Run benchmarks
```

## Quick Reference: Rust Idioms

| Idiom | Description |
|-------|-------------|
| Borrow, don't clone | Pass `&T` instead of cloning unless ownership is needed |
| Make illegal states unrepresentable | Use enums to model valid states only |
| `?` over `unwrap()` | Propagate errors, never panic in library/production code |
| Parse, don't validate | Convert unstructured data to typed structs at the boundary |
| Newtype for type safety | Wrap primitives in newtypes to prevent argument swaps |
| Prefer iterators over loops | Declarative chains are clearer and often faster |
| `#[must_use]` on Results | Ensure callers handle return values |
| `Cow` for flexible ownership | Avoid allocations when borrowing suffices |
| Exhaustive matching | No wildcard `_` for business-critical enums |
| Minimal `pub` surface | Use `pub(crate)` for internal APIs |

## Anti-Patterns to Avoid

```rust
// Bad: .unwrap() in production code
let value = map.get("key").unwrap();

// Bad: .clone() to satisfy borrow checker without understanding why
let data = expensive_data.clone();
process(&original, &data);

// Bad: Using String when &str suffices
fn greet(name: String) { /* should be &str */ }

// Bad: Box<dyn Error> in libraries (use thiserror instead)
fn parse(input: &str) -> Result<Data, Box<dyn std::error::Error>> { todo!() }

// Bad: Ignoring must_use warnings
let _ = validate(input); // Silently discarding a Result

// Bad: Blocking in async context
async fn bad_async() {
    std::thread::sleep(Duration::from_secs(1)); // Blocks the executor!
    // Use: tokio::time::sleep(Duration::from_secs(1)).await;
}
```

**Remember**: If it compiles, it's probably correct — but only if you avoid `unwrap()`, minimize `unsafe`, and let the type system work for you.
