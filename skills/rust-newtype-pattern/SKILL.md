---
name: rust-newtype-pattern
description: Use when Rust code needs type-safe wrappers for IDs, units, validated domain values, boundary formats, orphan-rule workarounds, or a decision between type alias, newtype, and typestate.
---

# Rust Newtype Pattern

Apply `rules/rust/patterns.md` as the baseline. Use this procedure to decide whether to introduce a newtype and how much API surface to expose.

## When Not To Use

- Do not introduce a newtype only to make a primitive look more domain-driven.
- Do not replace a clear local variable or private helper argument with a wrapper when no boundary or invariant exists.
- Do not use typestate when a simple runtime enum makes state handling clearer.

## Operating Procedure

1. Identify the concrete bug class: argument mix-up, invalid value, representation leak, orphan-rule limitation, or protocol ambiguity.
2. Choose between plain value, `type alias`, newtype, and typestate. Load `references/design-flow.md` when the choice or API surface is not obvious.
3. Keep invariant-owning fields private and expose construction through `new`, `try_new`, `parse`, `FromStr`, or `TryFrom`.
4. Load `references/boundary-semantics.md` when framework, serialization, database, trait-coherence, layout, FFI, or unsafe-code semantics matter.
5. Review failure modes before editing code.

## Minimal Pattern

Use this minimal pattern for validated business values:

```rust
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Username(String);

impl Username {
    pub fn try_new(value: impl Into<String>) -> Result<Self, &'static str> {
        let value = value.into();
        if value.trim().is_empty() {
            return Err("username must not be empty");
        }
        Ok(Self(value))
    }

    pub fn as_str(&self) -> &str {
        &self.0
    }
}
```

## References

- Load `references/design-flow.md` for representation, constructor, accessor, trait, and conversion choices.
- Load `references/boundary-semantics.md` for serde, Axum, SQLx, orphan-rule, layout, FFI, unsafe-code, and ABI decisions.

## Review Checklist

- Does the wrapper prevent a concrete mix-up, invalid state, representation leak, or boundary ambiguity?
- Is every invariant enforced by construction and protected by field visibility?
- Are accessors, traits, and conversions sufficient without erasing domain meaning?
- Are serialization, database, layout, FFI, and unsafe-code semantics intentional and tested when relevant?
- Would a plain value, `type alias`, runtime enum, or typestate express the design more clearly?
