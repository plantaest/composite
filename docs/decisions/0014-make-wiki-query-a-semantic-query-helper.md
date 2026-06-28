# Make Wiki.request the primitive and Wiki.query a helper

Date: 2026-06-28
Status: accepted

## Context

`mw.Api#get(params)`, `mwn.request(params)`, and `mwn.query(params)` are related but not identical.

mwn treats `request(params)` as the generic Action API primitive and `query(params)` as a small helper that calls `request()` with `action: 'query'`.

Composite should follow that shape while keeping the frontend `/mw` adapter simple.

## Decision

`Wiki.request(params)` is the generic Action API request primitive.

`Wiki.query(params)` is an mwn-style helper built on top of `request()`.

Callers should pass query parameters without `action`:

```ts
await wiki.query({
  meta: 'siteinfo'
});
```

Composite supplies `action: 'query'` internally:

```ts
this.request(Object.assign({ action: 'query' }, params));
```

Callers should use `wiki.request(params)` for non-query actions.

Composite does not validate overridden `action` values in `wiki.query()` in this milestone.

Runtime adapters delegate through `request()`:

- `/mw` `request(params)` passes params to `mw.Api#get()`.
- `/mwn` `request(params)` passes params to `mwn.request()`.
- `/testing` matches configured request params.

## Rationale

The method name `query()` should normally mean `action=query`, and examples should encourage that use.

However, Composite is an internal Taxon Labs SDK with a small user base. A simple mwn-like helper plus a code comment is enough for the second milestone, and avoids adding defensive abstractions before they earn their keep.

## Consequences

`wiki.request(params)` becomes available to shared application code.

`wiki.query(params)` stays small and predictable for normal query use.

If a caller passes a non-query `action` to `wiki.query()`, that value may override the helper default. This is accepted for now and documented as something callers should avoid.
