# React + TypeScript 栈（Vite SPA）

> 维护说明：本文件只描述 `project-bootstrap` 与 `$react-ts-project-template` 的交接契约。React 工具链细节统一维护在 `skills/react-ts-project-template/references/tooling.md`。

## 委托边界

`project-bootstrap` 检测到 Vite + React + TypeScript 项目后：

1. 继续执行通用文档模板物化：ADR、PRD、BDD、CHANGELOG，以及按需 API 文档。
2. 继续按 GitHub 开源判断物化 issue / PR 模板。
3. 继续执行通用 GitHub Actions 是否生成的判断；具体 React CI 配置读取 `$react-ts-project-template` 的工具链 reference。
4. **REQUIRED SUB-SKILL:** Use `react-ts-project-template` for React-specific `src/` structure, route layout, feature module boundaries, TypeScript-first ESLint configuration, ESLint boundary checks, and React tooling (`lefthook.yml`).

`project-bootstrap` 不自行创建 React `src/` 目录骨架，不自行决定 `src/pages` + `src/app/router` 与 `src/routes` 的路由布局，也不维护 React 专属 ESLint 或 Lefthook 命令。

## rules 指针

`<rules>` 由 `project-bootstrap` 定义为当前宿主的 rules 根目录。先解析下列 rule key，再按「使用锚点」读取对应章节。

| Rule key | 文件 |
|---|---|
| `react-structure` | `<rules>/react-ts-project-structure.md` |
| `conventional-commit` | `<rules>/common/conventional-commit.md` |

## 使用锚点

| 用途 | Rule key | 章节 |
|---|---|---|
| src/ 目录骨架 | `react-structure` | §2.1 目录骨架必须存在 |
| feature 内部 segment | `react-structure` | §3.1 feature 内部 segment 划分 |
| TS 编译基线与类型组织 | `react-structure` | §2.6 TypeScript 规范 |
| commit 规范 | `conventional-commit` | 项目特定约定 |

TS 编译基线与 `react-ts-project-template/references/project-structure.md` 的 TypeScript Baseline 保持一致：至少启用 `strict: true`，新项目推荐同时启用 `noUncheckedIndexedAccess: true` 与 `exactOptionalPropertyTypes: true`。

## 交接输入

调用 `$react-ts-project-template` 时，把以下已确认信息传给它：

- `<project-root>`
- 已确认项目为 Vite + React + TypeScript，或检测信号与疑点
- 用户选择的模板语言，仅作为最终汇报语言参考
- 是否已生成通用文档模板
- 是否已生成 GitHub issue / PR 模板
- 是否需要生成 GitHub Actions CI
- 是否检测到 API/接口契约需求
