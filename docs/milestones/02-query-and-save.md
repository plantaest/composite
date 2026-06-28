# Request, Query, and Save Milestone

This document defines the second implementation milestone after the first Composite skeleton.

Status: completed.

Read this together with:

- `../capabilities.md` for the long-term capability roadmap.
- `../api-mapping.md` for provisional runtime adapter mapping.
- `../runtime-support.md` for runtime support labels and matrix.

The goal is to add the first practical low-level API capability and the first write capability, while keeping the runtime adapter boundary small and testable.

This milestone is limited to the APIs and behavior listed below.

## Goal

Create a focused read/write vertical slice that demonstrates:

- low-level API requests through the shared `Wiki` interface;
- page saving through the shared `Page` interface;
- adapter mapping for `/mw` and `/mwn`;
- mock/testing support for downstream application tests;
- explicit runtime documentation for permission- and session-dependent behavior.

## Public API additions

Add these methods to the core interfaces:

```ts
export interface Wiki {
  runtime(): Runtime;
  page(title: string): Page;
  request(params: WikiRequestParams): Promise<WikiRequestResponse>;
  query(params: WikiQueryParams): Promise<WikiQueryResponse>;
}

export interface Page {
  title(): string;
  text(): Promise<string>;
  save(text: string, summary?: string, options?: PageSaveOptions): Promise<PageSaveResult>;
}
```

Add lightweight shared types:

```ts
export type WikiRequestParams = Record<
  string,
  string | number | boolean | string[] | number[] | Date | File | undefined
>;

export interface WikiRequestResponse {
  [key: string]: unknown;
}

export type WikiQueryParams = WikiRequestParams;

export interface WikiQueryResponse extends WikiRequestResponse {
  batchcomplete?: true;
  continue?: {
    continue: string;
    [key: string]: string;
  };
  query?: Record<string, unknown>;
}

export interface PageSaveOptions {
  minor?: boolean;
}

export interface PageSaveResult {
  title: string;
}
```

These types may become stricter later. The second milestone should prefer a simple shared contract over an early comprehensive MediaWiki API type model.

## `wiki.request(params)`

`wiki.request(params)` is the generic Action API request primitive for early Composite APIs.

Expected behavior:

```ts
const response = await wiki.request({
  action: 'parse',
  page: 'Wikipedia:Sandbox'
});
```

Runtime mapping:

- `/mw`: delegate to `mw.Api#get(params)`.
- `/mwn`: delegate to `Mwn#request(params)`.
- `/testing`: return configured mock request responses.

In this milestone, `wiki.request()` is GET-like and read-oriented. Token-based write APIs such as `page.save()` should keep using their own adapter-specific write path.

## `wiki.query(params)`

`wiki.query(params)` is an mwn-style convenience helper for Action API `action=query` read requests.

Expected behavior:

```ts
const response = await wiki.query({
  meta: 'siteinfo'
});
```

Runtime mapping:

- `/mw`: call `wiki.request(Object.assign({ action: 'query' }, params))`.
- `/mwn`: call `wiki.request(Object.assign({ action: 'query' }, params))`.
- `/testing`: call `wiki.request(Object.assign({ action: 'query' }, params))`.

Callers should not override `action`; use `wiki.request(params)` for non-query actions. Composite does not validate this in the second milestone.

The method should not perform live requests in tests. Adapter tests should use fake runtime objects.

## `page.save(text, summary?, options?)`

`page.save()` is the first write method on `Page`.

Expected behavior:

```ts
await wiki.page('Wikipedia:Sandbox').save('Hello', 'Testing Composite');
```

Runtime mapping:

- `/mw`: use the current browser session and edit token support through MediaWiki frontend facilities.
- `/mwn`: delegate to the corresponding mwn page save behavior.
- `/testing`: update the mock page text and return a minimal result.

This method is portable in API shape, but depends on the active user's rights, tokens, edit restrictions, and runtime session state.

## `/mw` adapter details

For `wiki.request(params)`:

```ts
api.get(params)
```

For `wiki.query(params)`:

```ts
wiki.request(Object.assign({ action: 'query' }, params))
```

For `page.save(text, summary?, options?)`, use an `mw.Api`-compatible edit request. The exact request shape should be documented in the implementation tests.

The first implementation may support only:

```ts
{
  action: 'edit',
  title,
  text,
  summary,
  minor
}
```

Do not implement advanced edit options yet.

## `/mwn` adapter details

For `wiki.request(params)`:

```ts
bot.request(params)
```

For `wiki.query(params)`:

```ts
wiki.request(Object.assign({ action: 'query' }, params))
```

For `page.save(text, summary?, options?)`, delegate to the mwn page object.

Prefer the mwn naming and semantics where practical. If mwn supports more save options than Composite exposes, keep the Composite surface small and map only documented options.

## `/testing` API

Extend the mock wiki to support:

```ts
const wiki = createMockWiki({
  pages: {
    'Wikipedia:Sandbox': 'Hello'
  },
  requests: [
    {
      match: {
        action: 'query',
        meta: 'siteinfo'
      },
      response: {
        query: {
          general: {
            sitename: 'Wikipedia'
          }
        }
      }
    }
  ]
});
```

Required behavior:

```ts
await wiki.request({ action: 'parse', page: 'Wikipedia:Sandbox' });
await wiki.query({ meta: 'siteinfo' });
await wiki.page('Wikipedia:Sandbox').save('Updated', 'Test edit');
await wiki.page('Wikipedia:Sandbox').text() === 'Updated';
```

The mock request design may be simplified during implementation, but it must remain deterministic and runtime-independent.

## Tests required

Add or extend tests in these categories:

```text
tests/core/
tests/contract/
tests/runtimes/mw/
tests/runtimes/mwn/
tests/testing/
```

Minimum tests:

- `MockWiki` satisfies the updated `Wiki` and `Page` contract.
- `/mw` `wiki.request(params)` delegates to fake `api.get(params)`.
- `/mwn` `wiki.request(params)` delegates to fake `bot.request(params)`.
- `/mw` `wiki.query(params)` delegates through `wiki.request(Object.assign({ action: 'query' }, params))`.
- `/mwn` `wiki.query(params)` delegates through `wiki.request(Object.assign({ action: 'query' }, params))`.
- `/mw` `page.save()` maps to the expected fake API edit request.
- `/mwn` `page.save()` delegates to the fake mwn page object.
- `/testing` `wiki.request()` returns configured mock request responses.
- `/testing` `page.save()` updates mock page text.
- import boundary tests still pass.

## Definition of done

This milestone is done when:

- `wiki.request(params)` is implemented for `/mw`, `/mwn`, and `/testing`;
- `wiki.query(params)` is implemented for `/mw`, `/mwn`, and `/testing`;
- `page.save(text, summary?, options?)` is implemented for `/mw`, `/mwn`, and `/testing`;
- shared contract tests cover request, query, and save behavior;
- runtime adapter tests verify fake runtime calls;
- docs match the implemented API shape;
- typecheck, build, tests, and Biome check pass.
