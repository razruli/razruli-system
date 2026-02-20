export const stripNulls = <T extends Record<string, any>>(
  obj: T,
): { [K in keyof T]: NonNullable<T[K]> } => {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === null ? undefined : v]),
  ) as any;
};
