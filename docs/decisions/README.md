# Decision Records

This directory records important Composite design decisions.

The format is intentionally lightweight. A decision record should explain why a choice was made, not repeat every detail from the implementation or milestone spec.

Use decision records when a choice affects public API shape, runtime behavior, package boundaries, testing strategy, or future development direction.

## Format

```md
# Short decision title

Date: YYYY-MM-DD
Status: accepted

## Context

What question or pressure led to this decision.

## Decision

What Composite will do.

## Rationale

Why this is the right tradeoff for now.

## Consequences

What this enables, limits, or postpones.
```

## Records

- `0001-use-single-package-with-subpath-exports.md`
- `0002-keep-composite-mwn-shaped-not-mwn-cloned.md`
- `0003-use-explicit-runtime-entry-points.md`
- `0004-keep-root-import-lightweight.md`
- `0005-use-small-vertical-milestones.md`
- `0006-use-wikiregistry-for-multi-wiki-access.md`
- `0007-support-mw-and-mwn-through-narrow-adapters.md`
- `0008-add-query-and-save-as-second-milestone.md`
- `0009-keep-save-options-and-result-minimal.md`
- `0010-use-mock-runtime-and-adapter-contract-tests.md`
- `0011-use-types-mediawiki-at-mw-boundaries.md`
- `0012-record-lightweight-sdd-decisions-in-repo.md`
- `0013-split-page-read-basics-from-broader-third-milestone.md`
- `0014-make-wiki-query-a-semantic-query-helper.md`
