// HACK: Omit over a union.
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
export type DistributiveOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never;

// HACK: Pick over a union.
// https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
export type DistributivePick<T, K extends keyof T> = T extends unknown
  ? Pick<T, K>
  : never;

export type DistributivePropertyAccess<T, K extends keyof T, V = unknown> =
  T extends Record<K, V> ? T[K] : never;

// https://stackoverflow.com/a/69019874/5930115
export type EntriesType =
  | [PropertyKey, unknown][]
  | readonly (readonly [PropertyKey, unknown])[];
type DeepWritable<ObjectFlags> = {
  -readonly [P in keyof ObjectFlags]: DeepWritable<ObjectFlags[P]>;
};

// https://stackoverflow.com/a/50375286
type UnionToIntersection<UnionT> = (
  UnionT extends unknown ? (k: UnionT) => void : never
) extends (k: infer I) => void
  ? I
  : never;
type UnionObjectFromArrayOfPairs<ArrT extends EntriesType> =
  DeepWritable<ArrT> extends (infer R)[]
    ? R extends [infer key, infer val]
      ? Record<key & PropertyKey, val>
      : never
    : never;
type MergeIntersectingObjects<ObjT> = { [key in keyof ObjT]: ObjT[key] };
export type EntriesToObject<ArrT extends EntriesType> =
  MergeIntersectingObjects<
    UnionToIntersection<UnionObjectFromArrayOfPairs<ArrT>>
  >;

// https://stackoverflow.com/a/69019874/5930115
type ObjectType = Record<PropertyKey, unknown>;
type PickByValue<ObjT, ValueT> = // From https://stackoverflow.com/a/55153000
  Pick<
    ObjT,
    { [K in keyof ObjT]: ObjT[K] extends ValueT ? K : never }[keyof ObjT]
  >;
export type ObjectEntries<ObjT> = // From https://stackoverflow.com/a/60142095
  {
    [K in keyof ObjT]: [keyof PickByValue<ObjT, ObjT[K]>, ObjT[K]];
  }[keyof ObjT][];

// https://stackoverflow.com/a/69019874/5930115
export function createTypedObjectFromEntries<ArrT extends EntriesType>(
  arr: ArrT
): EntriesToObject<ArrT> {
  return Object.fromEntries(arr) as EntriesToObject<ArrT>;
}

export function getTypedObjectEntries<ObjT extends ObjectType>(
  obj: ObjT
): ObjectEntries<ObjT> {
  return Object.entries(obj) as ObjectEntries<ObjT>;
}

// https://stackoverflow.com/a/52331580
export type ArrayUnpack<T> = T extends (infer U)[] ? U : never;
