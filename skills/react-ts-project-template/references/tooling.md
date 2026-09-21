# React + TypeScript 工具链模板

本文件由 `$react-ts-project-template` 持有，供 `project-bootstrap` 在 React + TypeScript 项目中物化工具链配置。

## ESLint

新建 React + TypeScript 项目默认复制所选路由模板中的：

- `eslint.config.js`
- `eslint.boundaries.config.js`

已有项目只有在用户明确要求时添加，且不得覆盖既有 ESLint 配置。

配置是 TypeScript-first flat config，依赖：

- `@eslint/js`
- `globals`
- `typescript-eslint`

## lefthook.yml

React + TypeScript 项目的推荐配置：

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

适配规则：

- `{staged_files}` 是 lefthook 内置变量，仅传变更文件，避免全量扫描。
- `prettier --check` 只校验不自动改；自动格式化需另行采用 lint-staged 模式。
- 测试框架默认使用 `vitest`。若 `package.json` 检出 jest，改用 `npx jest --findRelatedTests`。
- 存在 ESLint 配置时，在 `pre-commit.commands` 追加：

```yaml
    eslint:
      glob: "*.{ts,tsx}"
      run: npx eslint {staged_files}
```

依赖检查：

- `prettier`
- `vitest`
- `commitlint`
- `@commitlint/config-conventional`
- `@eslint/js`
- `globals`
- `typescript-eslint`

缺失依赖时列出清单，提示用户使用当前包管理器安装，不替用户执行安装。

## GitHub Actions CI

只在 `project-bootstrap` 主流程判定需要 GitHub Actions CI 时生成 `.github/workflows/ci.yml`；若同名文件已存在，跳过并提示，不覆盖。

默认 CI：

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  react:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npm test -- --run
```

适配规则：

- 没有 `test` script 但有 `vitest` 依赖时，改用 `npx vitest run`。
- 没有 `test` script 且无法检测测试框架时，跳过 test step 并在收尾说明。
- 存在 `pnpm` / `yarn` lockfile 时，按对应包管理器改写 install、build、test 命令。
- 不默认生成 deploy、release、coverage upload、multi-OS matrix 或 cron。
