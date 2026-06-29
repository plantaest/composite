import { Mwn } from 'mwn';
import { Composite, type MwnWiki } from '../../../src/runtimes/mwn/index.js';
import { createFakeBot } from '../../fixtures/mwn.js';

describe('mwn Composite', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Composite.create()', () => {
    it('creates a wiki from mwn init config', async () => {
      const bot = createFakeBot();
      const init = vi.spyOn(Mwn, 'init').mockResolvedValue(bot);

      const wiki = await Composite.create({
        apiUrl: 'https://test.wikipedia.org/w/api.php',
      });

      expect(wiki.runtime().type).toBe('mwn');
      expect(wiki.bot).toBe(bot);
      expect(wiki.config.apiUrl).toBe('https://test.wikipedia.org/w/api.php');
      expect(init).toHaveBeenCalledWith({
        apiUrl: 'https://test.wikipedia.org/w/api.php',
      });
    });
  });

  describe('Composite.from()', () => {
    it('wraps an existing mwn bot', () => {
      const bot = createFakeBot();

      const wiki = Composite.from(bot, {
        apiUrl: 'https://test.wikipedia.org/w/api.php',
      });

      expect(wiki.runtime().type).toBe('mwn');
      expect(wiki.bot).toBe(bot);
      expect(wiki.config.apiUrl).toBe('https://test.wikipedia.org/w/api.php');
    });
  });

  describe('Composite.wikis()', () => {
    it('creates mwn wiki connections from wiki configs', async () => {
      const testBot = createFakeBot();
      const commonsBot = createFakeBot();
      const init = vi
        .spyOn(Mwn, 'init')
        .mockResolvedValueOnce(testBot)
        .mockResolvedValueOnce(commonsBot);

      const wikis = await Composite.wikis({
        wikis: {
          testwiki: {
            apiUrl: 'https://test.wikipedia.org/w/api.php',
          },
          commonswiki: {
            apiUrl: 'https://commons.wikimedia.org/w/api.php',
          },
        },
      });

      expect(wikis.get('testwiki').runtime().type).toBe('mwn');
      expect(wikis.get('commonswiki').runtime().type).toBe('mwn');
      expect((wikis.get('testwiki') as MwnWiki).bot).toBe(testBot);
      expect((wikis.get('commonswiki') as MwnWiki).bot).toBe(commonsBot);
      expect((wikis.get('testwiki') as MwnWiki).config.apiUrl).toBe(
        'https://test.wikipedia.org/w/api.php',
      );
      expect((wikis.get('commonswiki') as MwnWiki).config.apiUrl).toBe(
        'https://commons.wikimedia.org/w/api.php',
      );
      expect(init).toHaveBeenCalledWith({
        apiUrl: 'https://test.wikipedia.org/w/api.php',
      });
      expect(init).toHaveBeenCalledWith({
        apiUrl: 'https://commons.wikimedia.org/w/api.php',
      });
    });
  });
});
