import { Composite } from '../../../src/runtimes/mw/index.js';
import { createFakeMwApi, type FakeMwApi } from '../../fixtures/mw.js';

describe('MwPage', () => {
  describe('Page.text()', () => {
    it('maps to a MediaWiki revisions query', async () => {
      const api = createFakeMwApi('Mapped text');
      const wiki = Composite.from(api);

      await expect(wiki.page('Wikipedia:Sandbox').text()).resolves.toBe(
        'Mapped text',
      );

      expect(api.get).toHaveBeenCalledWith({
        action: 'query',
        prop: 'revisions',
        titles: 'Wikipedia:Sandbox',
        rvprop: 'content',
        rvslots: 'main',
        formatversion: 2,
      });
    });

    it('returns empty text when the response has no main slot content', async () => {
      const api = {
        get: vi.fn(async () => ({
          query: {
            pages: [
              {
                revisions: [{}],
              },
            ],
          },
        })),
        postWithToken: vi.fn(),
      };
      const wiki = Composite.from(api as FakeMwApi);

      await expect(wiki.page('Wikipedia:Sandbox').text()).resolves.toBe('');
    });
  });

  describe('Page.info()', () => {
    it('maps to a MediaWiki info query', async () => {
      const api = createFakeMwApi();
      const wiki = Composite.from(api);

      await expect(wiki.page('Wikipedia:Sandbox').info()).resolves.toEqual({
        title: 'Wikipedia:Sandbox',
        sourceTitle: 'Wikipedia:Sandbox',
        exists: true,
        pageId: 107092,
        namespace: 4,
        contentModel: 'wikitext',
        pageLanguage: 'en',
        touched: '2026-06-20T21:00:50Z',
        lastRevisionId: 747754,
        length: 82,
      });

      expect(api.get).toHaveBeenCalledWith({
        action: 'query',
        prop: 'info',
        titles: 'Wikipedia:Sandbox',
        redirects: true,
        formatversion: 2,
      });
    });
  });

  describe('Page.exists()', () => {
    it('maps through page info', async () => {
      const api = createFakeMwApi();
      const wiki = Composite.from(api);

      await expect(wiki.page('Wikipedia:Sandbox').exists()).resolves.toBe(true);

      expect(api.get).toHaveBeenCalledWith({
        action: 'query',
        prop: 'info',
        titles: 'Wikipedia:Sandbox',
        redirects: true,
        formatversion: 2,
      });
    });
  });

  describe('Page.categories()', () => {
    it('maps to a MediaWiki categories query', async () => {
      const api = createFakeMwApi();
      const wiki = Composite.from(api);

      await expect(
        wiki.page('Wikipedia:Sandbox').categories(),
      ).resolves.toEqual(['Category:Tests', 'Category:Sandbox pages']);

      expect(api.get).toHaveBeenCalledWith({
        action: 'query',
        prop: 'categories',
        titles: 'Wikipedia:Sandbox',
        cllimit: 'max',
        formatversion: 2,
      });
    });

    it('continues category queries until all batches are collected', async () => {
      const api = {
        get: vi
          .fn()
          .mockResolvedValueOnce({
            continue: {
              continue: '||',
              clcontinue: '107092|Second',
            },
            query: {
              pages: [
                {
                  categories: [
                    {
                      title: 'Category:First',
                    },
                  ],
                },
              ],
            },
          })
          .mockResolvedValueOnce({
            batchcomplete: true,
            query: {
              pages: [
                {
                  categories: [
                    {
                      title: 'Category:Second',
                    },
                  ],
                },
              ],
            },
          }),
        postWithToken: vi.fn(),
      };
      const wiki = Composite.from(api as FakeMwApi);

      await expect(
        wiki.page('Wikipedia:Sandbox').categories(),
      ).resolves.toEqual(['Category:First', 'Category:Second']);

      expect(api.get).toHaveBeenNthCalledWith(1, {
        action: 'query',
        prop: 'categories',
        titles: 'Wikipedia:Sandbox',
        cllimit: 'max',
        formatversion: 2,
      });
      expect(api.get).toHaveBeenNthCalledWith(2, {
        action: 'query',
        prop: 'categories',
        titles: 'Wikipedia:Sandbox',
        cllimit: 'max',
        formatversion: 2,
        continue: '||',
        clcontinue: '107092|Second',
      });
    });
  });

  describe('Page.save()', () => {
    it('maps to a csrf edit request', async () => {
      const api = createFakeMwApi();
      const wiki = Composite.from(api);

      await expect(
        wiki.page('Wikipedia:Sandbox').save('Updated', 'Test edit', {
          minor: true,
        }),
      ).resolves.toEqual({
        title: 'Wikipedia:Sandbox',
      });

      expect(api.postWithToken).toHaveBeenCalledWith('csrf', {
        action: 'edit',
        title: 'Wikipedia:Sandbox',
        text: 'Updated',
        summary: 'Test edit',
        minor: true,
      });
    });

    it('omits summary when called without one', async () => {
      const api = createFakeMwApi();
      const wiki = Composite.from(api);

      await expect(
        wiki.page('Wikipedia:Sandbox').save('Updated'),
      ).resolves.toEqual({
        title: 'Wikipedia:Sandbox',
      });

      expect(api.postWithToken).toHaveBeenCalledWith('csrf', {
        action: 'edit',
        title: 'Wikipedia:Sandbox',
        text: 'Updated',
      });
    });
  });
});
