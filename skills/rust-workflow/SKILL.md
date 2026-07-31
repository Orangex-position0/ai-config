---
name: rust-workflow
description: Rust project workflow setup and maintenance. Use when creating or updating Rust project tooling, configuring cargo checks, choosing prek or Lefthook, writing prek.toml or compatibility .pre-commit-config.yaml files, setting rust-toolchain.toml, deciding Cargo.lock policy, or establishing local verification commands.
---

# Rust Workflow

Follow [Rust Workflow Standards](../../rules/rust/rust-workflow-standards.md) as the non-negotiable baseline. This Skill carries setup steps and copyable configuration that should not live in the always-loaded rule.

## Setup Flow

1. Detect whether the repository is an application, library, or workspace.
2. Keep an existing managed hook framework such as Lefthook; do not preserve untracked `.git/hooks` scripts as project workflow.
3. For new Rust projects, use `prek` with its native `prek.toml`.
4. Add `rust-toolchain.toml` if the project does not already pin the toolchain.
5. Add `package.rust-version` to each publishable crate.
6. Use `workspace = true` for shared workspace dependencies.
7. Verify with the smallest command set that covers the touched surface.

## Workspace Decision

Default to a single crate. Use a workspace only when the repository already has multiple crates that must share CI, toolchain, dependency policy, or release coordination.

Good workspace boundaries:

- binary plus reusable library
- CLI plus server
- proc macro plus runtime crate
- integration-test support crate

Avoid vague crates such as `utils`, `common`, or `helpers` unless they provide real reusable APIs with a clear owner.

Do not create a workspace for speculative future split. Add it when the second real crate exists or is part of the requested change.

## Command Policy

Default commands:

```bash
cargo fmt --all -- --check
cargo clippy --locked --all-targets --all-features -- -D warnings
cargo nextest run --locked
cargo todo
```

Fallbacks:

- Use `cargo test --locked` when `cargo-nextest` is not installed.
- Move Clippy from pre-commit to pre-push only after documenting the local runtime cost.
- Use raw Cargo commands in `prek.toml` by default.
- Use `justfile` wrappers only when commands are reused outside hooks or need cross-platform handling.

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

Use this `prek.toml` for new Rust projects:

```toml
default_install_hook_types = ["pre-commit", "pre-push"]

[[repos]]
repo = "local"

[[repos.hooks]]
id = "fmt"
name = "cargo fmt"
language = "system"
entry = "cargo fmt --all -- --check"
files = "(\\.rs$|(^|/)Cargo\\.(toml|lock)$)"
pass_filenames = false
stages = ["pre-commit"]

[[repos.hooks]]
id = "clippy"
name = "cargo clippy"
language = "system"
entry = "cargo clippy --locked --all-targets --all-features -- -D warnings"
files = "(\\.rs$|(^|/)Cargo\\.(toml|lock)$)"
pass_filenames = false
stages = ["pre-commit"]

[[repos.hooks]]
id = "cargo-todo"
name = "cargo todo"
language = "system"
entry = "cargo todo"
files = "(\\.rs$|(^|/)Cargo\\.toml$)"
pass_filenames = false
stages = ["pre-commit"]

[[repos.hooks]]
id = "test"
name = "cargo nextest"
language = "system"
entry = "cargo nextest run --locked"
pass_filenames = false
always_run = true
stages = ["pre-push"]
```

Use `.pre-commit-config.yaml` only when the project must remain compatible with Python `pre-commit`.

Keep hooks visible when tools are missing. Do not delete `cargo-todo` or `cargo-nextest` hooks to hide first-run failures.

## justfile

Do not add `justfile` only to make hooks look tidy. Add it when humans or CI will reuse the same commands:

```just
fmt:
    cargo fmt --all -- --check

clippy:
    cargo clippy --locked --all-targets --all-features -- -D warnings

test:
    cargo nextest run --locked

todo:
    cargo todo

check: fmt clippy test todo
```

When a `justfile` exists, `prek.toml` may call `just fmt`, `just clippy`, `just todo`, and `just test` instead of raw Cargo commands.

## rust-toolchain.toml

Use this file for new Rust projects unless the repository already pins a different toolchain:

```toml
[toolchain]
channel = "stable"
components = ["rustfmt", "clippy"]
```

## Cargo.toml Defaults

Declare MSRV:

```toml
[package]
rust-version = "1.75.0"
```

Prefer fast release builds by default:

```toml
[profile.release]
incremental = true
lto = "off"
debug = 1
codegen-units = 16
```

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

Use CI as the authoritative gate. A minimal GitHub Actions job should run:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
        with:
          components: rustfmt, clippy
      - uses: Swatinem/rust-cache@v2
      - run: cargo fmt --all -- --check
      - run: cargo clippy --locked --all-targets --all-features -- -D warnings
      - run: cargo test --locked
```

Prefer `cargo nextest run --locked` once `cargo-nextest` is installed in CI. Public libraries or crates with multiple feature flags should add a feature matrix check with `cargo hack`. Public or production projects should add dependency vulnerability checks, and projects with license policy requirements should add `cargo deny check`.

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

Prefer fast local release builds unless the project explicitly optimizes for binary size or runtime performance:

```toml
[profile.release]
incremental = true
lto = "off"
debug = 1
codegen-units = 16
```

Only switch `lto` to `"thin"` or `"fat"` when profiling or release requirements justify the cost.

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
cargo nextest run --locked
cargo todo
```

Fallbacks:

- Use `cargo test --locked` when `cargo-nextest` is not installed.
