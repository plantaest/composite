# Support mw and mwn through narrow adapters

Date: 2026-06-28
Status: accepted

## Context

The `mw` frontend runtime and `mwn` server runtime have different APIs, dependency constraints, and promise shapes.

## Decision

Composite will wrap each runtime with narrow adapter classes such as `MwWiki`, `MwPage`, `MwnWiki`, and `MwnPage`.

## Rationale

Narrow adapters keep shared interfaces stable while allowing runtime-specific mapping, casts, and normalization to stay close to the runtime boundary.

## Consequences

Adapter tests should use fake runtime objects and verify mapping behavior. Low-level runtime differences, such as `mw.Api` jQuery-style promises and `mwn` native promises, should be normalized or bridged inside runtime adapters.
