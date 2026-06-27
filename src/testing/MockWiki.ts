import type { Runtime } from '../core/Runtime.js';
import type { WikiQueryParams, WikiQueryResponse } from '../core/types.js';
import type { Wiki } from '../core/Wiki.js';
import { MockPage } from './MockPage.js';
import { matchesParams } from './matchesParams.js';

export interface MockQuery {
  match: WikiQueryParams;
  response: WikiQueryResponse;
}

export interface MockWikiConfig {
  pages?: Record<string, string>;
  queries?: MockQuery[];
}

export function createMockWiki(config: MockWikiConfig = {}): MockWiki {
  return new MockWiki(config);
}

export class MockWiki implements Wiki {
  private readonly pages: Record<string, string>;
  private readonly queries: MockQuery[];

  constructor(config: MockWikiConfig = {}) {
    this.pages = config.pages ?? {};
    this.queries = config.queries ?? [];
  }

  runtime(): Runtime {
    return { type: 'mock' };
  }

  page(title: string): MockPage {
    return new MockPage(title, this.pages);
  }

  async query(params: WikiQueryParams): Promise<WikiQueryResponse> {
    const query = this.queries.find(({ match }) =>
      matchesParams(match, params),
    );

    return query?.response ?? {};
  }
}
