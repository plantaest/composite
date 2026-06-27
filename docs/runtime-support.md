# Runtime Support

Composite supports multiple runtimes behind a shared API.

Initial runtimes:

- `mw`: MediaWiki frontend runtime using `mw.Api`, `mw.ForeignApi`, `mw.config`, `mw.user`, and related frontend facilities.
- `mwn`: Node.js / Toolforge runtime backed by the `mwn` library.

Runtime support must be explicit. Do not assume an API works everywhere.

## Support labels

Use these labels in documentation and implementation decisions:

| Label | Meaning |
|---|---|
| `supported` | Expected to work in this runtime. |
| `partial` | Works with limitations or a reduced feature set. |
| `frontend-only` | Only meaningful in the `mw` runtime. |
| `server-only` | Only meaningful in the `mwn` runtime. |
| `future` | Planned but not implemented yet. |
| `unsupported` | Not supported and not planned for this runtime. |

## Initial runtime matrix

This matrix is provisional. It should be updated as APIs are implemented.

| Capability | Proposed API | `mw` runtime | `mwn` runtime | Notes |
|---|---|---:|---:|---|
| Runtime info | `wiki.runtime()` | supported | supported | Must identify runtime `type`. |
| Current wiki | `Composite.current()` | frontend-only | unsupported | Only natural inside MediaWiki frontend. |
| Connect wiki | `Composite.connect(config)` | frontend-only | unsupported | Requires an explicit server name and `mw.ForeignApi`. |
| Create wiki | `Composite.create(config)` | unsupported | server-only | Creates or initializes an `mwn`-backed wiki. |
| Wrap runtime | `Composite.from(...)` | supported | supported | Wrap `mw.Api` / `mw.ForeignApi` or `mwn` instance. |
| Multi-wiki manager | `Composite.wikis(config)` | supported | supported | May be sync in `/mw`, async in `/mwn`. |
| Page object | `wiki.page(title)` | supported | supported | Core portable API. |
| User object | `wiki.user(name)` | future | future | Core portable API, not first milestone. |
| Query | `wiki.query(params)` | future | future | Should map to `mw.Api` and `mwn.query`. |
| Request | `wiki.request(params)` | future | future | Exact distinction from `query` must be defined. |
| Page title | `page.title()` | supported | supported | First milestone. |
| Page text | `page.text()` | supported | supported | First milestone. |
| Save page | `page.save(text, summary, options)` | future | future | Portable if user has rights and token/session are available. |
| Edit transform | `page.edit(transform, config)` | future | future | Should follow mwn semantics where practical. |
| Page history | `page.history(...)` | future | future | Portable. |
| Page history generator | `page.historyGen(...)` | partial | supported | Generator semantics may differ in frontend. |
| Categories | `page.categories()` | future | future | Portable. |
| Templates | `page.templates()` | future | future | Portable. |
| Links | `page.links()` | future | future | Portable. |
| Backlinks | `page.backlinks()` | future | future | Portable. |
| Subpages | `page.subpages()` | future | future | Portable with namespace rules. |
| Logs | `page.logs()` | future | future | Portable. |
| Purge | `page.purge()` | future | future | Portable. |
| Search | `wiki.search(query, options)` | future | future | Portable. |
| SPARQL | `wiki.sparqlQuery(query, endpoint)` | future | future | May use fetch in `/mw`, delegate to mwn in `/mwn`. |
| Upload | `wiki.upload(...)` | partial | future | Frontend behavior may differ. |
| Download | `wiki.download(...)` | unsupported | server-only | Filesystem-oriented. |
| Login | `wiki.login(...)` | unsupported | server-only | Frontend uses current browser session. |
| Logout | `wiki.logout(...)` | unsupported | server-only | Frontend should not emulate bot session behavior. |
| User info | `user.info()` | future | future | Portable. |
| User contribs | `user.contribs()` | future | future | Portable. |
| User options | `wiki.userinfo()` / option APIs | future | future | Needs careful design. |
| EventStreams | `wiki.eventStreams(...)` or `/streams` | future | future | Custom module; not primarily mwn-shaped. |
| Wikitext utils | `/wikitext` functions | supported | supported | Pure utilities, runtime-independent. |
| Testing mock | `/testing` | supported | supported | Runtime-independent mock utilities. |

## Unsupported runtime behavior

If an API is not supported by the current runtime, it should fail explicitly.

Preferred behavior:

```ts
throw new UnsupportedRuntimeError({
  api: "wiki.download",
  runtime: "mw"
});
```

Do not silently no-op unsupported APIs unless the API contract explicitly permits no-op behavior.

## Runtime-specific access

Use `wiki.runtime()` when application code needs access to the underlying runtime.

This is acceptable for application boundary code, but shared application logic should depend on core interfaces where possible.
