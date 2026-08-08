# Development Workflow

> This file extends [git-workflow.md](./git-workflow.md) with the development gates that happen before a PR is opened or marked ready.

## PR-Based Development Lifecycle

1. **Anchor the request**
   - Identify the source of truth: issue, PRD, ADR, user request, or existing failing test.
   - If no source exists, state the working assumption before coding.
   - Keep every changed file traceable to that source. Do not include drive-by refactors or unrelated cleanup.

2. **Check the repository state**
   - Run `git status --short --branch -uall` before editing.
   - Do not develop directly on `main`; follow [git-workflow.md](./git-workflow.md) for branch naming.
   - Treat modified, staged, and untracked files as user work unless they are clearly yours in the current task.

3. **Research only when it reduces risk**
   - Use existing project code and docs first.
   - For new libraries, public APIs, or unfamiliar framework behavior, check primary docs or the package registry before implementing.
   - Prefer a proven dependency only when it is already accepted by the project or clearly smaller than hand-rolled code.

4. **Implement in narrow slices**
   - Make the smallest change that satisfies the request.
   - Preserve existing module boundaries, naming conventions, and public contracts.
   - Do not add placeholders, TODO-only behavior, mock production paths, or speculative extension points.

5. **Test the changed behavior**
   - Add or update tests when behavior changes or a bug is fixed.
   - For bug fixes, prefer a regression test that would fail before the fix.
   - Run the smallest relevant verification command from project docs, package scripts, CI, or language rules.
   - If a check cannot run, record the exact blocker; do not claim it passed.

6. **Review before PR readiness**
   - Inspect the full branch diff with `git diff <base-branch>...HEAD`.
   - Check for scope drift, missing tests, dependency surprises, generated artifact drift, and uncommitted local-only files.
   - Address CRITICAL and HIGH review findings before calling the branch ready.

7. **Prepare the PR**
   - Write a concise summary, linked issue, changed behavior, and test plan.
   - Mark unchecked items as TODOs in the test plan instead of hiding them.
   - Do not write `verified`, `shipped`, `released`, or `fixed on main` unless that state was checked in the current session.

8. **Before requesting human review**
   - Confirm required checks or CI are green, or name the failing check and owner.
   - Resolve merge conflicts.
   - Confirm the branch is up to date with the target branch when the project requires it.
