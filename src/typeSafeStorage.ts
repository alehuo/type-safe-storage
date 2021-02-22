import { isLeft, left, right, Either } from "fp-ts/lib/Either";
import { Any, TypeOf, Validation } from "io-ts";

export class CustomStorage {
  constructor(private readonly storage: Storage) {
    return new Proxy(this, {
      get(target, name, receiver) {
        if (!Reflect.has(target, name)) {
          const item = storage.getItem(name.toString());
          if (item === null) {
            return null;
          }
          return JSON.parse(item);
        } else {
          return Reflect.get(target, name, receiver);
        }
      },
      set(target, name, value, receiver) {
        if (!Reflect.has(target, name)) {
          storage.setItem(name.toString(), JSON.stringify(value));
          return true;
        } else {
          return Reflect.set(target, name, value, receiver);
        }
      },
    });
  }

  setItem<T extends Any>(
    key: string,
    val: TypeOf<T>,
    codec: T
  ): Either<"ERROR", "OK"> {
    const result = codec.decode(val);
    if (isLeft(result)) {
      return left("ERROR" as const);
    } else {
      this.storage.setItem(key, JSON.stringify(result.right));
      return right("OK" as const);
    }
  }
  get length() {
    return this.storage.length;
  }
  getItem<T extends Any>(key: string, codec: T) {
    const item = this.storage.getItem(key);
    if (!item) {
      return null;
    }
    return codec.decode(JSON.parse(item)) as Validation<TypeOf<T>>;
  }
  key(index: number) {
    return this.storage.key(index);
  }
  removeItem(key: string) {
    this.storage.removeItem(key);
  }
  clear() {
    this.storage.clear();
  }
}

export const typeSafeLocalStorage = new CustomStorage(window.localStorage);
export const typeSafeSessionStorage = new CustomStorage(window.sessionStorage);
