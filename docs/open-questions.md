# Composite Open Questions

This document records unresolved questions that should not be hidden inside chat history or private notes.

Questions may later turn into decisions, scope changes, or explicit non-goals.

---

## OQ-0001 — Public entry point shape
Should `Composite.current()` be the primary public entry point for v1, or should the library expose a different construction model centered on `Wiki`?

Status: open

---

## OQ-0002 — Missing page representation
When reading page info or page text, how should missing pages be represented?

Options may include:
- a structured result with an existence flag
- a nullable result in some operations
- a dedicated error in some operations

Status: open

---

## OQ-0003 — Revision model richness in v1
Should revisions in v1 be represented as plain data objects, or should Composite expose a richer `Revision` object?

Status: open

---

## OQ-0004 — Raw API escape hatch shape
How should Composite expose unsupported or lower-level Action API access without undermining the domain-oriented public API?

Status: open

---

## OQ-0005 — Scope of early administrative actions
Should rollback be the first administrative capability after read/edit, or should Composite defer administrative actions until the read/edit contract is stable?

Status: open
