export type { Page } from './Page.js';
export type { Runtime, RuntimeType } from './Runtime.js';
export type { User } from './User.js';
export type { Wiki } from './Wiki.js';
export type { Wikis } from './Wikis.js';

export type WikiRequestParams = Record<
  string,
  string | number | boolean | string[] | number[] | Date | File | undefined
>;

export interface WikiRequestResponse {
  [key: string]: unknown;
}

export type WikiQueryParams = WikiRequestParams;

export interface WikiQueryResponse extends WikiRequestResponse {
  batchcomplete?: true;
  continue?: {
    continue: string;
    [key: string]: string;
  };
  query?: Record<string, unknown>;
}

export interface PageInfo {
  /**
   * Current effective title returned by MediaWiki.
   *
   * This may differ from sourceTitle when MediaWiki normalizes a title
   * (`WP:Sandbox` -> `Wikipedia:Sandbox` on test.wikipedia.org) or follows a
   * redirect (`Quandong` -> `Santalum acuminatum` on vi.wikipedia.org).
   */
  title: string;

  /**
   * Original title used to create the Page object.
   */
  sourceTitle: string;

  /**
   * True when the effective page exists.
   *
   * Missing pages are represented as data, not as errors.
   */
  exists: boolean;

  /**
   * MediaWiki page ID for existing pages.
   */
  pageId?: number;

  /**
   * MediaWiki namespace ID.
   */
  namespace?: number;

  /**
   * True when MediaWiki reports the effective page as missing.
   */
  missing?: boolean;

  /**
   * True when MediaWiki normalized sourceTitle before resolving page info.
   */
  normalized?: boolean;

  /**
   * True when MediaWiki followed a redirect before returning page info.
   */
  redirect?: boolean;

  /**
   * MediaWiki content model, such as `wikitext`.
   */
  contentModel?: string;

  /**
   * MediaWiki page language code, such as `en` or `vi`.
   */
  pageLanguage?: string;

  /**
   * MediaWiki touched timestamp for the effective page.
   */
  touched?: string;

  /**
   * Latest revision ID for the effective page.
   */
  lastRevisionId?: number;

  /**
   * Page length in bytes for the effective page.
   */
  length?: number;
}

export interface PageSaveOptions {
  /**
   * This intentionally starts as a small subset of ApiEditPageParams from
   * types-mediawiki-api.
   */
  minor?: boolean;
}

export interface PageSaveResult {
  /**
   * Title of the page Composite attempted to save.
   *
   * This result is intentionally minimal until edit response normalization is
   * designed. MediaWiki edit responses can include page ID, old/new revision
   * IDs, timestamps, and other useful fields, but Composite should add those
   * only after a focused save-result design.
   */
  title: string;
}
