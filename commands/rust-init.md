---
description: Initialize or retrofit Rust project workflow by detecting existing conventions, applying rust-workflow templates, preserving existing config, and reporting created/modified/preserved files.
---

# Rust Init

Use this command to initialize or retrofit Rust workflow configuration. Command owns orchestration only; workflow choices live in `skills/rust-workflow/SKILL.md`, templates live in `skills/rust-workflow/assets/templates/`, and hard constraints live in `rules/rust/rust-workflow-standards.md`.

## Design Principles

- Detect existing project conventions before applying defaults.
- Prefer minimal, additive changes.
- Never overwrite existing workflow, hook, toolchain, formatting, lint, or CI configuration.
- Explain any non-obvious modification before making it.
- Create files with real default content; never create empty placeholder files.

## Detection Checklist

Before editing, inspect:

- `Cargo.toml` and `Cargo.lock`
- workspace members and package type
- `.cargo/config.toml`
- existing `RUSTFLAGS` or profiling flags in CI, scripts, or Cargo config
- `rust-toolchain.toml`
- `rustfmt.toml`
- Clippy lint config in `Cargo.toml`, crate attributes, and `clippy.toml`
- `.github/workflows/*`
- existing hook frameworks such as Lefthook, Husky, Python `pre-commit`, `prek`, or `core.hooksPath`

Classify the project as:

- single crate
- workspace
- library
- binary application

## Execution Flow

1. Follow `rules/rust/rust-workflow-standards.md`.
2. Use `skills/rust-workflow/SKILL.md` for command choices and `skills/rust-workflow/assets/templates/` for template files.
3. Preserve existing project conventions unless they violate the rule.
4. Add only missing workflow pieces with the smallest useful content.
5. Keep existing CI structure; add Rust checks to it instead of creating duplicate workflows.
6. Use `edition = "2024"` only for new projects without an existing edition.
7. Add workspace lint config only at a real workspace root; for single-crate projects, use single-crate lint config.
8. Prefer `cargo-nextest` only when the project already uses it; otherwise use `cargo test`.
9. Skip commands only with a clear reason.

## Final Report

End with:

- Created files
- Modified files
- Preserved files
- Verification commands
- Skipped commands and reasons

## Related

- Rule: `rules/rust/rust-workflow-standards.md`
- Skill: `skills/rust-workflow/SKILL.md`
