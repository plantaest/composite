import type { Mwn } from 'mwn';
import type { Page } from '../../core/Page.js';
import type { PageSaveOptions, PageSaveResult } from '../../core/types.js';

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
