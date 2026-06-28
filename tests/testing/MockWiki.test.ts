import { createMockWiki } from '../../src/testing/index.js';
import { describeWikiContract } from '../contract/wikiContract.js';

describeWikiContract(
  'mock runtime',
  () =>
    createMockWiki({
      pages: {
        'Wikipedia:Sandbox': 'Hello',
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

describe('createMockWiki', () => {
  it('reports the mock runtime type', () => {
    const wiki = createMockWiki();

    expect(wiki.runtime().type).toBe('mock');
  });

  it('returns empty text for unknown pages', async () => {
    const wiki = createMockWiki();

    await expect(wiki.page('Missing').text()).resolves.toBe('');
  });

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

  it('runs wiki.query() through request semantics', async () => {
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
