# Imports and Bundling

Composite is designed as a single npm package with explicit subpath exports.

The main goal is to keep frontend bundles small and prevent server-only dependencies from leaking into MediaWiki user scripts, gadgets, or frontend applications.

## Package strategy

Initial strategy:

```text
Single package + subpath exports
```

Planned entry points:

```ts
@taxonlabs/composite
@taxonlabs/composite/mw
@taxonlabs/composite/mwn
@taxonlabs/composite/wikitext
@taxonlabs/composite/streams
@taxonlabs/composite/testing
```

Do not start with a multi-package monorepo unless a real dependency or publishing problem appears.

The repository should still be structured so it can be split into packages later if needed.

## Root import

The root import must stay lightweight:

```ts
import type { Wiki, Page, User, Wikis } from "@taxonlabs/composite";
import { CompositeError } from "@taxonlabs/composite";
```

The root import should export only:

- core types;
- interfaces;
- errors;
- lightweight primitives.

The root import must not export:

- `/mw` runtime factory;
- `/mwn` runtime factory;
- streams implementation;
- heavy wikitext parser implementation;
- server-only dependencies.

## Runtime imports

MediaWiki frontend runtime:

```ts
import { Composite } from "@taxonlabs/composite/mw";
```

Node.js / Toolforge runtime:

```ts
import { Composite } from "@taxonlabs/composite/mwn";
```

Runtime imports must be explicit. Do not auto-detect runtime from the root package.

## Utility imports

Wikitext utilities:

```ts
import { parseTemplates, parseLinks } from "@taxonlabs/composite/wikitext";
```

EventStreams utilities:

```ts
import { createEventStream } from "@taxonlabs/composite/streams";
```

Testing utilities:

```ts
import { createMockWiki } from "@taxonlabs/composite/testing";
```

## Dependency boundaries

Required boundaries:

```text
src/index.ts
  must not import src/runtimes/mw
  must not import src/runtimes/mwn
  must not import mwn

src/runtimes/mw/**
  must not import mwn
  must not import src/runtimes/mwn/**
  must not rely on Node.js-only modules

src/runtimes/mwn/**
  may import mwn
  may use Node.js-compatible APIs

src/wikitext/**
  must not import runtime modules

src/streams/**
  must not be imported by root/core unless explicitly intended
```

## Package exports

Planned `package.json` export shape:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./mw": {
      "types": "./dist/runtimes/mw/index.d.ts",
      "import": "./dist/runtimes/mw/index.js"
    },
    "./mwn": {
      "types": "./dist/runtimes/mwn/index.d.ts",
      "import": "./dist/runtimes/mwn/index.js"
    },
    "./wikitext": {
      "types": "./dist/wikitext/index.d.ts",
      "import": "./dist/wikitext/index.js"
    },
    "./streams": {
      "types": "./dist/streams/index.d.ts",
      "import": "./dist/streams/index.js"
    },
    "./testing": {
      "types": "./dist/testing/index.d.ts",
      "import": "./dist/testing/index.js"
    }
  }
}
```

## ESM-first

Composite should be ESM-first.

Recommended package settings:

```json
{
  "type": "module"
}
```

ESM static imports are important for tree-shaking.

## Side effects

Composite modules should avoid top-level side effects.

If this remains true, the package may use:

```json
{
  "sideEffects": false
}
```

Do not initialize runtime clients at import time.

Avoid:

```ts
const api = new mw.Api();
```

at module top level.

Prefer:

```ts
export function current(config?: MwWikiConfig) {
  const api = new mw.Api();
  return new MwWiki(api, config);
}
```

## Wikitext utility design

Wikitext utilities should prefer small pure functions.

Good:

```ts
parseTemplates(text)
parseLinks(text)
parseSections(text)
```

Be careful with large facade classes that pull all parser behavior into the bundle.

A facade such as `Wikitext.from(text)` may be added later, but pure function imports should remain available.

## Dependency policy

`mwn` should not be a hard requirement for frontend-only users if avoidable.

Possible approach:

```json
{
  "peerDependencies": {
    "mwn": "^x.y.z"
  },
  "peerDependenciesMeta": {
    "mwn": {
      "optional": true
    }
  }
}
```

The exact dependency strategy can be decided during implementation, but the bundle boundary is non-negotiable.

## Bundle checks

Early checks should ensure:

- importing `@taxonlabs/composite/mw` does not include `mwn`;
- importing `@taxonlabs/composite` does not include runtimes;
- importing `@taxonlabs/composite/wikitext` does not include runtimes;
- no runtime initializes at module import time.
