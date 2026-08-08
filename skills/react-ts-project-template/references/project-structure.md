# React TS Project Structure

## Scope

Use these rules for Vite + React + TypeScript browser SPA projects with a separate back end reached through HTTP APIs.

Do not apply this structure directly to Next.js, Remix, React Router Framework, React Native, Expo, or full monorepo workspace design.

## Recommended Shape

```text
src/
├── app/
│   ├── App.tsx
│   ├── providers/
│   └── router/
├── assets/
├── components/
├── config/
├── features/
├── hooks/
├── lib/
├── pages/
├── types/
├── utils/
└── main.tsx
```

For file-based routing, use `src/routes/` instead of `src/app/router/` plus `src/pages/`.

## Layers

```text
main.tsx
  -> app/
  -> pages/ or routes/
  -> features/
  -> shared: components, hooks, lib, config, types, utils, assets
```

- `main.tsx`: mount React and wrap with `StrictMode`.
- `app/`: assemble `App`, global providers, top-level router, and global error boundaries.
- `pages/`: route entries. Read route params and compose features; keep business logic in features.
- `routes/`: file-route entries when the router supports that convention.
- `features/`: main business-code home, split by business capability.

## Feature Shape

Create feature subdirectories only when used.

```text
features/<feature>/
├── api/
├── components/
├── hooks/
├── model/
├── store/
├── utils/
└── index.ts
```

`index.ts` is the feature public API:

```ts
export { ProjectList } from "./components/ProjectList";
export { useProjects } from "./hooks/useProjects";
export type { Project } from "./model/project";
```

Outside code should import from the feature root:

```ts
import { ProjectList, type Project } from "@/features/project";
```

Do not deep-import another feature's internals:

```ts
import { ProjectList } from "@/features/project/components/ProjectList";
```

## API Layer

Put common HTTP infrastructure in `src/lib/http/`:

- base URL
- timeout
- token injection
- shared response parsing
- shared error conversion

Put business API code in `src/features/<feature>/api/`:

- endpoint paths
- request and response DTOs
- DTO-to-model conversion
- TanStack Query or SWR query and mutation functions

Do not copy back-end `controller/service/repository` layering into the front end. The front end expresses calling, caching, displaying, and interaction boundaries.

## Shared Directory Rules

- `components/`: shared UI without business meaning, such as `Button`, `Dialog`, `EmptyState`, `Loading`.
- `hooks/`: hooks reused by multiple features, such as `useDebounce`, `useMediaQuery`, `useLocalStorage`.
- `lib/`: configured third-party integrations, infrastructure, side-effect boundaries, and replaceable adapters.
- `config/`: parse and validate env. Business code should not read `import.meta.env` directly.
- `types/`: only truly cross-feature base types.
- `utils/`: stateless pure functions without business vocabulary.
- `assets/`: imported build assets.
- `public/`: fixed-name static files copied as-is.

## Feature Dependencies

Default to no direct feature-to-feature dependency.

When features need to interact, prefer this order:

1. Compose them in `pages/`, `routes/`, or `app/`.
2. Pass data through props, callbacks, route state, or URL search params.
3. Merge them if they are actually one feature.
4. Extract a stable shared domain object to the owner feature public API, or introduce `entities/` only when project scale justifies it.

Allowed cross-feature dependencies must be public API only, one-way, stable, and acyclic.

## State Placement

- One component: `useState`.
- Complex local state: `useReducer`.
- Server state: TanStack Query or SWR.
- Cross-page client state: Zustand, Redux, or Jotai only when needed.
- Global context: `app/providers/`.
- Feature context: `features/<feature>/context/`.

Do not create a top-level `context/` or global store by default.

## TypeScript Baseline

Recommended options for new projects:

```json
{
  "compilerOptions": {
    "strict": true,
    "isolatedModules": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

Use `.tsx` for JSX files and `.ts` otherwise.

Use `import type` for type-only imports and `export type` for type-only exports.

Prefer `interface` for extendable public object contracts. Use `type` for unions, intersections, mapped types, and conditional types.

## Boundary Checks

Use ESLint `no-restricted-imports` for the minimum architecture checks:

- shared layers must not import `features/`, `pages/`, `routes/`, or `app/`
- features must not import `pages/`, `routes/`, or `app/`
- code must not deep-import another feature's internals

`no-restricted-imports` mainly checks static imports. Review dynamic imports and string paths manually.

## Placement Decision

```text
Only serves one feature?
  -> features/<feature>/

Already reused by multiple features?
  -> components/ | hooks/ | lib/ | config/ | types/ | utils/

Not reused yet?
  -> keep it near the user
```

Reverse check: deleting a feature may break `pages`, `routes`, or `app/router`. If it breaks another feature or shared layer, inspect for a leaked dependency.

## Avoid

- Do not put all business types in top-level `types/`.
- Do not promote hooks to top-level `hooks/` before reuse exists.
- Do not create empty folders for symmetry.
- Do not hide business logic in `utils/`.
- Do not wrap every third-party library.
- Do not keep both `pages + app/router` and `routes` as active routing structures.
