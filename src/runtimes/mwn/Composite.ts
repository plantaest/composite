import { Mwn } from 'mwn';
import { WikiRegistry } from '../../core/WikiRegistry.js';
import type { Wikis } from '../../core/Wikis.js';
import { MwnWiki, type MwnWikiConfig } from './MwnWiki.js';

export interface MwnWikisConfig {
  wikis: Record<string, MwnWikiConfig>;
}

/**
 * Node.js / Toolforge runtime entry point backed by mwn.
 */
// biome-ignore lint/complexity/noStaticOnlyClass: Composite is the documented runtime namespace API.
export class Composite {
  /**
   * Create and initialize a mwn-backed wiki.
   */
  static async create(config: MwnWikiConfig): Promise<MwnWiki> {
    const bot = await Mwn.init(config);
    return new MwnWiki(bot, config);
  }

  /**
   * Wrap an existing Mwn instance.
   */
  static from(bot: Mwn, config: MwnWikiConfig = {}): MwnWiki {
    return new MwnWiki(bot, config);
  }

  /**
   * Create a registry of mwn-backed wiki connections.
   */
  static async wikis(config: MwnWikisConfig): Promise<Wikis> {
    const wikiEntries = await Promise.all(
      Object.entries(config.wikis).map(
        async ([wikiId, wikiConfig]): Promise<readonly [string, MwnWiki]> => [
          wikiId,
          await Composite.create(wikiConfig),
        ],
      ),
    );

    return new WikiRegistry(Object.fromEntries(wikiEntries));
  }
}
