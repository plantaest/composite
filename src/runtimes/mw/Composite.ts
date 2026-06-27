import { ConfigurationError } from '../../core/errors.js';
import { WikiRegistry } from '../../core/WikiRegistry.js';
import type { Wikis } from '../../core/Wikis.js';
import { MwWiki, type MwWikiConfig } from './MwWiki.js';
import { createMwApiOptions, getMwGlobal, type MwApi } from './mediawiki.js';

export interface MwWikisConfig {
  wikis: Record<string, MwWikiConfig>;
}

/**
 * MediaWiki frontend runtime entry point.
 *
 * Use this inside user scripts, gadgets, and in-wiki frontend applications.
 */
// biome-ignore lint/complexity/noStaticOnlyClass: Composite is the documented runtime namespace API.
export class Composite {
  /**
   * Create a wiki backed by the current MediaWiki frontend API context.
   */
  static current(config: MwWikiConfig = {}): MwWiki {
    const mw = getMwGlobal();
    return new MwWiki(new mw.Api(createMwApiOptions(config)), config);
  }

  /**
   * Connect to an explicitly configured wiki through mw.ForeignApi.
   */
  static connect(config: MwWikiConfig): MwWiki {
    if (config.serverName === undefined) {
      throw new ConfigurationError('Composite.connect() requires serverName.');
    }

    const mw = getMwGlobal();

    if (mw.ForeignApi === undefined) {
      throw new ConfigurationError(
        'Composite.connect() requires mw.ForeignApi.',
      );
    }

    const url = `https://${config.serverName}/w/api.php`;
    return new MwWiki(
      new mw.ForeignApi(url, createMwApiOptions(config)),
      config,
    );
  }

  /**
   * Wrap an existing mw.Api-compatible instance.
   */
  static from(api: MwApi, config: MwWikiConfig = {}): MwWiki {
    return new MwWiki(api, config);
  }

  /**
   * Create a registry of explicitly configured frontend wiki connections.
   */
  static wikis(config: MwWikisConfig): Wikis {
    const wikis = Object.fromEntries(
      Object.entries(config.wikis).map(([wikiId, wikiConfig]) => {
        const config = {
          ...wikiConfig,
          wikiId: wikiConfig.wikiId ?? wikiId,
        };

        return [
          wikiId,
          config.serverName !== undefined
            ? Composite.connect(config)
            : Composite.current(config),
        ];
      }),
    );

    return new WikiRegistry(wikis);
  }
}
