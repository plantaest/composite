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

Planned package entry points:

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
import type { Wiki, Page, User, Wikis } from '@taxonlabs/composite';
import { CompositeError } from '@taxonlabs/composite';
```

Runtime-specific code must import a runtime explicitly.

## MediaWiki frontend runtime

For user scripts, gadgets, and frontend applications running inside MediaWiki:

```ts
import { Composite } from '@taxonlabs/composite/mw';

const wiki = Composite.current({
  apiUserAgent: 'Composite/0.1'
});

const text = await wiki.page('Wikipedia:Sandbox').text();
```

Cross-wiki access in the frontend runtime should use an explicit connection:

```ts
import { Composite } from '@taxonlabs/composite/mw';

const testwiki = Composite.connect({
  wikiId: 'testwiki',
  serverName: 'test.wikipedia.org',
  apiUserAgent: 'Composite/0.1'
});
```

## Node.js / Toolforge runtime

For bots, services, and server-side applications:

```ts
import { Composite } from '@taxonlabs/composite/mwn';

const wiki = await Composite.create({
  apiUrl: 'https://test.wikipedia.org/w/api.php',
  username: process.env.BOT_USERNAME,
  password: process.env.BOT_PASSWORD,
  userAgent: 'Composite/0.1'
});

const text = await wiki.page('Wikipedia:Sandbox').text();
```

Composite should also support wrapping an existing `mwn` instance:

```ts
import { Composite } from '@taxonlabs/composite/mwn';

const wiki = Composite.from(bot);
```

## Shared application code

Application logic should depend on the core interfaces, not on a concrete runtime:

```ts
import type { Wiki } from '@taxonlabs/composite';

export async function readPage(wiki: Wiki, title: string) {
  return wiki.page(title).text();
}
```

Frontend and server entry points create the runtime-specific `Wiki`; shared code consumes the common interface.

## Documentation

Start with `docs/README.md` for the documentation map.

The active implementation scope lives in `docs/milestones/`. Roadmap documents such as `docs/capabilities.md` and `docs/api-mapping.md` describe direction, but milestone documents define the next concrete slice.

## License

MIT. See `LICENSE`.
