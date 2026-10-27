# Architecture

- **Last verified**: YYYY-MM-DD
- **Code baseline**: `<full commit SHA>`
- **Verification scope**: <sections and modules actually checked; name sections not rechecked after a partial update>

<!-- When Git revision is unknown, explain why. For relevant uncommitted changes, name paths and note that the SHA is not a complete snapshot. Add a release tag only if verified. Remove this prompt in the final document. -->

> Full version is a checklist of project-level concerns, not a form to fill out. Keep only implemented, evidenced, useful sections; link detailed module designs.

## Purpose and system context

<!-- Problem, responsibility boundary, consumers, and external systems. Leave setup instructions in the README. -->

## Bird's-eye view and core data flow

<!-- Major parts, dependency direction, representative input → processing → output path, and key state owners; diagram if useful. -->

## Entry points and reading path

<!-- Application and request entry points, key public APIs/types, suggested reading order, and repository paths. -->

## Code map

<!-- Core modules' responsibilities, exclusions, public boundaries, dependencies, and locations; avoid file-by-file inventory. -->

## Architecture boundaries and invariants

<!-- Cross-module dependency, state, consistency, lifecycle, or compatibility rules; include reason and locatable evidence. -->

## Cross-cutting mechanisms

<!-- Include only relevant themes: error propagation, concurrency/shared state, persistence, config/codegen, observability, and test boundaries. Link deeper designs. -->

## Change and extension path

<!-- Where to start for representative cross-module changes, constraints to preserve, and how to verify them. Avoid duplicating command lists. -->

## Related documents

<!-- Link module designs, ADRs, and essential external protocols rather than repeating their contents. -->
