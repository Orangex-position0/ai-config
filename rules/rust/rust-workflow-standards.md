---
paths:
  - "**/*.rs"
  - "**/Cargo.toml"
  - "**/prek.toml"
  - "**/.pre-commit-config.yaml"
  - "**/.github/workflows/*.{yml,yaml}"
  - "**/.cargo/config.toml"
  - "**/justfile"
---

# Rust Workflow Standards

> Non-negotiable Rust workflow baseline. Setup steps, templates, and command examples belong in [rust-workflow](../../skills/rust-workflow/SKILL.md).

## Verification Baseline

- Rust changes must be verified with formatting, Clippy with warnings denied, tests, and TODO review before handoff.
- CI and release builds must use locked dependency resolution.
- Automated fixes are local repair tools only; rerun the verification baseline after applying them.

## Git Hooks

- New Rust projects must prefer `prek` with its native `prek.toml` configuration for Git hook management.
- Use `.pre-commit-config.yaml` only when compatibility with Python `pre-commit` tooling is required.
- Existing managed hook frameworks may remain; do not mix hook frameworks in the same project.
- Hand-written `core.hooksPath` scripts are allowed only for tiny personal projects; migrate to `prek` once hooks are shared or reused.
- Commit hook configuration files; do not rely on untracked `.git/hooks` scripts.
- Pre-commit must catch formatting, `cargo check`, and TODO issues by default.
- Pre-push must run Clippy and tests by default.
- Use `--no-verify` only for emergency commits, and run the skipped commands before handoff or push.
- Do not treat hooks as a security boundary; CI remains authoritative.

## CI Pipeline

- CI must be the authoritative quality gate for Rust repositories.
- CI must cover formatting, Clippy, and tests at minimum.
- Public libraries and crates with non-trivial feature flags must verify feature combinations in CI.
- Public or production projects must include dependency vulnerability checks in CI.
- Projects with license or dependency policy requirements must include policy checks in CI.

## Project Configuration

- When initializing or retrofitting Rust project workflow files, use [rust-workflow](../../skills/rust-workflow/SKILL.md). Claude Code may enter through `/rust-init`; Codex should invoke `$rust-workflow` directly.
- Preserve existing project conventions; never remove existing configuration, overwrite workflows, downgrade toolchains, introduce nightly features, or migrate editions automatically.
- New Rust projects must pin the Rust toolchain and include `rustfmt` and `clippy`.
- Publishable crates must declare MSRV with `package.rust-version`.
- Projects that declare MSRV should verify it before release.
- Application crates must commit `Cargo.lock`.
- Library crates should not commit `Cargo.lock` unless the repository is also an application workspace.
- Single-crate projects should stay single-crate; do not introduce a workspace only because the project may grow later.
- Use a workspace when multiple crates are developed, tested, and versioned together in one repository.
- Use a workspace when a binary crate and reusable library crate need shared CI, toolchain, dependency policy, or release coordination.
- Split into workspace members only across real crate boundaries such as public library, CLI, server, proc macro, or integration-test support crates.
- Workspace member crates must use `workspace = true` for dependencies already declared in `[workspace.dependencies]`.
- Keep linker, cache, and profiling flags in `.cargo/config.toml` or CI environment configuration; do not require global developer machine settings.

## Release Profile

- Prefer fast, debuggable local release builds by default.
- Enable heavier release optimizations only when binary size or runtime performance is an explicit requirement.
