import type { Wiki } from "./Wiki";

export interface Wikis {
  get(wikiId: string): Wiki;
  has(wikiId: string): boolean;
  ids(): string[];
  current(): Wiki;
}
