# ai-config

[English](README.md)

个人 AI 编程配置仓库，用来集中维护 Claude Code 和 Codex 使用的 rules、skills、agents、commands 和安装脚本。

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

安装脚本会把本仓库中的配置复制到默认目录：

- Claude Code：`~/.claude`
- Codex：`~/.codex`

也可以通过环境变量指定目标目录：

- `CLAUDE_HOME`
- `CODEX_HOME`

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

检查脚本会比较仓库内容和已安装到本机的配置，发现缺失或漂移时返回失败。
