---
name: changelog
description: >
  Create, update, review, or release CHANGELOG files. Use when users request
  creating CHANGELOG.md, maintaining [Unreleased], preparing release notes,
  organizing changes using Keep a Changelog categories, or validating changelog
  entries against Semantic Versioning and project conventions.
---

# Changelog Maintenance

Maintain project changelogs with minimal changes.
Prefer updating existing changelog files instead of creating new ones.
When creating a new changelog, start from `assets/changelog-template.md`.

## Workflow

1. Locate the project's changelog file:
   - `CHANGELOG.md`
   - `CHANGELOG.en.md`
   - `CHANGELOG.zh-CN.md`
   - Other project-specific changelog files

2. Check project-specific rules:
   - If `rules/changelog-standards.md` exists, read and follow it.
   - Follow existing repository style and formatting conventions.

3. Determine the operation:
   - New development changes -> update `## [Unreleased]`
   - Release preparation -> move unreleased changes into a version section
   - Audit request -> check structure, consistency, and missing information

4. Only record meaningful changes:
   - User-visible features
   - Behavior changes
   - Bug fixes
   - Security improvements
   - Breaking changes

   Do not copy raw commits, PR titles, or implementation details into the changelog.

5. Preserve ordering:
   - Keep versions in descending order.
   - Keep `[Unreleased]` at the top.

## Entry Categories

Use Keep a Changelog categories:

| Category | Usage |
|---|---|
| Added | New features or capabilities |
| Changed | Changes to existing behavior |
| Deprecated | Features scheduled for removal |
| Removed | Removed features |
| Fixed | Bug fixes |
| Security | Security-related fixes |

Rules:
- Remove empty categories.
- Keep categories only when they contain entries.
- Place breaking changes under the most relevant category.

Example:

```markdown
### Changed

- **BREAKING**: Replace legacy authentication flow with token-based authentication.
```

## Release Handling

- Use Semantic Versioning: `MAJOR.MINOR.PATCH`.
- Use `YYYY-MM-DD` release dates.
- Update comparison links at the bottom when the changelog uses reference links.
- Keep `[Unreleased]` comparing the latest tag to `HEAD`.
