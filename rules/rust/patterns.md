---
paths:
  - "**/*.rs"
---
# Rust Patterns

> This file extends [common/patterns.md](../common/patterns.md) with Rust-specific content.

## Repository Pattern with Traits

Encapsulate data access behind a trait:

```rust
pub trait OrderRepository: Send + Sync {
    fn find_by_id(&self, id: u64) -> Result<Option<Order>, StorageError>;
    fn find_all(&self) -> Result<Vec<Order>, StorageError>;
    fn save(&self, order: &Order) -> Result<Order, StorageError>;
    fn delete(&self, id: u64) -> Result<(), StorageError>;
}
```

Concrete implementations handle storage details (Postgres, SQLite, in-memory for tests).

## Service Layer

Business logic in service structs; inject dependencies via constructor:

```rust
pub struct OrderService {
    repo: Box<dyn OrderRepository>,
    payment: Box<dyn PaymentGateway>,
}

impl OrderService {
    pub fn new(repo: Box<dyn OrderRepository>, payment: Box<dyn PaymentGateway>) -> Self {
        Self { repo, payment }
    }

    pub fn place_order(&self, request: CreateOrderRequest) -> anyhow::Result<OrderSummary> {
        let order = Order::from(request);
        self.payment.charge(order.total())?;
        let saved = self.repo.save(&order)?;
        Ok(OrderSummary::from(saved))
    }
}
```

## Newtype Pattern for Type Safety

Prevent argument mix-ups with distinct wrapper types. Validate at construction when the wrapped value has domain rules.

```rust
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct UserId(u64);

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct OrderId(u64);

fn get_order(user: UserId, order: OrderId) -> anyhow::Result<Order> {
    // Can't accidentally swap user and order IDs at call sites
    todo!()
}
```

```rust
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Email(String);

impl Email {
    pub fn parse(input: &str) -> anyhow::Result<Self> {
        let trimmed = input.trim();
        if trimmed.contains('@') && trimmed.len() >= 3 {
            Ok(Self(trimmed.to_owned()))
        } else {
            anyhow::bail!("invalid email")
        }
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}
```

## Enum State Machines

Model states as enums — make illegal states unrepresentable:

```rust
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

Always match exhaustively — no wildcard `_` for business-critical enums.

## Typestate Pattern

Use typestate only when invalid call order is a real bug class and transitions can consume `self` cleanly. Prefer enum state machines when state is runtime-driven.

```rust
use std::marker::PhantomData;

pub struct Connection<State> {
    inner: ConnectionInner,
    _state: PhantomData<State>,
}

pub struct Disconnected;
pub struct Connected;
pub struct Authenticated;

impl Connection<Disconnected> {
    pub fn new(inner: ConnectionInner) -> Self {
        Self { inner, _state: PhantomData }
    }

    pub fn connect(self) -> anyhow::Result<Connection<Connected>> {
        self.inner.connect()?;
        Ok(Connection { inner: self.inner, _state: PhantomData })
    }
}

impl Connection<Connected> {
    pub fn authenticate(self, credentials: Credentials) -> anyhow::Result<Connection<Authenticated>> {
        self.inner.authenticate(credentials)?;
        Ok(Connection { inner: self.inner, _state: PhantomData })
    }
}

impl Connection<Authenticated> {
    pub fn query(&self, sql: &str) -> anyhow::Result<QueryResult> {
        self.inner.query(sql)
    }
}
```

## Builder Pattern

Use for structs with many optional parameters:

```rust
pub struct ServerConfig {
    host: String,
    port: u16,
    max_connections: usize,
}

impl ServerConfig {
    pub fn builder(host: impl Into<String>, port: u16) -> ServerConfigBuilder {
        ServerConfigBuilder {
            host: host.into(),
            port,
            max_connections: 100,
        }
    }
}

pub struct ServerConfigBuilder {
    host: String,
    port: u16,
    max_connections: usize,
}

impl ServerConfigBuilder {
    pub fn max_connections(mut self, n: usize) -> Self {
        self.max_connections = n;
        self
    }

    pub fn build(self) -> ServerConfig {
        ServerConfig {
            host: self.host,
            port: self.port,
            max_connections: self.max_connections,
        }
    }
}
```

For mandatory fields, prefer constructor arguments. Use a typestate builder only when many fields are mandatory, order-independent, and commonly assembled across steps.

```rust
#[derive(Default)]
pub struct RequestBuilder<Email, Name> {
    email: Email,
    name: Name,
    age: Option<u8>,
}

pub struct Set<T>(T);
pub struct Unset;

impl RequestBuilder<Unset, Unset> {
    pub fn new() -> Self {
        Self::default()
    }
}

impl<N> RequestBuilder<Unset, N> {
    pub fn email(self, email: String) -> RequestBuilder<Set<String>, N> {
        RequestBuilder { email: Set(email), name: self.name, age: self.age }
    }
}

impl<E> RequestBuilder<E, Unset> {
    pub fn name(self, name: String) -> RequestBuilder<E, Set<String>> {
        RequestBuilder { email: self.email, name: Set(name), age: self.age }
    }
}

impl RequestBuilder<Set<String>, Set<String>> {
    pub fn age(mut self, age: u8) -> Self {
        self.age = Some(age);
        self
    }

    pub fn build(self) -> CreateUserRequest {
        CreateUserRequest {
            email: self.email.0,
            name: self.name.0,
            age: self.age,
        }
    }
}
```

## Smart Constructors

Use smart constructors when every instance must satisfy an invariant. Keep fields private so callers cannot bypass construction.

```rust
#[derive(Debug, Clone)]
pub struct NonEmptyVec<T> {
    head: T,
    tail: Vec<T>,
}

impl<T> NonEmptyVec<T> {
    pub fn new(head: T, tail: Vec<T>) -> Self {
        Self { head, tail }
    }

    pub fn from_vec(mut values: Vec<T>) -> Option<Self> {
        if values.is_empty() {
            return None;
        }

        let head = values.remove(0);
        Some(Self { head, tail: values })
    }

    pub fn head(&self) -> &T {
        &self.head
    }

    pub fn len(&self) -> usize {
        1 + self.tail.len()
    }
}
```

## Const Generics for Bounds

Use const generics when bounds are part of the type and known at compile time.

```rust
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct BoundedString<const MIN: usize, const MAX: usize> {
    value: String,
}

impl<const MIN: usize, const MAX: usize> BoundedString<MIN, MAX> {
    pub fn new(value: String) -> anyhow::Result<Self> {
        let len = value.len();
        if len < MIN {
            anyhow::bail!("too short: min {MIN}, actual {len}");
        }
        if len > MAX {
            anyhow::bail!("too long: max {MAX}, actual {len}");
        }
        Ok(Self { value })
    }

    pub fn as_str(&self) -> &str {
        &self.value
    }
}

pub type Username = BoundedString<3, 20>;
pub type Bio = BoundedString<0, 500>;
```

## Safe Concurrency Primitives

Use atomics for simple counters and semaphores or bounded queues to cap async work.

```rust
use std::sync::atomic::{AtomicU64, Ordering};

pub struct Counter {
    value: AtomicU64,
}

impl Counter {
    pub fn new() -> Self {
        Self { value: AtomicU64::new(0) }
    }

    pub fn increment(&self) -> u64 {
        self.value.fetch_add(1, Ordering::Relaxed) + 1
    }

    pub fn get(&self) -> u64 {
        self.value.load(Ordering::Relaxed)
    }
}
```

```rust
use std::sync::Arc;
use tokio::sync::Semaphore;

pub struct ConcurrencyLimiter {
    semaphore: Arc<Semaphore>,
}

impl ConcurrencyLimiter {
    pub fn new(max_concurrent: usize) -> Self {
        Self { semaphore: Arc::new(Semaphore::new(max_concurrent)) }
    }

    pub async fn run<F, T>(&self, future: F) -> anyhow::Result<T>
    where
        F: std::future::Future<Output = T>,
    {
        let _permit = self.semaphore.acquire().await?;
        Ok(future.await)
    }
}
```

## Sealed Traits for Extensibility Control

Use a private module to seal a trait, preventing external implementations:

```rust
mod private {
    pub trait Sealed {}
}

pub trait Format: private::Sealed {
    fn encode(&self, data: &[u8]) -> Vec<u8>;
}

pub struct Json;
impl private::Sealed for Json {}
impl Format for Json {
    fn encode(&self, data: &[u8]) -> Vec<u8> { todo!() }
}
```

## API Response Envelope

Consistent API responses using a generic enum:

```rust
#[derive(Debug, serde::Serialize)]
#[serde(tag = "status")]
pub enum ApiResponse<T: serde::Serialize> {
    #[serde(rename = "ok")]
    Ok { data: T },
    #[serde(rename = "error")]
    Error { message: String },
}
```

## Pattern Selection

| Pattern | Use when |
| --- | --- |
| Newtype | Distinguishing identifiers, units, or validated raw values |
| Enum state machine | State is runtime-driven or every caller must handle alternatives |
| Typestate | Invalid call order should fail at compile time |
| Builder | Optional fields or staged construction improve ergonomics |
| Typestate builder | Mandatory fields must be enforced across staged construction |
| Smart constructor | A type owns an invariant that must hold for every instance |
| Const generics | Fixed bounds belong in the type itself |
| Trait injection | Tests or deployments need swappable implementations |

Newtypes, typestate marker types, and `PhantomData` have no meaningful runtime cost after optimization. `Arc` adds atomic reference counting; use it for real shared ownership, not as a default parameter-passing style.

## References

See skill: `rust-patterns` for comprehensive patterns including ownership, traits, generics, concurrency, and async.
See skill: `rust-typestate-audit` before broad typestate refactors.
