import type {
  Wiki,
  WikiQueryParams,
  WikiQueryResponse,
} from '../../src/index.js';

export interface WikiContractOptions {
  expectedText: string;
  queryParams: WikiQueryParams;
  queryResponse: WikiQueryResponse;
  savedText: string;
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

    it('runs a low-level query', async () => {
      const wiki = createWiki();

      await expect(wiki.query(options.queryParams)).resolves.toEqual(
        options.queryResponse,
      );
    });

    it('saves page text', async () => {
      const wiki = createWiki();
      const page = wiki.page(options.title);

      await expect(page.save(options.savedText, 'Test edit')).resolves.toEqual({
        title: options.title,
      });
    });
  });
}
