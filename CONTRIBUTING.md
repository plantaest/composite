# Contributing

This guide keeps Composite contributions consistent across human and AI-assisted work.

Composite is a runtime-aware, mwn-shaped MediaWiki SDK for TypeScript. Public API changes should follow the project policy docs and move in small, tested vertical slices.

## Project principles

- Keep Composite mwn-shaped, not mwn-cloned.
- Keep the root import lightweight.
- Use explicit runtime entry points: `/mw`, `/mwn`, and `/testing`.
- Do not let `/mw` import `mwn` or Node-only dependencies.
- Do not let `/wikitext` import runtime modules.
- Prefer one primary API name for each concept.
- Delegate low-level behavior to `mw` or `mwn` where practical.

## Branch naming

Use short, descriptive branch names with a conventional prefix:

```text
feat/<short-topic>
fix/<short-topic>
docs/<short-topic>
refactor/<short-topic>
test/<short-topic>
chore/<short-topic>
```

Examples:

```text
feat/query-and-save
docs/roadmap
refactor/wiki-registry
test/mw-save-adapter
```

Codex-assisted branches may use:

```text
codex/<short-topic>
```

## Commit messages

Use Conventional Commits:

```text
type: short imperative summary
```

Recommended types:

```text
feat
fix
docs
refactor
test
chore
build
ci
```

Examples:

```text
feat: add wiki query support
fix: require serverName for mw connect
docs: add capability roadmap
refactor: rename WikiMap to WikiRegistry
test: cover mock page save
chore: configure biome
```

Scopes are optional but welcome when they clarify the affected area:

```text
feat(mw): add query adapter
test(mwn): cover page save delegation
docs(milestones): add query and save plan
```

## Development setup

Use pnpm:

```sh
pnpm install
```

Common checks:

```sh
pnpm run typecheck
pnpm run typecheck:tests
pnpm run build
pnpm test
pnpm run check
```

Run all relevant checks before opening a pull request.

## Code style

- TypeScript should be ESM-first.
- Use single quotes for strings.
- Biome handles formatting and linting.
- Prefer explicit types at public API boundaries.
- Keep comments concise and useful. Explain intent, runtime behavior, or non-obvious adapter shapes.
- Avoid adding aliases such as both `page.text()` and `page.getText()` unless there is a strong compatibility reason.

## API changes

Before adding or changing a public API, check:

- `docs/api-policy.md`
- `docs/runtime-support.md`
- `docs/api-mapping.md`
- `docs/decisions/`
- the active milestone in `docs/milestones/`

For each public API change:

- define the core interface shape;
- decide runtime support for `/mw` and `/mwn`;
- update runtime adapters where supported;
- add or update contract tests;
- add adapter tests with fake runtime objects;
- update documentation if the public surface changes.
- add or update a decision record when the reason for the choice would not be obvious later.

Unsupported runtime behavior should fail explicitly, usually with `UnsupportedRuntimeError`.

Configuration validation should use `ConfigurationError`.

## Documentation

The docs have different roles:

- `COMPOSITE.md`: contributor and agent working rules.
- `docs/api-policy.md`: API naming and design policy.
- `docs/runtime-support.md`: runtime availability matrix.
- `docs/imports-and-bundling.md`: package boundary and bundle policy.
- `docs/testing-strategy.md`: testing layers and expectations.
- `docs/decisions/`: accepted design decisions and their rationale.
- `docs/capabilities.md`: long-term capability roadmap.
- `docs/api-mapping.md`: provisional runtime adapter mapping.
- `docs/milestones/`: active milestone scope.

Roadmap docs are not implementation promises. Milestone docs define current planned scope.

## Testing

Prefer tests that verify Composite behavior rather than retesting MediaWiki, `mw.Api`, or `mwn`.

Use:

- unit tests for core errors, registries, and pure utilities;
- adapter tests for `/mw` and `/mwn` runtime mapping with fakes;
- contract tests for shared `Wiki`, `Page`, and future domain interfaces;
- boundary tests for import and dependency rules.

Live Wikimedia integration tests are not required for early milestones.

## Pull request checklist

Before requesting review:

- [ ] API shape follows `docs/api-policy.md`.
- [ ] Runtime support is documented when behavior changes.
- [ ] Root import remains lightweight.
- [ ] `/mw` does not import `mwn`.
- [ ] Public API changes include contract tests.
- [ ] Runtime behavior changes include adapter tests.
- [ ] Documentation is updated when public behavior changes.
- [ ] `pnpm run typecheck` passes.
- [ ] `pnpm run typecheck:tests` passes.
- [ ] `pnpm run build` passes.
- [ ] `pnpm test` passes.
- [ ] `pnpm run check` passes.
