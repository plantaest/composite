import { Composite } from '../../../src/runtimes/mw/index.js';
import { describeWikiContract } from '../../contract/wikiContract.js';
import { createSiteInfoResponse } from '../../fixtures/mediawiki.js';
import { createFakeMwApi } from '../../fixtures/mw.js';

describeWikiContract(
  'mw runtime',
  () => Composite.from(createFakeMwApi(), { wikiId: 'testwiki' }),
  {
    expectedCategories: ['Category:Tests', 'Category:Sandbox pages'],
    expectedLinks: ['Help:Contents', 'Wikipedia:Sandbox/Help'],
    expectedTemplates: ['Template:Sandbox notice', 'Template:Documentation'],
    expectedText: 'Hello',
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

describe('MwWiki', () => {
  describe('Wiki.request()', () => {
    it('maps to mw.Api#get()', async () => {
      const api = createFakeMwApi();
      const wiki = Composite.from(api);
      const params = {
        action: 'query',
        meta: 'siteinfo',
        siprop: 'general',
        formatversion: 2,
      };

      await expect(wiki.request(params)).resolves.toEqual(
        createSiteInfoResponse(),
      );

      expect(api.get).toHaveBeenCalledWith(params);
    });
  });

  describe('Wiki.query()', () => {
    it('maps to mw.Api#get() with action=query', async () => {
      const api = createFakeMwApi();
      const wiki = Composite.from(api);
      const params = {
        meta: 'siteinfo',
        siprop: 'general',
        formatversion: 2,
      };

      await expect(wiki.query(params)).resolves.toEqual(
        createSiteInfoResponse(),
      );

      expect(api.get).toHaveBeenCalledWith({
        action: 'query',
        meta: 'siteinfo',
        siprop: 'general',
        formatversion: 2,
      });
    });

    it('lets explicit action override action=query', async () => {
      const api = createFakeMwApi();
      const wiki = Composite.from(api);

      await expect(
        wiki.query({
          action: 'parse',
          page: 'Wikipedia:Sandbox',
        }),
      ).resolves.toEqual({});

      expect(api.get).toHaveBeenCalledWith({
        action: 'parse',
        page: 'Wikipedia:Sandbox',
      });
    });
  });
});
