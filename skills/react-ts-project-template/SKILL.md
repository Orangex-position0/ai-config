---
name: react-ts-project-template
description: Create, adapt, or review Vite + React + TypeScript SPA project templates for front-end/back-end separated applications. Use when scaffolding a React TS project structure, choosing between pages/app-router and file-based routes, organizing feature modules, adding minimal architecture boundary checks, or converting React project-structure notes into a reusable template.
---

# React TS Project Template

## Scope

Use this for browser SPA projects built with Vite, React, and TypeScript.

Do not use this for Next.js, Remix, React Native, Expo, or full monorepo workspace design.

## Workflow

1. Confirm the target project is Vite + React + TypeScript, or ask before proceeding.
2. Choose exactly one route layout:
   - `assets/router-classic/` for `src/app/router` plus `src/pages`.
   - `assets/router-file-based/` for `src/routes`.
3. Copy only the needed template files into the target project. Prefer `npm create vite@latest` for dependency versions, then layer this template over it.
4. Read `references/project-structure.md` when deciding where code belongs or when reviewing an existing structure.
5. For a new React + TypeScript project, copy the selected `eslint.config.js` and `eslint.boundaries.config.js` templates. For an existing project, add them only when the user requests ESLint; never overwrite an existing ESLint config.
6. Read `references/tooling.md` when generating ESLint, Lefthook, or GitHub Actions configuration, then run the smallest available check, usually `npm run typecheck`, `npm run lint`, or the repository's existing `check` script.

## Defaults

- Keep business code under `src/features/<feature>/`.
- Keep `src/app` and route/page files thin: assemble providers, routes, pages, loading, error, and empty states.
- Create feature subdirectories only when used. Do not create empty `api`, `store`, `context`, or `utils` folders for symmetry.
- Put shared code under `src/components`, `src/hooks`, `src/lib`, `src/config`, `src/types`, `src/utils`, or `src/assets` only after real cross-feature reuse exists.
- Put HTTP infrastructure in `src/lib/http`; put business endpoints, DTOs, and query/mutation wrappers in `src/features/<feature>/api`.
- Export a feature's public API from `src/features/<feature>/index.ts`; outside code should not deep-import another feature's internals.

## Route Layout Choice

Use `router-classic` when the app has explicit route configuration or the team wants route objects in one place.

Use `router-file-based` when the router supports file conventions and the team wants URL structure visible in the filesystem.

Do not keep both `src/pages` plus `src/app/router` and `src/routes` as competing route entry points.

## Template Resources

- `assets/router-classic/` contains the minimal `src/app/router` plus `src/pages` layout and ESLint templates.
- `assets/router-file-based/` contains the minimal `src/routes` layout and ESLint templates.
- `references/project-structure.md` contains placement rules, API layer guidance, TypeScript baseline, and boundary-check rationale.
- `references/tooling.md` contains the React-specific ESLint, Lefthook, and GitHub Actions configuration contract.

The ESLint template is TypeScript-first and uses flat config with `@eslint/js`, `globals`, and `typescript-eslint`; it also applies the selected architecture boundary rules. Add these packages as dev dependencies when they are absent.

Skipped: package dependency versions. Use the target project's package manager or Vite initializer so versions stay current.
