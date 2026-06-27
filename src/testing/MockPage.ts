import type { Page } from '../core/Page.js';

export class MockPage implements Page {
  constructor(
    private readonly pageTitle: string,
    private readonly pageText: string,
  ) {}

  title(): string {
    return this.pageTitle;
  }

  async text(): Promise<string> {
    return this.pageText;
  }
}
