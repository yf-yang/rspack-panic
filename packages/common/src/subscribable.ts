/**
 * REFACTOR: Current implementation is based on React's `useSyncExternalStore`.
 * Maybe Observable is more common.
 *
 * @see https://rxjs.dev/guide/observable
 */
export interface ISubscribable<T> {
  subscribe: (listener: (value: T, prevValue: T) => void) => () => void;
  getSnapshot: () => T;
}

export class Subscribable<T> implements ISubscribable<T> {
  private _listeners: ((value: T, prevValue: T) => void)[] = [];
  private _version = 0;
  constructor(private _value: T) {}

  public update(callback: (value: T) => T): void {
    const prevValue = this._value;
    const value = callback(prevValue);
    this._value = value;
    if (value !== prevValue) {
      this._version += 1;
      // Used to cancel listeners when the subscribable is updated during a
      // listener call
      const currentVersion = this._version;
      for (const listener of this._listeners) {
        currentVersion === this._version && listener(value, prevValue);
      }
    }
  }

  public subscribe(listener: (value: T, prevValue: T) => void): () => void {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener);
    };
  }

  public getSnapshot(): T {
    return this._value;
  }
}
