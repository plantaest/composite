import type { Runtime } from '../../core/Runtime.js';
import type { Wiki } from '../../core/Wiki.js';
import { MwPage } from './MwPage.js';
import type { MwApi } from './mediawiki.js';

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

  runtime(): Runtime {
    return { type: 'mw' };
  }

  page(title: string): MwPage {
    return new MwPage(this.api, title);
  }
}
