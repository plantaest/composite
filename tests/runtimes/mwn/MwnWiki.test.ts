import type { Mwn } from 'mwn';
import { Composite } from '../../../src/runtimes/mwn/index.js';
import { describeWikiContract } from '../../contract/wikiContract.js';

function createFakeBot(text = 'Hello'): Mwn {
  return {
    query: vi.fn(async () => createSiteInfoResponse()),
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
      action: 'query',
      meta: 'siteinfo',
    },
    queryResponse: createSiteInfoResponse(),
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
      query: vi.fn(),
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

  it('delegates wiki.query() to the mwn bot', async () => {
    const bot = createFakeBot();
    const wiki = Composite.from(bot);
    const params = {
      action: 'query',
      meta: 'siteinfo',
    };

    await expect(wiki.query(params)).resolves.toEqual(createSiteInfoResponse());

    expect(bot.query).toHaveBeenCalledWith(params);
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
      query: vi.fn(),
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
      query: vi.fn(),
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
