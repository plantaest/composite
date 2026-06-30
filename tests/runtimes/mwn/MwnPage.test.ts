import { MwnWiki } from '../../../src/runtimes/mwn/index.js';
import { createFakeMwnBot, createFakeMwnPage } from '../../fixtures/mwn.js';

describe('MwnPage', () => {
  describe('Page.text()', () => {
    it('delegates to the mwn page object', async () => {
      const page = createFakeMwnPage({
        methods: {
          text: vi.fn(async () => 'Delegated text'),
        },
      });
      const bot = createFakeMwnBot({ page });
      const wiki = MwnWiki.from(bot);

      await expect(wiki.page('Wikipedia:Sandbox').text()).resolves.toBe(
        'Delegated text',
      );

      expect(bot.Page).toHaveBeenCalledWith('Wikipedia:Sandbox');
      expect(page.text).toHaveBeenCalledWith();
    });
  });

  describe('Page.info()', () => {
    it('maps to an mwn request', async () => {
      const bot = createFakeMwnBot();
      const wiki = MwnWiki.from(bot);

      await expect(wiki.page('Wikipedia:Sandbox').info()).resolves.toEqual({
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
      });

      expect(bot.request).toHaveBeenCalledWith({
        action: 'query',
        prop: 'info',
        titles: 'Wikipedia:Sandbox',
        redirects: true,
        formatversion: 2,
      });
    });
  });

  describe('Page.exists()', () => {
    it('maps through page info', async () => {
      const bot = createFakeMwnBot();
      const wiki = MwnWiki.from(bot);

      await expect(wiki.page('Wikipedia:Sandbox').exists()).resolves.toBe(true);

      expect(bot.request).toHaveBeenCalledWith({
        action: 'query',
        prop: 'info',
        titles: 'Wikipedia:Sandbox',
        redirects: true,
        formatversion: 2,
      });
    });
  });

  describe('Page.categories()', () => {
    it('delegates to the mwn page object', async () => {
      const page = createFakeMwnPage();
      const bot = createFakeMwnBot({ page });
      const wiki = MwnWiki.from(bot);

      await expect(
        wiki.page('Wikipedia:Sandbox').categories(),
      ).resolves.toEqual(['Category:Tests', 'Category:Sandbox pages']);

      expect(bot.Page).toHaveBeenCalledWith('Wikipedia:Sandbox');
      expect(page.categories).toHaveBeenCalledWith();
    });
  });

  describe('Page.templates()', () => {
    it('delegates to the mwn page object', async () => {
      const page = createFakeMwnPage();
      const bot = createFakeMwnBot({ page });
      const wiki = MwnWiki.from(bot);

      await expect(wiki.page('Wikipedia:Sandbox').templates()).resolves.toEqual(
        ['Template:Sandbox notice', 'Template:Documentation'],
      );

      expect(bot.Page).toHaveBeenCalledWith('Wikipedia:Sandbox');
      expect(page.templates).toHaveBeenCalledWith();
    });
  });

  describe('Page.links()', () => {
    it('delegates to the mwn page object', async () => {
      const page = createFakeMwnPage();
      const bot = createFakeMwnBot({ page });
      const wiki = MwnWiki.from(bot);

      await expect(wiki.page('Wikipedia:Sandbox').links()).resolves.toEqual([
        'Help:Contents',
        'Wikipedia:Sandbox/Help',
      ]);

      expect(bot.Page).toHaveBeenCalledWith('Wikipedia:Sandbox');
      expect(page.links).toHaveBeenCalledWith();
    });
  });

  describe('Page.save()', () => {
    it('delegates to the mwn page object', async () => {
      const page = createFakeMwnPage();
      const bot = createFakeMwnBot({ page });
      const wiki = MwnWiki.from(bot);

      await expect(
        wiki.page('Wikipedia:Sandbox').save('Updated', 'Test edit', {
          minor: true,
        }),
      ).resolves.toEqual({
        title: 'Wikipedia:Sandbox',
      });

      expect(bot.Page).toHaveBeenCalledWith('Wikipedia:Sandbox');
      expect(page.save).toHaveBeenCalledWith('Updated', 'Test edit', {
        minor: true,
      });
    });

    it('allows saving without a summary', async () => {
      const page = createFakeMwnPage();
      const bot = createFakeMwnBot({ page });
      const wiki = MwnWiki.from(bot);

      await expect(
        wiki.page('Wikipedia:Sandbox').save('Updated'),
      ).resolves.toEqual({
        title: 'Wikipedia:Sandbox',
      });

      expect(page.save).toHaveBeenCalledWith('Updated', undefined, {});
    });
  });
});
