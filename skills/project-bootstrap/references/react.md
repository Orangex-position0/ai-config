# React + TypeScript 栈（Vite SPA）

> 维护说明：rules 章节名变化时，同步更新本文件的 Rule key 与使用锚点。
> 本文件只持有「委托边界 + hooks 增量」。项目结构、路由布局、feature 边界和 ESLint 架构边界检查委托 `$react-ts-project-template`；lefthook 命令仍是本 skill 的增量知识。

## 委托边界

`project-bootstrap` 检测到 Vite + React + TypeScript 项目后：

1. 继续执行通用文档模板物化：ADR、PRD、BDD、CHANGELOG，以及按需 API 文档。
2. 继续按 GitHub 开源判断物化 issue / PR 模板。
3. 继续按本文件的 `lefthook.yml` 增量配置 hooks。
4. **REQUIRED SUB-SKILL:** Use `react-ts-project-template` for React-specific `src/` structure, route layout, feature module boundaries, and optional ESLint boundary checks.

`project-bootstrap` 不再自行创建 React `src/` 目录骨架，也不自行决定 `src/pages` + `src/app/router` 与 `src/routes` 的路由布局。

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

## react-ts-project-template 输入

调用 `$react-ts-project-template` 时，把以下已确认信息传给它：

- `<project-root>`
- 已确认项目为 Vite + React + TypeScript，或检测信号与疑点
- 用户选择的模板语言，仅作为最终汇报语言参考
- 是否已生成通用文档模板
- 是否已生成 GitHub issue / PR 模板
- 是否检测到 API/接口契约需求

## lefthook.yml（增量，rules 未覆盖）

Vite + TS SPA 的推荐配置。命令节奏对齐 Java rules 的 <10s / <60s 原则（跨栈通用）：

```yaml
# pre-commit：格式 + 类型 + Secret，全部秒级
pre-commit:
  parallel: true
  commands:
    prettier:
      glob: "*.{ts,tsx,js,jsx,json,css,md}"
      run: npx prettier --check {staged_files}
    typecheck:
      run: npx tsc --noEmit
    secret-scan:
      run: gitleaks protect --staged

# pre-push：测试，可至数十秒
pre-push:
  commands:
    test:
      run: npx vitest run

# commit-msg：Conventional Commit 校验
commit-msg:
  commands:
    commitlint:
      run: npx commitlint --edit
```

要点：

- `{staged_files}` 是 lefthook 内置变量，仅传变更文件，避免全量扫描。
- `prettier --check` 只校验不自动改（改了 staged 文件需 re-add，易出错）；要自动格式化改用 lint-staged 模式，本配置保守起见用 check。
- 测试框架默认 **vitest**（Vite 标配）。若 `package.json` 检出 jest，改 `npx jest --findRelatedTests`。
- ESLint：若项目已配 ESLint，在 `pre-commit.commands` 追加 `eslint: { glob: "*.{ts,tsx}", run: npx eslint {staged_files} }`；未配则不强加。

## 前提依赖

`prettier` / `vitest` / `commitlint` / `@commitlint/config-conventional` 须在 `devDependencies`。检测 `package.json`，缺失项**列清单提示用户 `npm install -D ...`**，不替用户执行安装。
