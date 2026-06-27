import { ConfigurationError } from '../../../src/index.js';
import { Composite } from '../../../src/runtimes/mw/index.js';
import { describeWikiContract } from '../../contract/wikiContract.js';

function createFakeApi(text = 'Hello') {
  return {
    get: vi.fn(async () => ({
      query: {
        pages: [
          {
            revisions: [
              {
                slots: {
                  main: {
                    content: text,
                  },
                },
              },
            ],
          },
        ],
      },
    })),
  };
}

describeWikiContract(
  'mw runtime',
  () => Composite.from(createFakeApi(), { wikiId: 'testwiki' }),
  {
    expectedText: 'Hello',
    title: 'Wikipedia:Sandbox',
  },
);

describe('mw adapter', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'mw');
  });

  it('reports the mw runtime type', () => {
    const wiki = Composite.from(createFakeApi());

    expect(wiki.runtime().type).toBe('mw');
  });

  it('creates the current wiki from the MediaWiki frontend runtime', () => {
    const Api = vi.fn(function Api() {
      return createFakeApi();
    });
    vi.stubGlobal('mw', {
      Api,
    });

    const wiki = Composite.current({ apiUserAgent: 'Composite/0.1' });

    expect(wiki.runtime().type).toBe('mw');
    expect(Api).toHaveBeenCalledWith({
      ajax: {
        headers: {
          'Api-User-Agent': 'Composite/0.1',
        },
      },
    });
  });

  it('connects to a foreign wiki when ForeignApi is available', () => {
    const Api = vi.fn(function Api() {
      return createFakeApi();
    });
    const ForeignApi = vi.fn(function ForeignApi() {
      return createFakeApi();
    });
    vi.stubGlobal('mw', {
      Api,
      ForeignApi,
    });

    const wiki = Composite.connect({
      serverName: 'test.wikipedia.org',
      wikiId: 'testwiki',
    });

    expect(wiki.runtime().type).toBe('mw');
    expect(ForeignApi).toHaveBeenCalledWith(
      'https://test.wikipedia.org/w/api.php',
      undefined,
    );
    expect(Api).not.toHaveBeenCalled();
  });

  it('requires serverName for connect()', () => {
    vi.stubGlobal('mw', {
      Api: vi.fn(function Api() {
        return createFakeApi();
      }),
    });

    expect(() => Composite.connect({})).toThrow(
      'Composite.connect() requires serverName.',
    );
    expect(() => Composite.connect({})).toThrow(ConfigurationError);
  });

  it('requires mw.ForeignApi for connect()', () => {
    vi.stubGlobal('mw', {
      Api: vi.fn(function Api() {
        return createFakeApi();
      }),
    });

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

  it('creates a map-backed wiki registry from wiki configs', () => {
    const Api = vi.fn(function Api() {
      return createFakeApi();
    });
    const ForeignApi = vi.fn(function ForeignApi() {
      return createFakeApi();
    });
    vi.stubGlobal('mw', {
      Api,
      ForeignApi,
      config: {
        get: vi.fn(() => 'testwiki'),
      },
    });

    const wikis = Composite.wikis({
      wikis: {
        commonswiki: {
          serverName: 'commons.wikimedia.org',
        },
        testwiki: {},
      },
    });

    expect(wikis.ids()).toEqual(['commonswiki', 'testwiki']);
    expect(wikis.has('testwiki')).toBe(true);
    expect(wikis.get('testwiki').runtime().type).toBe('mw');
    expect(wikis.get('commonswiki').runtime().type).toBe('mw');
    expect(ForeignApi).toHaveBeenCalledWith(
      'https://commons.wikimedia.org/w/api.php',
      undefined,
    );
  });

  it('maps page.text() to a MediaWiki revisions query', async () => {
    const api = createFakeApi('Mapped text');
    const wiki = Composite.from(api);

    await expect(wiki.page('Wikipedia:Sandbox').text()).resolves.toBe(
      'Mapped text',
    );

    expect(api.get).toHaveBeenCalledWith({
      action: 'query',
      prop: 'revisions',
      titles: 'Wikipedia:Sandbox',
      rvprop: 'content',
      rvslots: 'main',
      formatversion: 2,
    });
  });

  it('returns empty text when the response has no main slot content', async () => {
    const api = {
      get: vi.fn(async () => ({
        query: {
          pages: [
            {
              revisions: [{}],
            },
          ],
        },
      })),
    };
    const wiki = Composite.from(api);

    await expect(wiki.page('Wikipedia:Sandbox').text()).resolves.toBe('');
  });
});
