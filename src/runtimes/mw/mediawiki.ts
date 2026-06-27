/// <reference types="types-mediawiki" />
import type { UnknownApiParams } from 'types-mediawiki-api';

export type MwApi = Pick<mw.Api, 'get' | 'postWithToken'>;
export type MwApiParams = UnknownApiParams;

export interface MwGlobal {
  Api: new (options?: Record<string, unknown>) => MwApi;
  ForeignApi?: new (url: string, options?: Record<string, unknown>) => MwApi;
  config?: Pick<typeof mw.config, 'get'>;
}

export interface MwApiOptionsConfig {
  apiUserAgent?: string;
}

export interface MwPageTextResponse {
  query: {
    pages: Array<{
      revisions?: Array<{
        slots?: {
          main?: {
            content?: string;
          };
        };
      }>;
    }>;
  };
}

export function getMwGlobal(): MwGlobal {
  const mw = (globalThis as { mw?: MwGlobal }).mw;

  if (mw === undefined) {
    throw new Error('MediaWiki frontend runtime is not available.');
  }

  return mw;
}

export function createMwApiOptions(
  config: MwApiOptionsConfig,
): Record<string, unknown> | undefined {
  if (config.apiUserAgent === undefined) {
    return undefined;
  }

  return {
    // mw.Api forwards this object to jQuery.ajax. MediaWiki user scripts and
    // gadgets commonly set Api-User-Agent through ajax.headers so API requests
    // can identify the tool in accordance with Wikimedia user-agent guidance.
    ajax: {
      headers: {
        'Api-User-Agent': config.apiUserAgent,
      },
    },
  };
}
