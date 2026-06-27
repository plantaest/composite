import type { Wiki } from '../../src/index.js';

export interface WikiContractOptions {
  expectedText: string;
  title: string;
}

export function describeWikiContract(
  name: string,
  createWiki: () => Wiki,
  options: WikiContractOptions,
): void {
  describe(name, () => {
    it('creates a page object for the requested title', () => {
      const wiki = createWiki();
      const page = wiki.page(options.title);

      expect(page.title()).toBe(options.title);
    });

    it('reads page text', async () => {
      const wiki = createWiki();

      await expect(wiki.page(options.title).text()).resolves.toBe(
        options.expectedText,
      );
    });
  });
}
