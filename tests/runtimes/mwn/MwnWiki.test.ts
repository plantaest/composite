import { Composite } from '../../../src/runtimes/mwn/index.js';
import { describeWikiContract } from '../../contract/wikiContract.js';
import { createSiteInfoResponse } from '../../fixtures/mediawiki.js';
import { createFakeBot } from '../../fixtures/mwn.js';

describeWikiContract(
  'mwn runtime',
  () => Composite.from(createFakeBot('Hello')),
  {
    expectedCategories: ['Category:Tests', 'Category:Sandbox pages'],
    expectedText: 'Hello from Wikipedia:Sandbox',
    pageInfo: {
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
    },
    queryParams: {
      meta: 'siteinfo',
    },
    queryResponse: createSiteInfoResponse(),
    requestParams: {
      action: 'query',
      meta: 'siteinfo',
    },
    requestResponse: createSiteInfoResponse(),
    savedText: 'Updated',
    title: 'Wikipedia:Sandbox',
  },
);

describe('MwnWiki', () => {
  describe('Wiki.request()', () => {
    it('delegates to the mwn bot', async () => {
      const bot = createFakeBot();
      const wiki = Composite.from(bot);
      const params = {
        action: 'query',
        meta: 'siteinfo',
        siprop: 'general',
        formatversion: 2,
      };

      await expect(wiki.request(params)).resolves.toEqual(
        createSiteInfoResponse(),
      );

      expect(bot.request).toHaveBeenCalledWith(params);
    });
  });

  describe('Wiki.query()', () => {
    it('delegates to mwn request with action=query', async () => {
      const bot = createFakeBot();
      const wiki = Composite.from(bot);
      const params = {
        meta: 'siteinfo',
        siprop: 'general',
        formatversion: 2,
      };

      await expect(wiki.query(params)).resolves.toEqual(
        createSiteInfoResponse(),
      );

      expect(bot.request).toHaveBeenCalledWith({
        action: 'query',
        meta: 'siteinfo',
        siprop: 'general',
        formatversion: 2,
      });
    });

    it('lets explicit action override action=query', async () => {
      const bot = createFakeBot();
      const wiki = Composite.from(bot);

      await expect(
        wiki.query({
          action: 'parse',
          page: 'Wikipedia:Sandbox',
        }),
      ).resolves.toEqual({});

      expect(bot.request).toHaveBeenCalledWith({
        action: 'parse',
        page: 'Wikipedia:Sandbox',
      });
    });
  });
});
