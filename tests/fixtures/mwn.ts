import type { Mwn } from 'mwn';
import {
  createEditResponse,
  createPageInfoResponse,
  createSiteInfoResponse,
} from './mediawiki.js';

export interface FakeMwnPage {
  categories: ReturnType<typeof vi.fn>;
  templates: ReturnType<typeof vi.fn>;
  links: ReturnType<typeof vi.fn>;
  text: ReturnType<typeof vi.fn>;
  save: ReturnType<typeof vi.fn>;
}

export type FakeMwnBot = Mwn & {
  request: ReturnType<typeof vi.fn>;
  Page: ReturnType<typeof vi.fn>;
};

export interface CreateFakeMwnPageOptions {
  text?: string;
  methods?: Partial<FakeMwnPage>;
}

export interface CreateFakeMwnBotOptions {
  page?: FakeMwnPage;
}

export function createFakeMwnPage(
  options: CreateFakeMwnPageOptions = {},
): FakeMwnPage {
  return {
    categories: vi.fn(async () => ['Category:Tests', 'Category:Sandbox pages']),
    templates: vi.fn(async () => [
      'Template:Sandbox notice',
      'Template:Documentation',
    ]),
    links: vi.fn(async () => ['Help:Contents', 'Wikipedia:Sandbox/Help']),
    text: vi.fn(async () => options.text ?? 'Hello'),
    save: vi.fn(async () => createEditResponse()),
    ...options.methods,
  };
}

export function createFakeMwnBot(options: CreateFakeMwnBotOptions = {}) {
  const page = options.page ?? createFakeMwnPage();

  return {
    request: vi.fn(async (params: Record<string, unknown>) => {
      if (params.prop === 'info') {
        return createPageInfoResponse();
      }

      if (params.meta === 'siteinfo') {
        return createSiteInfoResponse();
      }

      return {};
    }),
    Page: vi.fn(function Page(_title: string) {
      return page;
    }),
  } as unknown as FakeMwnBot;
}
