# Composite Capabilities

This document is the high-level capability roadmap for Composite.

It answers a different question from `api-mapping.md` and `runtime-support.md`:

- `capabilities.md` defines what Composite is expected to support over time.
- `api-mapping.md` tracks per-API runtime support, adapter mapping, implementation status, and test coverage.
- `runtime-support.md` defines runtime support policy and labels.

Composite is a runtime-aware, mwn-shaped MediaWiki SDK for TypeScript. This document should help keep the project focused on capabilities needed by Taxon Labs applications without forcing Composite to clone all of mwn.

This is a roadmap document, not a promise that every listed capability belongs in the next milestone. Documents in `docs/milestones/` define active implementation scope.

## Status labels

Use these labels when tracking capabilities.

| Status | Meaning |
|---|---|
| `core` | Important to the main Composite API and broadly useful across applications. |
| `extended` | Important, but can be implemented after the core API is stable. |
| `optional` | Useful utility or specialized feature. |
| `future` | Planned or plausible, but not needed soon. |
| `defer` | Known capability, but intentionally deferred. |
| `out-of-scope` | Should not be implemented in Composite. |

## Capability groups

Composite capabilities are grouped by domain. The groups are not implementation packages by default. A capability may live in the core API, a runtime subpath, or a utility subpath depending on bundle size, runtime behavior, and API shape.

---

# Runtime and wiki management

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| Runtime information | `wiki.runtime()` | core | Returns runtime type and controlled access to the underlying adapter. |
| Current wiki in MediaWiki frontend | `Composite.current(config?)` | core | `/mw` only. Natural for gadgets, user scripts, and MediaWiki frontend apps. |
| Connect to another wiki from frontend | `Composite.connect(config)` | core | `/mw` only. Requires `serverName` and `mw.ForeignApi`. |
| Create mwn-backed wiki | `Composite.create(config)` | core | `/mwn` only. Creates or initializes an mwn-backed wiki. |
| Wrap existing runtime client | `Composite.from(...)` | core | Wraps `mw.Api`, `mw.ForeignApi`, or an `mwn` instance. |
| Multi-wiki manager | `Composite.wikis(config)` | core | Creates a registry of multiple `Wiki` instances for cross-wiki tools. |
| Get wiki by ID | `wikis.get(wikiId)` | core | Returns a configured wiki instance by ID. |
| List configured wiki IDs | `wikis.ids()` | core | Utility for multi-wiki applications. |
| Cross-wiki identity metadata | `wiki.id()` | optional | Useful when tools handle several Wikimedia wikis at once. |

---

# Low-level API access

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| Request API | `wiki.request(params)` | core | Generic Action API primitive. |
| Query Action API | `wiki.query(params)` | core | mwn-style helper that supplies `action=query` through `request()`. |
| Raw runtime access | `wiki.runtime()` | core | Escape hatch for boundary code. Shared logic should prefer Composite interfaces. |
| Continued query | `wiki.continuedQuery(params)` | extended | mwn-shaped. Frontend support may be partial. |
| Continued query generator | `wiki.continuedQueryGen(params)` | extended | Useful for large result sets. |
| Mass query | `wiki.massQuery(...)` | extended | Useful for batching page/user/title queries. |
| Mass query generator | `wiki.massQueryGen(...)` | extended | Useful for streaming or paginated batch results. |
| Batch operation | `wiki.batchOperation(...)` | extended | Server-first; frontend support may need conservative concurrency. |
| Series batch operation | `wiki.seriesBatchOperation(...)` | extended | Useful when order matters or rate limits are strict. |

---

# Reliability and request behavior

This group tracks behavior that makes Composite safe to use in real Wikimedia tools. It should not require Composite to reimplement low-level logic already provided by `mwn`, but the public API and adapter behavior should be explicit.

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| User-Agent / Api-User-Agent configuration | runtime config | core | Browser tools should use `Api-User-Agent`; server tools should set a proper User-Agent. |
| Maxlag handling | runtime config / request policy | extended | Delegate to mwn where possible; define frontend behavior conservatively. |
| Retry policy | runtime config / request policy | extended | Should be explicit for server/bot workflows; avoid aggressive retries in frontend. |
| Request timeout | runtime config | extended | Important for Toolforge services and long-running bots. |
| Rate limit / throttle behavior | runtime config / batch helpers | extended | Especially important for batch operations and bots. |
| Token refresh behavior | adapter responsibility | extended | Composite should normalize behavior where practical, but avoid hiding all runtime differences. |
| Readonly / database lag handling | adapter responsibility | future | Useful for robust bot/service operation. |
| Error normalization | `CompositeError` subclasses | core | Adapter errors should be translated into stable Composite errors where practical. |
| Unsupported runtime failure | `UnsupportedRuntimeError` | core | Unsupported APIs must fail explicitly rather than silently no-op. |

---

# Pagination and continuation

Continuation is a first-class concern in MediaWiki API usage. Composite should make paginated APIs predictable across both runtimes.

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| Continued query helper | `wiki.continuedQuery(params)` | extended | Should return collected results or a mwn-shaped response, depending final API decision. |
| Async continuation generator | `wiki.continuedQueryGen(params)` | extended | Preferred for large result sets when supported by runtime. |
| Page history generator | `page.historyGen(...)` | extended | Core for large page histories. |
| User contributions generator | `user.contribsGen(...)` | extended | Useful for review/admin tools. |
| Recent changes generator | `wiki.recentChangesGen(...)` | extended | Useful for monitoring tools. |
| Logs generator | `wiki.logsGen(...)` | extended | Useful for admin/review workflows. |
| Backlinks generator | `page.backlinksGen(...)` | optional | Useful for maintenance tools. |
| Category members generator | `wiki.categoryMembersGen(...)` | optional | Useful for content/maintenance workflows. |
| Conservative frontend pagination | adapter policy | core | Frontend runtime should avoid accidentally expensive operations. |

---

# Site and configuration

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| Site information | `wiki.getSiteInfo()` | core | Names should follow mwn where practical. |
| Namespaces | `siteInfo.getNamespaces()` / `wiki.namespaces()` | core | API shape needs to be decided. |
| Server time | `wiki.getServerTime()` | extended | Useful for timestamp-based edits and conflict handling. |
| Site messages | `wiki.getMessages(keys)` | extended | Useful for UI and localization-aware tools. |
| Tags | `wiki.getTags()` | extended | Useful for edit tags and patrol workflows. |
| Interwiki map | `wiki.interwikiMap()` | extended | Useful for cross-wiki tools. |
| Site statistics | `wiki.statistics()` | optional | Nice to have, not core. |
| Wiki configuration | `wiki.config()` | extended | Must distinguish frontend `mw.config` from site config fetched through API. |
| Runtime configuration | `wiki.runtime().config` / runtime-specific accessor | optional | Useful for diagnostics; avoid exposing sensitive data. |
| Application config stored in user options | option helpers | extended | Important for tools that store user preferences on-wiki. |

---

# Authentication, session, and permissions

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| Current user info | `wiki.userinfo()` | core | Needed by nearly all authenticated applications. |
| Current user object | `wiki.currentUser()` | extended | Optional convenience API. |
| User rights | `user.rights()` / `wiki.userinfo()` | core | Needed before admin/patrol operations. |
| User groups | `user.groups()` / `wiki.userinfo()` | core | Needed for permission-aware UI. |
| CSRF token | `wiki.getToken('csrf')` / token helper | core | API shape needs careful design. |
| Save user option | `wiki.saveOption(name, value)` | extended | mwn-shaped. |
| Save user options | `wiki.saveOptions(options)` | extended | mwn-shaped. |
| Browser session use | `/mw` current session | core | Frontend should use the current browser session, not emulate bot login. |
| BotPassword login | `wiki.login(config)` | extended | `/mwn` only or server-only. |
| OAuth 1.0a | runtime-specific auth module | future | Potentially useful for legacy Wikimedia workflows. |
| OAuth 2.0 | runtime-specific auth module | extended | Important for Common Services, Sage, Akaiv, Fusion, Rosetta, and server integrations. |
| OAuth session validation | auth helper | extended | Needed by services that need to verify current user identity. |
| Token management | token helper / adapter responsibility | extended | Must avoid leaking runtime-specific complexity into shared app code. |
| Logout | `wiki.logout()` | defer | Usually server-only; frontend behavior should not mimic bot logout. |
| Permission check helper | `wiki.can(action, target?)` | future | Could be useful, but should not hide MediaWiki complexity too early. |

---

# Page objects and page reading

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| Page object | `wiki.page(title)` | core | Primary domain object. |
| Page title | `page.title()` | core | First milestone API. |
| Page existence | `page.exists()` | core | Useful before edit/create flows. |
| Page metadata | `page.info()` | core | Should include effective/source title, existence, page ID, namespace, redirects, and common page metadata where possible. |
| Page wikitext | `page.text()` | core | First read capability. |
| Page JSON content | `page.json()` | extended | Needed by JSON pages and structured content utilities. |
| Page Lua data | `page.luaData()` | future | Useful for Lua data modules, but needs careful parsing assumptions. |
| Purge page | `page.purge()` | extended | Portable and useful for cache workflows. |
| Page language links | `page.languageLinks()` | extended | Needed by translation tools. |
| Page categories | `page.categories()` | core | Common reading capability. |
| Page templates | `page.templates()` | core | Common reading capability. |
| Page links | `page.links()` | core | Common reading capability. |
| Page backlinks | `page.backlinks()` | extended | Useful for analysis and maintenance. |
| Embedded-in pages | `page.embeddedIn()` | extended | Useful for template/module impact analysis. |
| Page subpages | `page.subpages()` | extended | Useful for project pages and maintenance workflows. |
| Page logs | `page.logs()` | extended | Needed for admin/review tools. |

---

# Revisions and diffs

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| Page history | `page.history(...)` | core | Portable. |
| Page history generator | `page.historyGen(...)` | extended | mwn-shaped; frontend semantics may be partial. |
| Latest revision | `page.latestRevision()` | core | Useful shortcut for review tools. |
| Specific revision object | `page.revision(id)` | extended | Useful if `Revision` becomes a richer domain object. |
| Compare revisions | `wiki.compareRevisions(from, to, options?)` | core | Needed by patrol, anti-vandalism, and review tools. |
| Revision diff | `revision.diff(previous?)` | extended | Optional object-oriented convenience. |
| Revision content | `revision.text()` | extended | Useful but must avoid API duplication with `page.text()`. |
| Revision metadata | `revision.info()` | extended | Useful for UI and review workflows. |
| Mark revision as patrolled | `wiki.patrol(revisionId)` / `revision.patrol()` | core | Important for Zinnia-like tools. |
| Revision visibility | `wiki.changeRevisionVisibility(...)` | future | Admin capability; complex permissions and semantics. |

---

# Editing and page operations

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| Save page text | `page.save(text, summary?, options?)` | core | mwn-shaped. |
| Transform edit | `page.edit(transform, config?)` | core | Should follow mwn semantics where practical. |
| Create page | `wiki.create(title, text, summary, options?)` | extended | mwn-shaped; may also be page-level. |
| New section | `page.newSection(subject, text, options?)` | extended | Useful for talk/project pages. |
| Append text | `page.append(text, summary, options?)` | extended | Could be convenience around edit. |
| Prepend text | `page.prepend(text, summary, options?)` | extended | Could be convenience around edit. |
| Undo revision | `page.undo(...)` / `wiki.undo(...)` | core | Important for patrol tools. API shape needs design. |
| Rollback | `page.rollback(...)` / `wiki.rollback(...)` | core | Important for patrol/admin tools. |
| Move page | `page.move(...)` | extended | Admin/editor operation. |
| Delete page | `page.delete(...)` | extended | Admin operation. |
| Restore page | `page.restore(...)` / `page.undelete(...)` | extended | mwn uses undelete terminology. |
| Protect page | `page.protect(...)` | extended | Admin operation. |
| Watch page | `page.watch()` | extended | Useful for user-facing tools. |
| Unwatch page | `page.unwatch()` | extended | Useful for user-facing tools. |
| Watch status | `page.watchStatus()` | optional | Nice to have. |
| MassMessage | `wiki.massMessage(...)` | future | Specialized; keep out of core until needed. |

---

# User, IP, and global identity

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| User object | `wiki.user(name)` | core | Portable API. |
| User information | `user.info()` | core | Common user lookup. |
| User contributions | `user.contribs(...)` | core | Needed by review/admin tools. |
| User contributions generator | `user.contribsGen(...)` | extended | Useful for large histories. |
| User logs | `user.logs(...)` | extended | Useful for admin/review workflows. |
| User rights | `user.rights()` | core | May use userinfo for current user or query for arbitrary users. |
| User groups | `user.groups()` | core | Same concern as rights. |
| User block info | `user.blocks()` | extended | Needed by admin/review tools. |
| Block user | `user.block(...)` / `wiki.block(...)` | extended | Admin operation; API shape needs care. |
| Unblock user | `user.unblock(...)` / `wiki.unblock(...)` | extended | Admin operation. |
| IP information | `wiki.ipInfo(ip)` | extended | Needed by anti-vandalism tools; implementation may depend on available APIs/extensions. |
| CentralAuth account info | `user.globalInfo()` / global helper | future | Useful for Wikimedia cross-wiki review tools. |
| Global groups | `user.globalGroups()` | future | Useful for cross-wiki permission-aware tools. |
| Global blocks | `user.globalBlocks()` / `wiki.globalBlocks()` | future | Useful for anti-abuse workflows. |
| Cross-wiki user identity | global identity helper | future | Useful for multi-wiki tools like Zinnia/Nous/Cosmos. |

---

# Recent changes, logs, and monitoring

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| Recent changes | `wiki.recentChanges(options?)` | core | Needed by anti-vandalism and monitoring tools. |
| Recent changes generator | `wiki.recentChangesGen(options?)` | extended | Useful for paginated historical monitoring. |
| Watchlist | `wiki.watchlist(options?)` | extended | User-facing monitoring capability. |
| Generic logs | `wiki.logs(options?)` | core | Useful for admin/review tools. |
| Logs generator | `wiki.logsGen(options?)` | extended | Useful for large log queries. |
| EventStreams recent changes | `wiki.eventStreams("recentchange")` / `/streams` | extended | Custom module; not primarily mwn-shaped. |
| EventStreams typed streams | `/streams` helpers | future | Should be designed after first EventStreams use case. |
| Stream filtering by wiki | `/streams` filters | extended | Important for Citron/Nous-like services. |
| Stream filtering by namespace | `/streams` filters | extended | Common monitoring need. |
| Stream filtering by user | `/streams` filters | extended | Common anti-abuse/review need. |
| Stream filtering by bot/minor/anon | `/streams` filters | extended | Common RecentChanges filtering. |
| Stream filtering by added links | `/streams` filters | future | Useful for link-spam detection. |
| Reconnect / resume behavior | `/streams` runtime policy | future | Important for long-running services. |

---

# Search and discovery

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| Full-text search | `wiki.search(query, options?)` | core | mwn-shaped where practical. |
| Prefix search | `wiki.prefixSearch(query, options?)` | extended | Useful for autocomplete and navigation. |
| OpenSearch | `wiki.openSearch(query, options?)` | optional | Useful if frontend UX needs it. |
| Search titles only | `wiki.searchTitles(query, options?)` | optional | Convenience API; avoid too many aliases early. |
| Categories search/listing | `wiki.categoryMembers(title, options?)` | extended | May also be represented as `wiki.page(category).members()`. |

---

# Upload, file handling, and Commons-related capabilities

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| File object | `wiki.file(name)` | extended | Useful once upload/file metadata is implemented. |
| File metadata | `file.info()` | extended | Useful for Commons/file workflows. |
| File usage | `file.usage(...)` / `wiki.fileUsage(...)` | future | Useful for Commons and page impact analysis. |
| Global file metadata | file helper | future | Useful when local wiki uses Commons-hosted media. |
| Upload file | `wiki.upload(...)` | extended | Frontend behavior may differ from server. |
| Upload from URL | `wiki.uploadFromUrl(...)` | future | Likely server-first. |
| Download file | `wiki.download(...)` | defer | Server-only/filesystem-oriented. |
| Download from URL | `wiki.downloadFromUrl(...)` | defer | Server-only. |
| Stash/chunk upload | upload module | future | Complex; defer until a real use case requires it. |
| Structured Data on Commons / MediaInfo | `file.mediaInfo()` / `/wikibase` helper | future | Important only if Commons workflows become a Taxon Labs priority. |

---

# Parsoid and rendered content

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| Page HTML | `page.html()` | core | Simple high-level API. |
| Revision HTML | `page.revisionHtml(revisionId)` | extended | Useful for review tools. |
| Parse wikitext to HTML | `wiki.parseWikitext(text, options?)` | extended | mwn has parse-related helpers; runtime differences need mapping. |
| Parsoid HTML fetch | `wiki.parsoid().html(title, options?)` | extended | Could live in `/parsoid` later. |
| HTML to wikitext | `wiki.parsoid().toWikitext(html, options?)` | future | More complex; defer. |
| Section-aware HTML | Parsoid helper | future | Useful for translation/editing tools. |
| Lint/parse diagnostics | parse helper | future | Useful for editors but not core. |

---

# Wikibase and SPARQL

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| SPARQL query | `wiki.sparqlQuery(query, endpoint?)` | core | Should exist early because mwn supports it and Taxon tools may need it. |
| Entity object | `wiki.entity(id)` | extended | Use `wikibase`, not only `wikidata`, in naming where possible. |
| Read entity | `entity.get()` | extended | Needed before edit capability. |
| Edit entity | `entity.edit(...)` | future | Complex; defer until needed. |
| Labels/descriptions/aliases | entity helpers | future | Useful, but avoid premature large model. |
| Statements/claims | entity helpers | future | Large domain; likely separate `/wikibase` subpath later. |
| Sitelinks | entity helpers | future | Useful for language-link-related workflows. |
| Lexemes | lexeme helpers | defer | Specialized; not needed soon. |
| Commons MediaInfo entities | wikibase/file helpers | future | Potential Commons-related extension area. |

---

# Wikitext utilities

These utilities should be runtime-independent and should not pull in `mw`, `mwn`, streams, or heavy runtime dependencies.

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| Parse templates | `parseTemplates(text)` | core | Prefer pure functions for bundle size. |
| Parse links | `parseLinks(text)` | core | Runtime-independent. |
| Parse sections | `parseSections(text)` | core | Useful for append/new-section/edit tools. |
| Parse categories | `parseCategories(text)` | extended | Useful for page analysis. |
| Parse tables | `parseTables(text)` | optional | Potentially more complex. |
| Replace template | `replaceTemplate(text, match, replacement)` | extended | Useful for maintenance tools. |
| Insert template | `insertTemplate(text, template, options?)` | extended | Useful for warning/tagging workflows. |
| Wikitext facade | `Wikitext.from(text)` | optional | Ergonomic facade; pure functions should remain primary. |

---

# Title and namespace utilities

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| Title object | `wiki.title(text)` / `Title` | core | API shape should be compatible with mwn/MW expectations. |
| Normalize title | `normalizeTitle(title, options?)` | core | Useful across runtimes. |
| Namespace extraction | `title.namespace()` | core | Depends on site info for full correctness. |
| Main title text | `title.text()` | core | Useful for display and API calls. |
| Talk page conversion | `title.toTalkPage()` / helper | optional | Useful but not urgent. |
| Subject page conversion | `title.toSubjectPage()` / helper | optional | Useful but not urgent. |
| Interwiki parsing | title helper | extended | Needed for cross-wiki tools. |

---

# Testing and mocks

| Capability | Proposed API | Status | Notes |
|---|---|---:|---|
| Mock wiki | `createMockWiki(config?)` | core | Useful for Composite tests and downstream app tests. |
| Mock page | `createMockPage(...)` | extended | Optional direct helper. |
| Mock user | `createMockUser(...)` | extended | Optional direct helper. |
| Contract test helpers | `describeWikiContract(...)` | optional | Useful internally; may or may not be public. |
| Fixture utilities | testing helpers | optional | Useful after multiple apps depend on Composite. |
| Unsupported runtime test helpers | testing helpers | optional | Helps verify explicit runtime failure behavior. |

---

# Capabilities intentionally out of scope

Composite should not contain application-specific business logic.

Examples:

- Anti-vandalism workflows.
- Warning template policy.
- Deletion discussion workflows.
- Mass rollback policy.
- Bot task scheduling.
- Community-specific patrol rules.
- UI components.
- Application state management.
- Organization-specific reporting logic.

Applications may build these on top of Composite, but Composite should remain a reusable MediaWiki SDK.

---

# Prioritization guidance

## First priority

Implement APIs that are:

- used by multiple Taxon Labs applications;
- portable across `mw` and `mwn`;
- easy to test with mocked adapters;
- already represented in an active milestone or `api-mapping.md`.

Examples:

- `wiki.runtime()`
- `Composite.wikis(config)`
- `wiki.page(title)`
- `page.title()`
- `page.text()`
- `wiki.request(params)`
- `wiki.query(params)`
- `page.save(text, summary?, options?)`
- `page.info()`
- `page.exists()`
- `page.categories()`
- `page.templates()`
- `page.links()`

## Second priority

Implement APIs that are important but have runtime differences.

Examples:

- `page.edit(...)`
- `page.history(...)`
- `wiki.search(...)`
- `wiki.userinfo()`
- `wiki.sparqlQuery(...)`
- `wiki.recentChanges(...)`
- `wiki.upload(...)`
- retry/maxlag/request behavior
- pagination/generator helpers

## Third priority

Implement specialized domains when a real application needs them.

Examples:

- EventStreams.
- Parsoid advanced operations.
- Wikibase entity editing.
- File upload workflows.
- Admin-only operations.
- OAuth flows.
- Global Wikimedia identity APIs.

## Documentation relationship

Use this file as the capability roadmap.

Use `api-mapping.md` to track per-API details such as:

- Composite API name;
- `mw` adapter implementation;
- `mwn` adapter implementation;
- runtime support status;
- test status;
- implementation notes.

Use `runtime-support.md` for runtime support policy and labels, not per-API tracking.
