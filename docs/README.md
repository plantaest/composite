# Composite Documentation

This directory contains Composite's project documentation.

When documents overlap, use this authority order:

1. Source code and tests.
2. The active milestone in `docs/milestones/`.
3. Accepted decision records in `docs/decisions/`.
4. Standing policy documents.
5. Roadmap documents.

Roadmap documents describe direction. Milestone documents define active implementation scope.

## Lean SDD workflow

Composite follows a lightweight spec-driven development workflow:

1. Use policy docs to decide whether an API belongs in Composite.
2. Record important design choices in `docs/decisions/`.
3. Define the next implementation slice in `docs/milestones/`.
4. Implement the slice with contract, adapter, and boundary tests.
5. Update source, tests, and the affected docs when public behavior changes.

This process should stay lightweight. Do not create decision records for every small code change; use them when the reasoning would be useful later.

## Standing policy

- `api-policy.md`: API naming, design, and runtime-entry policy.
- `runtime-support.md`: runtime support policy and labels.
- `imports-and-bundling.md`: package boundary and bundle policy.
- `testing-strategy.md`: expected test layers and test boundaries.

## Milestones

- `milestones/`: implementation milestone specs and completion records.

## Decisions

- `decisions/`: lightweight decision records explaining why major API, runtime, testing, and documentation choices were made.

## Roadmap

- `capabilities.md`: high-level capability roadmap.
- `api-mapping.md`: per-API runtime support, adapter mapping, implementation status, and test coverage.

## Contributor guides

- `../COMPOSITE.md`: project-specific development rules.
- `../CONTRIBUTING.md`: branch, commit, style, testing, and pull request conventions.
