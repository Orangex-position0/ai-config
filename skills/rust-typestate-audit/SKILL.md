---
name: rust-typestate-audit
description: Audit Rust projects for code that would benefit from the typestate pattern, compare typestate against simpler enum/newtype/builder alternatives, and refactor approved candidates into the smallest compile-time state model. Use for Rust reviews, refactors, API hardening, builders with required phases, protocols, resource lifecycles, authentication/session states, and order-dependent method calls.
---

# Rust Typestate Audit

## Overview

Find places where a Rust API relies on caller discipline for valid state transitions, then decide whether typestate is the smallest useful fix. Prefer boring Rust first: enum state machines, newtypes, or a normal builder are often enough.

Use typestate for object usage protocols. Use enum state machines for business state.

## Workflow

1. Confirm this is a Rust project and locate the crate root or workspace.
2. Read existing Rust rules or project instructions before proposing API changes.
3. Read `references/patterns.md` when a candidate may need typestate.
4. Search for candidate state constraints:
   - structs with `bool`, `Option<T>`, or sentinel fields that gate later methods
   - methods that panic, return "not initialized", or check "already started"
   - builders where required fields are validated only in `build()`
   - protocols such as disconnected/connected/authenticated/closed
   - resources with open/start/lock/acquire then use then close/stop/release order
   - comments or docs saying callers must invoke methods in a sequence
5. Inspect all callers before judging a candidate. A typestate refactor changes call sites; do not judge from one file.
6. Classify each candidate as `skip`, `enum`, `newtype`, `builder`, or `typestate`.
7. If the user asked for implementation, refactor only the strongest candidate first unless they explicitly approve a broader migration.
8. Run the smallest relevant verification, usually `cargo check` plus existing tests touched by the change.

## Decision Rules

Use typestate when all are true:

- Invalid call order is a real bug class, not a theoretical cleanup.
- The state describes the object's usage protocol, lifecycle, or capabilities, not domain data.
- States are known at compile time for normal callers.
- Different states expose meaningfully different method sets.
- The API can consume `self` for transitions without awkward cloning or shared mutable state.
- Compile-time rejection removes runtime checks, panics, or invalid `Result` branches.
- The generic/marker types do not spread through unrelated public APIs.

Prefer an enum when state is business data, comes from runtime input or a database, values live in heterogeneous collections, every caller must handle many states dynamically, or exhaustive `match` is clearer.

Prefer a normal builder when only optional fields or default values are involved.

Prefer a typestate builder only when a small number of mandatory fields or phases must be enforced at compile time. If many required fields create many type parameters, prefer constructor arguments, an input DTO plus validation, or a normal builder with a clear `build()` error.

Prefer newtypes when the issue is mixing identifiers, units, or validated raw values rather than state transitions.

Skip when the existing checks are simple, the illegal path is already impossible through module privacy, state dimensions multiply into combinations such as `User<LoggedIn, Admin, Premium>`, or refactoring would break a broad stable public API for little safety gain.

## Refactor Shape

Keep the typestate model small:

- Use one generic state parameter, e.g. `Client<S>`, before considering multiple parameters.
- For typestate builders, use one type parameter per truly mandatory field only while the count stays small.
- Use zero-sized marker structs such as `Disconnected`, `Connected`, `Authenticated`.
- Use `PhantomData<S>` only when the state type is not otherwise stored.
- Put methods on the state where they are valid: `impl Client<Connected> { fn authenticate(...) -> Client<Authenticated> }`.
- Make transitions consume `self` when ownership naturally moves to the next state.
- Keep shared helper methods in a generic `impl<S> Client<S>` only when valid for every state.
- Keep marker types private unless callers must name them in the public API.
- Keep the final domain type free of builder state markers when possible.

Do not add a macro, trait hierarchy, factory, or dependency for ordinary typestate refactors.

For public crates, treat typestate refactors as potentially breaking API changes and call that out before implementation.

## Output

For audit-only requests, return a table:

| Candidate | Current guard | Recommendation | Why | Risk |
| --- | --- | --- | --- | --- |

For implementation requests, state the one candidate being changed, the files touched, and the verification command. If more than one candidate should change, ask for approval after the first working refactor.

Do not write local note paths or machine-specific references into the skill output or generated code.

## Verification

After code changes:

- Run `cargo fmt` if Rust files changed.
- Run `cargo check` for compile-time API validation.
- Run focused tests for the touched crate or module.
- If the project already uses compile-fail testing such as `trybuild`, add or update one compile-fail case for the rejected invalid call order.
- Do not add a compile-fail test framework only for one typestate refactor unless the user asks for it.
