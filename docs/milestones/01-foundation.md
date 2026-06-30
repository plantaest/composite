# Foundation Milestone

This document defines the first implementation milestone for the rebuilt Composite repository.

Status: completed.

The goal is to establish the architecture, public import paths, core interfaces, minimal runtime entry points, and first shared capability.

This milestone is limited to the APIs and behavior listed below.

## Goal

Create the smallest working Composite skeleton that demonstrates:

- single package with subpath exports;
- root core types;
- explicit `/mw` and `/mwn` runtime entry points;
- basic shared `Wiki` and `Page` behavior;
- testable runtime adapters;
- no accidental dependency leakage.

## Public entry points

The first milestone should prepare these imports:

```ts
import type { Wiki, Page, User, WikiRegistry } from '@taxonlabs/composite';
import { CompositeError, UnsupportedRuntimeError } from '@taxonlabs/composite';

import { MwWiki } from '@taxonlabs/composite/mw';
import { MwnWiki } from '@taxonlabs/composite/mwn';

import { createMockWiki } from '@taxonlabs/composite/testing';
```

The `/wikitext` and `/streams` entry points may exist as placeholders, but they do not need feature implementation in the first milestone.

## Core interfaces

Define minimal interfaces:

```ts
export interface Runtime {
  type: RuntimeType;
}

export type RuntimeType = 'mw' | 'mwn' | 'mock';

export interface Wiki {
  runtime(): Runtime;
  page(title: string): Page;
}

export interface Page {
  title(): string;
  text(): Promise<string>;
}

export interface User {
  // Placeholder for future capability.
}

export interface WikiRegistry {
  get(wikiId: string): Wiki;
  has(wikiId: string): boolean;
  ids(): string[];
}
```

These interfaces can evolve, but the first milestone should keep them minimal.

## `/mw` runtime API

Implement or stub with tests:

```ts
import { MwWiki } from '@taxonlabs/composite/mw';

const currentWiki = MwWiki.create(config);
const connectedWiki = MwWiki.create({
  serverName: 'test.wikipedia.org',
});
const wrappedWiki = MwWiki.from(api, config);
const wikis = MwWiki.registry({
  testwiki: {
    serverName: 'test.wikipedia.org',
  },
});
```

Required behavior for this milestone:

```ts
const wiki = MwWiki.from(fakeApi, config);

wiki.runtime().type === 'mw';
wiki.page('Wikipedia:Sandbox').title() === 'Wikipedia:Sandbox';
await wiki.page('Wikipedia:Sandbox').text();
```

`page.text()` should map to an appropriate `mw.Api` query shape. It does not need to support every page content edge case in this milestone.

## `/mwn` runtime API

Implement or stub with tests:

```ts
import { MwnWiki } from '@taxonlabs/composite/mwn';

const wiki = await MwnWiki.create(config);
const wrappedWiki = MwnWiki.from(bot, config);
const wikis = await MwnWiki.registry({
  testwiki: {
    serverName: 'test.wikipedia.org',
  },
});
```

Required behavior for this milestone:

```ts
const wiki = MwnWiki.from(fakeBot, config);

wiki.runtime().type === 'mwn';
wiki.page('Wikipedia:Sandbox').title() === 'Wikipedia:Sandbox';
await wiki.page('Wikipedia:Sandbox').text();
```

`page.text()` should delegate to the corresponding mwn page text behavior.

## `/testing` API

Implement:

```ts
import { createMockWiki } from '@taxonlabs/composite/testing';

const wiki = createMockWiki({
  pages: {
    'Wikipedia:Sandbox': 'Hello',
  },
});
```

Required behavior:

```ts
wiki.runtime().type === 'mock';
wiki.page('Wikipedia:Sandbox').title() === 'Wikipedia:Sandbox';
await wiki.page('Wikipedia:Sandbox').text() === 'Hello';
```

## Suggested source structure

```text
src/
  index.ts

  core/
    errors.ts
    Runtime.ts
    Wiki.ts
    Page.ts
    User.ts
    WikiRegistry.ts
    DefaultWikiRegistry.ts
    types.ts

  runtimes/
    mw/
      index.ts
      mediawiki.ts
      MwWiki.ts
      MwPage.ts

    mwn/
      index.ts
      MwnWiki.ts
      MwnPage.ts

  wikitext/
    index.ts

  streams/
    index.ts

  testing/
    index.ts
    MockWiki.ts
    MockPage.ts
```

## Tests required

Use a small test suite. Recommended categories:

```text
tests/core/
tests/runtimes/mw/
tests/runtimes/mwn/
tests/contract/
tests/testing/
```

Minimum tests:

- `MockWiki` satisfies the basic `Wiki` contract.
- `/mw` adapter satisfies the basic `Wiki` contract with a fake API.
- `/mwn` adapter satisfies the basic `Wiki` contract with a fake bot.
- `page.text()` delegates or maps correctly in each runtime.
- root import does not import runtime implementations.

## Definition of done

This milestone is done when:

- the repo has the planned source structure;
- package exports are defined;
- root import is lightweight;
- `/mw`, `/mwn`, and `/testing` entry points compile;
- basic `Wiki` and `Page` interfaces are implemented;
- `page.text()` works through mocked `/mw`, mocked `/mwn`, and `/testing`;
- tests pass;
- docs still match the implemented API shape.
