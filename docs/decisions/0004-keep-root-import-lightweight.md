# Keep root import lightweight

Date: 2026-06-28
Status: accepted

## Context

Frontend tools, gadgets, and user scripts should be able to import Composite core types without pulling server runtime code.

## Decision

The root import will export only core interfaces, errors, and lightweight primitives. It must not export runtime factories or import runtime implementation modules.

## Rationale

This protects bundle size and prevents `mwn` or Node-only dependencies from leaking into frontend builds.

## Consequences

Tests must enforce import boundaries. Public examples should show runtime factories coming from `/mw` or `/mwn`, not from the root package.
