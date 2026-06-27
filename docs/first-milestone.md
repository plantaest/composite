# First Milestone

This document defines the first implementation milestone for the rebuilt Composite repository.

The goal is to establish the architecture, public import paths, core interfaces, minimal runtime entry points, and first shared capability.

Do not implement broad MediaWiki coverage in this milestone.

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
import type { Wiki, Page, User, Wikis } from "@taxonlabs/composite";
import { CompositeError, UnsupportedRuntimeError } from "@taxonlabs/composite";

import { Composite as MwComposite } from "@taxonlabs/composite/mw";
import { Composite as MwnComposite } from "@taxonlabs/composite/mwn";

import { createMockWiki } from "@taxonlabs/composite/testing";
```

The `/wikitext` and `/streams` entry points may exist as placeholders, but they do not need feature implementation in the first milestone.

## Core interfaces

Define minimal interfaces:

```ts
export interface Runtime {
  kind: RuntimeKind;
}

export type RuntimeKind = "mw" | "mwn" | "mock";

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

export interface Wikis {
  get(wikiId: string): Wiki;
  has(wikiId: string): boolean;
  ids(): string[];
  current(): Wiki;
}
```

These interfaces can evolve, but the first milestone should keep them minimal.

## `/mw` runtime API

Implement or stub with tests:

```ts
import { Composite } from "@taxonlabs/composite/mw";

const currentWiki = Composite.current(config);
const connectedWiki = Composite.connect(config);
const wrappedWiki = Composite.from(api, config);
const wikis = Composite.wikis(config);
```

Required behavior for this milestone:

```ts
const wiki = Composite.from(fakeApi, config);

wiki.runtime().kind === "mw";
wiki.page("Wikipedia:Sandbox").title() === "Wikipedia:Sandbox";
await wiki.page("Wikipedia:Sandbox").text();
```

`page.text()` should map to an appropriate `mw.Api` query shape. It does not need to support every page content edge case in this milestone.

## `/mwn` runtime API

Implement or stub with tests:

```ts
import { Composite } from "@taxonlabs/composite/mwn";

const wiki = await Composite.create(config);
const wrappedWiki = Composite.from(bot, config);
const wikis = await Composite.wikis(config);
```

Required behavior for this milestone:

```ts
const wiki = Composite.from(fakeBot, config);

wiki.runtime().kind === "mwn";
wiki.page("Wikipedia:Sandbox").title() === "Wikipedia:Sandbox";
await wiki.page("Wikipedia:Sandbox").text();
```

`page.text()` should delegate to the corresponding mwn page text behavior.

## `/testing` API

Implement:

```ts
import { createMockWiki } from "@taxonlabs/composite/testing";

const wiki = createMockWiki({
  pages: {
    "Wikipedia:Sandbox": "Hello"
  }
});
```

Required behavior:

```ts
wiki.runtime().kind === "mock";
wiki.page("Wikipedia:Sandbox").title() === "Wikipedia:Sandbox";
await wiki.page("Wikipedia:Sandbox").text() === "Hello";
```

## Suggested source structure

```text
src/
  index.ts

  core/
    errors.ts
    runtime.ts
    Wiki.ts
    Page.ts
    User.ts
    Wikis.ts
    types.ts

  runtimes/
    mw/
      index.ts
      Composite.ts
      MwWiki.ts
      MwPage.ts

    mwn/
      index.ts
      Composite.ts
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

## Not in this milestone

Do not implement these yet:

```text
page.save()
page.edit()
page.history()
page.categories()
page.templates()
page.links()
page.backlinks()
page.logs()
wiki.search()
wiki.sparqlQuery()
wiki.upload()
EventStreams
Parsoid
Wikibase
OAuth
real integration tests against Wikimedia sites
```

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
