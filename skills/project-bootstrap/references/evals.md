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
- React 推荐 Lefthook、Rust 推荐 prek，必须先让用户为同一 Git 仓库显式选择；未回答前不生成、改写或注册 hooks。
- 用户选择后只在根目录生成一份所选管理器的配置，合并前端与 `src-tauri/` 检查；Rust hooks 命令、CI、toolchain、fmt、Clippy、测试和目录策略委托 `rust-workflow`。
- 若需要 GitHub Actions CI，生成同时覆盖前端和 `src-tauri/` 的联合检查；不生成多平台打包、签名或 release 流程。
- 不同时启用 Lefthook 和 prek；已有任一管理器时仍须显式选择，迁移另行确认，不自动切换或并行注册。
- 不臆造 Tauri capabilities、IPC、窗口或打包配置，不覆盖既有 Tauri 文件。

## 场景 3a：Vite + Vue + TypeScript repo

输入：目标目录含 `package.json`，依赖有 Vue、Vite、TypeScript，且存在 `.vue` 文件。

期望行为：

- 先询问文档模板语言，继续由 `project-bootstrap` 处理通用文档和 GitHub 判断。
- 检测为 Vue+TS，不因 Vite 信号进入 React 分支。
- 将源码、Vue Router、ESLint 和工具链委托 `vue-ts-project-template`。
- 默认物化 `assets/router-classic/` 的 Feature-based 结构：`app/`、`features/auth/`、`features/document/`、`features/workspace/`、`shared/` 和 `assets/`；空目录有 `.gitkeep`，`src/README.md` 解释职责。
- 只有 `workspace` 有可运行页面；文档组件名留作示例位置，不生成空实现，也不默认安装 Pinia 或 HTTP 客户端。
- 新项目使用 `create-vue` 的依赖版本和 ESLint 配置；已有项目不覆盖现有源码或配置。
- hooks 的 `pre-commit` 使用只读 ESLint 检查暂存的 `.vue`/`.ts`；`pre-push` 执行已有的 Vue 类型检查与构建，构建已含类型检查时只执行一次；测试仅在已有 runner、脚本和测试时加入。
- Vue 单栈默认 Lefthook；hooks 和 CI 只调用目标项目实际存在的脚本，保留现有同名文件。

## 场景 3b：Tauri v2 + Vue repo

输入：目标目录存在 Tauri v2 配置，前端依赖 Vue 而非 React。

期望行为：

- 不把 Vue 前端送入 React 模板或 React + Rust 的组合流程。
- 报告组合栈暂未覆盖；能独立完成的通用文档仍按主流程处理。

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

## 场景 8：同一 Git 仓库的 Vue + TypeScript 与 Rust 后端

输入：根目录有 Vue `package.json`，后端目录有 `Cargo.toml`；Vue 推荐 Lefthook，Rust 推荐 prek。分别模拟已有 `lefthook.yml`、已有 `prek.toml`、两者都存在及均不存在。

期望行为：

- 同时识别 Vue 与 Rust，不因先命中一个栈而遗漏另一个。
- 向用户说明两种候选、现有配置以及 Vue 的 lint、类型检查、构建和 Rust 的检查，要求显式选一个根目录管理器；已有配置不能替代用户选择。
- 用户未答前可生成独立文档和结构，但 hooks 文件及注册状态保持原样。
- 用户选定后将两个栈的检查合并到一份根目录配置，向两个子 skill 传递同一选择；若需迁移已有管理器，另请用户明确决定，禁止覆盖或并行注册。
- 若前后端各自是独立 Git 仓库，分别按各仓库单栈规则处理，不制造跨仓库冲突。
