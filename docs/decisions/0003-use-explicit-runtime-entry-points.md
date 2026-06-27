# Use explicit runtime entry points

Date: 2026-06-28
Status: accepted

## Context

Composite supports different execution environments with different runtime dependencies and assumptions.

## Decision

Runtime factories will live under explicit runtime entry points:

```ts
import { Composite } from '@taxonlabs/composite/mw';
import { Composite } from '@taxonlabs/composite/mwn';
```

The root package will not auto-detect or create runtime instances.

## Rationale

Explicit entry points keep application boundaries clear and prevent accidental dependency leaks. They also make runtime support easier to reason about in tests and documentation.

## Consequences

Shared application code should consume root interfaces such as `Wiki`, `Page`, and `Wikis`. Runtime-specific code should create concrete instances at the application boundary.
