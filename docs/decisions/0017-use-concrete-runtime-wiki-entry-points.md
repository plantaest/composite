# Use concrete runtime wiki entry points

Date: 2026-06-30
Status: accepted

## Context

Composite previously exposed runtime factory methods through runtime-specific `Composite` classes. The `mw` runtime exposed `Composite.current()`, `Composite.connect()`, `Composite.from()`, and `Composite.wikis()`. The `mwn` runtime exposed `Composite.create()`, `Composite.from()`, and `Composite.wikis()`.

This made `Composite` a product-level namespace in the public API, even though users primarily work with domain objects such as wiki clients, pages, and registries. An alternative `Wiki.init()` API was considered, but rejected because `Wiki` is already the core runtime-neutral interface. Using `Wiki` as both the core interface and a runtime factory would create IDE and documentation ambiguity.

The existing core naming also had both a `Wikis` interface and a concrete `WikiRegistry` class, which becomes less clear if the runtime factory method is named `registry()`.

## Decision

Use concrete runtime wiki classes as the runtime entry points.

The `mw` runtime will expose:

- `MwWiki.create(config?)`
- `MwWiki.from(api, config?)`
- `MwWiki.registry(configs)`

The `mwn` runtime will expose:

- `MwnWiki.create(config)`
- `MwnWiki.from(bot, config?)`
- `MwnWiki.registry(configs)`

Runtime-created wiki configs should use `serverName` in both `/mw` and `/mwn`. The `/mwn` adapter derives the mwn `apiUrl` internally when calling `Mwn.init`.

The core multi-wiki contract will be named `WikiRegistry`.

The default map-backed implementation will be named `DefaultWikiRegistry`.

The old `Composite` runtime namespace will no longer be the documented public API.

## Rationale

Concrete runtime entry points keep the runtime boundary explicit. `MwWiki.create()` and `MwnWiki.create()` make it clear which adapter is being created without overloading the core `Wiki` interface name.

`create()` is preferred over constructors for documented public usage because it can hide runtime-specific setup such as `mw.Api`, `mw.ForeignApi`, and `Mwn.init`. Constructors may remain available for low-level or internal use, but README examples should prefer `create()` and `from()`.

`from()` remains separate because wrapping an existing client is different from letting Composite create a backing client.

`registry()` is clearer than `wikis()` when the return value is a registry object. Renaming the core interface to `WikiRegistry` aligns the method name, return type, and public terminology.

## Consequences

Runtime construction is more explicit and less dependent on the `Composite` product namespace.

The core `Wiki` interface remains a pure shared contract.

The registry naming becomes consistent across core and runtime APIs.

Existing tests, exports, and documentation using `Composite.*`, `Wikis`, or the concrete `WikiRegistry` class must be migrated.

This migration does not add new registry capabilities such as a default wiki accessor.
