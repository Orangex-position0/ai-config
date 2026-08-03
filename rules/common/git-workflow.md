# Git Workflow

## Commit Messages

- Follow [Conventional Commit 规范](../conventional-commit.md).
- To disable co-author attribution on commits, set `"includeCoAuthoredBy": false` in `~/.claude/settings.json`. Claude Code appends `Co-Authored-By` by default; ECC does not ship this setting.

## Pull Request Workflow

Before starting PR-based work:

- Do not develop directly on `main`.
- Create a dedicated branch with `git switch -c <prefix>/<short-topic>`.
- Use branch prefixes by intent: `feat/`, `fix/`, `refactor/`, `docs/`, `test/`, `chore/`, or `ci/`.

When creating PRs:

1. Analyze the full commit history, not just the latest commit.
2. Use `git diff [base-branch]...HEAD` to inspect all branch changes.
3. Draft a comprehensive PR summary.
4. Include a test plan with TODOs for unchecked items.
5. Push with `-u` when publishing a new branch.

> For the full development process before git operations, see [development-workflow.md](./development-workflow.md).
