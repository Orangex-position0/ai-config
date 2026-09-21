# Engineering Coach Runtime Workflows

Use this reference after `SKILL.md` has routed the request to a mode. Keep the evidence contract from `SKILL.md` active in every mode.

## coach

Use only when the user explicitly enables coaching for the current design discussion.

Teaching modes:

- `light`: no interruption; post-review only.
- `standard`: default; at most 3 pre-decision prediction questions, one at a time.
- `intensive`: deeper boundary, data/state, failure, and evolution questioning.

Ask prediction questions before revealing the AI's preferred design. Defer lower-value learning points to review. If the user says “先推进”, “暂停教学”, or “深入追问”, follow that control.

## review

Accept a design doc path, a specified conversation segment, or `recent`. For `recent`, restate the review scope and ask for confirmation before doing the review.

Select only 1-3 high-value design decisions:

- cross-module impact;
- hard-to-reverse cost;
- real alternatives;
- boundary, state, failure, or evolution risk;
- user omission that matters to the outcome;
- strong transfer value.

Focus the review on decisions with transfer value. Leave out low-value naming, framework convention, choices with no real trade-off, and accidental details that cannot transfer.

For each decision, output:

- concrete problem;
- raw evidence;
- post-hoc inference;
- key constraints;
- viable alternatives;
- trade-offs;
- chosen reasoning;
- invalidation conditions;
- transferable principle;
- common failure.

Default to a suggested write block. Profile updates require assessed practice evidence.

## practice

Generate one practice from a real review or a requested ability. Default to `near-transfer` and `standard` difficulty.

Read [scoring-rubric.md](scoring-rubric.md) before generating the practice so the scenario and assessment use one fixed evaluation contract.

Transfer distance:

- `same-domain`: same business domain, different module or constraint.
- `near-transfer`: different surface scenario, same structural challenge.
- `far-transfer`: different domain or module shape, same engineering principle.

Difficulty:

- `basic`: verifies the just-reviewed method.
- `standard`: default; adds one key constraint change.
- `stretch`: adds multiple conflicting constraints.

Use structure-preserving, minimally sensitive transformation: preserve constraints that affect design judgment; anonymize only secrets, customer names, project names, internal paths, and identifiable details.

If the original module is simple, add an engineering constraint such as concurrency, rollback, permission, observability, consistency, or future evolution instead of inventing fake business complexity.

Before the user answers, create the full `Evaluation Contract` for the practice record, then show the user only:

- scenario;
- required independent worksheet from [../templates/practice-record.md](../templates/practice-record.md);
- `Evaluation Contract Summary`: 1-2 ability dimensions, key risks, minimum alternatives, and unacceptable flaw types.

Use the full `Evaluation Contract` later during `assess`. Reveal reference alternatives after assessment is complete.

## assess

Read [scoring-rubric.md](scoring-rubric.md) and [state-machine.md](state-machine.md). Score only from the submitted worksheet and defense answers.

If the worksheet is incomplete, identify missing sections and request completion.

Validation modes:

- `review`: inline document feedback only; maximum level `initially_verified`.
- `standard`: default; ask 1-3 targeted defense questions.
- `defense`: fuller interactive defense.

Standard defense asks at most 3 questions, one at a time. Each validates one risk or trade-off. At least one question must shift a constraint. After each answer, note evidence impact only. Score after defense ends.

## status

Read the configured profile. Show:

- ability states;
- recent evidence links;
- one priority training item;
- up to 3 weak patterns;
- recommended next practice.

If no profile exists, run `init` or provide a no-profile explanation.

## resume

Read [state-machine.md](state-machine.md).

Select the practice using the resume order in [state-machine.md](state-machine.md).

Continue from its current state:

- `draft`: request the independent worksheet;
- `answered`: continue defense or assessment;
- `assessed`: handle optional write/profile update;
- `archived`: skip unless the user explicitly asks to reopen it.
