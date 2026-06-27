# Keep Composite mwn-shaped, not mwn-cloned

Date: 2026-06-28
Status: accepted

## Context

`mwn` is a strong reference for MediaWiki bot and API workflows, but Composite must work in both MediaWiki frontend and Node.js / Toolforge runtimes.

## Decision

Composite will use `mwn` as the primary naming and object-model reference, but it will not clone every `mwn` API.

## Rationale

Following `mwn` makes Composite familiar and avoids inventing unnecessary names. Not cloning it blindly keeps the API portable, frontend-safe, and aligned with Taxon Labs application needs.

## Consequences

When a `mwn` API is server-only, too broad, or not realistic in the frontend runtime, Composite may defer it, narrow it, or expose a different shape. These divergences should be documented in policy, mapping, or decision records.
