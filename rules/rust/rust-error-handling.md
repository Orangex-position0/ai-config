---
paths:
  - "**/*.rs"
---

# Rust Error Handling

## Core Rules

1. **Propagate errors with `?` first**: let errors move up the call stack and handle them at a boundary.
2. **Use defaults only when fallback behavior is valid**: `None` / `Err` is not automatically a default case.
3. **Use `expect()` only when failure is impossible by invariant**: tests, demos, startup invariants, and compile-time checked assumptions.
4. **Do not use bare `unwrap()` in production code**: handle the error, propagate it, or document the invariant with `expect()`.
5. **Do not panic from fallible production paths**: return `Result` instead.

## Lint Enforcement

Use targeted lints for code that must not panic on recoverable failures. Clippy's `restriction` lints are opt-in and should be enabled case by case, not as the whole group.

```rust
#![deny(clippy::unwrap_used)]
#![deny(clippy::expect_used)]
#![deny(clippy::panic)]
#![deny(unused_must_use)]
```

Allow exceptions locally with a short reason when the invariant is real:

```rust
#[expect(clippy::expect_used, reason = "embedded migration is compiled into the binary")]
let migration = include_str!("migration.sql").parse::<Migration>().expect("valid migration");
```

## Safe Option Handling

| Method | Use case | Notes |
|------|----------|------|
| `unwrap_or(default)` | Clear default value | Most common fallback |
| `unwrap_or_else(\|\| expr)` | Default needs computation | Lazy; runs only on `None` |
| `unwrap_or_default()` | `T: Default` is a valid fallback | Common for `String`, `Vec`, numeric types |
| `or_else(\|\| Some(val))` | Chained fallback | Often used with `and_then` |

```rust
let port = config.port.unwrap_or(8080);
let data = cache.get(key).unwrap_or_else(|| expensive_fetch(key));
let name: String = user_input.unwrap_or_default();
```

## Safe Result Handling

| Method | Use case | Notes |
|------|----------|------|
| `?` | Error should propagate | Idiomatic default |
| `unwrap_or(default)` | `Err` has a valid default | Error details are irrelevant |
| `unwrap_or_else(\|err\| fallback)` | Fallback depends on the error | Keeps access to the error |
| `.ok()` | Only success matters | Converts `Result<T, E>` to `Option<T>` |
| `or_else(\|err\| Ok(recovered))` | Recover from an error | Replaces the error with another valid result |

```rust
fn read_config(path: &str) -> Result<Config, io::Error> {
    let content = fs::read_to_string(path)?;
    Ok(parse(&content))
}

let conn = connect(db_url).unwrap_or_else(|err| {
    log::warn!("database connection failed ({err}); using in-memory store");
    InMemoryStore::new()
});

let maybe_count: Option<usize> = str::parse::<usize>(input).ok();
```

## Decision Flow

```text
Option / Result encountered
  |
  +- Can the caller handle the error?
  |  +- Yes: propagate with ? and handle at the boundary
  |  +- No: is there a valid fallback?
  |     +- Yes: use unwrap_or / unwrap_or_else
  |     +- No: is failure impossible by invariant?
  |        +- Yes: use expect("why failure is impossible")
  |        +- No: redesign the error flow
  |
  +- unwrap(): not for production code
```
