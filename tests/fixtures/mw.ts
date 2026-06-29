import type { MwApi } from '../../src/runtimes/mw/index.js';
import {
  createEditResponse,
  createPageCategoriesResponse,
  createPageInfoResponse,
  createPageTextResponse,
  createSiteInfoResponse,
} from './mediawiki.js';

export interface FakeMw {
  Api: ReturnType<typeof vi.fn>;
  ForeignApi: ReturnType<typeof vi.fn>;
  config: {
    get: ReturnType<typeof vi.fn>;
  };
}

export type FakeMwApi = MwApi & {
  get: ReturnType<typeof vi.fn>;
  postWithToken: ReturnType<typeof vi.fn>;
};

export function createFakeMw(): FakeMw {
  return {
    Api: vi.fn(function Api() {
      return createFakeMwApi();
    }),
    ForeignApi: vi.fn(function ForeignApi() {
      return createFakeMwApi();
    }),
    config: {
      get: vi.fn(() => 'testwiki'),
    },
  };
}

export function createFakeMwApi(text = 'Hello'): FakeMwApi {
  return {
    get: vi.fn(async (params: Record<string, unknown>) => {
      if (params.prop === 'info') {
        return createPageInfoResponse();
      }

      if (params.meta === 'siteinfo') {
        return createSiteInfoResponse();
      }

      if (params.prop === 'revisions') {
        return createPageTextResponse(text);
      }

      if (params.prop === 'categories') {
        return createPageCategoriesResponse();
      }

      return {};
    }),
    postWithToken: vi.fn(async () => createEditResponse()),
  } as FakeMwApi;
}
