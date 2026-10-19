# Tauri v2 组合栈（React + TypeScript + Rust）

> 本文件只描述 Tauri v2 的检测、编排和职责边界。默认复用 `references/react.md` 与 `references/rust.md` 的初始化契约；React 工具链委托 `$react-ts-project-template`，Rust 工具链委托 `$rust-workflow`。本文件只补充 Tauri 组合栈的差异。

## 检测信号

满足以下任一组合时，将项目识别为 Tauri v2，而不是拆成互不相关的 React 与 Rust 项目：

- 存在 `src-tauri/tauri.conf.json`，且 `src-tauri/Cargo.toml` 使用 Tauri v2 依赖；
- `src-tauri/Cargo.toml` 含 Tauri v2 依赖，并且根目录存在前端 `package.json`；
- `package.json` 含 Tauri v2 的 `@tauri-apps/cli`、`tauri` script 或 `tauri dev` / `tauri build` 命令，并且存在 `src-tauri/`。

Tauri 检测必须优先于单独的 React+TS 或 Rust 检测。

## 委托边界

检测到 Tauri v2 后：

1. 通用文档模板、GitHub 模板和是否生成 CI 的判断仍由 `project-bootstrap` 处理。
2. React + TypeScript 前端的目录结构、路由、feature 边界和 ESLint 委托 `$react-ts-project-template`；前端只提供 hooks 检查命令，不单独生成或注册 Lefthook。
3. 根目录 hook 管理器由 `project-bootstrap` Step 6 请用户显式选择；`src-tauri/` 下的 Cargo 配置、Rust hooks 命令、fmt、Clippy、测试、CI、toolchain 和构建策略委托 `$rust-workflow`。
4. Tauri 特有的 capabilities、权限、IPC、窗口配置、打包和签名不由 `project-bootstrap` 臆造；只有用户明确要求时才继续处理。
5. 不把 `src-tauri/` 目录当作普通 Rust library 或 workspace 自动改造，不覆盖既有 Tauri 配置。

## 子 skill 输入

调用 `$react-ts-project-template` 时传入：

- `<project-root>`；
- 已确认这是 Tauri v2 + React + TypeScript 项目；
- 前端工作目录和 package manager；
- 是否已生成通用文档模板、GitHub 模板和 API 文档；
- 是否需要联合 GitHub Actions CI。
- 用户为本 Git 仓库明确选择的 hook 管理器；未选择时不得生成或注册 hooks。

调用 `$rust-workflow` 时传入：

- `<project-root>`；
- Rust 工作目录为 `<project-root>/src-tauri`；
- 已确认这是 Tauri v2 的 Rust backend，而不是独立 Rust 服务；
- 是否已生成通用文档模板、GitHub 模板和 API 文档；
- 是否需要联合 GitHub Actions CI。
- 用户为本 Git 仓库明确选择的 hook 管理器；未选择时不得生成或注册 hooks。

## Hook 选择

React 前端推荐 Lefthook，Rust 后端推荐 prek，因此同一 Git 仓库必须先由用户显式选择。回答前不生成、改写或注册 hooks。

- 选定后在根目录维护一份所选管理器的配置，同时覆盖前端和 `src-tauri/` 检查；命令分别以 `$react-ts-project-template/references/tooling.md` 与 `$rust-workflow/references/decisions.md` 为准。
- `project-bootstrap` 统一注册所选管理器；已有另一管理器时，迁移文件及注册状态也须由用户明确决定。
- 前端或 Rust skill 不得分别注册各自推荐的管理器。

## 联合验证

最小验证顺序：

1. 前端执行项目已有的 typecheck、lint、test 或 build 检查；
2. `src-tauri/` 由 `$rust-workflow` 执行 `cargo fmt`、Clippy、测试和构建基线；
3. 若存在 `tauri dev` 或 `tauri build` script，确认其前端工作目录、`beforeDevCommand`、`beforeBuildCommand` 与当前 package manager 一致；
4. 报告任一子系统未验证的原因，不用另一侧的检查替代它。

## CI

需要生成 GitHub Actions 时，CI 必须同时覆盖前端和 `src-tauri/` Rust backend：

- 前端安装依赖并执行 typecheck、lint、test 或 build；
- Rust 使用 `$rust-workflow` 提供的 Tauri/Rust 检查；
- hooks 按用户明确选定的根目录管理器维护，不额外生成第二份配置。
- 不默认加入多平台打包、签名、发布、Updater 或 release 流程；
- 已有同名 workflow 时跳过并提示，不覆盖。
