# Spec Authoring

PosZero keeps the SDD lifecycle intact. Specs define the problem contract; plans own implementation design; tasks own executable work.

## Spec Structure

Use this order when drafting or refining a spec:

1. Problem Statement
2. Success Metrics (Optional)
3. User / Actor Scenarios
4. Acceptance Criteria
5. Non-Goals
6. Constraints
7. Edge Cases
8. Assumptions
9. Open Questions
10. Traceability
11. Readiness Check

Specs define Why, What, Observable Contract, and Constraints. Do not include implementation details such as types, method signatures, program layout, call graph, storage choice, or module interaction design.

Acceptance Criteria describe overall user-visible behavior or delivery results. Task-level acceptance belongs in `tasks.md`.

Constraints may include technical constraints, but must not prescribe an implementation solution. A good spec stays valid if implemented with a different technology stack.

## Spec Depth

Choose the shallowest depth that covers the risk.

- `lite`: documentation-only changes, tiny bugfixes, or local behavior changes.
- `standard`: new features or workflow changes within clear boundaries.
- `deep`: cross-module work, API/data/storage changes, install/release/check behavior changes, security/privacy risk, or unclear architecture.

Use deep when any trigger applies:

- New or changed API, CLI, command entry, or public contract.
- New or changed data model, storage behavior, or migration.
- Changes across more than two modules or skills.
- Changes to install, release, mirror sync, packaging, or verification behavior.
- Security, permission, privacy, or data-loss risk.
- User workflow or documentation contract changes.
- Multiple end-to-end steps are needed before the work can be verified.

The user may request `lite`, `standard`, or `deep`. If the requested depth is lower than the risk triggers, explain the mismatch and recommend the higher depth. Do not introduce a state machine for depth selection.

## Readiness Check

Do not add a separate pre-implementation review stage by default. End each spec with a Readiness Check that confirms the spec is executable:

- The problem is clear.
- Acceptance criteria are testable.
- Non-goals are explicit.
- Constraints avoid prescribing implementation details.
- The spec remains valid if implemented with a different technology stack.

## Vertical Slices

Vertical slices belong in `plan.md`, where the plan defines slice order and boundaries. `tasks.md` expands each slice into executable steps, local acceptance checks, and verification commands.

A vertical slice is not a layer, task category, or file group. It is an independently implementable, integrable, and verifiable end-to-end increment.
