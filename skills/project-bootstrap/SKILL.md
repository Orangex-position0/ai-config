---
name: project-bootstrap
description: 项目初始化脚手架（编排器）。在新项目启动或为现有项目补齐工程规范时使用：从用户全局 rules 实时读取规范，物化为项目的 AI coding 三件套文档模板（ADR / PRD / BDD）、CHANGELOG.md、按各技术栈约定配置的 Git hooks（Java/React 用 Lefthook，Rust 优先 prek；含 pre-commit / pre-push / commit-msg）、以及各技术栈约定的目录结构。当用户说「初始化项目」「搭建项目骨架」「生成 ADR 模板」「生成 PRD 模板」「生成 BDD / feature 模板」「生成 changelog 模板」「配置 git hooks」「配置 pre-commit / pre-push」「project init」「scaffold a new project」时触发。支持 Java/Spring Boot、React+TypeScript、Rust 三种技术栈；模板内容始终与 ~/.claude/rules/ 同步，skill 自身不持有模板副本。
---

# Project Bootstrap

## 定位

本 skill 是**编排器**，不是模板仓库。它执行时实时读取用户全局规范 `~/.claude/rules/`（Windows 下为 `C:\Users\<用户名>\.claude\rules\`），把规范**物化**为目标项目里的骨架文件。skill 自身不持有模板副本——避免与 rules 脱节腐化。

核心约束：

- 模板内容（ADR / PRD / BDD 字段、CHANGELOG 格式、commit 规范）一律从 rules 读取，禁止在本 skill 内复制。
- GitHub issue / PR 模板来自本仓库 `templates/github/`，只在目标项目会开源到 GitHub 时物化。
- rules 未覆盖的增量知识（如 React 的 lefthook 命令、Rust 的 prek 框架选择）才写进 `references/<stack>.md`。
- 锚点统一用「文件路径 + 章节标题」，不用行号——rules 迭代频繁，行号必然腐化。

## 工作流

按顺序执行，每步给出验证点。

### Step 1 · 确认目标项目与技术栈

1. 确认目标项目根目录。若不含 `.git/`，先提示 `git init`。
2. 检测技术栈信号（按优先级）：
   - `pom.xml` / `build.gradle*` / `**/*.java` → **Java/Spring**
   - `package.json` 且含 `vite`，或 `**/*.tsx` → **React+TS**
   - `Cargo.toml` / `**/*.rs` → **Rust**
   - 以上皆无 → 退化为「仅文档 + 最小 lefthook」，或主动询问用户。
3. 检测不到时**主动询问**，不要默认假设技术栈。

→ 验证：已确定 `<project-root>` 与技术栈。

### Step 2 · 读取语言无关的 rules 规范

按下表 Read 对应 rules 文件，取出模板原文：

| 产物 | rules 源 | 取哪个章节 |
|---|---|---|
| ADR 模板 | `~/.claude/rules/adr-writing.md` | 「最小模板」 |
| PRD 模板 | `~/.claude/rules/prd-writing.md` | 「最小模板」 |
| BDD feature 模板 | `~/.claude/rules/bdd-writing.md` | 「最小模板」（Gherkin 段） |
| CHANGELOG | `~/.claude/rules/changelog-standards.md` | §2 格式 + §5.1 语言选择 |
| commit-msg 校验依据 | `~/.claude/rules/conventional-commit.md` | 项目特定约定 |

→ 验证：已读到三件套模板与 CHANGELOG 初始格式。

### Step 3 · 物化文档模板（语言无关）

在 `<project-root>/` 下生成 AI coding 三件套文档模板 + CHANGELOG：

1. `docs/adr/adr-template.md` ← adr-writing.md「最小模板」原文（占位符 `<...>` 保留）。
2. `docs/prd/prd-template.md` ← prd-writing.md「最小模板」原文（全字段：Meta / Objectives / Background / Assumptions / User Stories / Design / Open Questions / What We're Not Doing）。
3. `docs/features/feature-template.feature` ← bdd-writing.md「最小模板」的 Gherkin 段（Feature + Scenario + Given/When/Then 骨架）。默认放 `docs/features/`；若项目偏好可执行规约紧邻测试代码，改 `tests/features/`（rules 两者皆允许）。
4. `CHANGELOG.md` ← changelog-standards.md §2 模板。语言默认**简体中文**（§5.1：个人/内部项目）；开源项目改英文或双语（§5.2）。

→ 验证：四个文件存在，字段与 rules 完全一致（未自行增删）。

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
   - **Rust** → 首选 prek，写 `<project-root>/.pre-commit-config.yaml`（drop-in 兼容 pre-commit）；团队要统一工具链时退回 Lefthook。
2. YAML 注释一律中文、独占行；禁行尾注释。

→ 验证：配置文件含 pre-commit 与 pre-push 两组检查。

### Step 6 · 创建技术栈目录结构

按 `references/<stack>.md` 的「目录结构」章节创建空目录骨架（用 `.gitkeep` 占位）。仅创建 rules 明确要求的目录，不臆造。

→ 验证：骨架目录存在。

### Step 7 · 安装 hooks 框架并验证

按栈安装并注册（**不替用户执行包管理器安装**，跨平台不可靠）：

| 栈 | 框架 | 安装 | 注册 |
|---|---|---|---|
| Java/React | Lefthook | `brew` / `scoop` / `go install` 三选一 | `lefthook install` |
| Rust | prek（首选） | `cargo install prek` | `prek install` |

→ 验证：注册命令成功，`.git/hooks/` 下出现对应钩子。

**收尾提醒用户**：本地 hook 可被 `git commit --no-verify` 绕过，安全强制必须走 CI（参见 `rules/java/java-workflow-standards.md` §4，该原则跨栈通用）。

## 产物清单（执行前向用户确认）

AI coding 三件套 + 工程基础设施：

- `docs/adr/adr-template.md` — ADR 空白模板
- `docs/prd/prd-template.md` — PRD 空白模板
- `docs/features/feature-template.feature` — BDD Gherkin 空白模板
- `CHANGELOG.md` — Keep a Changelog 初始文件
- `.github/pull_request_template.md` — GitHub PR 模板（仅开源到 GitHub 时）
- `.github/ISSUE_TEMPLATE/*.md` — GitHub issue 模板（仅开源到 GitHub 时）
- `lefthook.yml`（Java/React）或 `.pre-commit-config.yaml`（Rust）— Git hooks 配置
- `<stack>/` 目录骨架
- `.git/hooks/` — hooks 框架注册的钩子

可选扩展（用户提及再加，不主动生成）：`.editorconfig`、`README.md`、API 文档骨架（`rules/api-documentation.md`）。

## 执行约束

- **Windows 编码**：调用 Python/Node 工具链时设 `PYTHONUTF8=1`，避免 GBK 编码撞 emoji 报错。
- **幂等**：目标文件已存在则跳过并提示，绝不覆盖用户既有改动。
- **不臆造命令**：hooks 命令必须来自 rules 或 references，禁止编造工具名或参数。
- **少打断**：技术栈检测不到、或 GitHub 开源状态不明但出现 GitHub 信号时才问；其余用合理默认（中文 CHANGELOG、`docs/features/`、`<stack>` 骨架），不逐项追问。

## 技术栈分支速查

| 栈 | 检测信号 | references | hooks 框架 |
|---|---|---|---|
| Java/Spring | `pom.xml` / `build.gradle*` | `references/java.md` | Lefthook |
| React+TS | `package.json` + `vite` / `*.tsx` | `references/react.md` | Lefthook |
| Rust | `Cargo.toml` / `*.rs` | `references/rust.md` | prek（首选）/ Lefthook |
| 通用/不确定 | 无上述信号 | — | 仅执行 Step 2/3 + 最小 Lefthook，不建栈特定目录 |
