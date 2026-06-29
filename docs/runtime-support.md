# Runtime Support

Composite supports multiple runtimes behind a shared API.

Initial runtimes:

- `mw`: MediaWiki frontend runtime using `mw.Api`, `mw.ForeignApi`, `mw.config`, `mw.user`, and related frontend facilities.
- `mwn`: Node.js / Toolforge runtime backed by the `mwn` library.

Runtime support must be explicit. Do not assume an API works everywhere.

This document defines runtime support policy and labels. Per-API runtime support, adapter mapping, implementation status, and test coverage are tracked in `api-mapping.md`.

## Support labels

Use these labels in documentation and implementation decisions:

| Label | Meaning |
|---|---|
| `both` | Expected to work in both `/mw` and `/mwn`. |
| `supported` | Expected to work in this runtime. |
| `partial` | Works with limitations or a reduced feature set. |
| `frontend-only` | Only meaningful in the `mw` runtime. |
| `server-only` | Only meaningful in the `mwn` runtime. |
| `future` | Planned but not implemented yet. |
| `unsupported` | Not supported and not planned for this runtime. |

## Runtime support decisions

Every public API should have explicit runtime support recorded in `api-mapping.md`.

When designing or implementing an API, decide:

- whether it works in `/mw`, `/mwn`, both, or neither;
- whether the support label is supported, partial, frontend-only, server-only, future, or unsupported;
- whether unsupported runtime usage should throw `UnsupportedRuntimeError`;
- whether runtime-specific access is acceptable at the application boundary.

Do not duplicate per-API support matrices in this document.

## Unsupported runtime behavior

If an API is not supported by the current runtime, it should fail explicitly.

Preferred behavior:

```ts
throw new UnsupportedRuntimeError({
  api: 'wiki.download',
  runtime: 'mw'
});
```

Do not silently no-op unsupported APIs unless the API contract explicitly permits no-op behavior.

## Runtime-specific access

Use `wiki.runtime()` when application code needs access to the underlying runtime.

This is acceptable for application boundary code, but shared application logic should depend on core interfaces where possible.
