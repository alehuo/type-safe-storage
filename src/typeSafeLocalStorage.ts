import { isLeft, right } from "fp-ts/lib/Either";
import { left } from "fp-ts/lib/These";
import { Any, TypeOf, Validation } from "io-ts";

export const withCustomStorage = (storage: Storage) => ({
  setItem: function <T extends Any>(key: string, val: TypeOf<T>, codec: T) {
    const result = codec.decode(val);
    if (isLeft(result)) {
      return left("ERROR" as const);
    } else {
      storage.setItem(key, JSON.stringify(result.right));
      return right("OK" as const);
    }
  },
  get length() {
    return storage.length;
  },
  getItem: function <T extends Any>(key: string, codec: T) {
    const item = storage.getItem(key);
    if (!item) {
      return null;
    }
    return codec.decode(JSON.parse(item)) as Validation<TypeOf<T>>;
  },
  key: function (index: number) {
    return storage.key(index);
  },
  removeItem: function (key: string) {
    storage.removeItem(key);
  },
  clear: function () {
    storage.clear();
  },
});

export const typeSafeLocalStorage = withCustomStorage(localStorage);
