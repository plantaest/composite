import type { Page } from "./Page";
import type { Runtime } from "./runtime";

export interface Wiki {
  runtime(): Runtime;
  page(title: string): Page;
}
