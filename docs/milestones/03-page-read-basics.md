# Page Read Basics Milestone

This document defines the third Composite implementation milestone.

Status: planned.

Read this together with:

- `../decisions/0013-split-page-read-basics-from-broader-third-milestone.md` for the milestone scope decision.
- `../capabilities.md` for the long-term capability roadmap.
- `../api-mapping.md` for provisional runtime adapter mapping.
- `../runtime-support.md` for runtime support labels and matrix.

The goal is to add common page metadata and relationship reads without starting broader discovery, revision history, or current-user APIs.

This milestone is limited to the APIs and behavior listed below.

## Goal

Create a focused page-read vertical slice that supports:

- basic page metadata;
- page existence checks;
- categories, templates, and links for a page;
- consistent `/mw`, `/mwn`, and `/testing` behavior;
- contract and adapter tests for each new method.

This milestone should make `Page` more useful for application code while keeping continuation, search, revision history, and user-session design out of the first page-read expansion.

## Public API additions

Add these methods to the core `Page` interface:

```ts
export interface Page {
  title(): string;
  text(): Promise<string>;
  save(text: string, summary?: string, options?: PageSaveOptions): Promise<PageSaveResult>;

  info(): Promise<PageInfo>;
  exists(): Promise<boolean>;
  categories(): Promise<string[]>;
  templates(): Promise<string[]>;
  links(): Promise<string[]>;
}
```

Add a lightweight shared `PageInfo` type:

```ts
export interface PageInfo {
  title: string;
  sourceTitle: string;
  exists: boolean;

  pageId?: number;
  namespace?: number;
  missing?: boolean;
  normalized?: boolean;
  redirect?: boolean;

  contentModel?: string;
  pageLanguage?: string;
  touched?: string;
  lastRevisionId?: number;
  length?: number;
}
```

`PageInfo` exposes normalized page identity, existence state, and common Action API `prop=info` metadata.

`title` is the effective title returned by MediaWiki. `sourceTitle` is the title used to create the `Page` object.

For example, on test.wikipedia.org, `wiki.page('WP:Sandbox').info()` may return `title: 'Wikipedia:Sandbox'`, `sourceTitle: 'WP:Sandbox'`, and `normalized: true`.

For a redirect such as `wiki.page('Quandong').info()` on vi.wikipedia.org, Composite follows redirects in this milestone and may return `title: 'Santalum acuminatum'`, `sourceTitle: 'Quandong'`, and `redirect: true`.

## `page.info()`

`page.info()` returns normalized page metadata.

Expected behavior:

```ts
const info = await wiki.page('Wikipedia:Sandbox').info();

info.title;
info.exists;
```

Runtime mapping:

- `/mw`: query the Action API page info endpoint through `mw.Api`.
- `/mwn`: query the same Action API page info shape through mwn.
- `/testing`: return configured page info or derive minimal info from configured mock pages.

For a missing page, `exists` should be `false`, `missing` should be `true`, and `pageId` should be absent.

## `page.exists()`

`page.exists()` is a convenience method built on the same existence semantics as `page.info()`.

Expected behavior:

```ts
const exists = await wiki.page('Wikipedia:Sandbox').exists();
```

Runtime mapping:

- `/mw`: use page-info missing state.
- `/mwn`: delegate to an mwn page existence helper where practical, or use the same query shape as `page.info()`.
- `/testing`: return `true` for configured mock pages unless explicit page info marks the page as missing.

`page.exists()` should not fetch page text.

## Page relationship methods

Add:

```ts
await page.categories();
await page.templates();
await page.links();
```

These methods return page titles as strings.

Expected behavior:

- `page.categories()` returns category page titles, including the category namespace prefix where the runtime provides it.
- `page.templates()` returns template page titles.
- `page.links()` returns linked page titles.

Runtime mapping:

- `/mw`: query the Action API page relationship props through `mw.Api`.
- `/mwn`: delegate to the corresponding mwn page helpers where practical.
- `/testing`: return configured relationship arrays, or empty arrays when no relationship data is configured.

These methods should not silently expose only the first MediaWiki batch. If an adapter uses a paginated API response, it must either handle continuation for this method or document a deliberate limitation before implementation.

## `/testing` API

Extend the mock wiki without replacing the existing `pages` text map:

```ts
const wiki = createMockWiki({
  pages: {
    'Wikipedia:Sandbox': 'Hello'
  },
  pageInfo: {
    'Wikipedia:Sandbox': {
      title: 'Wikipedia:Sandbox',
      pageId: 1,
      namespace: 4,
      exists: true
    }
  },
  categories: {
    'Wikipedia:Sandbox': ['Category:Tests']
  },
  templates: {
    'Wikipedia:Sandbox': ['Template:Sandbox notice']
  },
  links: {
    'Wikipedia:Sandbox': ['Help:Contents']
  }
});
```

The exact mock config names may be adjusted during implementation if a simpler shape emerges, but the mock should stay deterministic and runtime-independent.

## Tests required

Add or extend tests in these categories:

```text
tests/contract/
tests/runtimes/mw/
tests/runtimes/mwn/
tests/testing/
```

Minimum tests:

- `MockWiki` satisfies the updated `Page` contract.
- `page.info()` returns normalized page info.
- `page.exists()` is consistent with `page.info().exists`.
- `page.categories()` returns configured category titles.
- `page.templates()` returns configured template titles.
- `page.links()` returns configured linked page titles.
- `/mw` adapter tests verify expected fake API calls and response normalization.
- `/mwn` adapter tests verify delegation to fake mwn page/query helpers.
- import boundary tests still pass.

## Definition of done

This milestone is done when:

- `page.info()` is implemented for `/mw`, `/mwn`, and `/testing`;
- `page.exists()` is implemented for `/mw`, `/mwn`, and `/testing`;
- `page.categories()` is implemented for `/mw`, `/mwn`, and `/testing`;
- `page.templates()` is implemented for `/mw`, `/mwn`, and `/testing`;
- `page.links()` is implemented for `/mw`, `/mwn`, and `/testing`;
- shared contract tests cover all new page-read methods;
- runtime adapter tests verify fake runtime calls and response normalization;
- docs match the implemented API shape;
- typecheck, build, tests, and Biome check pass.
