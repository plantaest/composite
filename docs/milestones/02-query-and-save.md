# Query and Save Milestone

This document defines the next implementation milestone after the first Composite skeleton.

Read this together with:

- `../capabilities.md` for the long-term capability roadmap.
- `../api-mapping.md` for provisional runtime adapter mapping.
- `../runtime-support.md` for runtime support labels and matrix.

The goal is to add the first practical low-level API capability and the first write capability, while keeping the runtime adapter boundary small and testable.

Do not implement broad MediaWiki coverage in this milestone.

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
export type WikiQueryParams = Record<
  string,
  string | number | boolean | string[] | number[] | Date | File | undefined
>;

export interface WikiQueryResponse {
  batchcomplete?: true;
  continue?: {
    continue: string;
    [key: string]: string;
  };
  query?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface PageSaveOptions {
  minor?: boolean;
}

export interface PageSaveResult {
  title: string;
}
```

These types may become stricter later. The second milestone should prefer a simple shared contract over an early comprehensive MediaWiki API type model.

## `wiki.query(params)`

`wiki.query(params)` is a low-level escape hatch for supported read requests.

Expected behavior:

```ts
const response = await wiki.query({
  action: "query",
  meta: "siteinfo"
});
```

Runtime mapping:

- `/mw`: delegate to `mw.Api#get(params)`.
- `/mwn`: delegate to `Mwn#query(params)`.
- `/testing`: return configured mock query responses.

The method should not perform live requests in tests. Adapter tests should use fake runtime objects.

## `page.save(text, summary?, options?)`

`page.save()` is the first write method on `Page`.

Expected behavior:

```ts
await wiki.page("Wikipedia:Sandbox").save("Hello", "Testing Composite");
```

Runtime mapping:

- `/mw`: use the current browser session and edit token support through MediaWiki frontend facilities.
- `/mwn`: delegate to the corresponding mwn page save behavior.
- `/testing`: update the mock page text and return a minimal result.

This method is portable in API shape, but depends on the active user's rights, tokens, edit restrictions, and runtime session state.

## `/mw` adapter details

For `wiki.query(params)`:

```ts
api.get(params)
```

For `page.save(text, summary?, options?)`, use an `mw.Api`-compatible edit request. The exact request shape should be documented in the implementation tests.

The first implementation may support only:

```ts
{
  action: "edit",
  title,
  text,
  summary,
  minor
}
```

Do not implement advanced edit options yet.

## `/mwn` adapter details

For `wiki.query(params)`:

```ts
bot.query(params)
```

For `page.save(text, summary?, options?)`, delegate to the mwn page object.

Prefer the mwn naming and semantics where practical. If mwn supports more save options than Composite exposes, keep the Composite surface small and map only documented options.

## `/testing` API

Extend the mock wiki to support:

```ts
const wiki = createMockWiki({
  pages: {
    "Wikipedia:Sandbox": "Hello"
  },
  queries: [
    {
      match: {
        action: "query",
        meta: "siteinfo"
      },
      response: {
        query: {
          general: {
            sitename: "Wikipedia"
          }
        }
      }
    }
  ]
});
```

Required behavior:

```ts
await wiki.query({ action: "query", meta: "siteinfo" });
await wiki.page("Wikipedia:Sandbox").save("Updated", "Test edit");
await wiki.page("Wikipedia:Sandbox").text() === "Updated";
```

The mock query design may be simplified during implementation, but it must remain deterministic and runtime-independent.

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
- `/mw` `wiki.query(params)` delegates to fake `api.get(params)`.
- `/mwn` `wiki.query(params)` delegates to fake `bot.query(params)`.
- `/mw` `page.save()` maps to the expected fake API edit request.
- `/mwn` `page.save()` delegates to the fake mwn page object.
- `/testing` `page.save()` updates mock page text.
- import boundary tests still pass.

## Documentation updates

Update these docs when implementing this milestone:

- `README.md`
- `docs/api-policy.md`
- `docs/runtime-support.md`
- `docs/testing-strategy.md`

The runtime support matrix should move these APIs from `future` to supported:

```text
wiki.query(params)
page.save(text, summary?, options?)
```

## Not in this milestone

Do not implement these yet:

```text
wiki.request()
page.edit()
page.history()
page.categories()
page.templates()
page.links()
page.backlinks()
page.logs()
page.purge()
wiki.search()
wiki.sparqlQuery()
user.info()
user.contribs()
real integration tests against Wikimedia sites
```

`wiki.request()` should wait until the distinction between `query` and `request` is clearly defined.

## Definition of done

This milestone is done when:

- `wiki.query(params)` is implemented for `/mw`, `/mwn`, and `/testing`;
- `page.save(text, summary?, options?)` is implemented for `/mw`, `/mwn`, and `/testing`;
- shared contract tests cover query and save behavior;
- runtime adapter tests verify fake runtime calls;
- docs match the implemented API shape;
- typecheck, build, tests, Biome check, and package audit pass.
