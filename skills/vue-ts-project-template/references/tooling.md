# Vue + TypeScript Tooling

`project-bootstrap` owns the decision to create hooks and CI. This reference owns Vue-specific commands. Read the target `package.json` and lockfile before writing them.

## ESLint

For a new project, select ESLint in `create-vue` and keep its generated flat config. If enabled, copy `assets/router-classic/eslint.boundaries.config.js` and append `...architectureBoundaries` to the generated config array. Existing projects receive this addition only when the user asks; preserve existing ESLint rules.

The boundary file checks alias imports. Keep the public API rule in `references/project-structure.md` for relative imports that ESLint's `no-restricted-imports` patterns cannot identify by feature owner.

Use the project's existing `lint` and `type-check` scripts. The type checker for Vue SFCs is `vue-tsc`; do not substitute plain `tsc` for it.

## Git hooks

For a Vue-only Git repository without an existing manager, recommend Lefthook. When `project-bootstrap` detects a different manager in the same Git repository, use only the manager explicitly selected by the user. Do not write or register either config before that choice. Merge the Vue checks below with the other stack's checks in one root config.

Inspect `package.json`, lockfile, ESLint config, and available tools first. The minimal Vue checks are read-only ESLint on staged Vue/TypeScript source at `pre-commit`, then Vue type checking and build at `pre-push`. Use `vue-tsc` through the project's verified `type-check` script. If `build` already invokes `type-check`, run `build` once; otherwise run both verified scripts. If `build-only` exists, it can follow `type-check` to avoid duplicate checking. Add a noninteractive test command only when its runner, script, and tests already exist. Add format, secret scanning, or commit-message checks only when the project already configures the required tools. Never run `--fix` or another mutating command in a hook. Omit unavailable checks and report the missing prerequisite.

For a root Vue project whose `package.json` has `type-check` and `build-only`, with ESLint installed, the Lefthook form is:

```yaml
pre-commit:
  commands:
    vue-eslint:
      glob: "*.{vue,ts}"
      run: npm exec -- eslint {staged_files}
pre-push:
  commands:
    vue-type-check:
      run: npm run type-check
    vue-build:
      run: npm run build-only
```

If the user selects prek for a mixed-stack repository, translate the same checks into local hooks. For the same root Vue project:

```toml
default_install_hook_types = ["pre-commit", "pre-push"]

[[repos]]
repo = "local"

[[repos.hooks]]
id = "vue-eslint"
name = "Vue ESLint"
language = "system"
entry = "npm exec -- eslint"
files = "\\.(vue|ts)$"
stages = ["pre-commit"]

[[repos.hooks]]
id = "vue-type-check"
name = "Vue type check"
language = "system"
entry = "npm run type-check"
pass_filenames = false
always_run = true
stages = ["pre-push"]

[[repos.hooks]]
id = "vue-build"
name = "Vue build"
language = "system"
entry = "npm run build-only"
pass_filenames = false
always_run = true
stages = ["pre-push"]
```

Adapt the package manager, working directory, and file filters to the actual repository. For a nested frontend, run scripts in its directory and filter staged paths to that frontend; do not copy the root examples unchanged. `project-bootstrap` owns registration and verifies the effective Git hooks directory.

If the project already has Vitest, a `test:unit` script, and tests, verify `npm run test:unit -- --run` exits after one run. Then add it to Lefthook under `pre-push.commands.vue-test.run`, or to prek as a local hook with `entry = "npm run test:unit -- --run"`, `pass_filenames = false`, `always_run = true`, and `stages = ["pre-push"]`. If its existing test script already runs once, use that exact script instead. Do not add a test hook to a fresh project without tests.

## GitHub Actions CI

When `project-bootstrap` decides CI is needed, write one minimal `.github/workflows/ci.yml` for the detected package manager and lockfile. For an npm project with `build`, `type-check`, `lint`, and `test:unit` scripts:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  vue:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run build
      - run: npm run test:unit -- --run
```

Remove a check step when its script is absent and report that omission. Match Node and package-manager setup to the target project's existing constraints. Never overwrite an existing CI file.
