/* eslint-disable unicorn/no-instanceof-builtins -- safe use of instanceof */
export function boolean(value: unknown): value is boolean {
  return value === true || value === false;
}

export function string(value: unknown): value is string {
  return typeof value === 'string' || value instanceof String;
}

export function number(value: unknown): value is number {
  return typeof value === 'number' || value instanceof Number;
}

export function bigint(value: unknown): value is bigint {
  return typeof value === 'bigint' || value instanceof BigInt;
}

export function error(value: unknown): value is Error {
  return value instanceof Error;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- safe use of Function here
export function func(value: unknown): value is Function {
  return typeof value === 'function';
}

export function iterable(value: unknown): value is Iterable<unknown> {
  // https://stackoverflow.com/a/32538867/5930115
  return (
    value !== undefined &&
    value !== null &&
    typeof (value as Iterable<unknown>)[Symbol.iterator] === 'function'
  );
}

export function array(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function stringArray(value: unknown): value is string[] {
  return array(value) && value.every(elem => string(elem));
}

export function typedArray<T>(
  value: unknown,
  check: (value: unknown) => boolean
): value is T[] {
  return Array.isArray(value) && (value as unknown[]).every(v => check(v));
}

export function thenable<T>(value: unknown): value is PromiseLike<T> {
  return Boolean(value) && func((value as { then: unknown }).then);
}
