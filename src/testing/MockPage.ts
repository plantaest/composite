import type { Page } from '../core/Page.js';
import type { PageSaveOptions, PageSaveResult } from '../core/types.js';

export class MockPage implements Page {
  constructor(
    private readonly pageTitle: string,
    private readonly pages: Record<string, string>,
  ) {}

  title(): string {
    return this.pageTitle;
  }

  async text(): Promise<string> {
    return this.pages[this.pageTitle] ?? '';
  }

  async save(
    text: string,
    _summary?: string,
    _options: PageSaveOptions = {},
  ): Promise<PageSaveResult> {
    this.pages[this.pageTitle] = text;

    return { title: this.pageTitle };
  }
}
