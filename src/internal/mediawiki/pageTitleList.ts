import type {
  WikiRequestParams,
  WikiRequestResponse,
} from '../../core/types.js';

export interface PageTitleListQueryResponse extends WikiRequestResponse {
  continue?: {
    continue: string;
    [key: string]: string;
  };
  query?: {
    pages?: Array<{
      [key: string]:
        | string
        | number
        | boolean
        | Array<{
            title?: string;
          }>
        | undefined;
    }>;
  };
}

export interface PageTitleListConfig {
  prop: string;
  limitParam: string;
}

export type PageTitleListRequest = (
  params: WikiRequestParams,
) => Promise<PageTitleListQueryResponse>;

export async function collectPageTitleList(
  request: PageTitleListRequest,
  title: string,
  config: PageTitleListConfig,
): Promise<string[]> {
  const titles: string[] = [];
  let continuation: Record<string, string> | undefined;

  do {
    // "max" means the largest batch MediaWiki allows for one request, not all
    // values. Follow continuation until the API stops returning continue data.
    const response = await request({
      action: 'query',
      prop: config.prop,
      titles: title,
      [config.limitParam]: 'max',
      formatversion: 2,
      ...continuation,
    });

    titles.push(...extractPageTitleList(response, config.prop));

    continuation = response.continue;
  } while (continuation !== undefined);

  return titles;
}

export function extractPageTitleList(
  response: PageTitleListQueryResponse,
  prop: string,
): string[] {
  const values = response.query?.pages?.[0]?.[prop];

  if (!Array.isArray(values)) {
    return [];
  }

  return values.flatMap((value) =>
    value.title === undefined ? [] : [value.title],
  );
}
