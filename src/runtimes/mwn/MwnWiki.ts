import type { ApiParams, Mwn, MwnOptions } from 'mwn';
import type { Runtime } from '../../core/Runtime.js';
import type {
  WikiQueryParams,
  WikiQueryResponse,
  WikiRequestParams,
  WikiRequestResponse,
} from '../../core/types.js';
import type { Wiki } from '../../core/Wiki.js';
import { MwnPage } from './MwnPage.js';

export interface MwnWikiConfig extends MwnOptions {
  apiUrl?: string;
  username?: string;
  password?: string;
  userAgent?: string;
}

export class MwnWiki implements Wiki {
  constructor(
    readonly bot: Mwn,
    readonly config: MwnWikiConfig = {},
  ) {}

  runtime(): Runtime {
    return { type: 'mwn' };
  }

  page(title: string): MwnPage {
    return new MwnPage(this.bot, title);
  }

  async request(params: WikiRequestParams): Promise<WikiRequestResponse> {
    return (await this.bot.request(
      params as ApiParams,
    )) as unknown as WikiRequestResponse;
  }

  async query(params: WikiQueryParams): Promise<WikiQueryResponse> {
    // Match mwn's query helper: action=query is supplied by the helper.
    // Callers should use request() for non-query actions.
    return this.request(
      Object.assign({ action: 'query' }, params),
    ) as Promise<WikiQueryResponse>;
  }
}
