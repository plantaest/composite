import type { PageInfo } from '../../core/types.js';
import { omitUndefinedFields } from '../object.js';

export interface PageInfoQueryResponse {
  query: {
    normalized?: Array<{
      from: string;
      to: string;
    }>;
    redirects?: Array<{
      from: string;
      to: string;
    }>;
    pages: PageInfoQueryPage[];
  };
}

export interface PageInfoQueryPage {
  pageid?: number;
  ns?: number;
  title: string;
  missing?: true;
  redirect?: true;
  contentmodel?: string;
  pagelanguage?: string;
  touched?: string;
  lastrevid?: number;
  length?: number;
}

export function normalizePageInfo(
  sourceTitle: string,
  response: PageInfoQueryResponse,
): PageInfo {
  const page = response.query.pages[0];

  if (page === undefined) {
    throw new Error('MediaWiki page info response did not include a page.');
  }

  // MediaWiki reports title normalization and redirect following at the query
  // level, while the effective page metadata lives in query.pages[0].
  return omitUndefinedFields<PageInfo>({
    title: page.title,
    sourceTitle,
    exists: page.missing !== true,
    pageId: page.pageid,
    namespace: page.ns,
    missing: page.missing,
    normalized: response.query.normalized !== undefined ? true : undefined,
    redirect:
      response.query.redirects !== undefined || page.redirect !== undefined
        ? true
        : undefined,
    contentModel: page.contentmodel,
    pageLanguage: page.pagelanguage,
    touched: page.touched,
    lastRevisionId: page.lastrevid,
    length: page.length,
  });
}
