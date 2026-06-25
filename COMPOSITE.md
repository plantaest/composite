# COMPOSITE.md

This file defines the working constitution for Composite. It exists to keep the project coherent as it grows, especially in an AI-assisted workflow where implementation can drift unless the repository states its boundaries clearly.

Composite is intentionally a small, evolving project. The goal of this file is not bureaucracy. The goal is to keep design, implementation, and documentation aligned.

---

# 1. Project identity

Composite is a MediaWiki API client library and abstraction layer intended for software that interacts with MediaWiki-based wikis.

Composite is **not** just a raw Action API wrapper. It should expose a domain-oriented API for common wiki tasks while still allowing lower-level access when necessary.

The long-term vision may include multiple runtimes, but the project should not sacrifice v1 clarity in the name of hypothetical future generality.

---

# 2. Current development focus

Composite v1 focuses on the **MediaWiki client runtime**:

- TypeScript / JavaScript
- code running inside a MediaWiki wiki environment
- use of MediaWiki frontend facilities and APIs where appropriate

The current priority is to establish a useful and maintainable public API for this runtime. Server runtimes such as Java or Rust are future concerns and must not drive premature abstraction unless a task explicitly requires it.

---

# 3. Primary goals of v1

Composite v1 should make common Wikipedia-oriented tasks easier and more consistent for client-side tools and applications.

The initial target is a narrow, coherent slice of capability:

- obtain a wiki client for the current runtime
- resolve a page object from a title
- read basic page information
- read page text
- list revisions
- edit pages
- provide a stable and ergonomic API surface for higher-level tools

Composite should reduce direct dependence on raw Action API details in application code wherever practical.

---

# 4. Non-goals for v1

Unless the repository documentation is explicitly revised, Composite v1 should **not** attempt to solve all of the following:

- full cross-runtime parity between client and server
- full Wikidata support
- full Wikimedia Commons workflows
- exhaustive Action API coverage
- complete replication of Pywikibot’s scope
- a generic wrapper for every MediaWiki extension API
- every administrative workflow in the first release

A feature being interesting or useful is not sufficient reason to include it in v1.

---

# 5. Design principles

## 5.1 Domain-oriented, not raw-module-oriented
Prefer task-oriented APIs such as page reading, revision listing, and editing over direct exposure of raw Action API module shapes.

## 5.2 Narrow v1 scope
Do not expand scope casually. Composite v1 should remain intentionally narrow and practical.

## 5.3 Explicit runtime assumptions
If Composite assumes a MediaWiki frontend runtime, document that assumption instead of hiding it behind vague abstractions.

## 5.4 Public API stability matters
Do not change public API shape casually. If a public API decision changes, update the relevant repository documentation.

## 5.5 Raw API escape hatch is allowed
Composite may provide a lower-level escape hatch for unsupported or niche use cases, but the primary experience should remain domain-oriented.

## 5.6 Avoid speculative abstractions
Do not introduce abstractions solely for hypothetical future server runtimes unless the benefit is clear and immediate.

## 5.7 Prefer explicit trade-offs over implicit drift
If a capability is intentionally deferred, narrowed, or left unresolved, record that explicitly in the docs rather than letting the implementation define project direction by accident.

---

# 6. Source of truth and documentation rules

The repository documentation is part of Composite’s source of truth.

Before making substantial design or implementation changes, review the relevant documents:

- `docs/scope.md`
- `docs/use-cases.md`
- `docs/api-sketch.md`
- `docs/decisions.md`
- `docs/open-questions.md`

Documentation does not need to predict every future detail, but it should define enough of the project’s direction that implementation work stays constrained.

If code changes public behavior, runtime assumptions, or the intended API contract, the relevant documentation should be updated in the same work cycle.

---

# 7. Rules for AI-assisted development

AI assistance is expected in this repository, but AI output must follow repository rules rather than inventing project direction.

When using AI to review, design, or implement Composite:

1. **Read repository docs first.**  
   The AI should be pointed to `COMPOSITE.md` and the relevant files under `docs/` before being asked to propose code or major design changes.

2. **Do not invent v1 scope beyond what is documented.**  
   If a requested change would broaden scope, treat that as a scope decision, not as a silent implementation detail.

3. **Do not silently introduce Wikidata, Commons, or cross-runtime abstractions.**  
   Those may become relevant later, but they should not be smuggled into v1 without an explicit project decision.

4. **Report ambiguity instead of hiding it.**  
   If the docs are insufficient or contradictory, the AI should say so and point to the ambiguity instead of fabricating a major behavior decision.

5. **Keep docs and code aligned.**  
   If public behavior changes, update `docs/api-sketch.md`, `docs/decisions.md`, `docs/scope.md`, or `docs/use-cases.md` as appropriate.

6. **Prefer narrow, reviewable tasks.**  
   Ask the AI to review docs, refine one API area, implement one method, add tests for one behavior, or refactor one module. Avoid open-ended “build the whole library” prompts.

7. **Do not use the AI as the only memory of project decisions.**  
   Important decisions belong in the repository, especially in `docs/decisions.md` and `docs/open-questions.md`.

---

# 8. Working rules for changes

## 8.1 Small, coherent changes
Prefer small, reviewable changes over large mixed rewrites. Avoid combining unrelated docs rewrites, refactors, and feature additions in one opaque change set.

## 8.2 Scope changes must be visible
If a capability moves between P0, P1, or out-of-scope status, update `docs/scope.md` and related docs.

## 8.3 API changes must be visible
If method names, return shapes, error semantics, or object model direction change, update `docs/api-sketch.md` and record the decision if it materially affects future work.

## 8.4 Open questions should stay visible
If implementation reveals an unresolved design issue, record it in `docs/open-questions.md` rather than letting the question disappear into commit history or chat logs.

---

# 9. Documentation map

- `docs/brief.md` — high-level project brief
- `docs/scope.md` — v1 scope, priorities, runtime assumptions, and non-goals
- `docs/use-cases.md` — SDK-level use cases and capability targets
- `docs/api-sketch.md` — early public API draft and behavioral expectations
- `docs/decisions.md` — decisions that should remain explicit over time
- `docs/open-questions.md` — unresolved design questions that need visibility
- `prompts/` — reusable prompts for AI-assisted work

For workflow conventions such as branch naming, commit messages, and daily working style, see `CONTRIBUTING.md`.

---

# 10. Definition of done for early-stage work

A design or implementation task should not be considered complete unless:

- the result is consistent with `COMPOSITE.md`;
- the change remains aligned with Composite’s documented v1 scope;
- relevant docs are updated when public behavior or project direction changes;
- important unresolved questions are recorded instead of silently ignored;
- the work does not introduce speculative abstractions without a concrete reason.

Composite does not need heavyweight process. It does need explicit boundaries.
