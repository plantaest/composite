type Params = Record<string, unknown>;

export function matchesParams(match: Params, params: Params): boolean {
  // Match objects are subsets: callers may pass extra request params.
  return Object.entries(match).every(([key, value]) => params[key] === value);
}
