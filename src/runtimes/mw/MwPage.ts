import type { Page } from '../../core/Page.js';
import type {
  PageInfo,
  PageSaveOptions,
  PageSaveResult,
  WikiQueryResponse,
} from '../../core/types.js';
import { normalizePageInfo } from '../../internal/mediawiki/pageInfo.js';
import { omitUndefinedFields } from '../../internal/object.js';
import type { MwApi, MwApiParams } from './mediawiki.js';

export class MwPage implements Page {
  constructor(
    private readonly api: MwApi,
    private readonly pageTitle: string,
  ) {}

  title(): string {
    return this.pageTitle;
  }

  async text(): Promise<string> {
    // Follows the MediaWiki Action API revisions module:
    // https://www.mediawiki.org/wiki/API:Revisions
    const response = (await this.api.get({
      action: 'query',
      prop: 'revisions',
      titles: this.pageTitle,
      rvprop: 'content',
      rvslots: 'main',
      formatversion: 2,
    })) as WikiQueryResponse;

    return (
      response.query?.pages?.[0]?.revisions?.[0]?.slots?.main?.content ?? ''
    );
  }

  async info(): Promise<PageInfo> {
    // Follows the MediaWiki Action API info module:
    // https://www.mediawiki.org/wiki/API:Info
    const response = await this.api.get({
      action: 'query',
      prop: 'info',
      titles: this.pageTitle,
      redirects: true,
      formatversion: 2,
    });

    return normalizePageInfo(this.pageTitle, response as WikiQueryResponse);
  }

  async exists(): Promise<boolean> {
    return (await this.info()).exists;
  }

  async categories(): Promise<string[]> {
    // Follows the MediaWiki Action API categories prop:
    // https://www.mediawiki.org/wiki/API:Categories
    const response = (await this.api.get({
      action: 'query',
      prop: 'categories',
      titles: this.pageTitle,
      cllimit: 'max',
      formatversion: 2,
    })) as WikiQueryResponse;

    return (
      response.query?.pages?.[0]?.categories?.map((value) => value.title) ?? []
    );
  }

  async templates(): Promise<string[]> {
    // Follows the MediaWiki Action API templates prop:
    // https://www.mediawiki.org/wiki/API:Templates
    const response = (await this.api.get({
      action: 'query',
      prop: 'templates',
      titles: this.pageTitle,
      tllimit: 'max',
      formatversion: 2,
    })) as WikiQueryResponse;

    return (
      response.query?.pages?.[0]?.templates?.map((value) => value.title) ?? []
    );
  }

  async links(): Promise<string[]> {
    // Follows the MediaWiki Action API links prop:
    // https://www.mediawiki.org/wiki/API:Links
    const response = (await this.api.get({
      action: 'query',
      prop: 'links',
      titles: this.pageTitle,
      pllimit: 'max',
      formatversion: 2,
    })) as WikiQueryResponse;

    return response.query?.pages?.[0]?.links?.map((value) => value.title) ?? [];
  }

  async save(
    text: string,
    summary?: string,
    options: PageSaveOptions = {},
  ): Promise<PageSaveResult> {
    const params = omitUndefinedFields<MwApiParams>({
      action: 'edit',
      title: this.pageTitle,
      text,
      summary,
      minor: options.minor,
    });

    // Edit params follow the MediaWiki Action API edit module:
    // https://www.mediawiki.org/wiki/API:Edit
    await this.api.postWithToken('csrf', params);

    return { title: this.pageTitle };
  }
}
