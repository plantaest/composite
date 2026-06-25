# Composite Project Brief

## Summary

Composite is a MediaWiki API client library and abstraction layer intended to simplify how software interacts with MediaWiki-based wikis.

Rather than mirroring the Action API one-to-one, Composite aims to provide a more task-oriented and reusable API for common wiki operations such as reading page data, retrieving revisions, editing pages, and eventually supporting selected moderation or administrative actions.

## Problem statement

Software that interacts with MediaWiki often has to deal with raw Action API details, runtime-specific API clients, token handling, response normalization, and inconsistent calling patterns.

For a family of related tools, repeatedly solving these concerns in each project leads to duplicated logic, inconsistent abstractions, and higher maintenance cost.

Composite exists to provide a reusable middle layer between application code and MediaWiki APIs.

## Initial direction

Composite v1 focuses on the MediaWiki client runtime:
- TypeScript-based implementation
- intended for code running inside MediaWiki wiki pages or related frontend environments
- built on top of MediaWiki frontend facilities where appropriate

The first release should remain deliberately small and should validate the public API shape before expanding to broader capabilities or additional runtimes.

## Intended value

Composite should help applications:

- perform common wiki tasks with a more ergonomic API
- reduce direct dependence on raw Action API details in application code
- share consistent MediaWiki interaction logic across multiple projects
- establish a foundation that may later be adapted to server-side runtimes

## Success criteria for early Composite

In its early stages, Composite is successful if it can:

1. define a coherent and maintainable public API for a narrow but useful set of wiki tasks;
2. provide a working client-side prototype for core page-reading and editing flows;
3. remain small enough to evolve safely without locking in poor abstractions too early.
