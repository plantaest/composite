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
}
