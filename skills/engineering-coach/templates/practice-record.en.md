---
schema_version: 1
type: engineering-coach-practice
date: 2026-09-04
topic: "<module or design topic>"
source_type: "design-doc | conversation-segment | recent-conversation | synthetic-practice"
practice_status: "draft | answered | assessed | archived"
verification_level: "unverified | initially_verified | verified | transfer_verified"
abilities: []
---

# Practice Record

## Source Scope

The original scope used for this review or practice.

## Raw Evidence

Observable facts extracted from the design document, conversation, user worksheet, or defense answer.

## Post-hoc Inference

The AI's reconstructed reasoning based on evidence. Mark uncertainty explicitly.

## Transferable Principles

Reusable engineering design methods that can transfer to another module or project.

## Practice Scenario

The simulated exercise prompt, including goals, constraints, change risks, and unacceptable flaws.

## Independent Design Worksheet

### 1. Problem Framing

What problem does this module or feature actually solve? What is intentionally out of scope?

### 2. Goals And Constraints

What are the goals, hard constraints, and soft constraints?

### 3. Assumptions

What assumptions are you making? Which assumptions need validation?

### 4. Boundaries

Where are the module boundaries? What should it depend on? What should it not know?

### 5. Data And State

What are the core data, state transitions, and consistency requirements?

### 6. Interfaces

What are the external interfaces, internal collaboration interfaces, and error semantics?

### 7. Failure Modes

Where can the design fail? What does the system see, and what does the user see?

### 8. Alternatives And Trade-offs

Provide at least 2 alternatives. Where does each win, where does each lose, and when is each unsuitable?

### 9. Validation Plan

How will you validate that the design is correct? Include tests, observability, rollback, or evolution strategy.

## Evaluation Contract

The fixed assessment criteria before scoring. When creating the practice, write the full contract first and show only the summary to the user.

### Summary Shown To User

- Target abilities:
- Key risks:
- Minimum alternatives:
- Unacceptable flaw types:

### Full Contract

- Primary ability dimensions:
- Secondary ability dimensions:
- Constraints that must remain consistent:
- Required boundary decisions:
- Required data/state decisions:
- Required failure modes:
- Required trade-off comparison:
- Required validation evidence:
- Constraint-shift defense focus:
- Conditions for `initially_verified`:
- Conditions for `verified`:
- Conditions for `transfer_verified`:

## Defense Q&A

Question-and-answer record for the defense.

## Assessment

Six-dimension scores, evidence, priority improvement item, and verification level.

## Reference Alternatives

Add after scoring. List 2-3 viable alternatives, fit conditions, main trade-offs, and failure conditions.

## Profile Update

The minimal suggested update block for the long-term learning profile.
