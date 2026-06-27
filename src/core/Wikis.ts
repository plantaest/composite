import type { Wiki } from './Wiki.js';

/**
 * Shared multi-wiki registry contract.
 */
export interface Wikis {
  /**
   * Return a wiki by identifier.
   */
  get(wikiId: string): Wiki;

  /**
   * Return whether a wiki identifier is known to the registry.
   */
  has(wikiId: string): boolean;

  /**
   * Return all known wiki identifiers.
   */
  ids(): string[];
}
