---
name: rust-workflow
description: Rust project workflow setup and maintenance. Use when creating or updating Rust project tooling, configuring cargo checks, choosing prek or Lefthook, writing prek.toml or compatibility .pre-commit-config.yaml files, setting rust-toolchain.toml, configuring rustfmt or Clippy, optimizing release profiles, CI caching, linker config, profiling flags such as frame pointers, cross builds, deciding Cargo.lock policy, or establishing local verification commands.
---

# Rust Workflow

Follow [Rust Workflow Standards](../../rules/rust/rust-workflow-standards.md) as the non-negotiable baseline. This Skill carries setup steps and points to copyable templates that should not live in the always-loaded rule.

For user-invoked Rust project initialization, prefer `/rust-init`; this Skill remains the implementation guide.

Use Rust workflow configuration to keep code quality high, CI efficient, builds reproducible, and release or dependency maintenance automated where the project actually needs it.

## Template Assets

Use templates from `assets/templates/` only after inspecting the target project. Treat them as starting points, not overrides.

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

Do not create empty placeholder files. If a template is applied, write useful default content and preserve any existing config.

## Setup Flow

1. Inspect `Cargo.toml`, `Cargo.lock`, workspace members, `.cargo/config.toml`, toolchain, rustfmt, Clippy, CI, and hook config before editing.
2. Classify the project as single crate or workspace, and library or binary application.
3. Keep existing managed hook frameworks such as Lefthook, Husky, Python `pre-commit`, or `prek`; do not preserve untracked `.git/hooks` scripts as project workflow.
4. For new Rust projects without a managed hook framework, use `prek` with its native `prek.toml`.
5. Add `rust-toolchain.toml` only if the project does not already pin the toolchain.
6. Add `package.rust-version` only when the project explicitly supports MSRV.
7. Use workspace lint config only at a real workspace root.
8. Verify with the smallest command set that covers the touched surface.

## Workspace Decision

Default to a single crate. Use a workspace only when the repository already has multiple crates that must share CI, toolchain, dependency policy, or release coordination.

Good workspace boundaries:

- binary plus reusable library
- CLI plus server
- proc macro plus runtime crate
- integration-test support crate

Avoid vague crates such as `utils`, `common`, or `helpers` unless they provide real reusable APIs with a clear owner.

Do not create a workspace for speculative future split. Add it when the second real crate exists or is part of the requested change.

For a new multi-crate Rust 2024 workspace, apply `assets/templates/cargo-workspace-root.toml`. For existing projects, preserve current workspace members and resolver.

## Command Policy

Default commands:

```bash
cargo fmt --all -- --check
cargo clippy --locked --all-targets --all-features -- -D warnings
cargo todo
```

Fallbacks:

- Use `cargo nextest run --locked` when the project already uses `cargo-nextest`.
- Use `cargo test --locked` otherwise.
- Use raw Cargo commands in `prek.toml` by default.
- Use `justfile` wrappers only when commands are reused outside hooks or need cross-platform handling.

## Clippy Configuration

Use a baseline that is unlikely to break tests, examples, benchmarks, or binary entry points:

- workspace root: apply `assets/templates/cargo-lints-workspace-root.toml`
- workspace member: apply `assets/templates/cargo-lints-workspace-member.toml`
- single crate: apply `assets/templates/cargo-lints-single-crate.toml`

Do not enable `pedantic`, `panic`, `unwrap_used`, `expect_used`, or `indexing_slicing` as default project-wide lints. Add them only as a documented strict or production profile after checking their impact on tests, examples, benchmarks, and binary entry points.

For a strict production profile, prefer local crate-level lints in production library/application crates over workspace-wide defaults. Document why each strict lint is acceptable for that crate.

Use `clippy::restriction` lints only one by one; never enable the whole group. Use `clippy.toml` only for lint parameters such as complexity or argument-count thresholds, not for lint levels.

## Tooling

Install missing Rust workflow tools only when the project needs them:

```bash
cargo install prek
cargo install cargo-todo
cargo install cargo-nextest --locked
```

Register hooks from the project root:

```bash
prek install
```

If the project already uses Lefthook, keep it and map the same commands into `lefthook.yml` instead of adding `prek`.

## prek Configuration

For new Rust projects, copy `assets/templates/prek.toml`.

Use `.pre-commit-config.yaml` only when the project must remain compatible with Python `pre-commit`.

Keep hooks visible when tools are missing. Do not delete `cargo-todo` or `cargo-nextest` hooks to hide first-run failures.

## justfile

Do not add `justfile` only to make hooks look tidy. Copy `assets/templates/justfile` only when humans or CI will reuse the same commands.

When a `justfile` exists, `prek.toml` may call `just fmt`, `just clippy`, `just todo`, and `just test` instead of raw Cargo commands.

## rust-toolchain.toml

Copy `assets/templates/rust-toolchain.toml` for new Rust projects unless the repository already pins a toolchain. Never downgrade a pinned toolchain or switch to nightly by default.

## rustfmt.toml

Copy `assets/templates/rustfmt.toml` only when there is no existing rustfmt config. Use the crate's existing edition. For new projects without an edition, use 2024.

## Cargo.toml Defaults

Declare MSRV only for publishable crates that explicitly support it:

```toml
[package]
rust-version = "1.75.0"
```

When MSRV is declared, copy `assets/templates/github-actions-msrv.yml` or add `cargo msrv verify` to existing CI.

Apply `assets/templates/cargo-release-profile.toml` when the project wants the default fast release profile.

Use workspace dependencies for member crates:

```toml
[workspace.dependencies]
tokio = "1"
serde = "1"

[dependencies]
tokio = { workspace = true }
serde = { workspace = true }
```

Share package metadata when all member crates follow the same value:

```toml
[workspace.package]
version = "0.1.0"
edition = "2024"
license = "MIT"

[package]
version.workspace = true
edition.workspace = true
license.workspace = true
```

## CI Pipeline

Use CI as the authoritative gate. If `.github/workflows` already exists, preserve the structure and add missing Rust checks. If `rust-toolchain.toml` exists, keep CI on the same channel and components. For new GitHub Actions projects, copy `assets/templates/github-actions-ci.yml`.

Keep required pull-request gates in one primary workflow file, usually `ci.yml`, with separate jobs for fmt, clippy, test, feature, MSRV, or audit checks. Split into separate workflow files only when triggers, permissions, schedule, runtime cost, or ownership differ. Template files are stored separately for reuse; they do not require separate workflow files in the target project.

Order CI layers as fmt, Clippy with warnings denied, tests, feature checks, vulnerability checks, dependency or license policy checks, then release build. Keep fmt, Clippy, tests, and release build in the base CI for new projects; add the other layers only when project risk justifies them.

Prefer `cargo nextest run --locked` only when the project already uses `cargo-nextest`. Add MSRV checks only for projects that declare MSRV. For public libraries or production projects, copy `assets/templates/github-actions-quality.yml` when extra dependency, security, or feature checks are needed.

Use `cargo hack` for crates with meaningful feature combinations. Use `cargo audit` for RustSec vulnerability checks. Use `cargo deny check` only when the project has dependency or license policy. Keep `cargo udeps` out of default CI because it requires nightly. Keep `cargo crap` as an explicit analysis task, not a default gate.

For workspace changes that affect shared crates, run workspace-level checks:

```bash
cargo check --workspace
cargo test --workspace
cargo build --workspace
```

## Cargo.lock Policy

| Project type | Cargo.lock |
|--------------|------------|
| Application | Commit |
| Library | Do not commit |
| Workspace with binaries | Commit |

## Release Profile

Prefer fast local release builds unless the project explicitly optimizes for binary size or runtime performance. Only switch `lto` to `"thin"` or `"fat"` when profiling or release requirements justify the cost.

## Build Optimization

Pin the Rust toolchain with `rust-toolchain.toml` when the project does not already pin one, so local and CI use the same channel and components.

Use `assets/templates/cargo-release-profile.toml` for the default fast release profile. Keep production runtime optimization separate and require profiling or release requirements before enabling heavier LTO.

Add `.cargo/config.toml` linker settings only when the project is link-bound and the required linker is installed. Use `assets/templates/cargo-config-linux-lld.toml` for Linux `lld`; use `assets/templates/cargo-config-macos-zld.toml` only for macOS ARM64 projects that explicitly choose `zld`. Never overwrite existing `.cargo/config.toml`.

Keep `Swatinem/rust-cache@v2` in GitHub Actions. Add `sccache` only for large projects with repeated CI compile bottlenecks, and only with a real cache backend/config rather than `RUSTC_WRAPPER` alone.

Use `cross` only when the project has real cross-compilation targets. Prefer `cross build --target <target>` over hand-written linker and sysroot config for Linux ARM64 or Linux-to-Windows builds.

## Observability

Enable frame pointers only for production, release, benchmark, or profiling builds that need more accurate stack traces. Prefer scoped CI environment variables or release build scripts:

```bash
RUSTFLAGS="-C force-frame-pointers=yes"
```

Do not add frame pointers to the default developer workflow unless the project already uses them or profiling accuracy is an explicit requirement. When `.cargo/config.toml` already contains `rustflags`, merge carefully and preserve linker flags.

## Automated Fixes

Use automatic fixes only for local repair after inspecting the current diff:

```bash
cargo fix --allow-dirty
cargo clippy --fix --allow-dirty
```

After automated fixes, review the diff and rerun formatting, Clippy, tests, and TODO checks before handoff.

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
