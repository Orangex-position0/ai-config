---
name: project-bootstrap
description: Use when initializing or retrofitting a repository with project scaffolding, docs templates, Git hooks, GitHub issue/PR templates, ADR/PRD/BDD/API/CHANGELOG files, or engineering bootstrap conventions.
---

# Project Bootstrap

## 定位

本 skill 是**编排器**，同时持有项目初始化所需的中英文空白模板资产。它执行时读取当前宿主的用户全局规范目录（Claude: `~/.claude/rules/`；Codex: `~/.codex/rules/`）作为质量约束，再把 `assets/templates/<language>/` 中的模板**物化**为目标项目里的骨架文件。

`<rules>` 表示当前宿主的 rules 根目录：Claude 为 `~/.claude/rules/`，Codex 为 `~/.codex/rules/`。

核心约束：

- 文档模板（ADR / PRD / BDD / API / CHANGELOG）一律来自 `assets/templates/<language>/`，避免长模板常驻 rules 上下文。
- 使用本 skill 前必须先询问用户选择 `zh-CN`（中文模板）还是 `en`（English templates）；即使能从项目语境推断，也不能自动选择。
- rules 只提供质量约束和验收标准；模板变更必须同步检查对应 rule 是否仍满足字段要求。
- GitHub issue / PR 模板来自本仓库 `templates/github/`，只在目标项目会开源到 GitHub 时物化。
- rules 未覆盖的增量知识（如 React 的 lefthook 命令）才写进 `references/<stack>.md`。
- **React 职责边界**：本 skill 可为 Vite + React + TypeScript 生成 `lefthook.yml`；`src/` 项目结构、路由布局、feature 模块边界和 ESLint 架构边界检查必须交给 `$react-ts-project-template`，其结构依据是 `react-ts-project-structure.md`。
- **Rust 职责边界**：本 skill 只物化通用文档模板与 GitHub 开源模板；检测到 Rust 后，Cargo 工具链、hooks、CI、`rust-toolchain.toml`、`rustfmt.toml`、Clippy、`Cargo.lock` 策略和 Rust 目录结构必须交给 `$rust-workflow`。
- **GitHub Actions 边界**：本 skill 不生成通用 `ci.yml` / `release.yml`。检测到 Rust 时委托 `$rust-workflow`；其他技术栈仅在对应 workflow skill 明确提供 CI 模板时委托，否则收尾说明跳过 GitHub Actions。
- 锚点统一用「文件路径 + 章节标题」，不用行号——rules 迭代频繁，行号必然腐化。
- 修改本 skill 后，用 `references/evals.md` 做人工回归检查。

## 工作流

按顺序执行，每步给出验证点。

### Step 1 · 确认模板语言、目标项目与技术栈

1. 先询问用户选择文档模板语言：
   - `zh-CN`：中文模板，适合中文工作环境、个人中文项目、内部项目。
   - `en`：English templates，适合开源项目、国际协作、英文 README / docs 项目。
   用户未回答前，不执行后续步骤。
2. 确认目标项目根目录。若不含 `.git/`，先提示 `git init`。
3. 检测技术栈信号（按优先级）：
   - `pom.xml` / `build.gradle*` / `**/*.java` → **Java/Spring**
   - `package.json` 且含 `vite`，或 `**/*.tsx` → **React+TS**
   - `Cargo.toml` / `**/*.rs` → **Rust**
   - 以上皆无 → 主动询问用户；若用户也不指定，则退化为「仅文档模板」，并在收尾说明跳过技术栈 hooks 与目录骨架。
4. 判断是否存在 API/接口契约需求，满足任一条件即视为需要：
   - 用户明确提到「接口」「API」「前后端分离」「后端调用」「OpenAPI」「Swagger」。
   - Java/Spring 项目含 `Controller` / `RestController` / `RouterFunction` / `application*.yml` 等 Web 信号。
   - React/TypeScript 项目含 `src/app/api/`、`pages/api/`、`server/`、`api/`、`openapi*.yaml`、`swagger*.yaml` 等信号。
   - Rust 项目含 `axum`、`actix-web`、`rocket`、`poem`、`warp`、`utoipa` 等 Web/API 依赖或路由目录。
5. 技术栈检测不到时**主动询问**，不要默认假设技术栈；API/接口契约需求不明时只在收尾说明中标记跳过，不为此单独打断。

→ 验证：已确定 `<language>`、`<project-root>`、技术栈，以及是否需要 API 文档模板。

### Step 2 · 读取 rules 质量约束与本 skill 模板

按下表 Read 对应 rules 文件，作为生成后的验收依据：

| 产物 | rules 源 | 取哪个章节 |
|---|---|---|
| ADR | `<rules>/adr-writing.md` | 核心字段 + 硬性约束 |
| PRD | `<rules>/prd-writing.md` | 核心字段 + 硬性约束 |
| BDD feature | `<rules>/bdd-writing.md` | Story / Scenario + 硬性约束 |
| API 文档（按需） | `<rules>/api-documentation.md` | 接口名称至文档更新记录 |
| CHANGELOG | `<rules>/changelog-standards.md` | 核心原则 + 分类规则 + 语言选择 |
| commit-msg 校验依据 | `<rules>/common/conventional-commit.md` | 项目特定约定 |

再按下表 Read 本 skill 的模板资产：

| 目标文件 | 模板资产 |
|---|---|
| `docs/adr/adr-template.md` | `assets/templates/<language>/adr-template.md` |
| `docs/prd/prd-template.md` | `assets/templates/<language>/prd-template.md` |
| `docs/features/feature-template.feature` | `assets/templates/<language>/feature-template.feature` |
| `docs/api/api-template.md`（按需） | `assets/templates/<language>/api-template.md` |
| `CHANGELOG.md` | `assets/templates/<language>/changelog-template.md` |

→ 验证：已读到相关 rules 质量约束与需要物化的模板资产。

### Step 3 · 物化文档模板（语言无关）

在 `<project-root>/` 下生成 AI coding 三件套文档模板 + CHANGELOG。若目标项目包含后端接口、前后端分离边界、API route、或用户明确提到「接口 / API / 后端调用」，同时生成 API 文档模板：

1. `docs/adr/adr-template.md` ← `assets/templates/<language>/adr-template.md`（占位符 `<...>` 保留）。
2. `docs/prd/prd-template.md` ← `assets/templates/<language>/prd-template.md`。
3. `docs/features/feature-template.feature` ← `assets/templates/<language>/feature-template.feature`。默认放 `docs/features/`；若项目偏好可执行规约紧邻测试代码，改 `tests/features/`（rules 两者皆允许）。
4. `CHANGELOG.md` ← `assets/templates/<language>/changelog-template.md`。
5. `docs/api/api-template.md` ← `assets/templates/<language>/api-template.md`。仅在项目存在 API/接口契约需求时生成；纯前端静态站点、CLI、库项目默认跳过，并在收尾说明中标记为跳过。若项目已有 `openapi.yaml` / `swagger.yaml`，仍生成 Markdown 模板作为“如何调用”的人工说明入口，但不得覆盖既有规范文件。

→ 验证：基础四个文件存在；需要 API 文档时第五个文件存在；生成文件满足对应 rules 字段要求；跳过 API 文档时说明跳过原因。

### Step 4 · 判断是否物化 GitHub 开源模板

仅当目标项目会作为开源项目发布到 GitHub 时，才生成 GitHub issue / PR 模板。判断顺序：

1. 用户明确说「开源」「GitHub」「public repo」「open source」→ 生成。
2. 目标项目已存在 `.github/`、GitHub remote，或 README / package metadata 明确指向公开 GitHub 仓库 → 生成前向用户确认一次。
3. 公司内部、私有、未确定托管平台、或只使用 GitHub Enterprise 做内部协作 → 不生成，并在收尾说明中标记为跳过。

生成时从本配置仓库复制：

- `templates/github/pull_request_template.md` → `<project-root>/.github/pull_request_template.md`
- `templates/github/ISSUE_TEMPLATE/bug_report.md` → `<project-root>/.github/ISSUE_TEMPLATE/bug_report.md`
- `templates/github/ISSUE_TEMPLATE/feature_request.md` → `<project-root>/.github/ISSUE_TEMPLATE/feature_request.md`
- `templates/github/ISSUE_TEMPLATE/config.yml` → `<project-root>/.github/ISSUE_TEMPLATE/config.yml`

若目标文件已存在，跳过并提示，不覆盖。

→ 验证：开源 GitHub 项目存在 `.github/` 模板；非开源或未确认项目明确跳过。

### Step 5 · 生成 Git hooks 配置

1. Read `references/<stack>.md`，确定该栈的 hooks 框架与命令：
   - **Java/Spring、React+TS** → Lefthook，写 `<project-root>/lefthook.yml`
   - **Rust** → 不在本步骤生成 hooks。改为加载并执行 `$rust-workflow`，由它按目标项目状态决定 `prek` / Lefthook、配置文件、安装提示与验证命令。
2. YAML 注释一律中文、独占行；禁行尾注释。

→ 验证：Java/React 配置文件含 pre-commit 与 pre-push 两组检查；Rust 已进入 `$rust-workflow` 的验证流程。

### Step 6 · 创建技术栈目录结构

按 `references/<stack>.md` 的「目录结构」章节创建空目录骨架（用 `.gitkeep` 占位）。仅创建 rules 明确要求的目录，不臆造。

- Java/Spring：由本步骤按 `references/java.md` 处理。
- React+TS：跳过本步骤，加载并执行 `$react-ts-project-template`，由它按 Vite SPA 状态、路由布局选择和 `react-ts-project-structure.md` 处理。
- Rust：跳过本步骤，由 `$rust-workflow` 根据 Cargo 项目类型处理。

→ 验证：Java/Spring 骨架目录存在；React+TS 已进入 `$react-ts-project-template` 的结构验证流程；Rust 已进入 `$rust-workflow` 的项目结构验证流程；通用/不确定分支明确跳过目录骨架。

### Step 7 · 注册 hooks 框架并验证

按栈注册（**不替用户执行包管理器安装**，跨平台不可靠）。Rust 项目跳过本步骤，安装、注册与验证由 `$rust-workflow` 的 Tool Safety 与 Verification 规则接管：

| 栈 | 框架 | 安装提示 | 注册 |
|---|---|---|---|
| Java/React | Lefthook | `brew` / `scoop` / `go install` 三选一 | `lefthook install` |

执行规则：

1. 检测 `lefthook` 是否可用。
2. 若可用，执行 `lefthook install`，并验证 `.git/hooks/` 下出现对应钩子。
3. 若不可用，不替用户安装；保留已生成的 `lefthook.yml`，在收尾说明中列出安装选项与待执行命令。

→ 验证：`lefthook` 可用时注册命令成功，`.git/hooks/` 下出现对应钩子；不可用时收尾明确标记 hooks 注册未完成。

**收尾提醒用户**：本地 hook 可被 `git commit --no-verify` 绕过，安全强制必须走 CI（参见 `rules/java/java-workflow-standards.md` §4，该原则跨栈通用）。

## 产物清单（执行前内部核对，收尾汇报）

除模板语言、技术栈不明、GitHub 开源状态不明外，不单独要求用户确认本清单；执行前用它核对范围，收尾按实际生成 / 跳过项汇报。

AI coding 三件套 + 工程基础设施：

- `docs/adr/adr-template.md` — ADR 空白模板
- `docs/prd/prd-template.md` — PRD 空白模板
- `docs/features/feature-template.feature` — BDD Gherkin 空白模板
- `docs/api/api-template.md` — API / 接口文档空白模板（存在 API/接口契约需求时）
- `CHANGELOG.md` — Keep a Changelog 初始文件
- `.github/pull_request_template.md` — GitHub PR 模板（仅开源到 GitHub 时）
- `.github/ISSUE_TEMPLATE/*.md` — GitHub issue 模板（仅开源到 GitHub 时）
- `lefthook.yml`（Java/React）— Git hooks 配置
- React TS template 文件（React+TS 项目）— 由 `$react-ts-project-template` 按目标项目状态决定
- Rust workflow 文件（Rust 项目）— 由 `$rust-workflow` 按目标项目状态决定
- `<stack>/` 目录骨架（React+TS / Rust 除外，分别交给 `$react-ts-project-template` / `$rust-workflow`）
- `.git/hooks/` — hooks 框架注册的钩子

可选扩展（用户提及再加，不主动生成）：`.editorconfig`、`README.md`。

## 委托 / 跳过项

- `.github/workflows/*.yml` — 本 skill 不生成通用 GitHub Actions；Rust 委托 `$rust-workflow`，其他技术栈仅在对应 workflow skill 明确提供 CI 模板时委托，否则收尾说明跳过。

## 执行约束

- **Windows 编码**：调用 Python/Node 工具链时设 `PYTHONUTF8=1`，避免 GBK 编码撞 emoji 报错。
- **幂等**：目标文件已存在则跳过并提示，绝不覆盖用户既有改动。
- **不臆造命令**：hooks 命令必须来自 rules 或 references，禁止编造工具名或参数。
- **模板语言必须确认**：无论项目是否明显中文或英文，都必须先问用户选择 `zh-CN` 还是 `en`，不能默认。
- **少打断**：除模板语言、技术栈检测不到、或 GitHub 开源状态不明但出现 GitHub 信号外，不逐项追问；API/接口契约需求不明时默认跳过并说明原因。

## 技术栈分支速查

| 栈 | 检测信号 | references | hooks 框架 |
|---|---|---|---|
| Java/Spring | `pom.xml` / `build.gradle*` | `references/java.md` | Lefthook |
| React+TS | `package.json` + `vite` / `*.tsx` | `references/react.md` + `$react-ts-project-template` | Lefthook |
| Rust | `Cargo.toml` / `*.rs` | `references/rust.md` | 委托 `$rust-workflow` |
| 通用/不确定 | 无上述信号 | — | 跳过；收尾说明未生成 hooks |
