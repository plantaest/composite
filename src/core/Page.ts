import type { PageInfo, PageSaveOptions, PageSaveResult } from './types.js';

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
   * Read normalized page metadata.
   */
  info(): Promise<PageInfo>;

  /**
   * Return whether the effective page exists.
   */
  exists(): Promise<boolean>;

  /**
   * Return category page titles used by this page.
   */
  categories(): Promise<string[]>;

  /**
   * Save full page text with an optional edit summary.
   */
  save(
    text: string,
    summary?: string,
    options?: PageSaveOptions,
  ): Promise<PageSaveResult>;
}
