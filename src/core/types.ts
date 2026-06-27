export type { Page } from './Page.js';
export type { Runtime, RuntimeType } from './Runtime.js';
export type { User } from './User.js';
export type { Wiki } from './Wiki.js';
export type { Wikis } from './Wikis.js';

export type WikiQueryParams = Record<
  string,
  string | number | boolean | string[] | number[] | Date | File | undefined
>;

export interface WikiQueryResponse {
  batchcomplete?: true;
  continue?: {
    continue: string;
    [key: string]: string;
  };
  query?: Record<string, unknown>;
  [key: string]: unknown;
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
