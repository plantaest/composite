# Keep save options and result minimal

Date: 2026-06-28
Status: accepted

## Context

MediaWiki edit APIs support many parameters and return detailed edit responses. Exposing the full edit surface during the second milestone would make `page.save()` too broad.

## Decision

`PageSaveOptions` starts with only:

```ts
minor?: boolean
```

`PageSaveResult` starts with only:

```ts
title: string
```

The edit summary is optional to match `mwn` page save behavior:

```ts
page.save(text, summary?, options?)
```

## Rationale

This keeps the first write API easy to review and portable across runtimes. It leaves room for future normalized edit responses without committing to a full `ApiEditPageParams` or raw runtime response shape.

## Consequences

Advanced edit options such as tags, bot flag, timestamps, watchlist behavior, append/prepend, undo, and conflict handling are deferred. They should be added only when a later milestone designs their portable behavior.
