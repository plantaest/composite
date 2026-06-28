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
            query: {
              general: {
                sitename: 'Wikipedia',
              },
            },
          },
        },
      ],
    }),
  {
    expectedText: 'Hello',
    queryParams: {
      meta: 'siteinfo',
    },
    queryResponse: {
      query: {
        general: {
          sitename: 'Wikipedia',
        },
      },
    },
    requestParams: {
      action: 'query',
      meta: 'siteinfo',
    },
    requestResponse: {
      query: {
        general: {
          sitename: 'Wikipedia',
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

  it('returns configured request responses', async () => {
    const wiki = createMockWiki({
      requests: [
        {
          match: {
            action: 'query',
            meta: 'siteinfo',
          },
          response: {
            query: {
              general: {
                sitename: 'Wikipedia',
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
      query: {
        general: {
          sitename: 'Wikipedia',
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
            query: {
              general: {
                sitename: 'Wikipedia',
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
      query: {
        general: {
          sitename: 'Wikipedia',
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
