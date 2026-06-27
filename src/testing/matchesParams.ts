type Params = Record<string, unknown>;

export function matchesParams(match: Params, params: Params): boolean {
  return Object.entries(match).every(([key, value]) => params[key] === value);
}
