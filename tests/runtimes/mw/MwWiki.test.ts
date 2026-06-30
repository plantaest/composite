import { ConfigurationError } from '../../../src/index.js';
import { MwWiki } from '../../../src/runtimes/mw/index.js';
import { describeWikiContract } from '../../contract/wikiContract.js';
import { createSiteInfoResponse } from '../../fixtures/mediawiki.js';
import { createFakeMw, createFakeMwApi } from '../../fixtures/mw.js';

describeWikiContract(
  'mw runtime',
  () => MwWiki.from(createFakeMwApi(), { wikiId: 'testwiki' }),
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
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'mw');
  });

  describe('MwWiki.create()', () => {
    it('creates the current wiki from the MediaWiki frontend runtime', () => {
      const mw = createFakeMw();
      vi.stubGlobal('mw', mw);

      const wiki = MwWiki.create({ apiUserAgent: 'Composite/0.1.0' });

      expect(wiki.runtime().type).toBe('mw');
      expect(mw.Api).toHaveBeenCalledWith({
        ajax: {
          headers: {
            'Api-User-Agent': 'Composite/0.1.0',
          },
        },
      });
    });

    it('connects to a foreign wiki when ForeignApi is available', () => {
      const mw = createFakeMw();
      vi.stubGlobal('mw', mw);

      const wiki = MwWiki.create({
        serverName: 'test.wikipedia.org',
        wikiId: 'testwiki',
      });

      expect(wiki.runtime().type).toBe('mw');
      expect(mw.ForeignApi).toHaveBeenCalledWith(
        'https://test.wikipedia.org/w/api.php',
        undefined,
      );
      expect(mw.Api).not.toHaveBeenCalled();
    });

    it('passes API options when connecting to a foreign wiki', () => {
      const mw = createFakeMw();
      vi.stubGlobal('mw', mw);

      MwWiki.create({
        apiUserAgent: 'Composite/0.1.0',
        serverName: 'test.wikipedia.org',
      });

      expect(mw.ForeignApi).toHaveBeenCalledWith(
        'https://test.wikipedia.org/w/api.php',
        {
          ajax: {
            headers: {
              'Api-User-Agent': 'Composite/0.1.0',
            },
          },
        },
      );
    });

    it('requires mw.ForeignApi', () => {
      const mw = createFakeMw();
      Reflect.deleteProperty(mw, 'ForeignApi');
      vi.stubGlobal('mw', mw);

      expect(() =>
        MwWiki.create({
          serverName: 'test.wikipedia.org',
        }),
      ).toThrow('MwWiki.create() requires mw.ForeignApi.');
      expect(() =>
        MwWiki.create({
          serverName: 'test.wikipedia.org',
        }),
      ).toThrow(ConfigurationError);
    });
  });

  describe('MwWiki.from()', () => {
    it('wraps an existing mw.Api instance', () => {
      const api = createFakeMwApi();

      const wiki = MwWiki.from(api, {
        wikiId: 'testwiki',
      });

      expect(wiki.runtime().type).toBe('mw');
      expect(wiki.config.wikiId).toBe('testwiki');
    });
  });

  describe('MwWiki.registry()', () => {
    it('creates current and foreign wiki connections from wiki configs', () => {
      const mw = createFakeMw();
      vi.stubGlobal('mw', mw);

      const wikis = MwWiki.registry({
        commonswiki: {
          serverName: 'commons.wikimedia.org',
        },
        testwiki: {},
      });

      expect(wikis.get('testwiki').runtime().type).toBe('mw');
      expect(wikis.get('commonswiki').runtime().type).toBe('mw');
      expect((wikis.get('testwiki') as MwWiki).config.wikiId).toBe('testwiki');
      expect((wikis.get('commonswiki') as MwWiki).config.wikiId).toBe(
        'commonswiki',
      );
      expect(mw.Api).toHaveBeenCalledOnce();
      expect(mw.ForeignApi).toHaveBeenCalledWith(
        'https://commons.wikimedia.org/w/api.php',
        undefined,
      );
    });
  });

  describe('Wiki.request()', () => {
    it('maps to mw.Api#get()', async () => {
      const api = createFakeMwApi();
      const wiki = MwWiki.from(api);
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
      const wiki = MwWiki.from(api);
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
      const wiki = MwWiki.from(api);

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
