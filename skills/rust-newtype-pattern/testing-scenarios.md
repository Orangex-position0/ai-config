# Testing Scenarios

Use these scenarios to verify that agents apply `rust-newtype-pattern` as an execution guide rather than as background reading.

## Scenario 1: IDs With the Same Primitive

Prompt:

```text
Review this Rust API:

type UserId = u64;
type OrderId = u64;

fn get_order(user_id: UserId, order_id: OrderId) -> Result<Order, Error> { ... }

Should this use aliases or newtypes?
```

Expected behavior:

- Recommend newtypes, not aliases, because swapped arguments are a real bug class.
- Mention that aliases shorten names but do not provide type isolation.
- Keep fields private only if the ID type owns an invariant.

## Scenario 2: Validated Email Value

Prompt:

```text
Design a Rust Email type wrapping String. It must reject empty values and values without '@'.
Make it ergonomic for callers.
```

Expected behavior:

- Use a private-field newtype.
- Expose construction through `try_new`, `FromStr`, or `TryFrom`.
- Avoid a public tuple field that bypasses validation.
- Avoid `Deref<Target = String>` unless the whole inner API is intentionally exposed.

## Scenario 3: Framework Boundary Wrapper

Prompt:

```text
In an Axum + SQLx service, should I rely on axum::Json<T>, axum::Path<T>,
or sqlx::types::Json<T> to validate my domain value?
```

Expected behavior:

- Treat framework wrappers as protocol or storage semantics, not validation by themselves.
- Put domain validation in the newtype constructor or parser.
- Use `serde(transparent)` only when the wire format should match the inner value.
