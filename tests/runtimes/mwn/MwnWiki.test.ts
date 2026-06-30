import { Mwn } from 'mwn';
import { ConfigurationError } from '../../../src/index.js';
import { MwnWiki } from '../../../src/runtimes/mwn/index.js';
import { describeWikiContract } from '../../contract/wikiContract.js';
import { createSiteInfoResponse } from '../../fixtures/mediawiki.js';
import { createFakeMwnBot, createFakeMwnPage } from '../../fixtures/mwn.js';

describeWikiContract(
  'mwn runtime',
  () =>
    MwnWiki.from(
      createFakeMwnBot({
        page: createFakeMwnPage({ text: 'Hello' }),
      }),
    ),
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

describe('MwnWiki', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('MwnWiki.create()', () => {
    it('creates a wiki from a server name', async () => {
      const bot = createFakeMwnBot();
      const init = vi.spyOn(Mwn, 'init').mockResolvedValue(bot);

      const wiki = await MwnWiki.create({
        serverName: 'test.wikipedia.org',
      });

      expect(wiki.runtime().type).toBe('mwn');
      expect(wiki.bot).toBe(bot);
      expect(wiki.config.serverName).toBe('test.wikipedia.org');
      expect(init).toHaveBeenCalledWith({
        apiUrl: 'https://test.wikipedia.org/w/api.php',
      });
    });

    it('passes mwn credentials through when creating a wiki', async () => {
      const bot = createFakeMwnBot();
      const init = vi.spyOn(Mwn, 'init').mockResolvedValue(bot);

      await MwnWiki.create({
        serverName: 'test.wikipedia.org',
        username: 'CompositeBot',
        password: 'secret',
        userAgent: 'Composite/0.1.0',
      });

      expect(init).toHaveBeenCalledWith({
        apiUrl: 'https://test.wikipedia.org/w/api.php',
        username: 'CompositeBot',
        password: 'secret',
        userAgent: 'Composite/0.1.0',
      });
    });

    it('requires serverName', async () => {
      await expect(
        MwnWiki.create({} as Parameters<typeof MwnWiki.create>[0]),
      ).rejects.toThrow('MwnWiki.create() requires serverName.');
      await expect(
        MwnWiki.create({} as Parameters<typeof MwnWiki.create>[0]),
      ).rejects.toThrow(ConfigurationError);
    });
  });

  describe('MwnWiki.from()', () => {
    it('wraps an existing mwn bot', () => {
      const bot = createFakeMwnBot();

      const wiki = MwnWiki.from(bot, {
        serverName: 'test.wikipedia.org',
      });

      expect(wiki.runtime().type).toBe('mwn');
      expect(wiki.bot).toBe(bot);
      expect(wiki.config.serverName).toBe('test.wikipedia.org');
    });
  });

  describe('MwnWiki.registry()', () => {
    it('creates mwn wiki connections from wiki configs', async () => {
      const testBot = createFakeMwnBot();
      const commonsBot = createFakeMwnBot();
      const init = vi
        .spyOn(Mwn, 'init')
        .mockResolvedValueOnce(testBot)
        .mockResolvedValueOnce(commonsBot);

      const wikis = await MwnWiki.registry({
        testwiki: {
          serverName: 'test.wikipedia.org',
        },
        commonswiki: {
          serverName: 'commons.wikimedia.org',
        },
      });

      expect(wikis.get('testwiki').runtime().type).toBe('mwn');
      expect(wikis.get('commonswiki').runtime().type).toBe('mwn');
      expect((wikis.get('testwiki') as MwnWiki).bot).toBe(testBot);
      expect((wikis.get('commonswiki') as MwnWiki).bot).toBe(commonsBot);
      expect((wikis.get('testwiki') as MwnWiki).config.serverName).toBe(
        'test.wikipedia.org',
      );
      expect((wikis.get('commonswiki') as MwnWiki).config.serverName).toBe(
        'commons.wikimedia.org',
      );
      expect(init).toHaveBeenCalledWith({
        apiUrl: 'https://test.wikipedia.org/w/api.php',
      });
      expect(init).toHaveBeenCalledWith({
        apiUrl: 'https://commons.wikimedia.org/w/api.php',
      });
    });
  });

  describe('Wiki.request()', () => {
    it('delegates to the mwn bot', async () => {
      const bot = createFakeMwnBot();
      const wiki = MwnWiki.from(bot);
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
      const bot = createFakeMwnBot();
      const wiki = MwnWiki.from(bot);
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
      const bot = createFakeMwnBot();
      const wiki = MwnWiki.from(bot);

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
