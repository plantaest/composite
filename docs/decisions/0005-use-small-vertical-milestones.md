# Use small vertical milestones

Date: 2026-06-28
Status: accepted

## Context

Composite has a broad possible API surface. Implementing too much at once would make review, testing, and API correction difficult.

## Decision

Composite will move through small vertical milestones. Each milestone should include API shape, runtime support decision, implementation, tests, and documentation updates.

## Rationale

Small vertical slices fit a solo Lean SDD workflow. They make it easier to keep policy, specs, tests, and implementation synchronized.

## Consequences

Broad domains such as history, search, uploads, EventStreams, Parsoid, Wikibase, and OAuth should wait until a milestone explicitly scopes them.
