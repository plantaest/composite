# Use explicit runtime entry points

Date: 2026-06-28
Status: accepted

Superseded naming note: see `0017-use-concrete-runtime-wiki-entry-points.md` for the later migration from runtime `Composite.*` factory namespaces to concrete `MwWiki` and `MwnWiki` entry points.

## Context

Composite supports different execution environments with different runtime dependencies and assumptions.

## Decision

Runtime factories will live under explicit runtime entry points.

At the time of this decision, the planned shape was:

```ts
import { Composite } from '@taxonlabs/composite/mw';
import { Composite } from '@taxonlabs/composite/mwn';
```

Decision 0017 keeps the same explicit runtime-entry-point rule, but supersedes the exported factory names with:

```ts
import { MwWiki } from '@taxonlabs/composite/mw';
import { MwnWiki } from '@taxonlabs/composite/mwn';
```

The root package will not auto-detect or create runtime instances.

## Rationale

Explicit entry points keep application boundaries clear and prevent accidental dependency leaks. They also make runtime support easier to reason about in tests and documentation.

## Consequences

Shared application code should consume root interfaces such as `Wiki`, `Page`, and `WikiRegistry`. Runtime-specific code should create concrete instances at the application boundary.
