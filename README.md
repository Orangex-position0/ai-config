# ai-config

[简体中文](README.zh-CN.md)

Personal AI coding configuration for maintaining the shared rules, skills, agents, commands, and install scripts used by Claude Code, Codex, and Pi.

This repository is meant to be versioned on GitHub and reused across machines.

## Layout

| Path | Purpose |
|---|---|
| `rules/` | Shared and language-specific engineering rules for Rust, Go, Python, React, Java, TypeScript, Vue, and more |
| `skills/` | Reusable agent skills such as code review, security review, TDD, project bootstrap, and frontend design |
| `agents/` | Specialized agent configuration |
| `commands/` | Common command templates |
| `scripts/` | Install and drift-check scripts |

## Install

Requires **Node.js >=20** on `PATH`. Bash (including macOS Bash 3.2) and PowerShell (5.1 or newer) are thin entrypoints to the same Node.js standard-library implementation. Installing and checking configuration do not require `npm install`.

Windows:

```powershell
.\scripts\install.ps1
```

macOS / Linux:

```bash
./scripts/install.sh
```

The install scripts treat this repository as the source of truth and install shared resources into:

- Shared agent config: `~/.agents`

Claude Code and Codex then receive runtime projections that link back to the shared resources:

- Claude Code: `~/.claude`
- Codex: `~/.codex`

Pi can be configured to scan `~/.agents/skills` directly; the installer does not write into a Pi-specific home.

You can override the target directories with:

- `AGENTS_HOME`
- `CLAUDE_HOME`
- `CODEX_HOME`

The installer owns individual resources, not shared containers: each `skills/<name>/` is one unit; rules, agents, commands and helpers are managed per file, including nested files. Templates, assets and references use their immediate files/directories as units. A unit directory includes its descendants. Local tooling directories such as `.claude` and `.git` are excluded from rule/agent/command source traversal and the top-level skills inventory.

- `.system/` and other independently installed resources are preserved by both install and check, even with `--force`. Existing correct whole-directory runtime links are retained as references, never treated as ownership of their containers. New directory units use links with a copy fallback; file units are copied.
- All destinations are checked before anything is replaced; `--dry-run` runs the same checks without creating locks, directories or state. Its output includes action counts and preserved resources; `--json` includes the complete list.
- Version 3 SHA-256 snapshots in `~/.agents/install-state.json` distinguish repository updates from edits within owned units, including hidden files and empty directories. Unchanged installed content upgrades automatically; differing same-name resources are refused unless `--force` is explicit.
- Removed owned resources are reported as stale by check and pruned on install only when unchanged (or `--force` is explicit). Empty shared containers are left in place.
- Changing a runtime home preserves the old home and stops managing its destinations.
- `--force` can discard changes **inside a named resource unit**, but never authorizes removing its shared parent or unrelated siblings. Review conflicts and back up anything you want to keep. Overlapping source/configuration homes are always refused.
- Install takes exclusive `.ai-config-install.lock` files in the repository and all three homes. Lock metadata records the PID and start time. Locks are not automatically stolen: after an interrupted process, inspect them and confirm no installer is active before manually removing stale locks. Check and dry-run refuse to inspect an installation with an existing lock.
- Replacements are staged and their snapshots verified. Targets are rechecked before commit; detected concurrent edits abort rather than overwrite. Ordinary commit errors trigger rollback. If a target changes externally during rollback, it and its backup are preserved for manual recovery. Forced termination, power loss and arbitrary writers ignoring the locks are not fully covered.
- Cleanup failure after a successful commit is a warning, not an installation failure; retained staging/backup paths are reported. Commit failures keep their original error even if cleanup also fails.

Legacy states without hashes adopt identical resources individually and preserve unrelated content. They do not authorize deleting old resources absent from the source. Version 2 directory snapshots migrate automatically to per-resource ownership and retain verifiable upgrade baselines. Same-name conflicts still require manual reconciliation or an explicit `--force`.

## Preview Changes

Windows:

```powershell
.\scripts\install.ps1 --dry-run
```

macOS / Linux:

```bash
./scripts/install.sh --dry-run
```

## Check Drift

Windows:

```powershell
.\scripts\check.ps1
```

macOS / Linux:

```bash
./scripts/check.sh
```

The check scripts verify both layers:

1. repository content → `~/.agents`
2. `~/.agents` → Claude Code and Codex runtime projections

They fail when files are missing or drifted, and warn when a projection is using copy fallback instead of links or when shared skills/rules contain runtime-specific paths.

## Script Development

```bash
npm ci
npm run validate
npm test
```

Validation uses a pinned YAML parser for valid multiline scalars and malformed-YAML detection. `agents/openai.yaml` is optional, but validated when present. The legacy `python scripts/validate_skills.py` entrypoint forwards to the same skill validator.

Tests install only into temporary homes. CI runs Node.js 20 on Windows, Linux, and macOS, including PowerShell 5.1/7 and the system Bash. Set `TEST_RUNNERS=node,bash` or `TEST_RUNNERS=node,pwsh,powershell` to exercise available entrypoints locally; the default is `node`.
