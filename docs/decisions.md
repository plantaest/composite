# Composite Decisions

This document records architecture and API decisions that are important enough to preserve explicitly.

Use short entries. The goal is to preserve reasoning and prevent accidental contradiction later.

---

## Decision template

### DEC-XXXX: Title
**Status:** proposed | accepted | superseded  
**Date:** YYYY-MM-DD

**Decision**  
What was decided.

**Why**  
Why this decision was made.

**Alternatives considered**  
Optional short list.

**Consequences**  
Important effects or follow-up implications.

---

## Decisions

### DEC-0001: Composite v1 is client-runtime-first
**Status:** accepted  
**Date:** 2026-06-25

**Decision**  
Composite v1 will focus on the MediaWiki client runtime rather than trying to support both client and server runtimes from the start.

**Why**  
The initial project goal is to validate the public API shape and provide a useful implementation in the environment with the clearest immediate need and strongest available frontend infrastructure.

**Consequences**  
Future server runtimes remain possible, but v1 should not over-engineer around them.
