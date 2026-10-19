# Vue TS Project Structure

## Scope

Use for a Vite + Vue + TypeScript browser SPA. The default Feature-based tree contains `app/`, the example `auth`, `document`, and `workspace` features, `shared/`, and `assets/`. Empty segments contain `.gitkeep`; they are placement guides, not implemented features.

## Starting Shape

```text
src/
├── app/
│   ├── router/index.ts
│   └── App.vue
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── stores/
│   │   ├── types/
│   │   └── views/
│   ├── document/
│   │   ├── api/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── stores/
│   │   ├── types/
│   │   └── views/
│   └── workspace/
│       ├── api/
│       ├── components/
│       ├── index.ts
│       └── views/WorkspaceView.vue
├── shared/
│   ├── api/
│   ├── components/
│   ├── composables/
│   ├── types/
│   └── utils/
├── assets/
├── README.md
└── main.ts
```

`main.ts` mounts the app and installs the router. `app/` owns global setup and route composition. `workspace/` provides the runnable initial view. `auth/` and `document/` are explicit placement examples; remove or rename them if the product has different capabilities. `shared/` holds code after real cross-feature reuse; `assets/` holds imported build assets; `public/` holds fixed-name static files.

The note's `DocumentEditor.vue`, `DocumentTree.vue`, and `DocumentDetailView.vue` indicate where actual document UI would live. Do not generate empty SFC implementations for those names. `src/README.md` explains the directories in the initialized project.

## Dependency Direction

```text
main.ts → app/ → features/ → shared/
```

- Router entries import a feature through its `index.ts` public API. Feature code does not import `app/` or another feature's internal files.
- Put a feature's HTTP calls and DTOs in its own `api/` only when it calls a backend. Put a reusable HTTP client in `shared/api/` only after more than one feature needs it.
- Put Pinia stores in a feature's `stores/` when state must outlive a view. Add shared stores only for genuinely cross-feature state.
- Keep view-local state in the component or a nearby composable; do not move it into a store for symmetry.
- When multiple features interact, compose them in `app/` or a route view, pass values through props/events, or extract a truly shared concern. Keep dependencies acyclic.

## Existing Projects

Do not relocate working code merely to match the diagram. Move a directory only when the user requested a structure migration and all imports, routes, tests, and config references can be updated together.
