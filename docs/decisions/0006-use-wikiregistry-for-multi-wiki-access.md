# Use WikiRegistry for multi-wiki access

Date: 2026-06-28
Status: accepted

## Context

Composite needs a way to hold multiple wiki instances for cross-wiki tools, but the early API should stay small.

## Decision

Composite will expose a `Wikis` interface backed by `WikiRegistry`, with:

```ts
wikis.get(wikiId)
wikis.has(wikiId)
wikis.ids()
```

## Rationale

An explicit map-like registry is enough for multi-wiki tools and avoids assuming there is always a current wiki. Runtime factories can decide how to build the registry.

## Consequences

`WikiRegistry` owns common registry validation such as rejecting an empty registry. Runtime-specific `Composite.wikis()` implementations should avoid duplicating that rule.
