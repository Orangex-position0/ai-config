# Rust Typestate Patterns

Use these as shape references, not copy-paste templates. Rename states, errors, and visibility to match the target crate.

## Decision Table

| Situation | Prefer |
| --- | --- |
| Object lifecycle or API protocol controls which methods are valid | Typestate |
| Business state changes from runtime data, database rows, or user workflow | Enum state machine |
| Mandatory construction fields are few and compile-time enforcement matters | Typestate builder |
| Optional fields or defaults dominate construction | Normal builder |
| The issue is mixing IDs, units, or validated strings | Newtype |
| Multiple independent state axes multiply into many combinations | Runtime state or smaller API boundary |

## Scenario Recognition Cards

| Scenario | Signals | Prefer | Check first |
| --- | --- | --- | --- |
| Connection or client lifecycle | Calls must follow `connect -> authenticate -> request`; later methods require earlier setup | Typestate with consuming transitions | Do callers need to store clients in mixed states or reconnect dynamically? |
| Transaction or one-shot finalization | `commit` and `rollback` are terminal; using the value afterward is invalid | Consuming API first; typestate only when named terminal states matter | Can `commit(self)` and `rollback(self)` alone remove the illegal path? |
| Builder mandatory fields | `build()` checks required `Option` fields or panics on missing fields | Typestate builder if required dimensions stay small | Would constructor arguments or an input DTO be simpler than multiple state parameters? |
| Resource handle lifecycle | `open/read/close`, `start/use/stop`, or `acquire/use/release` gates capabilities | RAII or `Drop` first; typestate only for explicit phase capabilities | Is explicit close/start state actually observable by callers? |
| Protocol, handshake, or session | Fixed steps where skipping or repeating a step is a bug | Typestate with methods only on valid phases | Are steps static enough to encode in the type system? |
| Business or persisted workflow | `OrderStatus`, `UserStatus`, task status, database row state, or external events drive transitions | Enum state machine | Is this state domain data that must be matched, stored, queried, or serialized? |

## Before Refactoring

- Is the state an API usage rule rather than business data?
- Can privacy, `Drop`, or consuming `self` solve it with less type machinery?
- Do callers need mixed-state values in one collection?
- Will state parameters leak across public APIs?
- Will mandatory builder dimensions stay small?

## Lifecycle Skeleton

```rust
use std::marker::PhantomData;

struct Created;
struct Ready;

pub struct Resource<State> {
    inner: Inner,
    _state: PhantomData<State>,
}

impl Resource<Created> {
    pub fn new(inner: Inner) -> Self {
        Self {
            inner,
            _state: PhantomData,
        }
    }

    pub fn prepare(self) -> Result<Resource<Ready>, Error> {
        self.inner.prepare()?;
        Ok(Resource {
            inner: self.inner,
            _state: PhantomData,
        })
    }
}

impl Resource<Ready> {
    pub fn run(&self) -> Result<(), Error> {
        self.inner.run()
    }
}
```

## Builder Skeleton

Use `expect()` only for fields proven by typestate, and make that invariant explicit in the message.

```rust
use std::marker::PhantomData;

struct MissingUrl;
struct HasUrl;
struct MissingLimit;
struct HasLimit;

pub struct PoolBuilder<Url, Limit> {
    url: Option<String>,
    limit: Option<u32>,
    timeout_secs: u64,
    _state: PhantomData<(Url, Limit)>,
}

impl PoolBuilder<MissingUrl, MissingLimit> {
    pub fn new() -> Self {
        Self {
            url: None,
            limit: None,
            timeout_secs: 30,
            _state: PhantomData,
        }
    }
}

impl<Limit> PoolBuilder<MissingUrl, Limit> {
    pub fn url(self, url: impl Into<String>) -> PoolBuilder<HasUrl, Limit> {
        PoolBuilder {
            url: Some(url.into()),
            limit: self.limit,
            timeout_secs: self.timeout_secs,
            _state: PhantomData,
        }
    }
}

impl<Url> PoolBuilder<Url, MissingLimit> {
    pub fn limit(self, limit: u32) -> PoolBuilder<Url, HasLimit> {
        PoolBuilder {
            url: self.url,
            limit: Some(limit),
            timeout_secs: self.timeout_secs,
            _state: PhantomData,
        }
    }
}

impl<Url, Limit> PoolBuilder<Url, Limit> {
    pub fn timeout_secs(mut self, timeout_secs: u64) -> Self {
        self.timeout_secs = timeout_secs;
        self
    }
}

impl PoolBuilder<HasUrl, HasLimit> {
    pub fn build(self) -> Pool {
        Pool {
            url: self.url.expect("url checked by typestate"),
            limit: self.limit.expect("limit checked by typestate"),
            timeout_secs: self.timeout_secs,
        }
    }
}
```

## Mental Examples

- `rustls::ConfigBuilder`: staged security configuration with required phases.
- `serde` serializers: ownership and associated types prevent use after `end(self)`.
- Embedded GPIO APIs: pin modes expose different capabilities.
