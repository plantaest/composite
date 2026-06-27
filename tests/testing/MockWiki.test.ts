import { createMockWiki } from '../../src/testing/index.js';
import { describeWikiContract } from '../contract/wikiContract.js';

describeWikiContract(
  'mock runtime',
  () =>
    createMockWiki({
      pages: {
        'Wikipedia:Sandbox': 'Hello',
      },
      queries: [
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
      action: 'query',
      meta: 'siteinfo',
    },
    queryResponse: {
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

  it('returns configured query responses', async () => {
    const wiki = createMockWiki({
      queries: [
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

  it('returns an empty object for unmatched queries', async () => {
    const wiki = createMockWiki();

    await expect(wiki.query({ action: 'query' })).resolves.toEqual({});
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
