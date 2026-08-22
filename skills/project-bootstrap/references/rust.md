# Rust 栈

> 维护说明：rules 章节名变化时，同步更新本文件的 Rule key 与使用锚点。
> 本文件只持有「委托边界 + rules 指针」。Rust 工具链、hooks、CI 与 Cargo 项目结构一律委托 `$rust-workflow`。

## 委托边界

`project-bootstrap` 检测到 Rust 项目后：

1. 继续执行通用文档模板物化：ADR、PRD、BDD、CHANGELOG，以及按需 API 文档。
2. 继续按 GitHub 开源判断物化 issue / PR 模板。
3. **REQUIRED SUB-SKILL:** Use `rust-workflow` for all Rust-specific bootstrap work.

`project-bootstrap` 不再自行生成 Rust hooks、Cargo 配置、CI、`rust-toolchain.toml`、`rustfmt.toml`、Clippy lint 配置、`Cargo.lock` 策略、release profile、linker/cache/profiling 配置、cross build 配置或 Rust 目录骨架。

## rust-workflow 输入

调用 `$rust-workflow` 时，把以下已确认信息传给它：

- `<project-root>`
- 用户选择的模板语言，仅作为最终汇报语言参考
- 是否已生成通用文档模板
- 是否已生成 GitHub issue / PR 模板
- 是否检测到 API/接口契约需求

其余 Rust 策略由 `$rust-workflow` 按目标项目文件自动检测；只有当选择会改变项目策略、增加 CI 成本、需要全局或网络安装、或无法从仓库推断时再问用户。

## rules 指针

`<rules>` 由 `project-bootstrap` 定义为当前宿主的 rules 根目录。先解析下列 rule key，再按「使用锚点」读取对应章节。

| Rule key | 文件 |
|---|---|
| `rust-workflow` | `<rules>/rust/rust-workflow-standards.md` |
| `rust-conventions` | `<rules>/rust/rust-conventions.md` |
| `conventional-commit` | `<rules>/common/conventional-commit.md` |

## 使用锚点

| 用途 | Rule key | 章节 |
|---|---|---|
| Git hooks 框架与配置 | `rust-workflow` | Git Hooks |
| 代码质量命令（fmt/clippy/todo） | `rust-workflow` | Verification Baseline |
| 测试命令（nextest） | `rust-workflow` | Verification Baseline |
| 项目配置（toolchain/release/Cargo.lock） | `rust-workflow` | Project Configuration / Release Profile |
| Workspace 与 MSRV | `rust-workflow` | Project Configuration |
| 编码规范 | `rust-conventions` | 全文 |
| commit 规范 | `conventional-commit` | 项目特定约定 |
