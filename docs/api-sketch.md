# Composite API Sketch

This document contains the early draft of Composite’s public API shape. It is not a final specification, but it should be concrete enough to guide implementation and review.

The goal of this document is to make public API decisions explicit before too much implementation accumulates.

---

# 1. API design goals

Composite should expose a task-oriented API for common MediaWiki operations without pretending to hide all MediaWiki concepts.

The public API should aim to be:

- readable
- practical for common wiki tasks
- small in its early stages
- reasonably adaptable to future runtimes without over-engineering v1

---

# 2. Early object model draft

The initial public object model is expected to revolve around a small number of concepts.

## Candidate core objects

- `Composite` or equivalent entry point
- `Wiki`
- `Page`
- `Revision` (possibly as a data object rather than a rich service object in v1)

Open question:
- whether `Composite.current()` should return a `Wiki` directly, or whether `Composite` should mainly be a namespace/factory

---

# 3. Entry point sketch

The current design direction assumes a client-side entry point that can obtain the current wiki runtime context.

Example:

```ts
const wiki = Composite.current();
```

Expected behavior:
- `Composite.current()` should obtain a wiki client bound to the current MediaWiki runtime context.
- It should not require callers to manually wire raw frontend API clients for common in-wiki usage.
- The exact runtime assumptions must remain documented.

Open question:
- whether the public entry point should allow explicit construction from a lower-level API client as well.

---

# 4. Page resolution sketch

Example:

```ts
const page = wiki.page("Wikipedia:Sandbox");
```

Expected behavior:
- `wiki.page(title)` should create or return a page-oriented object representing that title.
- It should not fetch page data immediately unless explicitly documented.
- The title handling rules and normalization behavior may be refined later.

Open questions:
- how much validation should happen at construction time
- whether page objects should be lightweight handles or cached objects

---

# 5. Read page information

Example:

```ts
const info = await page.getInfo();
```

Expected behavior:
- returns basic page information suitable for common application logic
- should provide a stable and documented shape rather than leaking raw Action API response objects by default
- should surface missing-page conditions in a consistent way

Open questions:
- what minimum info fields belong in the v1 result shape
- whether missing pages should be represented by a flag, a null-like result, or a dedicated error only in certain operations

---

# 6. Read page text

Example:

```ts
const text = await page.getText();
```

Expected behavior:
- returns the current readable text of the page
- should represent a common, ergonomic page-reading operation
- should not require callers to understand raw revision content query details for ordinary usage

Open questions:
- exact semantics of “current readable text”
- how redirects or missing pages should be handled
- whether additional read options belong in v1 or later

---

# 7. List revisions

Example:

```ts
const revisions = await page.getRevisions({ limit: 10 });
```

Expected behavior:
- returns revision data for the page in a Composite-defined shape
- v1 may intentionally expose only a limited revision model
- callers should not need to deal with raw Action API pagination details for simple cases

Possible early revision fields:
- revision ID
- timestamp
- user
- comment / summary
- size
- flags relevant to common workflows

Open questions:
- whether `Revision` should be a class, interface, or plain data structure in v1
- how much revision metadata is worth normalizing early

---

# 8. Edit a page

Example:

```ts
await page.edit({
  text: newText,
  summary: "Fix typo"
});
```

Expected behavior:
- Composite handles the standard edit flow for the current runtime
- token acquisition and routine client-side edit plumbing should not be the caller’s burden in normal cases
- errors should be surfaced in a Composite-oriented way rather than as arbitrary raw API payloads

Open questions:
- what the return type of `edit()` should be
- how to represent edit conflicts and permission failures
- whether minor edits / bot flags / basetimestamp options belong in the first edit API or later

---

# 9. Error model direction

Composite should not simply leak every raw API failure as an unstructured error.

The current direction is to define a small Composite-oriented error model for common cases, while still preserving access to underlying API details when useful.

Candidate error categories:
- permission-related failure
- missing page / invalid target where relevant
- edit conflict
- unsupported runtime or unavailable frontend facilities
- generic raw MediaWiki API failure

This area needs a more explicit decision before the implementation grows too much.

---

# 10. Raw API escape hatch

Composite likely needs some lower-level escape hatch for unsupported or niche cases.

This should not dominate the public API design, but it should exist in some form.

Open questions:
- should the escape hatch live on `Wiki`
- should it expose a Composite wrapper or the underlying frontend API object
- how much of that lower-level API should be treated as public and stable

---

# 11. Current implementation boundary for the prototype

The initial prototype should only prove the following flows:

1. obtain a wiki object
2. obtain a page object
3. read page info
4. read page text
5. list revisions in a minimal form
6. submit a simple edit

Anything beyond that should be treated as follow-up work unless explicitly promoted.
