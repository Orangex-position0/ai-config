# ai-config

[简体中文](README.zh-CN.md)

Personal AI coding configuration for maintaining the rules, skills, agents, commands, and install scripts used by Claude Code and Codex.

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

The install scripts copy this repository's configuration into the default homes:

- Claude Code: `~/.claude`
- Codex: `~/.codex`

You can override the target directories with:

- `CLAUDE_HOME`
- `CODEX_HOME`

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

The check scripts compare the repository with the installed local configuration and fail when files are missing or have drifted.
