---
name: poszero-specify
description: "将问题整理为可批准的 PosZero spec.md。"
disable-model-invocation: true
---

# PosZero Specify

Create or revise one feature `spec.md` under `.sdd/<feature-slug>/`.

## Contract

- Preconditions: Approved Constitution; user provides a problem or existing requirement input.
- Inputs: Constitution constraints, user goals, existing or external requirement material.
- Branches: New Spec, Revise Existing, Import External Input, Blocked Upstream.
- Allowed mutations: selected feature `spec.md`; a new feature directory only after slug confirmation.
- Handoff: spec revision/status, depth, Readiness Check result, unresolved questions, optional Plan path.

## Steps

1. Resolve project and feature, then read applicable constraints using `references/common-protocol.md` and spec structure rules using `references/spec-authoring.md`.
   Complete when root, feature, and requirement input are unique and valid.
2. Select the shallowest sufficient spec depth: `lite`, `standard`, or `deep`.
   Complete when depth and reason are recorded, and any user-requested lower depth has been challenged when risk triggers require more.
3. Converge Product Context in this order: Problem, User / Scenario, Goal, Non-Goals, Acceptance Criteria.
   Complete when only implementation-affecting product context remains; full PRD material is excluded or linked.
4. Fill System Architecture and Program Design only when the selected depth or risk triggers require them.
   Complete when architecture impact and program design are either addressed or explicitly marked not applicable.
5. Extract Requirements, Edge Cases, Constraints, Assumptions, and Open Questions.
   Complete when every requirement names observable behavior and unknown facts are not presented as confirmed requirements.
6. Create a Vertical Slice Plan.
   Complete when every slice is an independently implementable, integrable, and verifiable end-to-end increment.
7. Allocate stable IDs and build traceability.
   Complete when every active requirement connects to at least one scenario, acceptance criterion, or slice.
8. Run the Readiness Check and ask for approval.
   Complete when major findings and open questions are resolved or explicitly accepted, and Approval is recorded; otherwise status remains In Review.

## Gate

- Keep the SDD lifecycle intact; do not replace it with a new workflow.
- Do not add a separate pre-implementation review stage by default; use the spec Readiness Check.
- Move implementation detail to Plan unless it is required to make the spec executable.
- Do not split one slice into one spec by default; use child slice specs only for deep work where splitting lowers coordination risk.
