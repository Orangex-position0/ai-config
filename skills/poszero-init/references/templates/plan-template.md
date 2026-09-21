# Plan: {{FEATURE_NAME}}

## Document Control

| Field | Value |
| --- | --- |
| Status | Draft |
| Revision | 0.1 |
| Approved By | Pending |
| Approved At | Pending |
| Approval Note | Pending |

## Inputs

## Summary

## Technical Context

- Runtime / Language:
- Primary Dependencies / Tools:
- Data / Storage: N/A unless relevant
- Relevant Paths:
- Validation:
- Compatibility Constraints:
- Performance / Scale Constraints: N/A unless relevant

Use `NEEDS DECISION: [specific question]` only when missing information changes the implementation direction. Otherwise, proceed with a reasonable default.

## Implementation Approach

## Complexity Tracking

Fill only when the approach introduces a new abstraction, dependency, service/module, storage, async queue/worker, multi-stage migration, or non-trivial compatibility layer.

| Complexity | Why Needed | Simpler Alternative Rejected Because |
| --- | --- | --- |

## System Architecture

Fill only when the work changes cross-module boundaries, service boundaries, data flow, storage ownership, external interfaces, or runtime/deployment boundaries.

Use these prompts only when relevant:

- What domain boundaries matter?
- What data flows across boundaries?
- What external interfaces or contracts are affected?
- Who owns storage or durable state?
- What runtime/deployment boundaries constrain the design?
- What cross-module dependencies are allowed or forbidden?

## Program Design

Fill only when the work changes code structure.

Allowed:

- Key types or interfaces by responsibility
- Important method signatures only when they constrain collaboration
- Module boundaries
- Call sequence for non-trivial flows
- Error handling and validation strategy

Do not include full function bodies, step-by-step pseudocode, incidental helper names, or speculative abstractions.

Use these prompts only when relevant:

- What modules are needed?
- What key data models and functions does each module own?
- Which inputs, outputs, and signatures constrain collaboration?
- How do modules call or coordinate with each other?

## Project Structure

Fill only when this work adds, moves, or redefines files/directories. Use real target paths only.

```text
[real target paths only]
```

**Structure Decision**:

## Protocol Check

- [ ] Spec contains Why / What / Observable Contract / Constraints only.
- [ ] Plan owns implementation approach, architecture, program design, and slice order.
- [ ] Vertical slices are independently implementable, integrable, and verifiable.
- [ ] Complexity Tracking is filled when added complexity requires justification.
- [ ] Repository routing, mirror, install, and verification rules are satisfied or not applicable.

## Vertical Slices

A vertical slice is an independently implementable, integrable, and verifiable end-to-end increment. `plan.md` defines slice order and boundaries; `tasks.md` expands execution steps, checks, and commands.

| Order | Slice | Outcome | Depends On |
| --- | --- | --- | --- |

## Decisions

## Testing Strategy

## Requirement Coverage

## Developer Orientation

## Open Questions

## Approval
