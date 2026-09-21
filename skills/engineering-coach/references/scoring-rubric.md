# Engineering Coach Scoring Rubric

Use this rubric for `assess` and for any review that assigns verification level. Score evidence of engineering reasoning: constraint fit, boundary clarity, risk coverage, trade-off quality, and validation strength.

## Ability dimensions

Long-term profile tracks these engineering abilities:

- `problem_modeling`
- `boundary_identification`
- `design_order`
- `data_state`
- `interfaces_dependencies`
- `failure_modes`
- `evolution_change`
- `validation_strategy`
- `tradeoff_articulation`

For one practice, select 1-2 primary abilities and optionally 1-2 secondary abilities.

## Six score dimensions

Score each dimension from 0-4 and keep the dimensions separate.

### Problem modeling

- 0: problem omitted or replaced by implementation detail.
- 1: identifies the problem only after prompting.
- 2: states the problem but misses important scope or actors.
- 3: independently states the real problem, non-goals, and main constraints.
- 4: handles counterexamples, ambiguous goals, or changed business constraints.

### Decision order

- 0: jumps to implementation with no visible design sequence.
- 1: can describe order only after prompting.
- 2: has an order, but key decisions depend on unstated assumptions.
- 3: sequences problem, constraints, boundaries, data/state, interfaces, risks, and validation coherently.
- 4: adapts the sequence when a constraint shifts or an earlier assumption fails.

### Boundary design

- 0: module boundary absent or arbitrary.
- 1: boundary appears only after prompting.
- 2: names boundary but leaves ownership, dependencies, or forbidden knowledge fuzzy.
- 3: defines responsibility, dependencies, inputs/outputs, and what stays outside.
- 4: handles cross-module pressure, lifecycle ownership, and future boundary changes.

### Risk coverage

- 0: no meaningful failure modes.
- 1: lists risks only after prompting.
- 2: lists obvious risks but misses user/system consequences or recovery.
- 3: covers main failure modes, fallback behavior, observability, and recovery path.
- 4: handles cascading failures, rare-but-costly cases, or operational constraints.

### Trade-off

- 0: presents one solution as simply correct.
- 1: names alternatives only after prompting.
- 2: compares alternatives, but trade-offs are generic or not tied to constraints.
- 3: compares at least two viable options with fit, cost, invalidation conditions, and why one wins now.
- 4: changes the recommendation appropriately under a constraint shift.

### Validation

- 0: no validation plan.
- 1: adds tests only after prompting.
- 2: suggests tests or checks, but they do not prove the risky assumptions.
- 3: validates core assumptions with tests, observability, rollout, rollback, or review gates.
- 4: includes failure-oriented validation and an evolution strategy for future changes.

## Verification levels

- `unverified`: no independent answer or no enough evidence.
- `initially_verified`: document feedback or incomplete defense supports the direction.
- `verified`: assessed worksheet plus defense show the target abilities in the current/near scenario.
- `transfer_verified`: far-transfer scenario reaches score 3+ on target dimensions without key holes.

Skipping defense caps verification at `initially_verified`.

## Profile status upgrades

For mapping six assessment scores to the nine profile abilities, read [state-machine.md](state-machine.md).

Update exposure from confirmed reviews; update mastery only from practice-record evidence.

- `exposed`: confirmed review included this ability, or a practice was created for this ability.
- `practicing`: at least one related practice was attempted.
- `provisional`: one assessed practice scored 3+ on the ability.
- `validated`: two different scenarios scored 3+ and defense found no key hole.
- `transferred`: one far-transfer practice scored 3+.

A later weak score adds `regression_signal`. Adjust status only after repeated pattern evidence.

## Assessment output

Every assessment must include:

- six scores with evidence;
- strongest evidence;
- weakest evidence;
- one priority improvement;
- verification level;
- historical change if profile is available;
- next challenge recommendation.

## Defense questions

Standard defense asks 1-3 questions. Each question targets one risk or trade-off. At least one question must change a constraint, such as concurrency, rollback, permission, observability, consistency, or future evolution.

After each answer, record evidence impact. Wait until the defense ends before scoring.
