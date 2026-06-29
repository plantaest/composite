import type { Mwn } from 'mwn';
import type { Page } from '../../core/Page.js';
import type {
  PageInfo,
  PageSaveOptions,
  PageSaveResult,
  WikiQueryResponse,
} from '../../core/types.js';
import { normalizePageInfo } from '../../internal/mediawiki/pageInfo.js';

export class MwnPage implements Page {
  constructor(
    private readonly bot: Mwn,
    private readonly pageTitle: string,
  ) {}

  title(): string {
    return this.pageTitle;
  }

  text(): Promise<string> {
    return new this.bot.Page(this.pageTitle).text();
  }

  async info(): Promise<PageInfo> {
    const response = await this.bot.request({
      action: 'query',
      prop: 'info',
      titles: this.pageTitle,
      redirects: true,
      formatversion: 2,
    });

    return normalizePageInfo(this.pageTitle, response as WikiQueryResponse);
  }

  async exists(): Promise<boolean> {
    return (await this.info()).exists;
  }

  categories(): Promise<string[]> {
    return new this.bot.Page(this.pageTitle).categories();
  }

  templates(): Promise<string[]> {
    return new this.bot.Page(this.pageTitle).templates();
  }

  links(): Promise<string[]> {
    return new this.bot.Page(this.pageTitle).links();
  }

  async save(
    text: string,
    summary?: string,
    options: PageSaveOptions = {},
  ): Promise<PageSaveResult> {
    const page = new this.bot.Page(this.pageTitle);
    // mwn types the third argument as ApiEditPageParams from types-mediawiki-api,
    // but it does not export that type from the mwn package root.
    await page.save(text, summary, options as Parameters<typeof page.save>[2]);

    return { title: this.pageTitle };
  }
}
