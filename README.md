# Composite

Composite is a runtime-aware, mwn-shaped MediaWiki SDK for TypeScript.

It provides a stable application-facing API for interacting with MediaWiki from different execution environments. The initial runtimes are:

- `mw`: a MediaWiki frontend runtime for user scripts, gadgets, and in-wiki frontend applications.
- `mwn`: a Node.js / Toolforge runtime backed by the `mwn` library.

Composite does not try to replace `mw.Api` or `mwn`. Instead, it defines a shared API boundary so application code can be written against common `Wiki`, `Page`, `User`, and related interfaces.

## Design summary

Composite is:

- **mwn-shaped**: API names and object model should follow `mwn` where practical.
- **runtime-aware**: not every API is available in every runtime.
- **single-package**: distributed as one npm package with explicit subpath exports.
- **bundle-conscious**: frontend imports must not pull server-only dependencies.
- **Taxon-controlled**: `mwn` is the main API reference, but Composite owns its API policy.

## Public entry points

Package entry points:

```ts
@taxonlabs/composite
@taxonlabs/composite/mw
@taxonlabs/composite/mwn
@taxonlabs/composite/wikitext
@taxonlabs/composite/streams
@taxonlabs/composite/testing
```

The root import is intentionally lightweight:

```ts
import type { Wiki, Page, User, WikiRegistry } from '@taxonlabs/composite';
import { CompositeError } from '@taxonlabs/composite';
```

Runtime-specific code must import a runtime explicitly.

## MediaWiki frontend runtime

For user scripts, gadgets, and frontend applications running inside MediaWiki:

```ts
import { MwWiki } from '@taxonlabs/composite/mw';

const wiki = MwWiki.create({
  apiUserAgent: 'Composite/0.1.0'
});

const page = wiki.page('Wikipedia:Sandbox');
const text = await page.text();

await page.save(text, 'Testing Composite');
```

To access another wiki from the frontend runtime, create an `MwWiki` with `serverName`:

```ts
import { MwWiki } from '@taxonlabs/composite/mw';

const testwiki = MwWiki.create({
  wikiId: 'testwiki',
  serverName: 'test.wikipedia.org',
  apiUserAgent: 'Composite/0.1.0'
});
```

## Node.js / Toolforge runtime

For bots, services, and server-side applications:

```ts
import { MwnWiki } from '@taxonlabs/composite/mwn';

const wiki = await MwnWiki.create({
  serverName: 'test.wikipedia.org',
  username: process.env.BOT_USERNAME,
  password: process.env.BOT_PASSWORD,
  userAgent: 'Composite/0.1.0'
});

const page = wiki.page('Wikipedia:Sandbox');
const text = await page.text();

await page.save(text, 'Testing Composite');
```

Composite also supports wrapping an existing `mwn` instance:

```ts
import { MwnWiki } from '@taxonlabs/composite/mwn';

const wiki = MwnWiki.from(bot);
```

## Shared application code

Application logic should depend on the core interfaces, not on a concrete runtime:

```ts
import type { Wiki } from '@taxonlabs/composite';

export async function readPage(wiki: Wiki, title: string) {
  return wiki.page(title).text();
}

export async function readSiteInfo(wiki: Wiki) {
  return wiki.query({
    meta: 'siteinfo'
  });
}
```

Frontend and server entry points create the runtime-specific `Wiki`; shared code consumes the common interface.

## Documentation

Start with `docs/README.md` for the documentation map.

The active implementation scope lives in `docs/milestones/`. Roadmap documents such as `docs/capabilities.md` and `docs/api-mapping.md` describe direction, but milestone documents define the next concrete slice.

## License

MIT. See `LICENSE`.
