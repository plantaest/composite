import type { ApiParams, MwnOptions } from 'mwn';
import { Mwn } from 'mwn';
import { DefaultWikiRegistry } from '../../core/DefaultWikiRegistry.js';
import { ConfigurationError } from '../../core/errors.js';
import type { Runtime } from '../../core/Runtime.js';
import type {
  WikiQueryParams,
  WikiQueryResponse,
  WikiRequestParams,
  WikiRequestResponse,
} from '../../core/types.js';
import type { Wiki } from '../../core/Wiki.js';
import type { WikiRegistry } from '../../core/WikiRegistry.js';
import { MwnPage } from './MwnPage.js';

export interface MwnWikiConfig {
  serverName?: string;
  username?: string;
  password?: string;
  userAgent?: string;
}

export class MwnWiki implements Wiki {
  constructor(
    readonly bot: Mwn,
    readonly config: MwnWikiConfig = {},
  ) {}

  /**
   * Create and initialize a mwn-backed wiki.
   */
  static async create(config: MwnWikiConfig): Promise<MwnWiki> {
    if (config.serverName === undefined) {
      throw new ConfigurationError('MwnWiki.create() requires serverName.');
    }

    const { serverName, ...mwnConfig } = config;
    const initConfig: MwnOptions = {
      ...mwnConfig,
      apiUrl: `https://${serverName}/w/api.php`,
    };
    const bot = await Mwn.init(initConfig);

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
  static async registry(
    configs: Record<string, MwnWikiConfig>,
  ): Promise<WikiRegistry> {
    const wikiEntries = await Promise.all(
      Object.entries(configs).map(
        async ([wikiId, wikiConfig]): Promise<readonly [string, MwnWiki]> => [
          wikiId,
          await MwnWiki.create(wikiConfig),
        ],
      ),
    );

    return new DefaultWikiRegistry(Object.fromEntries(wikiEntries));
  }

  runtime(): Runtime {
    return { type: 'mwn' };
  }

  page(title: string): MwnPage {
    return new MwnPage(this.bot, title);
  }

  async request(params: WikiRequestParams): Promise<WikiRequestResponse> {
    return (await this.bot.request(params as ApiParams)) as WikiRequestResponse;
  }

  async query(params: WikiQueryParams): Promise<WikiQueryResponse> {
    // Match mwn's query helper: action=query is supplied by the helper.
    // Callers should use request() for non-query actions.
    return (await this.request(
      Object.assign({ action: 'query' }, params),
    )) as WikiQueryResponse;
  }
}
