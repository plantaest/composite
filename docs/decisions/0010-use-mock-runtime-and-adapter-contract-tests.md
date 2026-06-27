# Use mock runtime and adapter contract tests

Date: 2026-06-28
Status: accepted

## Context

Composite needs confidence that shared APIs behave consistently without relying on live Wikimedia sites, credentials, or network availability.

## Decision

Composite will provide a `/testing` mock runtime and maintain tests in three layers:

- contract tests for shared behavior;
- adapter tests for `/mw` and `/mwn` runtime mapping with fakes;
- import boundary tests for package architecture.

## Rationale

This tests Composite's abstraction rather than retesting MediaWiki, `mw.Api`, or `mwn`.

## Consequences

Live integration tests are not required for early milestones. They may be added later for authentication, permissions, edits, and other behavior that cannot be meaningfully proven with fakes.
