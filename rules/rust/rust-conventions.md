---
paths:
  - "**/*.rs"
  - "**/Cargo.toml"
---

# Rust Conventions

> Rust-specific coding conventions. Formatting and workflow commands live in [rust-workflow-standards.md](./rust-workflow-standards.md); detailed error handling lives in [rust-error-handling.md](./rust-error-handling.md).

## 1. Naming

Follow standard Rust naming:

- `snake_case` for functions, methods, variables, modules, and crates
- `PascalCase` for types, traits, enums, and type parameters
- `SCREAMING_SNAKE_CASE` for constants and statics
- short lowercase lifetimes such as `'a` and `'de`; use descriptive names such as `'input` only when they clarify a complex signature

## 2. Immutability

Prefer immutable code unless mutation is the clearer model:

- Use `let` by default; use `let mut` only when the value really changes.
- Return a new value instead of mutating an argument unless in-place mutation avoids meaningful cost.
- Use `Cow<'_, T>` when a function may return either borrowed or owned data.

```rust
use std::borrow::Cow;

fn normalize(input: &str) -> Cow<'_, str> {
    if input.contains(' ') {
        Cow::Owned(input.replace(' ', "_"))
    } else {
        Cow::Borrowed(input)
    }
}
```

## 3. Ownership and Borrowing

- Borrow with `&T` by default; take ownership only when the function stores or consumes the value.
- Accept `&str` instead of `String` and `&[T]` instead of `Vec<T>` in parameters.
- Use `impl Into<String>` for constructors that need to own a `String`.
- Do not use `clone()` to silence the borrow checker before understanding the ownership issue.
- Getter methods should return references instead of cloned owned values.
- For shared read-heavy data across threads, use `Arc<RwLock<T>>` or another explicit sharing primitive instead of cloning one full copy per worker.

```rust
fn word_count(text: &str) -> usize {
    text.split_whitespace().count()
}

fn new(name: impl Into<String>) -> Self {
    Self { name: name.into() }
}
```

## 4. Standard Library Traits

Use standard traits before writing custom helper methods:

- `Default` for useful default values and test setup.
- `From` / `TryFrom` for type conversions, including error conversion that works with `?`.
- `FromStr` for parsing custom types from strings.
- `AsRef` / `Borrow` only when a generic API genuinely needs them; prefer concrete borrowed parameters such as `&str` first.

## 5. Control Flow

Prefer iterator chains for straightforward transformations and loops for control flow with early return, branching, or side effects.

```rust
let active_emails: Vec<&str> = users
    .iter()
    .filter(|user| user.is_active)
    .map(|user| user.email.as_str())
    .collect();

for user in &users {
    if let Some(verified) = verify_email(&user.email)? {
        send_welcome(&verified)?;
    }
}
```

Use `match` when branching over enum states or structured alternatives. It gives destructuring, guards, and exhaustiveness checks that stacked `if` / `else if` conditions do not.

Avoid wildcard `_` for business-critical enums unless the ignored cases are intentionally equivalent.

## 6. Performance Primitives

- Profile or benchmark before optimizing non-obvious performance paths; do not guess bottlenecks.
- Avoid repeated heap allocation in loops or hot paths; reuse buffers with `clear()` when the capacity can be kept.
- Borrow `&str` / `&[T]` for read-only access; allocate `String` / `Vec<T>` only when ownership, mutation, storage, or dynamic construction is required.
- Check `clone()` cost before using it in hot paths. Cloning `Arc`, `Bytes`, or another handle is cheap; cloning owned heap data may copy the full payload.
- Use `bytes::Bytes` for forwarding byte payloads across components; deserialize directly into typed structs when business logic needs structured data.
- Use `Arc` for config, pools, and read-only shared state; avoid wrapping request-scoped large payloads in `Arc` unless their extended lifetime is intentional.
- Give caches explicit bounds such as max entries, max memory, TTL, or an eviction policy.
- Use `HashMap::entry` instead of `contains_key()` followed by `get_mut()` or `insert()`.
- Use Rayon parallel iterators for CPU-bound, independent data processing when sequential iteration is the bottleneck.
- Use `Vec::swap_remove()` when deleting by index and element order does not matter.

## 7. Imports

Avoid glob imports because they hide dependencies and increase the risk of name collisions.

Only use `*` imports for:

- prelude imports
- unit test modules
- deliberate re-exports

## 8. Module Organization

Organize modules by domain or capability, not by technical type.

### Module Layout

Prefer the Rust 2024 Edition module layout for new code:

```text
src/
+-- network.rs
+-- network/
    +-- client.rs
    +-- server.rs
```

This layout keeps the module entry (`network.rs`) in the parent directory while placing implementation files in a dedicated subdirectory.

For existing projects, follow the project's established module layout instead of mixing styles within the same crate.

## 9. Visibility

- Keep items private by default.
- Use `pub(crate)` for internal sharing.
- Use `pub` only for the crate's public API.
- Re-export the public API from `lib.rs` when it improves caller ergonomics.

## 10. Related Documents

- [rust-error-handling.md](./rust-error-handling.md)
- [rust-workflow-standards.md](./rust-workflow-standards.md)
- [rust-tokio-conventions.md](./rust-tokio-conventions.md)
