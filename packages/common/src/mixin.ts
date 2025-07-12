// https://www.typescriptlang.org/docs/handbook/mixins.html
export type Constructor<T = MixinBase> = new (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TypeScript forces it to be
  ...args: any[]
) => T;

export class MixinBase {}
