/**
 * Type-resolved wrapper of Object methods with Record<K, V> type where K is not
 * string.
 */

export function keys<T extends object>(o: T): (keyof T)[] {
  return Object.keys(o) as (keyof T)[];
}

export function values<T extends object>(o: T): T[keyof T][] {
  return Object.values(o) as T[keyof T][];
}

export function entries<T extends object>(o: T): [keyof T, T[keyof T]][] {
  return Object.entries(o) as [keyof T, T[keyof T]][];
}

export function fromEntries<K extends string | number | symbol, V>(
  entries: Iterable<readonly [K, V]>
): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}
