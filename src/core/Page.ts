export interface Page {
  title(): string;
  text(): Promise<string>;
}
