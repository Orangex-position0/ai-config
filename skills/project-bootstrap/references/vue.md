# Vue + TypeScript 栈（Vite SPA）

本文件只定义 `project-bootstrap` 与 `$vue-ts-project-template` 的交接。Vue 的结构、源码资产和工具链细节由后者维护。

## 委托边界

检测到 Vite + Vue + TypeScript 项目后：

1. `project-bootstrap` 继续处理通用文档、按需 API 文档，以及 GitHub issue / PR 模板判断。
2. `project-bootstrap` 判断是否需要 CI，并负责 hooks 注册与最终验证。
3. **REQUIRED SUB-SKILL:** Use `vue-ts-project-template` for feature-based `src/` structure, Vue Router, ESLint, Vue-specific hooks commands, and CI steps. Default to `assets/router-classic/`.

Vue 项目的 `src/` 结构以 `vue-ts-project-template/references/project-structure.md` 为准；这里不复制目录清单。

## Git hooks 交接

Vue 单栈项目推荐 Lefthook；同一 Git 仓库还有推荐 prek 的后端，或已有管理器不一致时，先按 `project-bootstrap` Step 6 请用户显式选择，不能在此默认 Lefthook。选择结果传给 `$vue-ts-project-template`。

| 阶段 | 默认检查 | 命令来源 |
|---|---|---|
| `pre-commit` | 对暂存的 `.vue`、`.ts` 等源码运行只读 ESLint | `$vue-ts-project-template/references/tooling.md` § Git hooks |
| `pre-push` | 类型检查与构建；若 `build` 已包含类型检查，只执行一次 | 同上 |
| `pre-push`（按需） | 已配置且有测试文件时运行单元测试 | 同上 |
| `commit-msg`（按需） | 已配置提交信息工具时校验 | 同上 |

完整 Lefthook/prek 示例、包管理器适配和缺失工具处理只维护在 Vue 工具链 reference，不在此复制命令。`project-bootstrap` 负责合并同一 Git 仓库中其他技术栈的检查，并注册用户选定的唯一管理器。

## 交接输入

- `<project-root>`，以及新建项目或已有项目
- `package.json` 中的 Vue、Vite、TypeScript、Router、脚本与包管理器信号
- 用户选择的文档模板语言
- 是否需要 API 文档、GitHub 模板与 CI
- 已有配置文件、路由和源码，避免覆盖
- Git 仓库根目录、已有 hook 管理器，以及用户明确选定的管理器（若有冲突）

## Tauri

现有 `references/tauri.md` 只覆盖 React + TypeScript 前端。若 Tauri 前端是 Vue，报告组合栈尚未覆盖，继续处理能独立完成的通用文档，不套用 React 模板或 hooks。
