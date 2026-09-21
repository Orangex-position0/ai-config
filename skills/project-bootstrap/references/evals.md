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
- React `src/` 结构、路由布局、feature 边界、TypeScript-first ESLint 配置、ESLint 架构边界和 React 工具链委托 `react-ts-project-template`。
- 新建项目默认生成 `eslint.config.js`；已有项目仅在用户明确要求时生成，且不覆盖既有 ESLint 配置。
- 按 `$react-ts-project-template/references/tooling.md` 生成 React `lefthook.yml`，由 `project-bootstrap` 负责注册和验证 hooks。
- 缺少 `prettier`、`vitest`、`commitlint`、`@commitlint/config-conventional`、`@eslint/js`、`globals` 或 `typescript-eslint` 时只提示安装命令，不替用户安装。
- 若用户明确要求 CI，或确认 GitHub 信号后的询问，则按 `$react-ts-project-template/references/tooling.md` 生成最小 `.github/workflows/ci.yml`；不生成 deploy/release。

## 场景 3：Tauri v2 repo

输入：目标目录含前端 `package.json`、`src-tauri/tauri.conf.json` 和 `src-tauri/Cargo.toml`，且 Rust 依赖含 `tauri`。

期望行为：

- 先询问模板语言。
- 识别为 Tauri v2 组合栈，不拆成独立 React 与 Rust 项目。
- 通用文档模板由 `project-bootstrap` 处理。
- React + TypeScript 前端结构和 ESLint 委托 `react-ts-project-template`。
- Tauri 项目不生成 React 专属 `lefthook.yml`，根目录统一选择 `prek`。
- 根目录 `prek.toml` 以及 `src-tauri/` 的 Rust hooks、CI、toolchain、fmt、Clippy、测试和目录策略委托 `rust-workflow`。
- 若需要 GitHub Actions CI，生成同时覆盖前端和 `src-tauri/` 的联合检查；不生成多平台打包、签名或 release 流程。
- 不同时启用 Lefthook 和 prek；已有 Lefthook 时先报告冲突，不自动切换或并行注册。
- 不臆造 Tauri capabilities、IPC、窗口或打包配置，不覆盖既有 Tauri 文件。

## 场景 4：Rust repo

输入：目标目录含 `Cargo.toml` 或 `*.rs`。

期望行为：

- 先询问模板语言。
- 通用文档模板由 `project-bootstrap` 处理。
- GitHub issue / PR 模板仍按开源判断处理。
- Rust hooks、CI、toolchain、`rustfmt.toml`、Clippy、`Cargo.lock` 策略和目录结构全部委托 `rust-workflow`。
- 若需要 GitHub Actions CI，主流程只做是否生成的判断，具体 Rust CI 委托 `rust-workflow`。
- 不生成通用 `ci.yml` 或 `release.yml`。

## 场景 5：Python repo

输入：目标目录含 `pyproject.toml` 或 `*.py`。

期望行为：

- 先询问模板语言。
- 通用文档模板由 `project-bootstrap` 处理。
- 默认 Python 主路径为 `uv + pyproject.toml + src/ layout`。
- 若不存在 `pyproject.toml`，生成最小 uv 项目配置；目录名不能安全转成项目名时先问用户；不生成可发布 package 配置。
- 默认只创建 `src/` 与 `tests/`；包名明确时才创建 `src/<package>/`。
- 按 `references/python.md` 生成 `lefthook.yml`：pre-commit 跑 `ruff format --check`、`ruff check`、`gitleaks protect --staged`；pre-push 跑 `pytest --cov=src --cov-report=term-missing` 与 `bandit -r src/`。
- 类型检查只在检测到既有 mypy/pyright 配置时追加。
- 检测到 FastAPI/API 信号时只生成 API 文档模板，不默认生成 FastAPI 代码或目录。
- 若用户明确要求 CI，或确认 GitHub 信号后的询问，则按 `references/python.md` 生成最小 `.github/workflows/ci.yml`；不生成 PyPI publish、Docker、coverage upload 或 release workflow。

## 场景 6：GitHub 信号但未明确 CI

输入：目标目录有 GitHub remote 或 `.github/`，但用户只要求初始化项目，未提 CI。

期望行为：

- 先按既有流程确认模板语言与技术栈。
- 到 CI 判断步骤时只问一次：`检测到 GitHub 仓库信号。是否生成最小 .github/workflows/ci.yml？`
- 用户拒绝或不确认时跳过 CI，并在收尾说明。
- 用户确认时按技术栈 reference 生成最小 CI；同名文件已存在则跳过，不覆盖。

## 场景 7：Java / Spring Boot repo

输入：目标目录含 `pom.xml`、`build.gradle` 或 Java/Spring Boot 主类。

期望行为：

- 先询问模板语言。
- 通用文档模板由 `project-bootstrap` 处理。
- 按 `references/java.md` 读取 Java workflow、coding、null safety 与 DDD 规则。
- 初始化生产级 Java 项目时询问是否接入 NullAway，并推荐接入。
- 用户同意接入 NullAway 时，Maven 只修改 `pom.xml`，Gradle Groovy 只修改 `build.gradle`；不自动处理 `build.gradle.kts`、多模块父子构建或已有复杂 Error Prone 配置。
- 能确定 base package 时生成 `package-info.java` 并使用 `@NullMarked`；不能确定时不臆造 `com.example`。
- 不生成 NullAway demo class。
- 接入后只用项目 wrapper 做最小验证；无 wrapper 或依赖下载不可用时报告未本地验证，不裸跑 `mvn` / `gradle`。
