import type { Mwn, MwnOptions } from 'mwn';
import type { Runtime } from '../../core/Runtime.js';
import type { Wiki } from '../../core/Wiki.js';
import { MwnPage } from './MwnPage.js';

export interface MwnWikiConfig extends MwnOptions {
  apiUrl?: string;
  username?: string;
  password?: string;
  userAgent?: string;
}

export class MwnWiki implements Wiki {
  constructor(
    readonly bot: Mwn,
    readonly config: MwnWikiConfig = {},
  ) {}

  runtime(): Runtime {
    return { type: 'mwn' };
  }

  page(title: string): MwnPage {
    return new MwnPage(this.bot, title);
  }
}
