# Newtype Design Flow

Use this reference when the main `rust-newtype-pattern` skill needs detailed representation, boundary, or API-surface decisions.

## Classify the Need

Identify the concrete bug class before introducing a wrapper:

- Argument mix-up: identical primitive types carry different domain meaning.
- Invalid value: every instance must satisfy a construction-time invariant.
- Representation leak: callers should not depend on the inner storage type.
- Orphan-rule limitation: an external trait must be implemented for an external type.
- Protocol ambiguity: a value needs boundary context such as HTTP JSON, URL path, or database JSON.

If none of these applies, keep the existing plain value unless the surrounding code already uses a stronger domain-primitive style.

## Choose the Representation

| Need | Choose |
| --- | --- |
| Shorten `Result<T, AppError>` or a long generic signature | `type alias` |
| Distinguish `UserId` from `OrderId` | Newtype |
| Express units such as `Meters`, `Seconds`, or `Amount` | Newtype |
| Guarantee values such as email, slug, port, or percentage | Private-field newtype |
| Implement an external trait for an external type | Local newtype wrapper |
| Keep JSON/wire format equal to the inner field | Newtype + `#[serde(transparent)]` |
| Promise layout or ABI equivalence | Newtype + `#[repr(transparent)]` |
| Enforce call order such as open before send | Typestate |

Use newtype for semantic boundaries. Use typestate only when operation availability depends on state transitions and the transition model can be expressed cleanly in types.

## Design the Boundary

- Keep the field private when the type owns an invariant.
- Expose a public tuple field only for transparent utility wrappers whose inner API is intentionally public.
- Keep the public API independent of the inner representation when future storage changes are plausible.
- Prefer semantic accessors over exposing `.0` from business types.

## Select API Surface

| Method | Use when |
| --- | --- |
| `new(value) -> Self` | Construction cannot fail or the input is already trusted |
| `try_new(value) -> Result<Self, Error>` | Construction validates domain rules |
| `parse(value) -> Result<Self, Error>` | Input starts as text or another unstructured representation |
| `get(&self) -> T` | Inner value is `Copy` |
| `as_str(&self) -> &str` | Inner value is a string |
| `as_uuid(&self) -> &Uuid` | Inner value is a UUID |
| `into_inner(self) -> T` | Caller should consume the wrapper and recover the inner value |

| Newtype kind | Usually implement |
| --- | --- |
| Value type | `Debug`, `Clone`, `Copy`, `PartialEq`, `Eq`, `Hash`, `PartialOrd`, `Ord` |
| String-like type | `Display`, `FromStr`, `AsRef<str>` |
| ID type | `Display`, `FromStr`, `Serialize`, `Deserialize` |
| Validated input | `TryFrom<T>`, `FromStr`, domain-specific error type |
| Wrapper for external trait | The specific trait that orphan rules prevented |

Implement only conversions that preserve the invariant and do not erase important domain meaning. Avoid broad `From<Newtype> for Inner` conversions when the wrapper's meaning should remain visible at call sites.

Prefer explicit trait implementations when formatting, parsing, validation, or privacy semantics matter. Avoid deriving or implementing traits that leak secrets or expose unstable representation.
