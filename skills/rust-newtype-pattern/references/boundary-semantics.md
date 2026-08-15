# Boundary Semantics

Use this reference when a Rust newtype crosses framework, serialization, database, trait-coherence, ABI, FFI, unsafe-code, or public-layout boundaries.

## Framework and Storage Wrappers

- For orphan-rule wrappers, use a local newtype only when both the trait and target type are external. If the trait is local, implement it directly for the external type unless the wrapper adds meaning.
- For `axum::Path<T>`, `axum::Json<T>`, and `sqlx::types::Json<T>`, treat the wrapper as protocol or storage semantics for `T`, not as a validation mechanism by itself.
- Put domain validation in the newtype constructor, parser, `TryFrom`, or `FromStr` implementation.

## Serialization and Layout

- Use `#[serde(transparent)]` when the wire format should match the inner field while Rust keeps a distinct type.
- Use `#[repr(transparent)]` only when layout or ABI equivalence is part of the contract, such as FFI, unsafe code, or public ABI guarantees.
- When layout guarantees matter, verify the final design against the Rust Reference before using unsafe assumptions.

## Common Mistakes

- Replacing every primitive with a wrapper without a boundary, invariant, or mix-up risk.
- Making an invariant-owning wrapper a public tuple struct.
- Adding `Deref` to recover convenience and accidentally expose the whole inner API.
- Treating `axum::Json<T>`, `axum::Path<T>`, or `sqlx::types::Json<T>` as validation by themselves.
- Adding `#[repr(transparent)]` without an ABI, FFI, unsafe-code, or public-layout contract.
