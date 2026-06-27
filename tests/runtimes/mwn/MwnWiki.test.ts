import type { Mwn } from 'mwn';
import { ConfigurationError } from '../../../src/index.js';
import { Composite } from '../../../src/runtimes/mwn/index.js';
import { describeWikiContract } from '../../contract/wikiContract.js';

function createFakeBot(text = 'Hello'): Mwn {
  return {
    Page: vi.fn(function Page(title: string) {
      return {
        text: vi.fn(async () => `${text} from ${title}`),
      };
    }),
  } as unknown as Mwn;
}

describeWikiContract(
  'mwn runtime',
  () => Composite.from(createFakeBot('Hello')),
  {
    expectedText: 'Hello from Wikipedia:Sandbox',
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
    };
    const bot = {
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

  it('requires at least one wiki config for wikis()', async () => {
    await expect(Composite.wikis({ wikis: {} })).rejects.toThrow(
      ConfigurationError,
    );
    await expect(Composite.wikis({ wikis: {} })).rejects.toThrow(
      'At least one wiki config is required.',
    );
  });
});
