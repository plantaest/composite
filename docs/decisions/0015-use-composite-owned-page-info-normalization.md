# Use Composite-owned page info normalization

Date: 2026-06-28
Status: accepted

## Context

Milestone 3 adds `page.info()`, but `mwn.Page` does not expose a direct `info()` method. MediaWiki still has a stable Action API page info shape through `action=query&prop=info`.

MediaWiki also distinguishes title normalization from redirects:

- normalization maps aliases such as `WP:Sandbox` to `Wikipedia:Sandbox` on test.wikipedia.org;
- redirects map one page title to another page, such as `Quandong` to `Santalum acuminatum` on vi.wikipedia.org.

## Decision

Composite will expose `page.info()` as a Composite-owned normalized API instead of requiring a direct mwn method.

`page.info()` follows redirects in this milestone and returns both:

- `title`: the effective title returned by MediaWiki;
- `sourceTitle`: the title used to create the `Page` object.

It also marks normalization and redirect state with `normalized?: boolean` and `redirect?: boolean`.

## Rationale

Application code often needs effective page metadata and still needs to know which title it originally asked about. Keeping both values makes normalization and redirects visible without exposing raw MediaWiki response objects.

Using the same Action API query shape for `/mw` and `/mwn` keeps behavior portable even though the method is not a direct mwn clone.

## Consequences

`page.info()` is mwn-shaped in spirit but Composite-owned in exact API shape.

Future options, such as `page.info({ redirects: false })`, can be added if applications need redirect-page metadata instead of effective target metadata.
