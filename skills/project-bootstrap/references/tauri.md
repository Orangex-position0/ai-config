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
2. React + TypeScript 前端的目录结构、路由、feature 边界和 ESLint 委托 `$react-ts-project-template`；Tauri 项目不生成 React 专属 `lefthook.yml`。
3. 项目根目录统一使用 `prek` 管理 hooks；`src-tauri/` 下的 Cargo 配置、hooks、fmt、Clippy、测试、CI、toolchain 和构建策略委托 `$rust-workflow`。
4. Tauri 特有的 capabilities、权限、IPC、窗口配置、打包和签名不由 `project-bootstrap` 臆造；只有用户明确要求时才继续处理。
5. 不把 `src-tauri/` 目录当作普通 Rust library 或 workspace 自动改造，不覆盖既有 Tauri 配置。

## 子 skill 输入

调用 `$react-ts-project-template` 时传入：

- `<project-root>`；
- 已确认这是 Tauri v2 + React + TypeScript 项目；
- 前端工作目录和 package manager；
- 是否已生成通用文档模板、GitHub 模板和 API 文档；
- 是否需要联合 GitHub Actions CI。

调用 `$rust-workflow` 时传入：

- `<project-root>`；
- Rust 工作目录为 `<project-root>/src-tauri`；
- 已确认这是 Tauri v2 的 Rust backend，而不是独立 Rust 服务；
- 是否已生成通用文档模板、GitHub 模板和 API 文档；
- 是否需要联合 GitHub Actions CI。

## Hook 选择

Tauri 项目固定选择 `prek`，不同时生成或注册 Lefthook：

- 由 `$rust-workflow` 在项目根目录生成或维护 `prek.toml`；
- `prek.toml` 同时覆盖前端和 `src-tauri/` 的检查；
- 前端检查可调用 package manager 的 typecheck、lint、test 或 build script；
- 若已有 Lefthook，先报告冲突并在用户确认前保留，不自动并行启用两个框架；
- 使用 `prek install` 注册 hooks。

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
- hooks 使用根目录 `prek.toml`，不额外生成 `lefthook.yml`。
- 不默认加入多平台打包、签名、发布、Updater 或 release 流程；
- 已有同名 workflow 时跳过并提示，不覆盖。
