import { ConfigurationError } from '../../../src/index.js';
import { Composite, type MwWiki } from '../../../src/runtimes/mw/index.js';
import { createFakeMw, createFakeMwApi } from '../../fixtures/mw.js';

describe('mw Composite', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'mw');
  });

  describe('Composite.current()', () => {
    it('creates the current wiki from the MediaWiki frontend runtime', () => {
      const mw = createFakeMw();
      vi.stubGlobal('mw', mw);

      const wiki = Composite.current({ apiUserAgent: 'Composite/0.1.0' });

      expect(wiki.runtime().type).toBe('mw');
      expect(mw.Api).toHaveBeenCalledWith({
        ajax: {
          headers: {
            'Api-User-Agent': 'Composite/0.1.0',
          },
        },
      });
    });
  });

  describe('Composite.connect()', () => {
    it('connects to a foreign wiki when ForeignApi is available', () => {
      const mw = createFakeMw();
      vi.stubGlobal('mw', mw);

      const wiki = Composite.connect({
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

      Composite.connect({
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

    it('requires serverName', () => {
      vi.stubGlobal('mw', createFakeMw());

      expect(() => Composite.connect({})).toThrow(
        'Composite.connect() requires serverName.',
      );
      expect(() => Composite.connect({})).toThrow(ConfigurationError);
    });

    it('requires mw.ForeignApi', () => {
      const mw = createFakeMw();
      Reflect.deleteProperty(mw, 'ForeignApi');
      vi.stubGlobal('mw', mw);

      expect(() =>
        Composite.connect({
          serverName: 'test.wikipedia.org',
        }),
      ).toThrow('Composite.connect() requires mw.ForeignApi.');
      expect(() =>
        Composite.connect({
          serverName: 'test.wikipedia.org',
        }),
      ).toThrow(ConfigurationError);
    });
  });

  describe('Composite.from()', () => {
    it('wraps an existing mw.Api instance', () => {
      const api = createFakeMwApi();

      const wiki = Composite.from(api, {
        wikiId: 'testwiki',
      });

      expect(wiki.runtime().type).toBe('mw');
      expect(wiki.config.wikiId).toBe('testwiki');
    });
  });

  describe('Composite.wikis()', () => {
    it('creates current and foreign wiki connections from wiki configs', () => {
      const mw = createFakeMw();
      vi.stubGlobal('mw', mw);

      const wikis = Composite.wikis({
        wikis: {
          commonswiki: {
            serverName: 'commons.wikimedia.org',
          },
          testwiki: {},
        },
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
});
