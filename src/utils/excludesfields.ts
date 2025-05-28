export function excludeFields<T, Key extends keyof T>(
  entity: T,
  keys: Key[],
): Omit<T, Key> {
  return Object.fromEntries(
    Object.entries(entity).filter(([key]) => !keys.includes(key as Key)),
  ) as Omit<T, Key>;
}
