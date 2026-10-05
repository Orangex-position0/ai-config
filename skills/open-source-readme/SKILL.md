---
name: open-source-readme
description: >
  Create, rewrite, or review README.md files for open-source developer projects.
  Use when users ask to create a README, improve README structure, audit README
  quality, align README files with open-source conventions, add quickstarts,
  document CLI/library/framework usage, or review project onboarding docs.
---

# Open Source README

Create or review README files for open-source developer projects.
Follow `rules/open-source-readme-standards.md` as the quality baseline.
Prefer minimal, truthful, project-specific documentation over generic templates.

## Scope

Cover developer-facing open-source projects: libraries, CLIs, SDKs, frameworks, templates, services, and tools.
Do not treat profile README files, product landing pages, paper homepages, or marketing sites as this skill's default target.

## Workflow

1. Determine the operation:
   - Create: no adequate `README.md` exists, or the user asks for a new one.
   - Review: an existing README needs critique, structure fixes, or quality checks.
   - Rewrite: preserve correct project facts while replacing unclear or stale presentation.

2. Inspect the repository before writing:
   - Project metadata: `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `pom.xml`, `build.gradle`, `Makefile`, CI files.
   - Existing docs: `docs/`, examples, demo files, screenshots, changelog, release notes.
   - Governance files: `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`.
   - Existing commands: install, build, run, test, lint, example execution.

3. Identify the project type and existing README style:
   - Library / SDK: installation, import, smallest API call, compatibility.
   - CLI: install, first command, flags, real output, shell completion if present.
   - GUI / Web / TUI: screenshot, GIF, demo URL, local run command.
   - Framework / template / starter: generated result, directory shape, next commands.
   - Service / platform: architecture boundary, configuration, deployment, security reporting.

4. Recommend one primary information architecture style and any secondary modules. Use one of:
   - `CLI Quickstart`
   - `Library / SDK API`
   - `Product Showcase`
   - `Framework / Starter`
   - `Service / Platform`

5. Present the recommendation and wait for explicit user confirmation before generating or substantially rewriting README files. A clear response such as “use the recommended style” is confirmation; do not treat an ambiguous response as confirmation.

6. After confirmation, load the matching template from `assets/` and adapt it to verified project facts. The templates are progressive references, not permission to invent content.

7. Build the README around the first 60 seconds:
   - Project name and one-sentence positioning.
   - Problem solved and target users.
   - Current maturity or support status when discoverable.
   - Visual or runtime evidence appropriate to project type.
   - Quickstart that reaches the smallest meaningful result.

8. Verify factual claims:
   - Use commands only when they are discoverable from project files or existing docs.
   - Run the smallest safe verification command when practical.
   - If a command cannot be run, mark it as unverified and explain why.
   - Never invent badges, compatibility guarantees, benchmark numbers, screenshots, or public URLs.

9. Keep README as a hub:
   - Link to detailed docs instead of duplicating them.
   - Link to `LICENSE` instead of pasting license text.
   - Link to `CONTRIBUTING.md` when external contribution is expected.
   - Link to `SECURITY.md` or state the security reporting path for security-sensitive projects.
   - Link to `CHANGELOG.md` or releases when version history matters.

10. For bilingual output, generate `README.md` and `README.zh-CN.md` from the same information architecture. Link the files to each other and keep commands, status, and governance links aligned.

## Create Path

Use the confirmed style template from `assets/` as a starting structure when the project lacks a usable README. Use `assets/readme-template.md` only as the generic fallback. Delete irrelevant sections instead of leaving placeholders, and adapt headings to the repository's language and audience.

Available style templates:

- `assets/cli-quickstart-template.md`
- `assets/library-sdk-template.md`
- `assets/product-showcase-template.md`
- `assets/framework-starter-template.md`
- `assets/service-platform-template.md`

Minimum create output:

- Project title and one-sentence description
- Status or maturity signal when known
- Features or why section
- Quickstart
- Usage
- Documentation or examples links when available
- Contributing
- Security when relevant
- License

## Review Path

Lead with findings ordered by reader impact:

1. Commands that are wrong, unverifiable, or not tied to project files.
2. Missing first-screen positioning or unclear target audience.
3. Missing quickstart or realistic usage example.
4. Missing license, contribution, or security status.
5. Overlong content that belongs in dedicated docs.
6. Cosmetic issues such as badge clutter or weak wording.

When asked to edit directly, fix the README after listing the material issues.
When asked only for review, do not rewrite the file unless requested.

## Default Information Architecture

1. Project name + one-sentence positioning
2. Status signal: badge, maturity, screenshot, demo, CLI output, or smallest result
3. Why / Features
4. Quickstart
5. Usage
6. Documentation / Examples
7. Contributing
8. Security
9. License

## Language

Use the repository's existing README language when present. For a new bilingual README, use English in `README.md` and Simplified Chinese in `README.zh-CN.md` unless the user confirms another arrangement. Keep commands, APIs, package names, and error codes in English. When maintaining bilingual README files, ensure they link to each other and do not drift on commands, status, or governance links.

## Final Checklist

- [ ] First screen answers what, why, who, and status
- [ ] Quickstart is based on real project files
- [ ] Usage shows a smallest meaningful result
- [ ] Visual or runtime evidence fits the project type
- [ ] License status is clear
- [ ] Contribution path is clear when contributions are welcome
- [ ] Security reporting path is clear when relevant
- [ ] README links to deeper docs instead of duplicating them
- [ ] Unverified commands or claims are explicitly marked
