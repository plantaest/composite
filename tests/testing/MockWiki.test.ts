import { createMockWiki } from '../../src/testing/index.js';
import { describeWikiContract } from '../contract/wikiContract.js';

describeWikiContract(
  'mock runtime',
  () =>
    createMockWiki({
      pages: {
        'Wikipedia:Sandbox': 'Hello',
      },
    }),
  {
    expectedText: 'Hello',
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
});
