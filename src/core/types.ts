export type { Page } from './Page.js';
export type { Runtime, RuntimeType } from './Runtime.js';
export type { User } from './User.js';
export type { Wiki } from './Wiki.js';
export type { Wikis } from './Wikis.js';

/**
 * Request parameters for the MediaWiki Action API.
 *
 * Inspired by mwn's ApiParams type, but kept as a small Composite-owned shape
 * so the root API does not expose upstream types directly.
 *
 * Reference:
 * https://mwn.toolforge.org/docs/api/types/ApiParams.html
 */
export type WikiRequestParams = Record<
  string,
  string | number | boolean | string[] | number[] | Date | File | undefined
>;

/**
 * Generic MediaWiki Action API response.
 *
 * Inspired by mwn's ApiResponse type.
 *
 * Reference:
 * https://mwn.toolforge.org/docs/api/interfaces/ApiResponse.html
 */
export interface WikiRequestResponse {
  [key: string]: unknown;
}

/**
 * Query parameters for MediaWiki action=query.
 *
 * Currently, the same shape as WikiRequestParams, matching mwn's use of
 * ApiParams for both request() and query().
 */
export type WikiQueryParams = WikiRequestParams;

/**
 * MediaWiki action=query response.
 *
 * Inspired by mwn's ApiQueryResponse type. Keep this intentionally partial
 * and expand it only when Composite APIs need typed access to more Action API
 * response fields.
 *
 * Reference:
 * https://mwn.toolforge.org/docs/api/interfaces/ApiQueryResponse.html
 */
export interface WikiQueryResponse extends WikiRequestResponse {
  batchcomplete?: true;
  continue?: {
    continue: string;
    [key: string]: string;
  };
  query?: {
    pages?: WikiQueryPage[];
    normalized?: Array<{
      from: string;
      to: string;
    }>;
    redirects?: Array<{
      from: string;
      to: string;
    }>;
    [key: string]: unknown;
  };
}

/**
 * Page object inside an action=query response.
 *
 * Inspired by mwn's ApiPage type.
 *
 * Reference:
 * https://mwn.toolforge.org/docs/api/interfaces/ApiPage.html
 */
export interface WikiQueryPage {
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
  revisions?: WikiQueryRevision[];
  categories?: WikiQueryLinkTarget[];
  templates?: WikiQueryLinkTarget[];
  links?: WikiQueryLinkTarget[];
  [key: string]: unknown;
}

/**
 * Revision object inside an action=query page response.
 *
 * Inspired by mwn's ApiRevision type.
 *
 * Reference:
 * https://mwn.toolforge.org/docs/api/interfaces/ApiRevision.html
 */
export interface WikiQueryRevision {
  slots?: {
    main: WikiQueryRevisionSlot;
    [slotname: string]: WikiQueryRevisionSlot;
  };
  [key: string]: unknown;
}

/**
 * Revision slot object inside an action=query revision response.
 *
 * Inspired by mwn's ApiRevisionSlot type.
 *
 * Reference:
 * https://mwn.toolforge.org/docs/api/interfaces/ApiRevisionSlot.html
 */
export interface WikiQueryRevisionSlot {
  content?: string;
  [key: string]: unknown;
}

/**
 * Link-like title target inside page relationship props.
 *
 * Inspired by mwn's LinkTarget type.
 *
 * Reference:
 * https://mwn.toolforge.org/docs/api/types/LinkTarget.html
 */
export interface WikiQueryLinkTarget {
  ns?: number;
  title: string;
}

/**
 * Normalized page metadata returned by Page.info().
 *
 * This intentionally exposes the page identity and common prop=info fields
 * that Composite can keep consistent across runtimes.
 */
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

/**
 * Options accepted by Page.save().
 *
 * Keep this small until Composite designs a broader edit API.
 */
export interface PageSaveOptions {
  /**
   * This intentionally starts as a small subset of ApiEditPageParams from
   * types-mediawiki-api.
   */
  minor?: boolean;
}

/**
 * Normalized result returned by Page.save().
 *
 * This currently confirms the attempted page title without exposing raw edit
 * response details.
 */
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
