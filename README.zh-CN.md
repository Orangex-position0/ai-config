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

需要 `PATH` 中存在 **Node.js >=20**。Bash（包括 macOS 默认 Bash 3.2）和 PowerShell（5.1 及以上）入口共用基于 Node.js 标准库的实现。安装、检查配置不需要执行 `npm install`。

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

安装器只管理明确的资源单元，不接管共享容器：每个 `skills/<name>/` 是一个单元；rules、agents、commands 和 helper 按文件管理，包括嵌套文件；templates、assets、references 按直接子文件或子目录管理。目录单元包含其后代内容。rules/agents/commands 的源遍历和 skills 顶层清单会排除 `.claude`、`.git` 等本地工具目录。

- `.system/` 和其他独立安装的资源由 install/check 保留，`--force` 也不会删除。已有正确的整目录 runtime 链接会保留，但不代表拥有该容器；新安装的目录单元优先链接，失败时复制，文件单元直接复制。
- 替换前检查全部目标；`--dry-run` 执行相同预检，不创建锁、目录或状态文件。输出包含操作数量和保留资源，`--json` 提供完整列表。
- `~/.agents/install-state.json` 使用 v3 SHA-256 快照，区分仓库更新和受管单元内的本地修改，包括隐藏文件和空目录。未修改的内容自动升级；同名但内容不同的资源默认拒绝覆盖。
- 仓库删除的受管资源由 check 报告为 stale，install 仅在旧内容未修改时清理，除非显式指定 `--force`。空的共享容器保留。
- 切换 runtime home 时保留旧 home，不再管理其中的目标。
- `--force` 可以丢弃**指定资源单元内部**的修改，但不会删除其共享父目录或无关的相邻资源。请先查看冲突并备份要保留的内容。源目录与配置 home 重叠时始终拒绝执行。
- install 在仓库及三个 home 中创建排他的 `.ai-config-install.lock`，记录 PID 和开始时间，不自动抢占旧锁。进程中断后，需要检查锁并确认没有安装进程运行，才能手动移除遗留锁。check 和 dry-run 遇到已有锁会停止。
- 内容先暂存并核对快照，提交前再次检查目标；检测到并发修改就停止，不授权覆盖。普通提交错误触发回滚；回滚期间若检测到外部修改，则保留目标和备份供人工恢复。强杀、断电及不遵守锁的任意外部写入不在完整保证范围内。
- 提交成功后的清理失败只报告警告，并列出暂存/备份残留路径，不误报安装失败。提交失败时，即使清理也失败，仍保留原始错误。

无 hash 的旧状态按资源逐项接管内容一致的项目，保留无关内容，不授权删除源中已不存在的旧资源。v2 整目录快照自动迁移为逐项所有权，并保留可验证的升级基线。同名冲突仍需人工处理或显式指定 `--force`。

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

## 脚本开发

```bash
npm ci
npm run validate
npm test
```

校验使用固定版本的 YAML 解析器，支持合法多行标量并拒绝非法 YAML。`agents/openai.yaml` 为可选文件，存在时校验。旧入口 `python scripts/validate_skills.py` 转发到同一个 skill 校验器。

测试仅安装到临时 home。CI 在 Windows、Linux、macOS 上使用 Node.js 20，覆盖 PowerShell 5.1/7 和系统 Bash。本地可设置 `TEST_RUNNERS=node,bash` 或 `TEST_RUNNERS=node,pwsh,powershell` 来测试可用入口；默认只运行 `node`。
