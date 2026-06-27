# Use types-mediawiki at mw boundaries

Date: 2026-06-28
Status: accepted

## Context

The `/mw` runtime should reflect real MediaWiki frontend APIs without forcing tests to fake the entire `mw` global surface.

## Decision

Composite will use upstream `types-mediawiki` and `types-mediawiki-api` at the `/mw` adapter boundary, but keep local narrow aliases:

```ts
export type MwApi = Pick<mw.Api, 'get' | 'postWithToken'>;
export type MwApiParams = UnknownApiParams;
```

`MwGlobal` remains a narrow local interface with members derived from upstream types where useful.

## Rationale

This avoids duplicating important method signatures while keeping fakes and adapter boundaries small.

## Consequences

Some casts remain at the adapter boundary because Composite's public API is intentionally more portable than the exact generated MediaWiki API types. `mw.Api` jQuery-style promises are normalized where Composite returns a native `Promise`.
