# Record lightweight SDD decisions in repo

Date: 2026-06-28
Status: accepted

## Context

Several important Composite decisions were made during discussion. Keeping them only in chat history makes future maintenance harder.

## Decision

Composite will keep lightweight decision records in `docs/decisions/`.

## Rationale

The project follows a simple Lean SDD workflow. Decision records preserve the reasoning behind specs without requiring a heavy formal ADR process.

## Consequences

Future public API, runtime, packaging, and testing decisions should be captured in short decision records when the reason would not be obvious from code or milestone specs alone.
