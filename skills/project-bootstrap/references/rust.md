# Rust 栈

> 锚点最后验证日期：2026-07-20
> 本文件只持有「rules 锚点 + 物化指令」，模板与配置内容一律去 rules 读原文。

## rules 锚点

| 用途 | rules 源 | 章节 |
|---|---|---|
| Git hooks 框架与配置 | `~/.claude/rules/rust/rust-workflow-standards.md` | Git Hooks |
| 代码质量命令（fmt/clippy/todo） | 同上 | Verification Baseline |
| 测试命令（nextest） | 同上 | Verification Baseline |
| 项目配置（toolchain/release/Cargo.lock） | 同上 | Project Configuration / Release Profile |
| Workspace 与 MSRV | 同上 | Project Configuration |
| 编码规范 | `~/.claude/rules/rust/rust-conventions.md` | 全文 |
| commit 规范 | `~/.claude/rules/conventional-commit.md` | 项目特定约定 |

## Git hooks（物化指令）

rules 已规定 Rust 栈首选 **prek**（pre-commit 的 Rust 实现），完整框架选型、安装与配置见 `rust-workflow-standards.md` 的 Git Hooks。物化时直接复用 rules：

1. 复制 `rust-workflow` skill 的 `prek.toml` 配置到 `<project-root>/prek.toml`，不自行改命令。
2. 执行 `prek install` 注册。

要点：

- `nextest` 未装时把 test hook 的 entry 改 `cargo test --locked`（`rust-workflow` fallback）。
- `cargo-todo` 缺失时提示 `cargo install cargo-todo`，宁留 hook 让首次提交报错暴露，不删。
- 小型项目可把 clippy 从 pre-push 上移 pre-commit——问用户项目规模后定。
- 团队要跨栈统一工具链时退回 Lefthook，把命令填入 `lefthook.yml`。

## 项目配置（物化提醒）

新建 Rust 项目时，按 `rust-workflow-standards.md` 的 Project Configuration / Release Profile 提醒或生成以下配置：

- `rust-toolchain.toml`：固定 `channel = "stable"` + `components = ["rustfmt", "clippy"]`。
- `Cargo.lock` 策略：二进制项目提交，库项目不提交。**先问项目类型**再决定是否 `.gitignore` 它。
- `rust-version`：写入 `Cargo.toml [package]`。
- Workspace 子 crate 依赖用 `workspace = true`——仅当存在多个真实 crate 时提醒。

## 目录结构（物化指令）

Cargo 约定目录，按需建空骨架（`.gitkeep` 占位）：

```text
src/          # main.rs 或 lib.rs（必建）
tests/        # 集成测试（按需）
benches/      # 基准（按需，rules/performance-benchmark.md）
examples/     # 示例（按需）
```

`src/` 必建，其余三项按用户需求。Workspace 结构按 Project Configuration 组建，不臆造子 crate。
