# Project Bootstrap Evals

修改 `project-bootstrap` 后，用这些场景做人工回归检查。目标是确认 agent 会遵守职责边界，而不是只生成文件。

## 场景 1：空 repo / 不明技术栈

输入：目标目录有 `.git/`，没有 `package.json`、`Cargo.toml`、`pom.xml`、`build.gradle*` 或源码信号。

期望行为：

- 先询问模板语言：`zh-CN` 或 `en`。
- 检测不到技术栈时询问用户。
- 用户不指定技术栈时退化为仅文档模板。
- 跳过 hooks、技术栈目录骨架和 GitHub Actions，并在收尾说明原因。

## 场景 2：Vite + React + TypeScript repo

输入：目标目录含 `package.json`，依赖或脚本显示 Vite，且存在 `*.tsx`。

期望行为：

- 先询问模板语言。
- 生成 ADR、PRD、BDD、CHANGELOG，并按 API 信号决定是否生成 API 模板。
- 按 GitHub 开源判断 issue / PR 模板，不默认生成。
- React `src/` 结构、路由布局、feature 边界和 ESLint 架构边界检查委托 `react-ts-project-template`。
- 仅按 `references/react.md` 生成 `lefthook.yml`。
- 缺少 `prettier`、`vitest`、`commitlint` 或 `@commitlint/config-conventional` 时只提示安装命令，不替用户安装。

## 场景 3：Rust repo

输入：目标目录含 `Cargo.toml` 或 `*.rs`。

期望行为：

- 先询问模板语言。
- 通用文档模板由 `project-bootstrap` 处理。
- GitHub issue / PR 模板仍按开源判断处理。
- Rust hooks、CI、toolchain、`rustfmt.toml`、Clippy、`Cargo.lock` 策略和目录结构全部委托 `rust-workflow`。
- 不生成通用 `ci.yml` 或 `release.yml`。
