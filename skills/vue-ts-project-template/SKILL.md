---
name: vue-ts-project-template
description: Create, adapt, or review Vite + Vue + TypeScript SPA project templates. Use when project-bootstrap detects Vue TS, when scaffolding a feature-based Vue project, or when choosing Vue Router, ESLint, hooks, and CI for that project.
---

# Vue TS Project Template

## Scope

Use this for a browser SPA built with Vite, Vue, and TypeScript. For Tauri, Nuxt, or a monorepo, confirm the owner workflow before changing the project.

## Workflow

1. Confirm the target is Vue + TypeScript. For a new project, use the current `create-vue` initializer with TypeScript and Vue Router selected; let it choose dependency versions. For an existing project, inspect its router, scripts, package manager, and configuration first.
   → Done when the project type and available tooling are known.
2. Read `references/project-structure.md`. In a new project, layer the full `assets/router-classic/` tree over the generated project, including `.gitkeep` directories. Copy `assets/guides/<language>/README.md` to `src/README.md`, using the document language already confirmed by `project-bootstrap`; when invoked alone, ask for `zh-CN` or `en`. Inspect the initializer's imports and remove untouched demo files made unused by the new entry, including its old `src/App.vue`, `src/router/`, `src/views/`, and sample components or assets. In an existing project, place new code within its current layout unless the user requested a migration. Never overwrite user files.
   → Done when one router entry renders `workspace`, every directory in the reference tree exists, the matching guide is present, and no unused initializer demo files remain.
3. Read `references/tooling.md` for ESLint, Git hooks, and CI. Use the initializer's ESLint config; add `assets/router-classic/eslint.boundaries.config.js` only when ESLint is enabled and the target config can import it. Add hooks only after `project-bootstrap` passes the selected manager for a mixed-stack Git repository; when invoked alone for Vue-only work, recommend Lefthook. Add checks only when the target scripts and dependencies support their commands.
   → Done when generated commands match the target package scripts and existing config is preserved.
4. Run the smallest available checks: type check, lint, then build if dependencies are installed. If they cannot run, report the exact missing prerequisite.
   → Done when each available check passes or its limitation is reported.

## Defaults

- Use `src/app` for app setup and explicit Vue Router configuration.
- Start with the draft's `auth/`, `document/`, and `workspace/` feature directories. Only `workspace` has runnable view code; `.gitkeep` marks the other segment directories as planned locations.
- Start with the draft's `shared/` segment directories. Put code there only after cross-feature reuse exists.
- Do not add Pinia, an HTTP client, file routing, or a monorepo unless the target actually needs them.

## Resources

- `assets/router-classic/`: minimal runnable Vue source and optional ESLint boundary rules.
- `assets/guides/<language>/README.md`: project-facing directory guide, copied to `src/README.md`.
- `references/project-structure.md`: placement and dependency rules.
- `references/tooling.md`: ESLint, Git hooks, and GitHub Actions contract.
