import { normalizePageInfo } from '../../../src/internal/mediawiki/pageInfo.js';

describe('normalizePageInfo', () => {
  it('normalizes existing page metadata', () => {
    expect(
      normalizePageInfo('Wikipedia:Sandbox', {
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
      }),
    ).toEqual({
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
  });

  it('normalizes title normalization responses', () => {
    expect(
      normalizePageInfo('WP:Sandbox', {
        query: {
          normalized: [
            {
              from: 'WP:Sandbox',
              to: 'Wikipedia:Sandbox',
            },
          ],
          pages: [
            {
              pageid: 107092,
              ns: 4,
              title: 'Wikipedia:Sandbox',
            },
          ],
        },
      }),
    ).toEqual({
      title: 'Wikipedia:Sandbox',
      sourceTitle: 'WP:Sandbox',
      exists: true,
      pageId: 107092,
      namespace: 4,
      normalized: true,
    });
  });

  it('normalizes redirect responses', () => {
    expect(
      normalizePageInfo('Quandong', {
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
              contentmodel: 'wikitext',
              pagelanguage: 'vi',
              touched: '2026-06-25T21:13:04Z',
              lastrevid: 75209624,
              length: 2048,
            },
          ],
        },
      }),
    ).toEqual({
      title: 'Santalum acuminatum',
      sourceTitle: 'Quandong',
      exists: true,
      pageId: 2323887,
      namespace: 0,
      redirect: true,
      contentModel: 'wikitext',
      pageLanguage: 'vi',
      touched: '2026-06-25T21:13:04Z',
      lastRevisionId: 75209624,
      length: 2048,
    });
  });

  it('normalizes missing page responses', () => {
    expect(
      normalizePageInfo('Wikipedia:Missing', {
        query: {
          pages: [
            {
              ns: 4,
              title: 'Wikipedia:Missing',
              missing: true,
              contentmodel: 'wikitext',
              pagelanguage: 'en',
            },
          ],
        },
      }),
    ).toEqual({
      title: 'Wikipedia:Missing',
      sourceTitle: 'Wikipedia:Missing',
      exists: false,
      namespace: 4,
      missing: true,
      contentModel: 'wikitext',
      pageLanguage: 'en',
    });
  });

  it('fails when the response has no page', () => {
    expect(() =>
      normalizePageInfo('Wikipedia:Missing', {
        query: {
          pages: [],
        },
      }),
    ).toThrow('MediaWiki page info response did not include a page.');
  });
});
