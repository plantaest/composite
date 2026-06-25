# Composite v1 Scope

## Scope philosophy

Composite v1 is intentionally narrow. Its purpose is to validate the core public API and establish a maintainable foundation for future growth.

v1 should prioritize high-value Wikipedia-oriented workflows on the MediaWiki client runtime and avoid trying to model every MediaWiki feature from the start.

## Runtime scope

### In scope for v1
- MediaWiki client runtime
- TypeScript / JavaScript implementation
- execution inside MediaWiki wiki environments
- use of MediaWiki frontend APIs and facilities where appropriate

### Out of scope for v1
- production-grade Java server implementation
- production-grade Rust server implementation
- guaranteed cross-runtime API parity

## Functional priorities

## P0 — core capabilities for the first prototype

These are the capabilities Composite should focus on first:

1. Create or obtain a wiki client object for the current runtime.
2. Resolve a page object from a title.
3. Read basic page information.
4. Read page text.
5. List revisions for a page.
6. Edit a page with supplied content and edit summary.

## P1 — likely next capabilities after the prototype stabilizes

These capabilities are plausible follow-up targets, but they are not part of the minimum initial prototype unless explicitly promoted:

- rollback
- delete
- protect
- category-related helpers
- current-user helpers and rights inspection
- limited raw Action API escape hatch

## Explicit non-goals for the initial prototype

The initial prototype should not attempt to include all of the following:

- full support for all Action API modules
- broad support for Wikidata workflows
- broad support for Commons workflows
- advanced multi-wiki orchestration
- comprehensive bot-style maintenance workflows
- complex batching or job scheduling abstractions
- a universal abstraction over every MediaWiki installation variant

## Runtime assumptions to document explicitly

Composite v1 may assume the presence of the MediaWiki frontend environment. Any such assumptions must be documented rather than hidden.

Questions to make explicit include:
- whether `mw` is assumed to exist
- how API clients are obtained
- how tokens are acquired
- how user identity and rights are accessed, if needed

## Scope control rules

When a new feature is proposed, evaluate it against the following questions:

1. Does it directly support a documented P0 or P1 use case?
2. Does it improve the core public API rather than only adding raw API coverage?
3. Can it be implemented without forcing speculative cross-runtime abstractions?
4. Would delaying it make the early prototype materially worse?

If the answer to most of these is no, the feature probably does not belong in the current v1 scope.
