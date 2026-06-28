# Composite Development Guide

This file defines the working rules for Composite contributors and AI coding agents.

Composite is a runtime-aware, mwn-shaped MediaWiki SDK for TypeScript. It exists to provide a stable application API across MediaWiki frontend and Node.js / Toolforge runtimes.

## Core principles

### 1. mwn-shaped, not mwn-cloned

Composite uses `mwn` as the primary API reference for naming, object model, and common MediaWiki operations.

Prefer names such as:

```ts
wiki.page(title)
wiki.user(name)
wiki.request(params)
wiki.query(params)
wiki.search(query, options)
wiki.sparqlQuery(query, endpoint)

page.text()
page.save(text, summary?, options?)
page.edit(transform, config)
page.history(props, limit, options)
page.categories()
page.templates()
page.links()
page.backlinks()
page.subpages()
page.logs()
page.purge()

user.info()
user.contribs()
```

However, `mwn` is the primary API reference, not the constitutional authority. Composite may diverge when a `mwn` API is not portable, not suitable for frontend runtime, too server-specific, or not aligned with Taxon Labs application needs.

### 2. Runtime-aware by design

Composite has at least two initial runtimes:

- `/mw`: uses MediaWiki Frontend API such as `mw.Api`, `mw.ForeignApi`, `mw.config`, `mw.user`, and related frontend facilities.
- `/mwn`: delegates to the `mwn` library for Node.js / Toolforge usage.

Do not assume every API works in both runtimes. Every non-trivial API should be classified as one of:

- `supported`
- `partial`
- `frontend-only`
- `server-only`
- `future`
- `unsupported`

### 3. Explicit runtime entry points

Do not create runtime instances from the root package.

Root import:

```ts
import type { Wiki } from '@taxonlabs/composite';
```

MediaWiki frontend runtime:

```ts
import { Composite } from '@taxonlabs/composite/mw';

const wiki = Composite.current(config);
```

Node.js / Toolforge runtime:

```ts
import { Composite } from '@taxonlabs/composite/mwn';

const wiki = await Composite.create(config);
```

### 4. Root import must remain lightweight

The root package must only export core types, interfaces, errors, and lightweight primitives.

The root package must not export runtime factories and must not import runtime implementation modules.

### 5. No accidental dependency leaks

The `/mw` runtime must not import `mwn` or any Node-only dependency.

The `/wikitext` module must not import runtime modules.

The `/streams` module must not be imported by core or page APIs unless explicitly requested by the user.

### 6. No aliases by default

Do not add parallel names such as both `page.text()` and `page.getText()` unless a strong compatibility reason exists.

If Composite follows `mwn` naming, keep that naming as the primary API.

### 7. Delegate low-level behavior

Do not reimplement low-level behavior already provided by the runtime libraries unless there is a clear reason.

For `/mwn`, delegate to `mwn` where practical.

For `/mw`, use MediaWiki frontend facilities where practical.

Composite should mainly normalize API shape, runtime differences, errors, and shared application contracts.

### 8. Shared code depends on interfaces

Application code intended to work across runtimes should depend on the core `Wiki`, `Page`, `User`, and related interfaces.

Runtime-specific code should live at application boundaries.

### 9. Keep implementation slices small

Each milestone should define a small positive scope and avoid broad MediaWiki coverage.

### 10. Prefer small vertical slices

Add features one capability at a time. Each slice should include:

- API shape;
- runtime support decision;
- implementation for supported runtimes;
- tests for adapter mapping and shared contract;
- documentation update if public API changes.

### 11. Record important decisions

Use `docs/decisions/` for design choices that affect public API shape, runtime behavior, package boundaries, testing strategy, or future development direction.

Decision records should stay lightweight. They should explain why the choice was made, not duplicate the full implementation or milestone spec.
