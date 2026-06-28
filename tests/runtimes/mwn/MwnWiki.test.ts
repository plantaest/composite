import type { Mwn } from 'mwn';
import { Composite } from '../../../src/runtimes/mwn/index.js';
import { describeWikiContract } from '../../contract/wikiContract.js';

function createFakeBot(text = 'Hello'): Mwn {
  return {
    request: vi.fn(async () => createSiteInfoResponse()),
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

function createSiteInfoResponse() {
  return {
    query: {
      general: {
        sitename: 'Wikipedia',
      },
    },
  };
}

describeWikiContract(
  'mwn runtime',
  () => Composite.from(createFakeBot('Hello')),
  {
    expectedText: 'Hello from Wikipedia:Sandbox',
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
