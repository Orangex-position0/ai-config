---
name: rust-workflow
description: Rust workflow setup, initialization, and retrofit for Cargo projects. Use when creating or updating Rust project tooling, hooks, CI, cargo checks, rust-toolchain.toml, rustfmt.toml, Clippy lint config, prek or Lefthook setup, Cargo.lock policy, release profiles, linker/cache/profiling config, cross builds, or local verification commands.
---

# Rust Workflow

Follow [Rust Workflow Standards](../../rules/rust/rust-workflow-standards.md) as the non-negotiable baseline.

For user-invoked Rust project initialization, Claude Code can use `/rust-init`; Codex should invoke `$rust-workflow` directly. This skill owns the shared workflow for both.

## Interaction Policy

Default to auto-detection from repository files. Ask the user only when a choice changes project policy, adds recurring CI cost, requires global or network-dependent installs, or cannot be inferred from the repository.

When the project level is not explicit, infer it and state the plan before editing. Example: "I infer this is an application/service; I will add rustfmt, managed hooks, a pinned toolchain, and base CI, and skip audit/MSRV/cross-build unless the repo shows they are needed."

Use guided selection only when the user asks to choose manually or repository signals conflict. In guided mode, present the inferred default plus these levels:

| Level | Use when | Default additions |
| --- | --- | --- |
| `minimal` | Demo, learning project, small local tool, or short-lived crate | `rustfmt`, existing test command, and only already-present workflow files |
| `application/service` | Maintained binary, CLI, internal service, or team-owned application | pinned toolchain, `rustfmt`, Clippy lints, managed hooks, and base CI |
| `production/public` | Public crate, production service, published artifact, or project with explicit compatibility/security expectations | application/service baseline plus quality CI; add MSRV, audit, feature matrix, cross-build, cache, or linker config only when the repo already shows that need |

## Initialization Flow

For initialization or retrofit, inspect before editing:

- `Cargo.toml` and `Cargo.lock`
- workspace members and package type
- `.cargo/config.toml`
- existing `RUSTFLAGS` or profiling flags in CI, scripts, or Cargo config
- `rust-toolchain.toml`
- `rustfmt.toml`
- Clippy lint config in `Cargo.toml`, crate attributes, and `clippy.toml`
- `.github/workflows/*`
- existing hook frameworks such as Lefthook, Husky, Python `pre-commit`, `prek`, or `core.hooksPath`

Then:

1. Classify the project as single crate or workspace, library or binary application, and minimal, application/service, or production/public level.
2. Read `references/decisions.md` before choosing workspace layout, hooks, lint config, CI, Cargo.lock policy, release profile, linker, cache, profiling, or cross-build behavior.
3. Preserve existing workflow, hook, toolchain, formatting, lint, and CI configuration unless it violates the rule.
4. Explain any non-obvious modification before making it.
5. Add only missing workflow pieces with useful content; never create empty placeholder files.
6. Keep existing CI structure; add Rust checks to it instead of creating duplicate workflows.
7. Use `edition = "2024"` only for new projects without an existing edition.
8. Prefer `cargo-nextest` only when the project already uses it; otherwise use `cargo test`.
9. Verify with the smallest command set that covers the touched surface.

## Template Assets

Use templates from `assets/templates/` only after inspecting the target project. Treat them as starting points, not overrides.

Copy templates only when the target file is missing. Merge manually when the target file exists. Never overwrite existing project config.

| Template | Use when |
| --- | --- |
| `assets/templates/prek.toml` | New Rust project without a managed hook framework |
| `assets/templates/rust-toolchain.toml` | Project does not already pin a Rust toolchain |
| `assets/templates/rustfmt.toml` | Project does not already configure rustfmt |
| `assets/templates/github-actions-ci.yml` | New GitHub Actions CI workflow is needed |
| `assets/templates/github-actions-quality.yml` | Public library or production project needs extra dependency, security, or feature checks |
| `assets/templates/github-actions-msrv.yml` | Project declares MSRV and needs CI verification |
| `assets/templates/justfile` | Existing workflow already uses `just`, or humans/CI reuse the commands |
| `assets/templates/cargo-workspace-root.toml` | New multi-crate Rust 2024 workspace needs a root manifest |
| `assets/templates/cargo-lints-workspace-root.toml` | Real workspace root needs shared Clippy lints |
| `assets/templates/cargo-lints-workspace-member.toml` | Workspace member opts into root lints |
| `assets/templates/cargo-lints-single-crate.toml` | Single-crate project needs local Clippy lints |
| `assets/templates/cargo-release-profile.toml` | Project wants the default fast release profile |
| `assets/templates/cargo-config-linux-lld.toml` | Linux build is link-bound and `clang`/`lld` are available |
| `assets/templates/cargo-config-macos-zld.toml` | macOS ARM64 build explicitly opts into `zld` and it is installed |

## Tool Safety

Before installing missing Rust workflow tools, check whether the tool already exists and whether the project actually needs it.

Ask before running global installs or network-dependent installs such as:

```bash
cargo install prek
cargo install cargo-todo
cargo install cargo-nextest --locked
```

Keep hooks visible when tools are missing. Do not delete `cargo-todo` or `cargo-nextest` hooks to hide first-run failures.

## Verification

Run the smallest relevant set:

```bash
cargo fmt --all -- --check
cargo clippy --locked --all-targets --all-features -- -D warnings
cargo todo
```

Fallbacks:

- Use `cargo nextest run --locked` when the project already uses `cargo-nextest`.
- Use `cargo test --locked` otherwise.

## Final Report

End initialization or retrofit work concisely with:

- Created files
- Modified files
- Preserved files
- Verification commands
- Skipped commands and reasons
