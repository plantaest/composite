import type { Page } from '../core/Page.js';
import type {
  PageInfo,
  PageSaveOptions,
  PageSaveResult,
} from '../core/types.js';

export class MockPage implements Page {
  constructor(
    private readonly pageTitle: string,
    private readonly pages: Record<string, string>,
    private readonly pageInfo: Record<string, PageInfo>,
  ) {}

  title(): string {
    return this.pageTitle;
  }

  async text(): Promise<string> {
    return this.pages[this.pageTitle] ?? '';
  }

  async info(): Promise<PageInfo> {
    const pageInfo = this.pageInfo[this.pageTitle];

    if (pageInfo !== undefined) {
      return pageInfo;
    }

    return {
      title: this.pageTitle,
      sourceTitle: this.pageTitle,
      exists: Object.hasOwn(this.pages, this.pageTitle),
    };
  }

  async exists(): Promise<boolean> {
    return (await this.info()).exists;
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
