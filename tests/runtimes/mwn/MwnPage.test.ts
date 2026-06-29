import type { Mwn } from 'mwn';
import { Composite } from '../../../src/runtimes/mwn/index.js';
import { createEditResponse } from '../../fixtures/mediawiki.js';
import { createFakeBot } from '../../fixtures/mwn.js';

describe('MwnPage', () => {
  describe('Page.text()', () => {
    it('delegates to the mwn page object', async () => {
      const mwnPage = {
        text: vi.fn(async () => 'Delegated text'),
        save: vi.fn(),
      };
      const bot = {
        request: vi.fn(),
        Page: vi.fn(function Page() {
          return mwnPage;
        }),
      } as unknown as Mwn;
      const wiki = Composite.from(bot);

      await expect(wiki.page('Wikipedia:Sandbox').text()).resolves.toBe(
        'Delegated text',
      );

      expect(bot.Page).toHaveBeenCalledWith('Wikipedia:Sandbox');
      expect(mwnPage.text).toHaveBeenCalledWith();
    });
  });

  describe('Page.info()', () => {
    it('maps to an mwn request', async () => {
      const bot = createFakeBot();
      const wiki = Composite.from(bot);

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
      const bot = createFakeBot();
      const wiki = Composite.from(bot);

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

  describe('Page.save()', () => {
    it('delegates to the mwn page object', async () => {
      const mwnPage = {
        text: vi.fn(),
        save: vi.fn(async () => createEditResponse()),
      };
      const bot = {
        request: vi.fn(),
        Page: vi.fn(function Page() {
          return mwnPage;
        }),
      } as unknown as Mwn;
      const wiki = Composite.from(bot);

      await expect(
        wiki.page('Wikipedia:Sandbox').save('Updated', 'Test edit', {
          minor: true,
        }),
      ).resolves.toEqual({
        title: 'Wikipedia:Sandbox',
      });

      expect(bot.Page).toHaveBeenCalledWith('Wikipedia:Sandbox');
      expect(mwnPage.save).toHaveBeenCalledWith('Updated', 'Test edit', {
        minor: true,
      });
    });

    it('allows saving without a summary', async () => {
      const mwnPage = {
        text: vi.fn(),
        save: vi.fn(async () => createEditResponse()),
      };
      const bot = {
        request: vi.fn(),
        Page: vi.fn(function Page() {
          return mwnPage;
        }),
      } as unknown as Mwn;
      const wiki = Composite.from(bot);

      await expect(
        wiki.page('Wikipedia:Sandbox').save('Updated'),
      ).resolves.toEqual({
        title: 'Wikipedia:Sandbox',
      });

      expect(mwnPage.save).toHaveBeenCalledWith('Updated', undefined, {});
    });
  });
});
