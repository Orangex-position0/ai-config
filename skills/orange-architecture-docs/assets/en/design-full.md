# <Module> design

- **Last verified**: YYYY-MM-DD
- **Code baseline**: `<full commit SHA>`
- **Verification scope**: <module paths and sections actually checked; name sections not rechecked after a partial update>

<!-- When Git revision is unknown, explain why. For relevant uncommitted changes, name paths and note that the SHA is not a complete snapshot. Add a release tag only if verified. Remove this prompt in the final document. -->

> A module-level adaptation of arc42: explain this module's real mechanisms and omit unsupported sections. Put project structure in `ARCHITECTURE.md` and unimplemented designs in `docs/proposals/`.

## Purpose, context, and constraints

<!-- Why the module exists, its responsibilities and exclusions, consumers/dependencies, key constraints, and code location. -->

## Building blocks and API boundaries

<!-- Core components, public interfaces, encapsulated details, dependency direction; diagram and code entry points if useful. -->

## Key runtime scenarios

<!-- Representative interactions, inputs/outputs, and exceptional branches; sequence diagram if helpful, not a function-call inventory. -->

## State, data, and lifecycle

<!-- State owners and transitions, resource lifetime, and when relevant persistence, transaction, or consistency boundaries. -->

## Failure and recovery

<!-- Error propagation and ownership of retry/rollback/degradation; identify failures that cannot be recovered automatically. -->

## Design trade-offs and invariants

<!-- Evidence-backed non-obvious rationale and module constraints; link ADRs for important decisions instead of repeating their history. -->

## Risks, extension, and verification

<!-- Known limits, extension points, common changes, and tests/checks that protect constraints. Mark unresolved claims separately. -->
