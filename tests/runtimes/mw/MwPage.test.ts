import { MwWiki } from '../../../src/runtimes/mw/index.js';
import { createFakeMwApi, type FakeMwApi } from '../../fixtures/mw.js';

describe('MwPage', () => {
  describe('Page.text()', () => {
    it('maps to a MediaWiki revisions query', async () => {
      const api = createFakeMwApi('Mapped text');
      const wiki = MwWiki.from(api);

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
      const wiki = MwWiki.from(api as FakeMwApi);

      await expect(wiki.page('Wikipedia:Sandbox').text()).resolves.toBe('');
    });
  });

  describe('Page.info()', () => {
    it('maps to a MediaWiki info query', async () => {
      const api = createFakeMwApi();
      const wiki = MwWiki.from(api);

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
      const wiki = MwWiki.from(api);

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
      const wiki = MwWiki.from(api);

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
  });

  describe('Page.templates()', () => {
    it('maps to a MediaWiki templates query', async () => {
      const api = createFakeMwApi();
      const wiki = MwWiki.from(api);

      await expect(wiki.page('Wikipedia:Sandbox').templates()).resolves.toEqual(
        ['Template:Sandbox notice', 'Template:Documentation'],
      );

      expect(api.get).toHaveBeenCalledWith({
        action: 'query',
        prop: 'templates',
        titles: 'Wikipedia:Sandbox',
        tllimit: 'max',
        formatversion: 2,
      });
    });
  });

  describe('Page.links()', () => {
    it('maps to a MediaWiki links query', async () => {
      const api = createFakeMwApi();
      const wiki = MwWiki.from(api);

      await expect(wiki.page('Wikipedia:Sandbox').links()).resolves.toEqual([
        'Help:Contents',
        'Wikipedia:Sandbox/Help',
      ]);

      expect(api.get).toHaveBeenCalledWith({
        action: 'query',
        prop: 'links',
        titles: 'Wikipedia:Sandbox',
        pllimit: 'max',
        formatversion: 2,
      });
    });
  });

  describe('Page.save()', () => {
    it('maps to a csrf edit request', async () => {
      const api = createFakeMwApi();
      const wiki = MwWiki.from(api);

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
      const wiki = MwWiki.from(api);

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
