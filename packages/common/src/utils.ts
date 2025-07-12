import 'core-js/modules/esnext.disposable-stack.constructor';
import 'core-js/modules/esnext.symbol.dispose';

export function createDisposable(...onDisposes: (() => void)[]): Disposable {
  return {
    [Symbol.dispose]() {
      for (const onDispose of onDisposes) {
        onDispose();
      }
    },
  };
}

/**
 * Vscode/Language server protocol provides a disposable interface. Convert them
 * to new ecmascript standard.
 */
export function createDisposableFromVscDisposable(disposable: {
  dispose: () => void;
}): Disposable {
  return createDisposable(() => disposable.dispose());
}

export class RegistryMap<Key extends string, Value> {
  private readonly _onGet: (key: Key) => void;
  private readonly _onRegister: (key: Key, value: Value) => void;
  private readonly _onUnregister: (key: Key, value: Value) => void;
  constructor(callbacks?: {
    onGet?: (key: Key) => void;
    onRegister?: (key: Key, value: Value) => void;
    onUnregister?: (key: Key, value: Value) => void;
  }) {
    callbacks = callbacks ?? {};
    this._onGet = callbacks.onGet ?? (() => {});
    this._onRegister = callbacks.onRegister ?? (() => {});
    this._onUnregister = callbacks.onUnregister ?? (() => {});
  }

  private readonly _internal = new Map<Key, Value>();

  public tryGet(key: Key): Value | undefined {
    this._onGet(key);
    return this._internal.get(key);
  }

  public get(key: Key): Value {
    const value = this.tryGet(key);
    ASSERT(value !== undefined, `missing value at ${key}`);
    return value;
  }

  public register(key: Key, value: Value): Disposable {
    this._onRegister(key, value);
    ASSERT(!this._internal.has(key), `register value at ${key} twice`);
    this._internal.set(key, value);

    return createDisposable(() => {
      this.unregister(key);
    });
  }

  public unregister(key: Key): void {
    const value = this._internal.get(key);
    ASSERT(value !== undefined, `unregister value at ${key} twice`);
    this._onUnregister(key, value);
    this._internal.delete(key);
  }

  public entries(): IterableIterator<[Key, Value]> {
    return this._internal.entries();
  }

  public keys(): IterableIterator<Key> {
    return this._internal.keys();
  }

  public values(): IterableIterator<Value> {
    return this._internal.values();
  }
}
