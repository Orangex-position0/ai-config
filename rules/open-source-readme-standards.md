---
paths:
  - "**/README.md"
  - "**/README.*.md"
---

# Open Source README Standards

> A README's first job is to help an unfamiliar developer decide within 60 seconds whether the project is worth exploring, then run the smallest real example with truthful commands.

## 1. Why

An open-source README is not a project encyclopedia or a marketing landing page. It should answer:

- What this project is
- What problem it solves
- Who should use it
- How to verify the smallest working path
- Where to learn more, contribute, or report security issues

The most harmful README failure is not a missing section. It is causing readers to misjudge project status or copy commands that cannot work.

## 2. Hard Rules

- The first screen must state the project name, one-sentence positioning, target users or use cases, and current maturity signal.
- Quickstart and Usage commands must come from the repository's real build system, such as `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `Makefile`, or CI files.
- Unknown, unverified, or externally dependent commands must be marked with verification status and the blocking reason. Do not invent installation, run, or test commands.
- Prefer the smallest real example. Library projects show an API call, CLI projects show a command and output, GUI / Web / TUI projects show a screenshot, GIF, demo, or accessible result.
- The README must state the license status. If an open-source repository has no `LICENSE`, treat the missing license as a release blocker.
- When external contributions are expected, the README must link to `CONTRIBUTING.md` or include a short contribution path.
- Projects involving servers, authentication, encryption, supply chain behavior, plugin ecosystems, or network exposure should link to `SECURITY.md` or state the security reporting path.
- The README is a hub. Do not duplicate the full contents of `LICENSE`, `CONTRIBUTING.md`, `CHANGELOG.md`, full API docs, or a complete test matrix.

## 3. Recommended Structure

Default information architecture:

1. Project name and one-sentence positioning
2. Status signal: badge, maturity, screenshot, demo, CLI output, or smallest visible result
3. Why / Features: core problem and capabilities
4. Quickstart: from a clean environment to the smallest working result
5. Usage: smallest real example
6. Documentation / Examples: deeper links
7. Contributing
8. Security
9. License

Adapt by project type:

- Small libraries may merge `Quickstart` and `Usage`.
- CLI projects should prioritize commands, flags, and real output.
- GUI / Web / TUI projects should surface screenshots, GIFs, or demo links early.
- Frameworks, templates, and starters should show the generated result, directory shape, and next commands.
- Architecturally complex projects should keep only high-level diagrams in the README and link details to `docs/`.

## 4. Language

- For international open-source communities, prefer English in `README.md` and optionally provide `README.zh-CN.md`.
- For Chinese-first or internal open-source communities, Chinese `README.md` is acceptable; keep commands, APIs, package names, and error codes in English.
- If the repository already has a README language style, follow the existing style.
- Bilingual README files should link to each other and avoid drifting on commands, status, or governance links.

## 5. Anti-patterns

| Anti-pattern | Problem | Fix |
| --- | --- | --- |
| Slogans instead of examples | Readers cannot judge whether the project works | Show minimal code, command output, screenshot, or demo |
| Badge clutter before Quickstart | Status signals block the action path | Put installation and the smallest usage immediately after status |
| Duplicating governance files | Content becomes stale and expensive to maintain | Link to `LICENSE`, `CONTRIBUTING.md`, and `SECURITY.md` |
| Claiming production readiness without evidence | Users underestimate adoption risk | State experimental, beta, stable, or supported compatibility scope |
| Guessing commands | Readers copy commands that fail | Derive commands from project files and verify them; mark unverified commands |

## 6. Checklist

- [ ] The first screen explains value, target users, and status
- [ ] Quickstart is reproducible from a clean environment
- [ ] Usage includes the smallest meaningful example
- [ ] Visual or runtime evidence fits the project type
- [ ] License, contribution, and security entry points are clear
- [ ] The README links to deeper docs instead of replacing them
- [ ] Commands, badges, screenshots, demos, compatibility, and maturity claims are not fabricated
