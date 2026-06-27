import type { Page } from './Page.js';
import type { Runtime } from './Runtime.js';
import type { WikiQueryParams, WikiQueryResponse } from './types.js';

/**
 * Shared MediaWiki client contract used by application code.
 *
 * Runtime-specific entry points create concrete Wiki objects; shared code should
 * depend on this interface.
 */
export interface Wiki {
  /**
   * Return information about the runtime backing this wiki.
   */
  runtime(): Runtime;

  /**
   * Create a Page object for the given title.
   */
  page(title: string): Page;

  /**
   * Run a low-level MediaWiki Action API query through the active runtime.
   */
  query(params: WikiQueryParams): Promise<WikiQueryResponse>;
}
