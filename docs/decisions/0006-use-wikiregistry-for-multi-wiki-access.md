# Use WikiRegistry for multi-wiki access

Date: 2026-06-28
Status: accepted

Superseded naming note: see `0017-use-concrete-runtime-wiki-entry-points.md` for the later rename from `Wikis` to the `WikiRegistry` contract and from the concrete `WikiRegistry` class to `DefaultWikiRegistry`.

## Context

Composite needs a way to hold multiple wiki instances for cross-wiki tools, but the early API should stay small.

## Decision

Composite will expose a map-like wiki registry with:

```ts
wikis.get(wikiId)
wikis.has(wikiId)
wikis.ids()
```

At the time of this decision, the interface name was `Wikis` and the concrete class name was `WikiRegistry`. Decision 0017 keeps the same behavior, but renames the public contract to `WikiRegistry` and the concrete class to `DefaultWikiRegistry`.

## Rationale

An explicit map-like registry is enough for multi-wiki tools and avoids assuming there is always a current wiki. Runtime factories can decide how to build the registry.

## Consequences

`DefaultWikiRegistry` owns common registry validation such as rejecting an empty registry. Runtime-specific `registry()` implementations should avoid duplicating that rule.
