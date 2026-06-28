# Add request, query, and save as second milestone

Date: 2026-06-28
Status: accepted

## Context

After the foundation milestone, Composite needed its first practical read/write vertical slice without opening the whole MediaWiki API surface.

## Decision

The second milestone adds:

```ts
wiki.request(params)
wiki.query(params)
page.save(text, summary?, options?)
```

for `/mw`, `/mwn`, and `/testing`.

## Rationale

`wiki.request()` gives a portable Action API request primitive. `wiki.query()` gives an mwn-style query helper built on top of `request()`. `page.save()` proves the first write path and token/session-dependent behavior while keeping the API small.

## Consequences

`page.edit()`, page relationships, history, search, and user APIs remain out of scope until later milestones.
