import type { Runtime } from '../core/Runtime.js';
import type { Wiki } from '../core/Wiki.js';
import { MockPage } from './MockPage.js';

export interface MockWikiConfig {
  pages?: Record<string, string>;
}

export function createMockWiki(config: MockWikiConfig = {}): MockWiki {
  return new MockWiki(config);
}

export class MockWiki implements Wiki {
  private readonly pages: Record<string, string>;

  constructor(config: MockWikiConfig = {}) {
    this.pages = config.pages ?? {};
  }

  runtime(): Runtime {
    return { type: 'mock' };
  }

  page(title: string): MockPage {
    return new MockPage(title, this.pages[title] ?? '');
  }
}
