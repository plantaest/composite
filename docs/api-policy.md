# API Policy

This document defines how Composite APIs should be designed.

Composite is a runtime-aware, mwn-shaped MediaWiki SDK. Its API should feel familiar to users of `mwn`, while remaining portable enough to support both MediaWiki frontend and Node.js / Toolforge runtimes.

## Primary rule

Use `mwn` as the primary API reference, but do not clone it blindly.

Composite should follow `mwn` when:

- the method name is natural;
- the concept exists in both frontend and server runtimes;
- the semantics can be implemented consistently;
- the API is useful for Taxon Labs applications.

Composite may diverge when:

- the method is server-only;
- the method relies on Node.js filesystem, cookies, user agent, process, or other server concepts;
- the method is not realistic in MediaWiki frontend runtime;
- the method would make frontend bundles unnecessarily heavy;
- Taxon Labs needs a clearer domain API.

## API style

Prefer mwn-like names:

```ts
wiki.page(title)
wiki.user(name)
wiki.query(params)
wiki.request(params)
wiki.search(query, options)
wiki.sparqlQuery(query, endpoint)
wiki.runtime()

page.text()
page.save(text, summary?, options?)
page.edit(transform, config)
page.history(props, limit, options)
page.historyGen(props, options)
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

Avoid adding aliases unless a strong need appears:

```ts
// Avoid in early versions
page.getText()
page.getRevisions()
page.editText()
```

One concept should have one primary name.

## Core domain objects

Initial core interfaces:

```ts
Wiki
Page
User
Wikis
Runtime
```

Future interfaces may include:

```ts
Revision
File
Title
Category
```

Avoid creating too many domain objects early. Prefer methods on `Wiki`, `Page`, and `User` unless a concept clearly deserves its own interface.

## Runtime entry point API

The root package must not create runtime instances.

MediaWiki frontend runtime:

```ts
import { Composite } from "@taxonlabs/composite/mw";

const currentWiki = Composite.current(config);
const connectedWiki = Composite.connect(config);
const wrappedWiki = Composite.from(api, config);
const wikis = Composite.wikis({
  wikis: {
    testwiki: {
      serverName: "test.wikipedia.org"
    }
  }
});
```

Node.js / Toolforge runtime:

```ts
import { Composite } from "@taxonlabs/composite/mwn";

const wiki = await Composite.create(config);
const wrappedWiki = Composite.from(bot, config);
const wikis = await Composite.wikis({
  wikis: {
    testwiki: {
      apiUrl: "https://test.wikipedia.org/w/api.php"
    }
  }
});
```

## Runtime escape hatch

Every `Wiki` should expose runtime information:

```ts
const runtime = wiki.runtime();
```

Example:

```ts
if (runtime.type === "mw") {
  // Access frontend runtime facilities if needed.
}

if (runtime.type === "mwn") {
  // Access wrapped mwn bot if needed.
}
```

The purpose of `runtime()` is to avoid wrapping every runtime-specific capability immediately while keeping the public API honest.

## API categories

Composite APIs should be classified into these categories.

### Core portable APIs

Expected to work in both `/mw` and `/mwn`.

Examples:

```ts
wiki.page(title)
wiki.user(name)
wiki.query(params)
page.text()
page.save(text, summary?, options?)
page.history()
user.info()
```

### Server-first APIs

Supported by `/mwn`; possible but not guaranteed in `/mw`.

Examples:

```ts
wiki.batchOperation()
wiki.continuedQueryGen()
```

### Server-only APIs

Not expected to work in `/mw`.

Examples:

```ts
wiki.login()
wiki.download()
wiki.downloadFromUrl()
wiki.setRequestOptions()
wiki.enableEmergencyShutoff()
```

### Frontend-specific APIs

Only meaningful in MediaWiki frontend context.

Examples:

```ts
Composite.current()
Composite.connect()
```

### Utility APIs

Pure functions or helpers that should not depend on a runtime.

Examples:

```ts
parseTemplates(text)
parseLinks(text)
parseSections(text)
```

### Future large domains

May become separate subpaths later.

Examples:

```ts
parsoid
wikibase
oauth
```

## Design rule for new APIs

Before adding a public API, answer:

1. Is there an equivalent or similar API in `mwn`?
2. Is it portable across `/mw` and `/mwn`?
3. If not portable, should it be server-only, frontend-only, partial, future, or excluded?
4. Does it belong on `Wiki`, `Page`, `User`, a utility subpath, or a future domain module?
5. Will it increase frontend bundle size?
6. Can it be tested with adapter and contract tests?

If these questions are unclear, do not implement the API yet.
