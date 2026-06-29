import { createMockWiki } from '../../src/testing/index.js';
import { describeWikiContract } from '../contract/wikiContract.js';

describeWikiContract(
  'mock runtime',
  () =>
    createMockWiki({
      categories: {
        'Wikipedia:Sandbox': ['Category:Tests', 'Category:Sandbox pages'],
      },
      links: {
        'Wikipedia:Sandbox': ['Help:Contents', 'Wikipedia:Sandbox/Help'],
      },
      pages: {
        'Wikipedia:Sandbox': 'Hello',
      },
      templates: {
        'Wikipedia:Sandbox': [
          'Template:Sandbox notice',
          'Template:Documentation',
        ],
      },
      requests: [
        {
          match: {
            action: 'query',
            meta: 'siteinfo',
          },
          response: {
            batchcomplete: true,
            query: {
              general: {
                sitename: 'Wikipedia',
                lang: 'en',
              },
            },
          },
        },
      ],
    }),
  {
    expectedCategories: ['Category:Tests', 'Category:Sandbox pages'],
    expectedLinks: ['Help:Contents', 'Wikipedia:Sandbox/Help'],
    expectedTemplates: ['Template:Sandbox notice', 'Template:Documentation'],
    expectedText: 'Hello',
    pageInfo: {
      title: 'Wikipedia:Sandbox',
      sourceTitle: 'Wikipedia:Sandbox',
      exists: true,
    },
    queryParams: {
      meta: 'siteinfo',
    },
    queryResponse: {
      batchcomplete: true,
      query: {
        general: {
          sitename: 'Wikipedia',
          lang: 'en',
        },
      },
    },
    requestParams: {
      action: 'query',
      meta: 'siteinfo',
    },
    requestResponse: {
      batchcomplete: true,
      query: {
        general: {
          sitename: 'Wikipedia',
          lang: 'en',
        },
      },
    },
    savedText: 'Updated',
    title: 'Wikipedia:Sandbox',
  },
);

describe('MockWiki', () => {
  describe('Wiki.runtime()', () => {
    it('reports the mock runtime type', () => {
      const wiki = createMockWiki();

      expect(wiki.runtime().type).toBe('mock');
    });
  });

  describe('Wiki.request()', () => {
    it('returns configured request responses', async () => {
      const wiki = createMockWiki({
        requests: [
          {
            match: {
              action: 'query',
              meta: 'siteinfo',
            },
            response: {
              batchcomplete: true,
              query: {
                general: {
                  sitename: 'Wikipedia',
                  lang: 'en',
                },
              },
            },
          },
        ],
      });

      await expect(
        wiki.request({
          action: 'query',
          meta: 'siteinfo',
        }),
      ).resolves.toEqual({
        batchcomplete: true,
        query: {
          general: {
            sitename: 'Wikipedia',
            lang: 'en',
          },
        },
      });
    });

    it('returns an empty object for unmatched requests', async () => {
      const wiki = createMockWiki();

      await expect(wiki.request({ action: 'query' })).resolves.toEqual({});
    });
  });

  describe('Wiki.query()', () => {
    it('runs through request semantics', async () => {
      const wiki = createMockWiki({
        requests: [
          {
            match: {
              action: 'query',
              meta: 'siteinfo',
            },
            response: {
              batchcomplete: true,
              query: {
                general: {
                  sitename: 'Wikipedia',
                  lang: 'en',
                },
              },
            },
          },
        ],
      });

      await expect(
        wiki.query({
          meta: 'siteinfo',
        }),
      ).resolves.toEqual({
        batchcomplete: true,
        query: {
          general: {
            sitename: 'Wikipedia',
            lang: 'en',
          },
        },
      });
    });
  });
});
