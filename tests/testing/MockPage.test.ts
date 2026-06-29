import { createMockWiki } from '../../src/testing/index.js';

describe('MockPage', () => {
  describe('Page.text()', () => {
    it('returns empty text for unknown pages', async () => {
      const wiki = createMockWiki();

      await expect(wiki.page('Missing').text()).resolves.toBe('');
    });
  });

  describe('Page.info()', () => {
    it('derives page info from configured pages', async () => {
      const wiki = createMockWiki({
        pages: {
          'Wikipedia:Sandbox': 'Hello',
        },
      });

      await expect(wiki.page('Wikipedia:Sandbox').info()).resolves.toEqual({
        title: 'Wikipedia:Sandbox',
        sourceTitle: 'Wikipedia:Sandbox',
        exists: true,
      });
      await expect(wiki.page('Wikipedia:Missing').info()).resolves.toEqual({
        title: 'Wikipedia:Missing',
        sourceTitle: 'Wikipedia:Missing',
        exists: false,
      });
    });

    it('returns configured page info', async () => {
      const wiki = createMockWiki({
        pageInfo: {
          Quandong: {
            title: 'Santalum acuminatum',
            sourceTitle: 'Quandong',
            exists: true,
            pageId: 2323887,
            namespace: 0,
            redirect: true,
            contentModel: 'wikitext',
            pageLanguage: 'vi',
            touched: '2026-06-25T21:13:04Z',
            lastRevisionId: 75209624,
            length: 2048,
          },
        },
      });

      await expect(wiki.page('Quandong').info()).resolves.toEqual({
        title: 'Santalum acuminatum',
        sourceTitle: 'Quandong',
        exists: true,
        pageId: 2323887,
        namespace: 0,
        redirect: true,
        contentModel: 'wikitext',
        pageLanguage: 'vi',
        touched: '2026-06-25T21:13:04Z',
        lastRevisionId: 75209624,
        length: 2048,
      });
    });
  });

  describe('Page.exists()', () => {
    it('derives page existence from page info', async () => {
      const wiki = createMockWiki({
        pages: {
          'Wikipedia:Sandbox': 'Hello',
        },
      });

      await expect(wiki.page('Wikipedia:Sandbox').exists()).resolves.toBe(true);
      await expect(wiki.page('Wikipedia:Missing').exists()).resolves.toBe(
        false,
      );
    });
  });

  describe('Page.save()', () => {
    it('updates page text when saving', async () => {
      const wiki = createMockWiki({
        pages: {
          'Wikipedia:Sandbox': 'Hello',
        },
      });

      await expect(
        wiki.page('Wikipedia:Sandbox').save('Updated', 'Test edit'),
      ).resolves.toEqual({
        title: 'Wikipedia:Sandbox',
      });
      await expect(wiki.page('Wikipedia:Sandbox').text()).resolves.toBe(
        'Updated',
      );
    });

    it('allows saving without a summary', async () => {
      const wiki = createMockWiki();

      await expect(
        wiki.page('Wikipedia:Sandbox').save('Updated'),
      ).resolves.toEqual({
        title: 'Wikipedia:Sandbox',
      });
      await expect(wiki.page('Wikipedia:Sandbox').text()).resolves.toBe(
        'Updated',
      );
    });
  });
});
