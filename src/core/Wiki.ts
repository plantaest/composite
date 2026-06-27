import type { Page } from "./Page";
import type { Runtime } from "./runtime";

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
}
