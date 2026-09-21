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

By default the installer creates links for shared directories and falls back to copying if links are unavailable. It refuses to replace drifted or unmanaged local content unless you pass `--force`.

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
