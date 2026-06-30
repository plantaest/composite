import type { Wiki } from './Wiki.js';
import type { WikiRegistry } from './WikiRegistry.js';

/**
 * Map-backed implementation of the shared multi-wiki registry contract.
 */
export class DefaultWikiRegistry implements WikiRegistry {
  private readonly wikiMap: Map<string, Wiki>;

  constructor(wikis: Record<string, Wiki>) {
    this.wikiMap = new Map(Object.entries(wikis));

    if (this.wikiMap.size === 0) {
      throw new Error('At least one wiki is required.');
    }
  }

  get(wikiId: string): Wiki {
    const wiki = this.wikiMap.get(wikiId);

    if (wiki === undefined) {
      throw new Error(`Unknown wiki: ${wikiId}`);
    }

    return wiki;
  }

  has(wikiId: string): boolean {
    return this.wikiMap.has(wikiId);
  }

  ids(): string[] {
    return [...this.wikiMap.keys()];
  }
}
