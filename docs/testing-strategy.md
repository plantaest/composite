# Testing Strategy

Composite should test its own abstraction, not re-test MediaWiki, `mw.Api`, or `mwn`.

The guiding rule:

```text
Trust mw.* and mwn at the low level, but test Composite adapters and contracts.
```

## What must be tested

Composite should test that:

- the same core API behaves consistently across runtimes;
- runtime adapters map Composite methods to the expected underlying runtime calls;
- unsupported APIs fail explicitly;
- errors are normalized where Composite promises normalization;
- root imports and runtime imports respect dependency boundaries;
- `/testing` mock utilities behave like the core contract.

## What does not need to be tested early

Do not spend early effort testing that:

- `mwn` itself talks to MediaWiki correctly;
- `mw.Api` itself talks to MediaWiki correctly;
- real Wikimedia sites are available;
- edit permissions and live authentication work in CI.

Real integration tests can be added later.

## Test layers

### 1. Core tests

Test core types, errors, and lightweight utilities.

Examples:

```text
CompositeError
UnsupportedRuntimeError
RuntimeType
```

### 2. Adapter tests

Test runtime adapters using fake runtime objects.

For `/mw`, use a fake `mw.Api`-like object:

```ts
const fakeApi = {
  get: vi.fn(),
  post: vi.fn(),
  postWithToken: vi.fn()
};
```

For `/mwn`, use a fake `mwn`-like object:

```ts
const fakeBot = {
  query: vi.fn(),
  Page: vi.fn()
};
```

Adapter tests should verify mapping, not live network behavior.

### 3. Contract tests

Create a shared test suite for the `Wiki` and `Page` contracts, then run it against multiple implementations.

Example shape:

```ts
export function describeWikiContract(name: string, createWiki: () => Wiki) {
  describe(name, () => {
    it("creates a page object", () => {
      const wiki = createWiki();
      const page = wiki.page("Wikipedia:Sandbox");

      expect(page.title()).toBe("Wikipedia:Sandbox");
    });

    it("reads page text", async () => {
      const wiki = createWiki();
      const text = await wiki.page("Wikipedia:Sandbox").text();

      expect(text).toBe("Hello");
    });
  });
}
```

Then run:

```ts
describeWikiContract("mock runtime", createMockWiki);
describeWikiContract("mw runtime", createMockedMwWiki);
describeWikiContract("mwn runtime", createMockedMwnWiki);
```

### 4. Wikitext utility tests

Wikitext utilities are pure functions and should be tested directly.

Examples:

```text
parseTemplates
parseLinks
parseSections
```

### 5. Import and bundle boundary tests

At minimum, enforce architecture rules:

```text
src/index.ts must not import runtimes
src/runtimes/mw/** must not import mwn
src/runtimes/mw/** must not import src/runtimes/mwn/**
src/wikitext/** must not import runtimes
```

Later, add bundle-size or bundle-composition checks if needed.

### 6. Integration tests

Real integration tests should come later, after the API shape is stable.

They may require:

- test wiki page;
- bot password or OAuth credentials;
- CI secrets;
- rate-limit awareness;
- cleanup logic.

Do not make live integration tests a blocker for the first milestone.

## `/testing` module

Composite should provide testing utilities for downstream applications.

Planned import:

```ts
import { createMockWiki } from "@taxonlabs/composite/testing";
```

Example usage:

```ts
const wiki = createMockWiki({
  pages: {
    "Wikipedia:Sandbox": "Hello world"
  }
});

const text = await wiki.page("Wikipedia:Sandbox").text();
```

This is useful for Taxon Labs applications that want to test logic against the `Wiki` interface without contacting a real wiki.

## Milestone test coverage

Keep tests small. The goal is to lock down architecture and adapter contracts one vertical slice at a time, not to test the whole SDK up front.

### Foundation tests

The foundation milestone should include tests for:

```text
Root/core:
- root import does not expose runtime factories
- RuntimeType
- UnsupportedRuntimeError

/mw:
- Composite.current(config)
- Composite.connect(config)
- Composite.from(api, config)
- wiki.runtime().type === "mw"
- wiki.page(title).title()
- page.text() maps to mw.Api request shape

/mwn:
- Composite.create(config) or Composite.from(bot)
- wiki.runtime().type === "mwn"
- wiki.page(title).title()
- page.text() delegates to mwn page.text()

/testing:
- createMockWiki()
- mock page.title()
- mock page.text()
```

### Query and save tests

The query and save milestone should include tests for:

```text
Contract:
- wiki.query(params) returns the configured query response
- page.save(text, summary?, options?) returns a minimal save result

/mw:
- wiki.query(params) maps to mw.Api#get
- page.save(text, summary?, options?) maps to an edit request with a CSRF token
- page.save(text) omits summary from the edit request

/mwn:
- wiki.query(params) delegates to mwn query()
- page.save(text, summary?, options?) delegates to mwn page.save()
- page.save(text) works without a summary

/testing:
- mock wiki.query()
- mock page.save()
- mock page.save() updates stored page text
```
