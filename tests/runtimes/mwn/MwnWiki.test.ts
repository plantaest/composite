import type { Mwn } from 'mwn';
import { Composite } from '../../../src/runtimes/mwn/index.js';
import { describeWikiContract } from '../../contract/wikiContract.js';

function createFakeBot(text = 'Hello'): Mwn {
  return {
    request: vi.fn(async (params: Record<string, unknown>) => {
      if (params.prop === 'info') {
        return createPageInfoResponse();
      }

      return createSiteInfoResponse();
    }),
    Page: vi.fn(function Page(title: string) {
      return {
        text: vi.fn(async () => `${text} from ${title}`),
        save: vi.fn(async () => ({
          edit: {
            result: 'Success',
          },
        })),
      };
    }),
  } as unknown as Mwn;
}

function createPageInfoResponse() {
  return {
    query: {
      pages: [
        {
          pageid: 107092,
          ns: 4,
          title: 'Wikipedia:Sandbox',
          contentmodel: 'wikitext',
          pagelanguage: 'en',
          touched: '2026-06-20T21:00:50Z',
          lastrevid: 747754,
          length: 82,
        },
      ],
    },
  };
}

function createSiteInfoResponse() {
  return {
    batchcomplete: true as const,
    query: {
      general: {
        sitename: 'Wikipedia',
        lang: 'en',
      },
    },
  };
}

describeWikiContract(
  'mwn runtime',
  () => Composite.from(createFakeBot('Hello')),
  {
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

describe('mwn adapter', () => {
  it('reports the mwn runtime type', () => {
    const wiki = Composite.from(createFakeBot());

    expect(wiki.runtime().type).toBe('mwn');
  });

  it('delegates page.text() to the mwn page object', async () => {
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

  it('maps page.info() to an mwn request', async () => {
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

  it('normalizes redirected page.info() responses', async () => {
    const bot = {
      request: vi.fn(async () => ({
        query: {
          redirects: [
            {
              from: 'Quandong',
              to: 'Santalum acuminatum',
            },
          ],
          pages: [
            {
              pageid: 2323887,
              ns: 0,
              title: 'Santalum acuminatum',
            },
          ],
        },
      })),
      Page: vi.fn(),
    } as unknown as Mwn;
    const wiki = Composite.from(bot);

    await expect(wiki.page('Quandong').info()).resolves.toEqual({
      title: 'Santalum acuminatum',
      sourceTitle: 'Quandong',
      exists: true,
      pageId: 2323887,
      namespace: 0,
      redirect: true,
    });
  });

  it('delegates wiki.request() to the mwn bot', async () => {
    const bot = createFakeBot();
    const wiki = Composite.from(bot);
    const params = {
      action: 'parse',
      page: 'Wikipedia:Sandbox',
    };

    await expect(wiki.request(params)).resolves.toEqual(
      createSiteInfoResponse(),
    );

    expect(bot.request).toHaveBeenCalledWith(params);
  });

  it('delegates wiki.query() to mwn request with action=query', async () => {
    const bot = createFakeBot();
    const wiki = Composite.from(bot);
    const params = {
      meta: 'siteinfo',
    };

    await expect(wiki.query(params)).resolves.toEqual(createSiteInfoResponse());

    expect(bot.request).toHaveBeenCalledWith({
      action: 'query',
      meta: 'siteinfo',
    });
  });

  it('lets explicit action override wiki.query() action', async () => {
    const bot = createFakeBot();
    const wiki = Composite.from(bot);

    await expect(
      wiki.query({
        action: 'parse',
        page: 'Wikipedia:Sandbox',
        meta: 'siteinfo',
      }),
    ).resolves.toEqual(createSiteInfoResponse());

    expect(bot.request).toHaveBeenCalledWith({
      action: 'parse',
      page: 'Wikipedia:Sandbox',
      meta: 'siteinfo',
    });
  });

  it('delegates page.save() to the mwn page object', async () => {
    const mwnPage = {
      text: vi.fn(),
      save: vi.fn(async () => ({
        edit: {
          result: 'Success',
        },
      })),
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

  it('allows page.save() without a summary', async () => {
    const mwnPage = {
      text: vi.fn(),
      save: vi.fn(async () => ({
        edit: {
          result: 'Success',
        },
      })),
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

  it('requires at least one wiki config for wikis()', async () => {
    await expect(Composite.wikis({ wikis: {} })).rejects.toThrow(
      'At least one wiki is required.',
    );
  });
});
