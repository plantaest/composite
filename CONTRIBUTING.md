# Contributing to Composite

Composite is currently a small, AI-assisted project with a narrow v1 scope. This guide defines the working conventions for changes to the repository so that the project remains coherent as it evolves.

Composite is currently maintained primarily by a single developer with AI assistance, so the process in this repository is intentionally lightweight. The purpose of these conventions is not bureaucracy; it is to keep design and implementation aligned as the project grows.

---

# 1. Working principles

## 1.1 Documentation is part of the source of truth
Before changing implementation, read the relevant project documents:

- `COMPOSITE.md`
- `docs/scope.md`
- `docs/use-cases.md`
- `docs/api-sketch.md`
- `docs/decisions.md`
- `docs/open-questions.md`

If implementation changes public behavior, the documentation should be updated as part of the same change or immediately after it.

## 1.2 Prefer small, reviewable changes
Do not mix unrelated design changes, refactors, and new features in one commit or one branch unless there is a strong reason.

## 1.3 Do not expand v1 casually
Composite v1 is intentionally narrow. New capabilities should be evaluated against the documented scope before they are implemented.

## 1.4 Record decisions explicitly
If a design choice materially affects the public API, runtime model, or long-term direction, record it in `docs/decisions.md`.

## 1.5 Record unresolved questions explicitly
If an important design question remains open, do not bury it in chat history or commit discussion. Record it in `docs/open-questions.md`.

---

# 2. Branch naming

For a small repository, branch naming should stay simple and descriptive.

Recommended branch format:

```text
<type>/<short-description>
```

Examples:

- `docs/page-read-review`
- `feat/page-read-prototype`
- `feat/edit-api`
- `refactor/client-adapter`
- `fix/missing-page-handling`
- `test/page-info`

Recommended branch type prefixes:

- `docs` — documentation-only changes
- `feat` — new user-facing or public API capabilities
- `fix` — bug fixes or incorrect behavior fixes
- `refactor` — structural code changes without intended behavior change
- `test` — test-related work
- `build` — build, packaging, release, or tooling work
- `chore` — repository housekeeping or maintenance work

Branch names should be short but specific enough that the purpose is obvious from the Git history.

---

# 3. Commit message convention

Composite uses a lightweight Conventional Commits style.

Recommended format:

```text
<type>(<scope>): <summary>
```

If a scope would add noise rather than clarity, the shorter form is acceptable:

```text
<type>: <summary>
```

## 3.1 Recommended commit types

- `feat` — add or expose new capability
- `fix` — correct broken or incorrect behavior
- `docs` — documentation changes
- `refactor` — internal restructuring without intended behavior change
- `test` — add or revise tests
- `build` — build tooling, packaging, or dependency/build config changes
- `ci` — CI workflow changes
- `chore` — repository setup, housekeeping, or maintenance changes

## 3.2 Recommended scopes

Use short, stable scopes when they add useful context. Examples:

- `repo`
- `docs`
- `api`
- `client`
- `page`
- `revision`
- `edit`
- `errors`
- `tests`
- `build`

Examples:

```text
chore(repo): initialize Composite starter documentation
docs(api): clarify page-read API behavior
feat(page): add getInfo() and getText() prototype
fix(edit): normalize permission failure handling
refactor(client): simplify MediaWiki frontend adapter
test(page): cover missing-page behavior
```

## 3.3 Commit message style rules

Use the summary line to describe what the change does, not the entire implementation story.

Prefer imperative phrasing:

- `feat(page): add getRevisions() prototype`
- `docs(api): clarify missing-page behavior`

Avoid vague summaries such as:

- `update stuff`
- `changes`
- `misc fixes`

## 3.4 Commit sizing

Prefer multiple small commits over one large mixed commit when practical.

For example, if a task requires:
1. refining page-read documentation,
2. implementing `page.getInfo()`,
3. adding tests,

then it is usually better to split those into separate commits if the split remains readable.

---

# 4. Pull request and change grouping guidance

Composite may often be developed by a single maintainer, but changes should still be grouped as if they are going to be reviewed later.

A good change set should ideally do one of the following:

- refine documentation for one capability;
- implement one small capability or one coherent vertical slice;
- refactor one area without mixing unrelated behavior changes;
- add tests for one feature area.

Try to avoid a single change set that simultaneously:
- redesigns the API,
- changes multiple unrelated modules,
- rewrites documentation across the repository,
- and introduces new capabilities.

---

# 5. When to update documentation

## 5.1 Update `docs/api-sketch.md` when:
- the public API shape changes;
- method names, signatures, or return shapes change;
- error behavior becomes more concrete;
- a previously vague API behavior is now intentionally defined.

## 5.2 Update `docs/scope.md` when:
- a capability changes priority between P0, P1, or out of scope;
- the runtime assumptions of v1 change;
- the project explicitly broadens or narrows what v1 includes.

## 5.3 Update `docs/use-cases.md` when:
- a new use case becomes a real project target;
- an existing use case is re-prioritized or dropped;
- the description of a capability materially changes.

## 5.4 Update `docs/decisions.md` when:
- a design choice should no longer remain implicit;
- a public API direction is intentionally chosen over alternatives;
- a runtime or architecture decision is made that future work must respect.

## 5.5 Update `docs/open-questions.md` when:
- a real unresolved question appears during implementation or review;
- a previously open question is no longer relevant and should be removed or replaced;
- a decision closes an open question and the question should be marked accordingly or removed.

---

# 6. Decision records

Use `docs/decisions.md` for decisions that matter beyond one small implementation detail.

Typical candidates include:

- public API shape decisions
- missing-page behavior strategy
- error model direction
- raw API escape hatch design
- runtime boundary decisions
- whether a capability belongs in v1

Do not create a decision record for every tiny refactor. Use judgment.

A decision entry should briefly explain:

- what was decided
- why it was chosen
- important alternatives considered
- consequences for future work

---

# 7. Open questions

If you encounter a question that is important enough to influence the public API or implementation direction, record it in `docs/open-questions.md` instead of keeping it only in chat or local notes.

Examples:

- Should `page.getText()` throw on missing pages or return a structured missing result?
- Should `Composite.current()` remain the primary entry point?
- How much of the underlying MediaWiki frontend API should be exposed through an escape hatch?

This helps prevent repeated re-discussion and makes AI-assisted work more stable.

---

# 8. AI-assisted development rules

Composite is intended to be developed with AI assistance, but AI output must be constrained by repository documentation rather than allowed to drift.

## 8.1 Before asking AI to implement
Point the AI to the relevant repository documents first, especially:

- `COMPOSITE.md`
- `docs/scope.md`
- `docs/use-cases.md`
- `docs/api-sketch.md`
- `docs/open-questions.md`

## 8.2 Ask for narrow tasks
Prefer prompts such as:

- review the current docs for contradictions;
- refine the API contract for one capability;
- implement one documented method;
- add tests for one behavior;
- refactor one internal module.

Avoid prompts like “build the whole library” or “design everything from scratch” once the repository already contains project docs.

## 8.3 Require ambiguity reporting
If the docs are unclear, the AI should be instructed to stop and report ambiguity instead of silently inventing behavior.

## 8.4 Keep docs and code aligned
If AI-generated code changes public behavior, update the relevant docs in the same work cycle.

---

# 9. Suggested daily workflow

A lightweight workflow for Composite work can look like this:

## Step 1 — pick a narrow task
Examples:
- clarify missing-page behavior for page reads
- define the first `PageInfo` shape
- implement `Composite.current()`
- implement `page.getInfo()`

## Step 2 — review docs first
Check whether the task is already sufficiently specified in:
- `docs/scope.md`
- `docs/use-cases.md`
- `docs/api-sketch.md`
- `docs/open-questions.md`

If not, tighten the docs first.

## Step 3 — open a focused branch
Example:

```text
feat/page-get-info
```

## Step 4 — ask AI for a narrow plan
Prefer asking for:
- a summary of the intended behavior,
- ambiguities,
- a minimal implementation plan,
before asking for code changes.

## Step 5 — implement in a small slice
Keep the change focused. Avoid mixing speculative follow-up work.

## Step 6 — update docs if needed
If the public behavior or documented direction changed, update the relevant docs.

## Step 7 — commit with a clear message
Examples:

```text
docs(api): define initial PageInfo shape
feat(page): add getInfo() client prototype
test(page): cover missing-page handling for getInfo()
```

---

# 10. What not to do

Avoid the following patterns:

- implementing broad server-runtime abstractions during the client-focused v1 stage without a concrete need;
- adding Wikidata or Commons-specific concepts to the core object model without an explicit scope decision;
- using raw Action API response shapes as the default public API simply because they are easy to pass through;
- leaving important API behavior undocumented after it has effectively been decided in code;
- combining unrelated docs rewrites, refactors, and new features into one opaque change.

---

# 11. Final guideline

If unsure, prefer the smaller change, the narrower scope, and the more explicit documentation update.

Composite does not need heavyweight process. It does need consistency.
