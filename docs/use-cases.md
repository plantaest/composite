# Composite Use Cases

This document lists the primary tasks that Composite should support or eventually support. These use cases are written from the perspective of application code using Composite rather than from the perspective of end users of a specific app.

---

## UC-01 Read basic page information
**Priority:** P0

Application code should be able to obtain a page object from a title and retrieve basic metadata about that page.

Potential information may include:
- normalized title
- page ID
- existence / missing status
- namespace information
- redirect status where relevant

---

## UC-02 Read page text
**Priority:** P0

Application code should be able to retrieve the current readable text of a page through a simple, task-oriented API.

The use case should avoid forcing application code to manually compose raw Action API requests for common page-reading tasks.

---

## UC-03 List revisions for a page
**Priority:** P0

Application code should be able to retrieve revisions associated with a page, at least in a limited and practical form suitable for early Composite use.

Initial support may be intentionally small, for example:
- recent revisions only
- configurable limit
- selected revision metadata

---

## UC-04 Edit a page
**Priority:** P0

Application code should be able to submit an edit to a page by providing content and an edit summary.

Composite should aim to hide unnecessary low-level complexity for common edit operations while still exposing errors in a meaningful way.

---

## UC-05 Roll back a recent revision
**Priority:** P1

Composite may later support a rollback-oriented API for authorized users.

This should be treated as a distinct moderation/administrative capability rather than forced into the initial prototype before the core page-reading and editing contract is stable.

---

## UC-06 Delete a page
**Priority:** P1

Composite may later support page deletion for authorized users where the runtime and permissions allow it.

---

## UC-07 Protect a page
**Priority:** P1

Composite may later support protection-related actions for authorized users.

---

## UC-08 Inspect current user context
**Priority:** P1

Composite may later expose limited helpers for current user information relevant to permissions, editing, or UI behavior.

---

## UC-09 Use a raw API escape hatch for unsupported cases
**Priority:** P1

Composite should likely provide some lower-level escape hatch so that application code can still reach unsupported Action API operations when necessary.

The exact shape of this escape hatch is still an open design question.

---

## Notes

- These use cases are intentionally written at the SDK capability level.
- A use case being listed here does not automatically mean it belongs in the first prototype.
- P0 use cases should drive the initial API design and prototype work.
