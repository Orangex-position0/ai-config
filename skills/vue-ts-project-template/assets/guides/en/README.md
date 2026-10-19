# Source layout

This project groups code by business feature. `app/` starts the application and owns the router. `features/auth/`, `features/document/`, and `features/workspace/` show where each capability belongs. The `workspace` view is the initial route; the empty directories contain `.gitkeep` and do not implement authentication or documents.

Within a feature:

| Directory | Put here |
| --- | --- |
| `api/` | This feature's endpoint calls and request/response types |
| `components/` | UI used by this feature |
| `composables/` | Reusable Vue logic for this feature |
| `stores/` | Feature state that must outlive a view |
| `types/` | Types local to this feature |
| `views/` | Route-level screens |

For example, a document feature could add `components/DocumentEditor.vue`, `components/DocumentTree.vue`, and `views/DocumentDetailView.vue` when those screens are implemented. Export what the router or other modules need from the feature's `index.ts`.

`shared/` has the same separation for code genuinely reused across features: `api/` for an HTTP client, `components/` for generic UI, `composables/` for shared Vue logic, `types/` for shared types, and `utils/` for pure helpers. Put imported images, fonts, and styles in `assets/`; put fixed-name static files in `public/`.

Rename or remove example feature directories that do not match your product. Remove a `.gitkeep` when real code lands in that directory.
