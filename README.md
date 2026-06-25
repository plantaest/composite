# Composite

Composite is a MediaWiki API client library and abstraction layer for software that interacts with MediaWiki-based wikis.

Its purpose is to provide a reusable, task-oriented API for common wiki operations—such as reading pages, browsing revisions, and editing content—without forcing every application to work directly with raw MediaWiki Action API details.

Composite is being developed as a small, long-lived foundation for multiple MediaWiki-related tools. It is intentionally narrow in its first version and is designed to evolve incrementally rather than trying to model the entire MediaWiki ecosystem at once.

---

# Current focus

Composite v1 focuses on the **MediaWiki client runtime**:

- TypeScript / JavaScript implementation
- code running inside a MediaWiki wiki environment
- use of MediaWiki frontend facilities and APIs where appropriate

The first goal of the project is not cross-runtime parity. It is to validate a coherent public API for the client runtime and make a small but useful slice of MediaWiki interaction easier to build on.

---

# What Composite is trying to solve

Software that interacts with MediaWiki often has to repeatedly solve the same problems:

- composing raw Action API requests
- dealing with runtime-specific API clients
- normalizing responses for application code
- handling token-related edit flows
- scattering MediaWiki-specific logic across many projects

Composite exists to reduce that repetition by providing a shared middle layer between application code and MediaWiki APIs.

---

# v1 design direction

Composite v1 is **not** intended to be:

- a full clone of Pywikibot
- a wrapper for every MediaWiki Action API module
- a generic solution for every Wikimedia project workflow
- a complete cross-runtime abstraction over client and server environments

Instead, v1 aims to prove a compact and maintainable API around a small set of high-value tasks.

Current P0 focus:

1. obtain a wiki client for the current runtime
2. resolve a page object from a title
3. read basic page information
4. read page text
5. list revisions for a page
6. edit a page with supplied content and summary

---

# Repository guide

## Core repository files

- `COMPOSITE.md` — project constitution, design rules, and AI-assisted development rules
- `CONTRIBUTING.md` — branch, commit, workflow, and documentation conventions
- `docs/brief.md` — high-level project brief
- `docs/scope.md` — v1 scope, priorities, and non-goals
- `docs/use-cases.md` — SDK-level use cases and capability targets
- `docs/api-sketch.md` — early draft of the public API shape
- `docs/decisions.md` — explicit design and architecture decisions
- `docs/open-questions.md` — unresolved design questions that should stay visible
- `prompts/` — reusable prompts for AI-assisted review, specification, and implementation work

## How to use this repository

If you are working on Composite implementation or design:

1. start with `COMPOSITE.md` to understand the project rules and boundaries;
2. read `docs/scope.md`, `docs/use-cases.md`, and `docs/api-sketch.md` before changing public behavior;
3. use `CONTRIBUTING.md` for branch naming, commit conventions, and daily workflow guidance;
4. update `docs/decisions.md` or `docs/open-questions.md` when the project direction becomes more concrete.

---

# Project status

Composite is currently in the **design and early prototyping stage**.

The immediate objective is to tighten the v1 contract, implement the first client-runtime slice, and keep the code and docs aligned as the project grows.

---

# Working style

Composite is currently maintained in a lightweight, AI-assisted workflow. That means:

- documentation is part of the source of truth;
- public API changes should be reflected in the docs;
- implementation should stay aligned with the documented v1 scope;
- unresolved design questions should be recorded explicitly rather than left in chat history or private notes.

For repository workflow details, see `CONTRIBUTING.md`.
