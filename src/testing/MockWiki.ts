import type { Runtime } from '../core/Runtime.js';
import type {
  PageInfo,
  WikiQueryParams,
  WikiQueryResponse,
  WikiRequestParams,
  WikiRequestResponse,
} from '../core/types.js';
import type { Wiki } from '../core/Wiki.js';
import { matchesParams } from '../internal/testing/matchesParams.js';
import { MockPage } from './MockPage.js';

export interface MockRequest {
  match: WikiRequestParams;
  response: WikiRequestResponse;
}

export interface MockWikiConfig {
  pages?: Record<string, string>;
  pageInfo?: Record<string, PageInfo>;
  requests?: MockRequest[];
}

export function createMockWiki(config: MockWikiConfig = {}): MockWiki {
  return new MockWiki(config);
}

export class MockWiki implements Wiki {
  private readonly pages: Record<string, string>;
  private readonly pageInfo: Record<string, PageInfo>;
  private readonly requests: MockRequest[];

  constructor(config: MockWikiConfig = {}) {
    this.pages = config.pages ?? {};
    this.pageInfo = config.pageInfo ?? {};
    this.requests = config.requests ?? [];
  }

  runtime(): Runtime {
    return { type: 'mock' };
  }

  page(title: string): MockPage {
    return new MockPage(title, this.pages, this.pageInfo);
  }

  async request(params: WikiRequestParams): Promise<WikiRequestResponse> {
    const request = this.requests.find(({ match }) =>
      matchesParams(match, params),
    );

    return request?.response ?? {};
  }

  async query(params: WikiQueryParams): Promise<WikiQueryResponse> {
    // Match mwn's query helper: action=query is supplied by the helper.
    // Callers should use request() for non-query actions.
    return (await this.request(
      Object.assign({ action: 'query' }, params),
    )) as WikiQueryResponse;
  }
}
