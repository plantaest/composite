# Split page read basics from broader third milestone

Date: 2026-06-28
Status: accepted

## Context

The roadmap originally grouped page metadata, page relationships, page history, search, and current-user information into the third milestone.

That grouping matched the long-term capability direction, but it mixed several different design problems:

- page metadata and simple page relationships;
- revision history shape, revision typing, limits, and continuation;
- search result shape and search options;
- current-user/session semantics.

Composite is following a lightweight spec-driven workflow, so the active milestone should be small enough to specify, implement, and review as one coherent slice.

## Decision

The third milestone will focus only on page read basics:

- `page.info()`;
- `page.exists()`;
- `page.categories()`;
- `page.templates()`;
- `page.links()`.

The milestone will not include:

- `page.history(...)`;
- `page.historyGen(...)`;
- `wiki.search(...)`;
- `wiki.userinfo()`;
- `wiki.currentUser()`;
- user object APIs.

Those APIs will be specified in later milestones.

## Rationale

Page info, existence checks, categories, templates, and links all belong to the `Page` domain object and can be normalized with a small public API.

History, search, and user APIs are also important, but they need more careful choices around result models, pagination, generators, options, and runtime session behavior. Implementing them in the same milestone would make the API surface harder to review and easier to overfit to one runtime.

## Consequences

Milestone 3 becomes smaller and easier to complete confidently.

Applications get useful page-read APIs before Composite settles the larger revision, search, and user models.

The roadmap must keep history, search, and user basics visible as near-term follow-up work instead of losing them from the plan.
