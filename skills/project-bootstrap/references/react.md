# React + TypeScript 栈（Vite SPA）

> 锚点最后验证日期：2026-07-20
> **本栈 rules 无工作流规范**（`react-ts-project-standards.md` 仅讲目录结构）。lefthook 命令是本 skill 的增量知识，下方为权威来源。

## rules 锚点

| 用途 | rules 源 | 章节 |
|---|---|---|
| src/ 目录骨架 | `~/.claude/rules/react-ts-project-structure.md` | §2.1 目录骨架必须存在 |
| feature 内部 segment | 同上 | §3.1 feature 内部 segment 划分 |
| TS 严格模式与类型组织 | 同上 | §2.6 TypeScript 规范 |
| commit 规范 | `~/.claude/rules/conventional-commit.md` | 项目特定约定 |

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

## 目录结构（物化指令）

按 `react-ts-project-structure.md` §2.1 在 `src/` 下建 12 个目录（`app/assets/components/config/features/hooks/lib/pages/providers/routes/types/utils`），每个放 `.gitkeep`。feature segment（§3.1）按需建，不预建空 feature。

**MVP 阶段（< 1 个月、< 5 feature）**：遵循 §3.5「别过度设计」，可只建 `components/` `hooks/` `lib/` `utils/`，跳过 `features/`。询问用户项目阶段后决定。
