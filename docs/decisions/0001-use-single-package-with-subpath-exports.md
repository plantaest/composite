# Use single package with subpath exports

Date: 2026-06-28
Status: accepted

## Context

Composite needs to support multiple runtimes without forcing frontend users to install or bundle server-only code. A monorepo or multi-package split would add operational overhead before the package boundaries are proven.

## Decision

Composite will be one npm package with explicit subpath exports:

```text
@taxonlabs/composite
@taxonlabs/composite/mw
@taxonlabs/composite/mwn
@taxonlabs/composite/wikitext
@taxonlabs/composite/streams
@taxonlabs/composite/testing
```

## Rationale

A single package is easier to publish, version, and use during early development. Subpath exports still give strong architectural boundaries.

## Consequences

The repository must enforce import boundaries so root and frontend imports do not pull `mwn` or Node-only dependencies. The structure should still allow a future split if publishing or dependency constraints require it.
