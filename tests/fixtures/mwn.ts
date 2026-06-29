import type { Mwn } from 'mwn';
import {
  createEditResponse,
  createPageInfoResponse,
  createSiteInfoResponse,
} from './mediawiki.js';

export function createFakeBot(text = 'Hello'): Mwn {
  return {
    request: vi.fn(async (params: Record<string, unknown>) => {
      if (params.prop === 'info') {
        return createPageInfoResponse();
      }

      if (params.meta === 'siteinfo') {
        return createSiteInfoResponse();
      }

      return {};
    }),
    Page: vi.fn(function Page(title: string) {
      return {
        text: vi.fn(async () => `${text} from ${title}`),
        save: vi.fn(async () => createEditResponse()),
      };
    }),
  } as unknown as Mwn;
}
