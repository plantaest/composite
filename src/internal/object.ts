type UndefinedFields<T> = {
  [K in keyof T]: T[K] | undefined;
};

export function omitUndefinedFields<T extends object>(
  value: UndefinedFields<T>,
): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, field]) => field !== undefined),
  ) as T;
}
