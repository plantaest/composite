import type { Page } from '../../core/Page.js';
import type { PageSaveOptions, PageSaveResult } from '../../core/types.js';
import type { MwApi, MwApiParams, MwPageTextResponse } from './mediawiki.js';

export class MwPage implements Page {
  constructor(
    private readonly api: MwApi,
    private readonly pageTitle: string,
  ) {}

  title(): string {
    return this.pageTitle;
  }

  async text(): Promise<string> {
    // Follows the MediaWiki Action API revisions module:
    // https://www.mediawiki.org/wiki/API:Revisions
    const response = (await this.api.get({
      action: 'query',
      prop: 'revisions',
      titles: this.pageTitle,
      rvprop: 'content',
      rvslots: 'main',
      formatversion: 2,
    })) as MwPageTextResponse;

    return response.query.pages[0]?.revisions?.[0]?.slots?.main?.content ?? '';
  }

  async save(
    text: string,
    summary?: string,
    options: PageSaveOptions = {},
  ): Promise<PageSaveResult> {
    const params: MwApiParams = {
      action: 'edit',
      title: this.pageTitle,
      text,
    };

    if (summary !== undefined) {
      params.summary = summary;
    }

    if (options.minor !== undefined) {
      params.minor = options.minor;
    }

    // Edit params follow the MediaWiki Action API edit module:
    // https://www.mediawiki.org/wiki/API:Edit
    await this.api.postWithToken('csrf', params);

    return { title: this.pageTitle };
  }
}
