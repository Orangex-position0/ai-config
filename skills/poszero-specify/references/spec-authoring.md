# Spec Authoring

PosZero keeps the SDD lifecycle intact. Specs define the problem contract; plans own implementation design; tasks own executable work.

## Spec Structure

Resolve decisions in dependency order: problem and actors → goals, in-scope boundaries, and non-goals → observable acceptance; address constraints, edge cases, assumptions, and traceability when relevant. This is a decision order, not a mandatory question script. Draft using the selected project template.

Specs define Why, What, Observable Contract, and inherited Constraints. For interactive scenarios, capture the user path, system feedback, failure or empty states, and observable outcome; skip UX detail when no interaction changes. When relevant, define changed business boundaries and data semantics. For changed public APIs, specify caller-visible request/response semantics, errors, and compatibility or link an approved contract artifact. Plan owns module/service partitioning, internal data structures, method signatures, storage choice, and interaction design; it references rather than restates the public contract. Record new technical choices in Plan, not Spec.

Acceptance Criteria describe overall user-visible behavior or delivery results. Make each criterion verifiable: give thresholds only where a meaningful measurement exists, otherwise use observable outcomes. Task-level acceptance belongs in `tasks.md`.

When a quality goal could change the design, express it as a verifiable scenario with conditions and an expected outcome. Keep existing technical constraints distinct from unverified assumptions and new implementation choices.

Constraints may cite approved technical boundaries (such as existing compatibility or dependency policy), with their source; do not invent a new technology choice in Spec. A good spec stays valid under any implementation that obeys those boundaries.

## Readiness Check

Do not add a separate pre-implementation review stage by default. End each spec with a Readiness Check that confirms the spec is executable:

- The problem, goals, and in-scope boundaries are clear.
- Acceptance criteria are testable.
- Non-goals are explicit.
- Constraints avoid prescribing implementation details.
- The spec remains valid under any implementation that obeys approved technical boundaries.

## Vertical Slices

Vertical slices belong in `plan.md`, where the plan defines slice order and boundaries. `tasks.md` expands each slice into executable steps, local acceptance checks, and verification commands.

A vertical slice is not a layer, task category, or file group. It is an independently implementable, integrable, and verifiable end-to-end increment.
