import type { Mwn } from 'mwn';
import type { Page } from '../../core/Page.js';

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
}
