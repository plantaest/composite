import type { Page } from '../../core/Page.js';
import type { MwApi, MwPageTextResponse } from './mediawiki.js';

export class MwPage implements Page {
  constructor(
    private readonly api: MwApi,
    private readonly pageTitle: string,
  ) {}

  title(): string {
    return this.pageTitle;
  }

  async text(): Promise<string> {
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
}
