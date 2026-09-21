# ai-config

[English](README.md)

个人 AI 编程配置仓库，用来集中维护 Claude Code、Codex 和 Pi 使用的共享 rules、skills、agents、commands 和安装脚本。

这个仓库适合放在 GitHub 上做版本管理，也方便在新机器上恢复同一套工作流。

## 目录

| 路径 | 作用 |
|---|---|
| `rules/` | 通用和语言相关的工程规则，例如 Rust、Go、Python、React、Java、TypeScript、Vue 等 |
| `skills/` | 可复用的 agent skill，例如 code review、security review、TDD、项目初始化、前端设计等 |
| `agents/` | 专用 agent 配置 |
| `commands/` | 常用命令模板 |
| `scripts/` | 安装和检查脚本 |

## 安装

Windows：

```powershell
.\scripts\install.ps1
```

macOS / Linux：

```bash
./scripts/install.sh
```

安装脚本把本仓库视为唯一 source of truth，并把共享资源安装到：

- 共享 agent 配置：`~/.agents`

Claude Code 和 Codex 会获得指向共享资源的运行时投影：

- Claude Code：`~/.claude`
- Codex：`~/.codex`

Pi 可以通过配置直接扫描 `~/.agents/skills`；安装脚本不会写入 Pi 专用 home。

也可以通过环境变量指定目标目录：

- `AGENTS_HOME`
- `CLAUDE_HOME`
- `CODEX_HOME`

默认优先为共享目录创建链接；如果链接不可用，则回退为复制。脚本默认拒绝替换已漂移或未托管的本地内容，除非传入 `--force`。

## 预览安装内容

Windows：

```powershell
.\scripts\install.ps1 --dry-run
```

macOS / Linux：

```bash
./scripts/install.sh --dry-run
```

## 检查配置漂移

Windows：

```powershell
.\scripts\check.ps1
```

macOS / Linux：

```bash
./scripts/check.sh
```

检查脚本会验证两层内容：

1. 仓库内容 → `~/.agents`
2. `~/.agents` → Claude Code 和 Codex 运行时投影

发现缺失或漂移时返回失败；发现投影使用 copy fallback 或共享 skills/rules 中存在 runtime-specific 路径时给出 warning。
