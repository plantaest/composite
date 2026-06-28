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
   * designed.
   */
  title: string;
}
