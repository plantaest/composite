import type {
  PageInfo,
  Wiki,
  WikiQueryParams,
  WikiQueryResponse,
  WikiRequestParams,
  WikiRequestResponse,
} from '../../src/index.js';

export interface WikiContractOptions {
  expectedText: string;
  pageInfo: PageInfo;
  queryParams: WikiQueryParams;
  queryResponse: WikiQueryResponse;
  requestParams: WikiRequestParams;
  requestResponse: WikiRequestResponse;
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

    it('reads page info', async () => {
      const wiki = createWiki();

      await expect(wiki.page(options.title).info()).resolves.toEqual(
        options.pageInfo,
      );
    });

    it('checks page existence', async () => {
      const wiki = createWiki();

      await expect(wiki.page(options.title).exists()).resolves.toBe(
        options.pageInfo.exists,
      );
    });

    it('runs an Action API request', async () => {
      const wiki = createWiki();

      await expect(wiki.request(options.requestParams)).resolves.toEqual(
        options.requestResponse,
      );
    });

    it('runs an Action API query', async () => {
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
