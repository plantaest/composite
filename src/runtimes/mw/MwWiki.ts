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
import { MwPage } from './MwPage.js';
import {
  createMwApiOptions,
  getMwGlobal,
  type MwApi,
  type MwApiParams,
} from './mediawiki.js';

export interface MwWikiConfig {
  apiUserAgent?: string;
  serverName?: string;
  wikiId?: string;
}

export class MwWiki implements Wiki {
  constructor(
    private readonly api: MwApi,
    readonly config: MwWikiConfig = {},
  ) {}

  /**
   * Create a MediaWiki frontend wiki from the current context or serverName.
   */
  static create(config: MwWikiConfig = {}): MwWiki {
    const mw = getMwGlobal();

    if (config.serverName === undefined) {
      return new MwWiki(new mw.Api(createMwApiOptions(config)), config);
    }

    if (mw.ForeignApi === undefined) {
      throw new ConfigurationError('MwWiki.create() requires mw.ForeignApi.');
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
  static registry(configs: Record<string, MwWikiConfig>): WikiRegistry {
    const wikis = Object.fromEntries(
      Object.entries(configs).map(([wikiId, wikiConfig]) => {
        const config = {
          ...wikiConfig,
          wikiId: wikiConfig.wikiId ?? wikiId,
        };

        return [wikiId, MwWiki.create(config)];
      }),
    );

    return new DefaultWikiRegistry(wikis);
  }

  runtime(): Runtime {
    return { type: 'mw' };
  }

  page(title: string): MwPage {
    return new MwPage(this.api, title);
  }

  async request(params: WikiRequestParams): Promise<WikiRequestResponse> {
    return Promise.resolve(this.api.get(params as MwApiParams));
  }

  async query(params: WikiQueryParams): Promise<WikiQueryResponse> {
    // Match mwn's query helper: action=query is supplied by the helper.
    // Callers should use request() for non-query actions.
    return (await this.request(
      Object.assign({ action: 'query' }, params),
    )) as WikiQueryResponse;
  }
}
