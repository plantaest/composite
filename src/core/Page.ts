import type { PageSaveOptions, PageSaveResult } from './types.js';

/**
 * Shared page contract for reading page-level data.
 */
export interface Page {
  /**
   * Return the page title represented by this object.
   */
  title(): string;

  /**
   * Read the current page text.
   */
  text(): Promise<string>;

  /**
   * Save full page text with an optional edit summary.
   */
  save(
    text: string,
    summary?: string,
    options?: PageSaveOptions,
  ): Promise<PageSaveResult>;
}
