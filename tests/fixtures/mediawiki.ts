// Based on a browser-console mw.Api response from test.wikipedia.org.
export function createPageInfoResponse() {
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

// Based on a browser-console mw.Api response from test.wikipedia.org.
// Currently used by the `/mw` adapter because mwn page text delegates to mwn.
export function createPageTextResponse(text: string) {
  return {
    batchcomplete: true as const,
    query: {
      pages: [
        {
          pageid: 107092,
          ns: 4,
          title: 'Wikipedia:Sandbox',
          revisions: [
            {
              slots: {
                main: {
                  contentmodel: 'wikitext',
                  contentformat: 'text/x-wiki',
                  content: text,
                },
              },
            },
          ],
        },
      ],
    },
  };
}

// Compact prop=categories shape observed from the MediaWiki Action API.
export function createPageCategoriesResponse() {
  return {
    batchcomplete: true as const,
    query: {
      pages: [
        {
          pageid: 107092,
          ns: 4,
          title: 'Wikipedia:Sandbox',
          categories: [
            {
              ns: 14,
              title: 'Category:Tests',
            },
            {
              ns: 14,
              title: 'Category:Sandbox pages',
            },
          ],
        },
      ],
    },
  };
}

// Compact prop=templates shape observed from the MediaWiki Action API.
export function createPageTemplatesResponse() {
  return {
    batchcomplete: true as const,
    query: {
      pages: [
        {
          pageid: 107092,
          ns: 4,
          title: 'Wikipedia:Sandbox',
          templates: [
            {
              ns: 10,
              title: 'Template:Sandbox notice',
            },
            {
              ns: 10,
              title: 'Template:Documentation',
            },
          ],
        },
      ],
    },
  };
}

// Compact prop=links shape observed from the MediaWiki Action API.
export function createPageLinksResponse() {
  return {
    batchcomplete: true as const,
    query: {
      pages: [
        {
          pageid: 107092,
          ns: 4,
          title: 'Wikipedia:Sandbox',
          links: [
            {
              ns: 12,
              title: 'Help:Contents',
            },
            {
              ns: 4,
              title: 'Wikipedia:Sandbox/Help',
            },
          ],
        },
      ],
    },
  };
}

// Edit success shape observed after saving Wikipedia:Sandbox on test.wikipedia.org.
export function createEditResponse() {
  return {
    edit: {
      result: 'Success',
      pageid: 107092,
      title: 'Wikipedia:Sandbox',
      contentmodel: 'wikitext',
      oldrevid: 747754,
      newrevid: 748800,
      newtimestamp: '2026-06-28T07:54:59Z',
    },
  };
}

// Compact siteinfo shape observed from test.wikipedia.org.
export function createSiteInfoResponse() {
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
