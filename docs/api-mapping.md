# Composite API Mapping

This document maps planned Composite APIs to their expected runtime adapters.

This is a roadmap document, not a guarantee that every listed API is implemented or committed for the next milestone. Current milestone documents in `docs/milestones/` and source code are the authority for active implementation work.

It should be read together with:

- `capabilities.md`: capability roadmap.
- `runtime-support.md`: runtime availability matrix.
- `api-policy.md`: API naming and design policy.
- `imports-and-bundling.md`: package boundary and bundle-size policy.

Composite is **mwn-shaped**, but it is not a full clone of mwn. The mappings below are provisional and should be verified against the actual mwn API and MediaWiki frontend API during implementation.

## Mapping labels

| Label | Meaning |
|---|---|
| `supported` | Expected to work in this runtime. |
| `partial` | Expected to work with limitations. |
| `frontend-only` | Only meaningful in the `mw` runtime. |
| `server-only` | Only meaningful in the `mwn` runtime. |
| `future` | Planned, but not needed soon. |
| `unsupported` | Not supported and not planned for this runtime. |
| `needs-design` | Capability is valid, but API shape or adapter behavior is not settled. |

## Implementation status labels

| Status | Meaning |
|---|---|
| `not-started` | No implementation yet. |
| `scaffolded` | Types/classes/exports exist, but implementation is incomplete. |
| `implemented` | Runtime implementation exists. |
| `tested` | Covered by unit/adapter/contract tests. |
| `blocked` | Waiting on a design or runtime decision. |
| `defer` | Intentionally delayed. |

## Test labels

| Label | Meaning |
|---|---|
| `unit` | Tests pure logic or small functions. |
| `adapter` | Tests mapping to mocked `mw` or `mwn`. |
| `contract` | Shared behavior test across multiple runtimes. |
| `integration` | Real wiki/API test; not required early. |
| `bundle` | Ensures import paths do not pull unwanted dependencies. |

## Adapter assumptions

- `/mw` should use `mw.Api`, `mw.ForeignApi`, `mw.config`, `mw.user`, `mw.Title`, `mw.Rest`, or `fetch` where appropriate.
- `/mwn` should delegate to mwn wherever practical.
- Shared app logic should depend on root core interfaces, not on runtime-specific objects.
- Unsupported runtime behavior must throw `UnsupportedRuntimeError` unless the API contract explicitly permits otherwise.
- Root import must not export runtime factories or import runtime dependencies.

---

# Runtime and wiki management

| Capability | Composite API | MW adapter | MWN adapter | Support | Status | Tests | Notes |
|---|---|---|---|---|---|---|---|
| Runtime information | `wiki.runtime()` | Return `{ type: "mw" }` | Return `{ type: "mwn" }` | both | tested | unit, contract | Keep runtime access explicit and narrow. |
| Current wiki | `Composite.current(config?)` | Build a wiki from current `mw.config`, `mw.user`, and `new mw.Api()` | unsupported | frontend-only | tested | adapter | Main frontend entrypoint. |
| Connect frontend wiki | `Composite.connect(config)` | Requires `serverName` and uses `mw.ForeignApi` | unsupported | frontend-only | tested | adapter | Needed for cross-wiki frontend tools. |
| Create mwn wiki | `Composite.create(config)` | unsupported | Initialize an mwn instance with `Mwn.init(config)` | server-only | implemented | adapter | Main server entrypoint; live behavior is not integration-tested yet. |
| Wrap runtime client | `Composite.from(...)` | Wrap provided `mw.Api` or `mw.ForeignApi` | Wrap provided mwn instance | both | tested | adapter, contract | Important for tests and advanced use. |
| Multi-wiki manager | `Composite.wikis(config)` | Build `WikiRegistry` from explicit wiki configs | Build `WikiRegistry` from explicit wiki configs | both | tested | unit, adapter | `/mw` is sync; `/mwn` is async. |
| Get wiki by ID | `wikis.get(wikiId)` | Return configured wiki by ID | Return configured wiki by ID | both | tested | unit | Core multi-wiki API. |
| List wiki IDs | `wikis.ids()` | Return configured IDs | Return configured IDs | both | tested | unit | Pure registry logic. |
| Wiki identity | `wiki.id()` / `wiki.info()` | Use config and/or `mw.config` | Use config and/or site info | both | needs-design | unit | Avoid expensive site calls in simple ID accessor. |

---

# Low-level API, reliability, and continuation

| Capability | Composite API | MW adapter | MWN adapter | Support | Status | Tests | Notes |
|---|---|---|---|---|---|---|---|
| Query Action API | `wiki.query(params)` | `api.get(params)` | `bot.query(params)` | both | tested | adapter, contract | Query is GET-like in the first implementation. |
| Request API | `wiki.request(params)` | `api.ajax(params)` / `api.post(params)` policy | `bot.request(params)` | both | needs-design | adapter | Distinction from `query` must be explicit. |
| Raw request | `wiki.rawRequest(params)` | Possibly direct `mw.Api` call | `bot.rawRequest(params)` | partial/server-first | needs-design | adapter | Consider keeping as runtime escape hatch. |
| Continued query | `wiki.continuedQuery(params)` | Loop over `continue` with conservative limits | `bot.continuedQuery(params)` | partial | not-started | adapter, contract | Return shape must be decided. |
| Continued query generator | `wiki.continuedQueryGen(params)` | Async generator over continuation | `bot.continuedQueryGen(params)` | partial | not-started | adapter, contract | Preferred for large results. |
| Mass query | `wiki.massQuery(...)` | Split parameters and query in batches | `bot.massQuery(...)` | partial | not-started | adapter | Frontend must limit concurrency. |
| Mass query generator | `wiki.massQueryGen(...)` | Async generator over batched calls | `bot.massQueryGen(...)` | partial | not-started | adapter | Server-first. |
| Batch operation | `wiki.batchOperation(...)` | Controlled promise pool with low concurrency | `bot.batchOperation(...)` | partial/server-first | not-started | unit, adapter | Avoid aggressive frontend behavior. |
| Series batch operation | `wiki.seriesBatchOperation(...)` | Sequential loop | `bot.seriesBatchOperation(...)` | both | not-started | unit, adapter | Useful for strict ordering. |
| User-Agent policy | runtime config | Set `Api-User-Agent` where possible | Set mwn user agent / request headers | both | not-started | adapter | Browser cannot set normal User-Agent. |
| Maxlag handling | runtime config / request policy | Add `maxlag` param where appropriate; conservative retry | Delegate to mwn maxlag handling | partial | needs-design | adapter | Should not surprise frontend users. |
| Retry policy | runtime config / request policy | Conservative retries for safe requests only | Delegate to mwn where practical | partial | needs-design | unit, adapter | Avoid hiding destructive retry behavior. |
| Timeout | runtime config | Depends on `mw.Api`/transport limits; possibly unsupported | mwn request timeout config | partial | needs-design | adapter | May be server-first. |
| Rate limit/throttle | runtime config / batch helpers | Low frontend concurrency defaults | Delegate/use mwn batch/throttle patterns | partial | needs-design | unit | Important for bots and batch tools. |
| Token refresh | adapter responsibility | `postWithToken()` where possible | Delegate to mwn token handling | both | not-started | adapter | Do not expose token complexity too early. |
| Error normalization | `CompositeError` subclasses | Translate `mw.Api` failures | Translate mwn errors | both | not-started | unit, adapter, contract | Normalize only stable categories. |
| Unsupported runtime | `UnsupportedRuntimeError` | Throw for server-only APIs | Throw for frontend-only APIs | both | scaffolded | unit | Required behavior. |

---

# Site, configuration, authentication, and permissions

| Capability | Composite API | MW adapter | MWN adapter | Support | Status | Tests | Notes |
|---|---|---|---|---|---|---|---|
| Site information | `wiki.getSiteInfo()` | `action=query&meta=siteinfo` or cached site info | `bot.getSiteInfo()` | both | not-started | adapter, contract | mwn-shaped name. |
| Namespaces | `wiki.namespaces()` / site info helper | From `mw.config` or siteinfo | From mwn siteinfo | both | needs-design | unit, adapter | Need final API shape. |
| Server time | `wiki.getServerTime()` | Action API query | `bot.getServerTime()` | both | not-started | adapter | Useful for edits. |
| Site messages | `wiki.getMessages(keys)` | `mw.message` if loaded or Action API | `bot.getMessages(keys)` | partial | not-started | adapter | Frontend/localization semantics may differ. |
| Tags | `wiki.getTags()` | Action API list tags | `bot.getTags()` if available or query | both | not-started | adapter | Needed for edit tags. |
| Interwiki map | `wiki.interwikiMap()` | siteinfo interwikimap | mwn query/siteinfo | both | not-started | adapter | Extended. |
| Wiki config | `wiki.config()` | Wrap selected `mw.config` values and/or API site config | API siteinfo/config | partial | needs-design | unit | Distinguish runtime config vs wiki config. |
| Current user info | `wiki.userinfo()` | `action=query&meta=userinfo` or `mw.user` + API | `bot.userinfo()` | both | not-started | adapter, contract | Core auth API. |
| Current user object | `wiki.currentUser()` | Build from current username | Build from `userinfo()` | both | not-started | contract | Convenience API. |
| User rights/groups | `user.rights()` / `user.groups()` | `userinfo` for current user; user query for others | mwn user/userinfo query | both | needs-design | adapter | Current vs arbitrary user must be clear. |
| CSRF token | `wiki.getToken("csrf")` | `api.getToken("csrf")` / `postWithToken` | mwn token helper | both | needs-design | adapter | May stay adapter-internal first. |
| Save option | `wiki.saveOption(name, value)` | `action=options` with token | `bot.saveOption(name, value)` | both | not-started | adapter | Important for app settings. |
| Save options | `wiki.saveOptions(options)` | `action=options` with multiple changes | `bot.saveOptions(options)` | both | not-started | adapter | Extended. |
| Browser session | `/mw` current session | Use current logged-in browser user | unsupported | frontend-only | implicit | adapter | No bot login in frontend. |
| BotPassword login | `wiki.login(config)` | unsupported | `bot.login(...)` / mwn init flow | server-only | defer | adapter/integration | Not first milestone. |
| OAuth 2.0 | auth helper/module | Browser/service-specific flow | Server OAuth flow / mwn or custom | partial/future | needs-design | integration | Likely separate design later. |
| OAuth session validation | auth helper | API/userinfo + service token validation | Service-level validation | future | needs-design | integration | Common Services/Sage/Akaiv. |
| Logout | `wiki.logout()` | unsupported | mwn logout if needed | server-only/defer | defer | adapter | Avoid frontend logout semantics. |
| Permission helper | `wiki.can(action, target?)` | Based on rights/site config/query | Based on rights/site config/query | future | needs-design | unit | Avoid overpromising MediaWiki permissions. |

---

# Page reading and page relationships

| Capability | Composite API | MW adapter | MWN adapter | Support | Status | Tests | Notes |
|---|---|---|---|---|---|---|---|
| Page object | `wiki.page(title)` | Return `MwPage` | Return `MwnPage` wrapper | both | tested | contract | Primary domain object. |
| Page title | `page.title()` | Return stored normalized/original title | Return stored normalized/original title | both | tested | unit, contract | First milestone. |
| Page existence | `page.exists()` | Query page info/missing | mwn page method or query | both | not-started | adapter, contract | Core. |
| Page metadata | `page.info()` | `action=query&prop=info` | mwn page/query equivalent | both | not-started | adapter, contract | Should include page ID, namespace, redirect, missing. |
| Page wikitext | `page.text()` | `action=query&prop=revisions&rvprop=content` with slots API | `new bot.Page(title).text()` | both | tested | adapter, contract | First milestone. |
| Page HTML | `page.html()` | Parsoid REST, `action=parse`, or selected policy | mwn parse/Parsoid/custom | both | needs-design | adapter | Keep simple high-level API. |
| JSON content | `page.json()` | Fetch text then `JSON.parse` or contentmodel query | mwn text/read + parse | both | not-started | unit, adapter | Validate content model where possible. |
| Lua data | `page.luaData()` | Fetch text and parse conventionally | Fetch text and parse conventionally | future | defer | unit | Risky assumptions; defer. |
| Revision HTML | `page.revisionHtml(revisionId)` | Parse/Parsoid for old revision | mwn parse helper/custom | both | not-started | adapter | Useful for review UI. |
| Purge page | `page.purge()` | `action=purge` | `new bot.Page(title).purge()` or request | both | not-started | adapter | Extended. |
| Language links | `page.languageLinks()` | `prop=langlinks` | mwn page/query equivalent | both | not-started | adapter | Translation/discovery. |
| Categories | `page.categories()` | `prop=categories` | `new bot.Page(title).categories()` | both | not-started | adapter, contract | Core relationship API. |
| Templates | `page.templates()` | `prop=templates` | `new bot.Page(title).templates()` | both | not-started | adapter, contract | Core relationship API. |
| Links | `page.links()` | `prop=links` | `new bot.Page(title).links()` | both | not-started | adapter, contract | Core relationship API. |
| Backlinks | `page.backlinks()` | `list=backlinks` | `new bot.Page(title).backlinks()` | both | not-started | adapter | Extended. |
| Embedded-in pages | `page.embeddedIn()` | `list=embeddedin` | mwn page equivalent/query | both | not-started | adapter | Extended. |
| Subpages | `page.subpages()` | `list=allpages` with prefix / namespace rules | `new bot.Page(title).subpages()` | both | not-started | adapter | Namespace rules matter. |
| Page logs | `page.logs(options?)` | `list=logevents` with page/title filter | `new bot.Page(title).logs()` | both | not-started | adapter | Admin/review workflows. |

---

# Revisions, diffs, and patrol

| Capability | Composite API | MW adapter | MWN adapter | Support | Status | Tests | Notes |
|---|---|---|---|---|---|---|---|
| Page history | `page.history(...)` | `prop=revisions` with selected props | `new bot.Page(title).history(...)` | both | not-started | adapter, contract | Core. |
| Page history generator | `page.historyGen(...)` | Async generator over revisions continuation | `new bot.Page(title).historyGen(...)` | partial | not-started | adapter, contract | Frontend may limit page size/concurrency. |
| Latest revision | `page.latestRevision()` | `prop=revisions&rvlimit=1` | mwn page history/text metadata | both | not-started | adapter, contract | Core shortcut. |
| Specific revision | `page.revision(id)` | Build `Revision` object with ID, lazy fetch | Build wrapper around mwn/query | both | needs-design | unit | Decide object richness. |
| Compare revisions | `wiki.compareRevisions(from, to, options?)` | `action=compare` | mwn compare method or request | both | not-started | adapter, contract | Important for Zinnia/Citron. |
| Revision diff | `revision.diff(previous?)` | Delegate to `wiki.compareRevisions` | Delegate to mwn/query | both | future | adapter | Optional object convenience. |
| Revision text | `revision.text()` | `prop=revisions` by revid | mwn/query by revid | both | future | adapter | Avoid duplicating page API too much. |
| Revision metadata | `revision.info()` | Query revision props | mwn/query | both | future | adapter | Useful for review UI. |
| Patrol revision | `wiki.patrol(revisionId)` / `revision.patrol()` | `action=patrol` with token | mwn patrol/request | both | not-started | adapter/integration | Rights-dependent. |
| Revision visibility | `wiki.changeRevisionVisibility(...)` | `action=revisiondelete` | mwn request/custom | both/admin | future | integration | Complex; defer. |

---

# Editing and administrative operations

| Capability | Composite API | MW adapter | MWN adapter | Support | Status | Tests | Notes |
|---|---|---|---|---|---|---|---|
| Save page text | `page.save(text, summary?, options?)` | `api.postWithToken("csrf", { action: "edit", ... })` | `new bot.Page(title).save(text, summary, options)` | both | tested | adapter, contract | Core editing API; live permission behavior is not integration-tested yet. |
| Transform edit | `page.edit(transform, config?)` | Read text, apply transform, save with conflict protection | `new bot.Page(title).edit(transform, config)` | both | not-started | unit, adapter, contract | Follow mwn semantics where practical. |
| Create page | `wiki.create(title, text, summary, options?)` | `action=edit&createonly=1` | `bot.create(...)` | both | not-started | adapter | Extended. |
| New section | `page.newSection(subject, text, options?)` | `action=edit&section=new` | `bot.newSection(...)` or page helper | both | not-started | adapter | Useful for talk/project pages. |
| Append text | `page.append(text, summary, options?)` | `action=edit&appendtext=...` or transform edit | mwn save/edit helper or request | both | needs-design | adapter | Convenience API. |
| Prepend text | `page.prepend(text, summary, options?)` | `action=edit&prependtext=...` or transform edit | mwn save/edit helper or request | both | needs-design | adapter | Convenience API. |
| Undo revision | `page.undo(...)` / `wiki.undo(...)` | `action=edit&undo=...` | mwn undo/request if available | both | needs-design | adapter/integration | API shape needs care. |
| Rollback | `page.rollback(...)` / `wiki.rollback(...)` | `action=rollback` with token | `bot.rollback(...)` | both | not-started | adapter/integration | Rights-dependent. |
| Move page | `page.move(...)` | `action=move` with token | `new bot.Page(title).move(...)` or `bot.move(...)` | both | not-started | adapter/integration | Extended. |
| Delete page | `page.delete(...)` | `action=delete` with token | `new bot.Page(title).delete(...)` or `bot.delete(...)` | both | not-started | adapter/integration | Admin. |
| Undelete/restore page | `page.undelete(...)` / `page.restore(...)` | `action=undelete` | `new bot.Page(title).undelete(...)` or `bot.undelete(...)` | both | not-started | adapter/integration | Prefer mwn naming unless clarity wins. |
| Protect page | `page.protect(...)` | `action=protect` | `new bot.Page(title).protect(...)` or request | both | not-started | adapter/integration | Admin. |
| Watch page | `page.watch()` | `action=watch` | mwn request/helper | both | not-started | adapter | Extended. |
| Unwatch page | `page.unwatch()` | `action=watch&unwatch=1` | mwn request/helper | both | not-started | adapter | Extended. |
| Watch status | `page.watchStatus()` | query watchlist/info props | mwn query/helper | both | future | adapter | Optional. |
| Block user | `user.block(...)` / `wiki.block(...)` | `action=block` | mwn request/helper | both/admin | not-started | adapter/integration | API shape needs design. |
| Unblock user | `user.unblock(...)` / `wiki.unblock(...)` | `action=unblock` | mwn request/helper | both/admin | not-started | adapter/integration | API shape needs design. |
| MassMessage | `wiki.massMessage(...)` | Extension API/custom | mwn request/custom | future | defer | integration | Specialized; implement only when needed. |

---

# User, IP, and global identity

| Capability | Composite API | MW adapter | MWN adapter | Support | Status | Tests | Notes |
|---|---|---|---|---|---|---|---|
| User object | `wiki.user(name)` | Return `MwUser` | Return `MwnUser` wrapper | both | not-started | contract | Core domain object. |
| User information | `user.info()` | `list=users` / `meta=userinfo` for current | mwn user/query helper | both | not-started | adapter, contract | Common lookup. |
| User contributions | `user.contribs(...)` | `list=usercontribs` | `bot.user(name).contribs(...)` | both | not-started | adapter, contract | Core review API. |
| User contributions generator | `user.contribsGen(...)` | Async generator over `uccontinue` | mwn user contribs generator if available / continued query | partial | not-started | adapter | Extended. |
| User logs | `user.logs(...)` | `list=logevents&leuser=...` | mwn user logs/query | both | not-started | adapter | Extended. |
| User rights | `user.rights()` | Current user via `userinfo`; arbitrary user may require query | mwn user/userinfo query | both | needs-design | adapter | Distinguish current vs arbitrary user. |
| User groups | `user.groups()` | Same as rights | Same as rights | both | needs-design | adapter | Core. |
| User block info | `user.blocks()` | `list=blocks` | mwn query/helper | both | not-started | adapter | Extended. |
| IP information | `wiki.ipInfo(ip)` | Extension/API if available, otherwise unsupported | Extension/API if available | partial | needs-design | adapter | Depends on Wikimedia API availability. |
| CentralAuth info | `user.globalInfo()` | CentralAuth API/custom query | mwn request/custom | future | defer | integration | Wikimedia-specific. |
| Global groups | `user.globalGroups()` | CentralAuth/globaluserinfo if available | mwn request/custom | future | defer | integration | Wikimedia-specific. |
| Global blocks | `user.globalBlocks()` / `wiki.globalBlocks()` | GlobalBlocking API/custom query | mwn request/custom | future | defer | integration | Wikimedia-specific. |
| Cross-wiki identity | global identity helper | Multi-wiki + CentralAuth | Multi-wiki + CentralAuth | future | defer | integration | Useful later for anti-abuse. |

---

# Recent changes, logs, monitoring, and search

| Capability | Composite API | MW adapter | MWN adapter | Support | Status | Tests | Notes |
|---|---|---|---|---|---|---|---|
| Recent changes | `wiki.recentChanges(options?)` | `list=recentchanges` | mwn query/helper | both | not-started | adapter, contract | Core monitoring API. |
| Recent changes generator | `wiki.recentChangesGen(options?)` | Async generator over `rccontinue` | continued query/generator | partial | not-started | adapter | Extended. |
| Watchlist | `wiki.watchlist(options?)` | `list=watchlist` | mwn query/helper | both | not-started | adapter | User-facing monitoring. |
| Generic logs | `wiki.logs(options?)` | `list=logevents` | mwn query/helper | both | not-started | adapter, contract | Core admin/review API. |
| Logs generator | `wiki.logsGen(options?)` | Async generator over continuation | mwn continued query | partial | not-started | adapter | Extended. |
| EventStreams | `wiki.eventStreams(...)` / `/streams` | Use EventSource/fetch-compatible stream helper | Use `wikimedia-streams` or EventSource polyfill | both/future | needs-design | adapter/integration | Not primarily mwn-shaped. |
| Stream filters | `/streams` filters | Filter stream events client-side or upstream params | Same | both/future | needs-design | unit | Include wiki, namespace, user, bot/minor/anon, links. |
| Full-text search | `wiki.search(query, options?)` | `list=search` / CirrusSearch params | `bot.search(...)` | both | not-started | adapter, contract | Core discovery API. |
| Prefix search | `wiki.prefixSearch(query, options?)` | `list=prefixsearch` or opensearch | mwn query/helper | both | not-started | adapter | Extended. |
| OpenSearch | `wiki.openSearch(query, options?)` | `action=opensearch` | mwn query/helper | both | future | adapter | Optional. |
| Category members | `wiki.categoryMembers(title, options?)` | `list=categorymembers` | mwn query/helper | both | not-started | adapter | Extended. |

---

# Upload, file handling, Parsoid, Wikibase, and SPARQL

| Capability | Composite API | MW adapter | MWN adapter | Support | Status | Tests | Notes |
|---|---|---|---|---|---|---|---|
| File object | `wiki.file(name)` | Return file wrapper | Return mwn-backed file wrapper | both | not-started | contract | Extended. |
| File metadata | `file.info()` | `prop=imageinfo` | mwn file/query helper | both | not-started | adapter | Extended. |
| File usage | `file.usage(...)` / `wiki.fileUsage(...)` | `list=imageusage` / `globalusage` if available | mwn query/custom | future | defer | adapter | Commons-related. |
| Upload file | `wiki.upload(...)` | `action=upload`; browser file/blob behavior differs | `bot.upload(...)` | partial/server-first | not-started | adapter/integration | Needs careful runtime contract. |
| Upload from URL | `wiki.uploadFromUrl(...)` | likely unsupported or limited | `bot.uploadFromUrl(...)` | server-first | defer | integration | Server-first. |
| Download file | `wiki.download(...)` | unsupported | `bot.download(...)` | server-only | defer | adapter | Filesystem-oriented. |
| Page HTML | `page.html()` | Parsoid REST or parse API | mwn parse helper / fetch Parsoid | both | needs-design | adapter, contract | Core high-level API. |
| Revision HTML | `page.revisionHtml(revisionId)` | Parsoid/parse by revision | mwn parse/custom | both | needs-design | adapter | Review UI. |
| Parse wikitext | `wiki.parseWikitext(text, options?)` | `action=parse` or Parsoid | `bot.parseWikitext(...)` if available / request | both | not-started | adapter | Extended. |
| Parsoid HTML fetch | `wiki.parsoid().html(title, options?)` | REST endpoint / `mw.Rest` / fetch | fetch REST endpoint | both | future | adapter/integration | Consider `/parsoid` later. |
| HTML to wikitext | `wiki.parsoid().toWikitext(html, options?)` | Parsoid transform endpoint | fetch Parsoid endpoint | future | defer | integration | Complex. |
| SPARQL query | `wiki.sparqlQuery(query, endpoint?)` | `fetch` to SPARQL endpoint | `bot.sparqlQuery(query, endpoint?)` | both | not-started | adapter, contract | Should exist early. |
| Entity object | `wiki.entity(id)` | Wikibase API request/custom | mwn Wikibase/custom request | future | defer | adapter | Prefer `wikibase` naming. |
| Read entity | `entity.get()` | `wbgetentities` | mwn/custom request | future | defer | adapter | Implement before entity editing. |
| Edit entity | `entity.edit(...)` | Wikibase edit APIs | mwn/custom request | future | defer | integration | Complex; defer. |
| Commons MediaInfo | `file.mediaInfo()` / wikibase helper | Wikibase/Commons APIs | custom request | future | defer | integration | Specialized. |

---

# Wikitext, title utilities, and testing

| Capability | Composite API | MW adapter | MWN adapter | Support | Status | Tests | Notes |
|---|---|---|---|---|---|---|---|
| Parse templates | `parseTemplates(text)` | Pure utility | Pure utility | both/runtime-independent | not-started | unit | Must not import runtime code. |
| Parse links | `parseLinks(text)` | Pure utility | Pure utility | both/runtime-independent | not-started | unit | Bundle-friendly. |
| Parse sections | `parseSections(text)` | Pure utility | Pure utility | both/runtime-independent | not-started | unit | Useful for edit/new-section helpers. |
| Parse categories | `parseCategories(text)` | Pure utility | Pure utility | both/runtime-independent | not-started | unit | Extended. |
| Parse tables | `parseTables(text)` | Pure utility | Pure utility | both/runtime-independent | future | unit | Complex; optional. |
| Replace template | `replaceTemplate(text, match, replacement)` | Pure utility | Pure utility | both/runtime-independent | future | unit | Maintenance workflows. |
| Insert template | `insertTemplate(text, template, options?)` | Pure utility | Pure utility | both/runtime-independent | future | unit | Warning/tagging workflows. |
| Wikitext facade | `Wikitext.from(text)` | Pure facade | Pure facade | both/runtime-independent | future | unit, bundle | Pure functions remain primary. |
| Title object | `wiki.title(text)` / `Title` | `mw.Title` where useful, or Composite Title | mwn Title wrapper / Composite Title | both | needs-design | unit, contract | Avoid runtime dependency in root Title if possible. |
| Normalize title | `normalizeTitle(title, options?)` | Pure or site-aware helper | Pure or site-aware helper | both | not-started | unit | Site-aware namespace handling may need `Wiki`. |
| Namespace extraction | `title.namespace()` | Use namespace map | Use namespace map | both | not-started | unit | Full correctness needs site info. |
| Talk/subject conversion | `title.toTalkPage()` / `title.toSubjectPage()` | Namespace map | Namespace map | future | defer | unit | Optional. |
| Mock wiki | `createMockWiki(config?)` | Runtime-independent | Runtime-independent | both | tested | unit, contract | `/testing` subpath. |
| Mock page | `createMockPage(...)` | Runtime-independent | Runtime-independent | both | not-started | unit | Extended. |
| Mock user | `createMockUser(...)` | Runtime-independent | Runtime-independent | both | not-started | unit | Extended. |
| Contract tests | `describeWikiContract(...)` | Test helper consumes MW factory | Test helper consumes MWN factory | both | future | contract | May remain internal. |
| Import boundary | package exports checks | Ensure `/mw` does not import `mwn` | Ensure root does not import runtimes | both | tested | bundle | Critical for frontend bundle size. |

---

# Suggested implementation order

## Milestone 1: skeleton and first read path

- Root core interfaces and errors.
- `/mw` and `/mwn` runtime entrypoints.
- `wiki.runtime()`.
- `wiki.page(title)`.
- `page.title()`.
- `page.text()`.
- Basic mock runtime under `/testing`.
- Adapter and contract tests for the above.
- Bundle/import boundary check.

## Milestone 2: query and save

This milestone is defined by `docs/milestones/02-query-and-save.md`.

- `wiki.query(params)`.
- `page.save(text, summary?, options?)`.
- Mock query support in `/testing`.
- Mock page save behavior in `/testing`.
- Adapter and contract tests for query and save.

## Milestone 3: page read expansion and user basics

- `page.info()`.
- `page.exists()`.
- `page.history(...)`.
- `page.categories()`.
- `page.templates()`.
- `page.links()`.
- `wiki.search(...)`.
- `wiki.userinfo()`.

## Milestone 4: editing and user workflows

- `page.edit(...)`.
- `wiki.getToken(...)` or adapter-internal token policy.
- `user.info()`.
- `user.contribs(...)`.
- `wiki.recentChanges(...)`.
- `wiki.compareRevisions(...)`.
- `wiki.patrol(...)`.

## Milestone 5: extended runtime capabilities

- continuation/generator helpers.
- `wiki.sparqlQuery(...)`.
- `page.html()`.
- `page.logs()` / `wiki.logs()`.
- watchlist and watch/unwatch.
- request reliability policy.

## Milestone 6: specialized domains

- EventStreams.
- Parsoid advanced operations.
- Upload/file workflows.
- Wikibase entities.
- OAuth flows.
- Global Wikimedia identity APIs.
- Administrative operations requiring real integration tests.

---

# Maintenance rules

- Every new public Composite API should get one row in this file.
- Every row should identify expected `mw` and `mwn` adapter behavior, even if one side is unsupported.
- If the adapter behavior is unclear, mark `needs-design` rather than guessing in code.
- When an API is implemented, update `Status` and add test coverage information.
- Do not use this file to add application-specific workflows. Composite remains a reusable SDK layer.
