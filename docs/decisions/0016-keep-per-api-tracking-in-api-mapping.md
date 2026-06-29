# Keep per-API tracking in API mapping

Date: 2026-06-29
Status: accepted

## Context

Composite has several roadmap and policy documents. `capabilities.md`, `runtime-support.md`, and `api-mapping.md` all touched API direction, which made it easy to duplicate per-API runtime support details.

That duplication creates unnecessary maintenance work: every new API could require updates in multiple broad documents before the implementation is even stable.

## Decision

Composite will use:

- `capabilities.md` for the high-level capability roadmap;
- `api-mapping.md` for per-API runtime support, adapter mapping, implementation status, and test coverage;
- `runtime-support.md` for runtime support policy and labels only.

Milestone documents may define active implementation scope, but they should reference `api-mapping.md` instead of duplicating long support matrices.

## Rationale

Lean spec-driven development works best when each document has one clear job.

Keeping per-API tracking in one document reduces drift, makes reviews easier, and avoids turning policy documents into large change logs.

## Consequences

Adding or changing a public API should usually update `api-mapping.md` and the active milestone document.

`runtime-support.md` should stay small and should not grow a new per-API matrix unless the documentation model changes again.
