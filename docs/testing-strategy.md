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
  postWithToken: vi.fn(),
};
```

For `/mwn`, use a fake `mwn`-like object:

```ts
const fakeBot = {
  request: vi.fn(),
  Page: vi.fn(),
};
```

Adapter tests should verify mapping, not live network behavior.

#### Browser-console reference checks

For `/mw` APIs, it is useful to check behavior directly in a MediaWiki browser console before designing the Composite wrapper.

These checks provide ground-truth examples of:

- request parameter shape;
- raw `mw.Api` response shape;
- normalization and redirect behavior;
- token/edit behavior;
- frontend runtime limitations.

Browser-console checks are research references, not automated tests. The normal test suite should still use fakes and must not depend on live Wikimedia sites, login state, or network availability.

When a browser-console observation informs a fake response, keep the fixture small and focused. Add a short comment when the observed shape is important for future review.

### 3. Contract tests

Create a shared test suite for the `Wiki` and `Page` contracts, then run it against multiple implementations.

Example shape:

```ts
export function describeWikiContract(name: string, createWiki: () => Wiki) {
  describe(name, () => {
    it('creates a page object', () => {
      const wiki = createWiki();
      const page = wiki.page('Wikipedia:Sandbox');

      expect(page.title()).toBe('Wikipedia:Sandbox');
    });

    it('reads page text', async () => {
      const wiki = createWiki();
      const text = await wiki.page('Wikipedia:Sandbox').text();

      expect(text).toBe('Hello');
    });
  });
}
```

Then run:

```ts
describeWikiContract('mock runtime', createMockWiki);
describeWikiContract('mw runtime', createMockedMwWiki);
describeWikiContract('mwn runtime', createMockedMwnWiki);
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

Import:

```ts
import { createMockWiki } from '@taxonlabs/composite/testing';
```

Example usage:

```ts
const wiki = createMockWiki({
  pages: {
    'Wikipedia:Sandbox': 'Hello world',
  },
});

const text = await wiki.page('Wikipedia:Sandbox').text();
```

This is useful for Taxon Labs applications that want to test logic against the `Wiki` interface without contacting a real wiki.

## Milestone test scope

Keep milestone tests small. The goal is to lock down architecture and adapter contracts one vertical slice at a time, not to test the whole SDK up front.

Each milestone document should define its own exact test checklist. This strategy document only defines the durable pattern:

- add or extend contract tests for new shared API behavior;
- add `/mw` adapter tests for request shape and response normalization;
- add `/mwn` adapter tests for delegation and response normalization;
- add `/testing` tests when mock behavior changes;
- keep import and bundle boundary tests passing;
- avoid live integration tests unless the milestone explicitly requires them.

When a milestone touches an existing API, update the existing contract and adapter tests instead of creating a parallel milestone-only test suite.
