# Add query and save as second milestone

Date: 2026-06-28
Status: accepted

## Context

After the foundation milestone, Composite needed its first practical read/write vertical slice without opening the whole MediaWiki API surface.

## Decision

The second milestone adds:

```ts
wiki.query(params)
page.save(text, summary?, options?)
```

for `/mw`, `/mwn`, and `/testing`.

## Rationale

`wiki.query()` gives a low-level read escape hatch. `page.save()` proves the first write path and token/session-dependent behavior while keeping the API small.

## Consequences

`wiki.request()`, `page.edit()`, page relationships, history, search, and user APIs remain out of scope until later milestones.
