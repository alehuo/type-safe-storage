# type-safe-storage

## Introduction

This library wraps the browser's localStorage and sessionStorage functionality to provide run-time type-checking of the values that are set and get from the sessionStorage and localStorage object.

This library adds a new parameter to the `setItem()` and `getItem()` functions which is used to pass an `io-ts` codec. The codec is used to validate the data coming from and going to the browser's local storage.

## Installation

```
npm install --save type-safe-storage fp-ts@2.9.5 io-ts@2.2.14
```

## Implemented methods

- ```typescript
    setItem(key, value, codec)
    ```
- ```typescript
    getItem(key, codec)
    ```
- ```typescript
    removeItem()
    ```
- ```typescript
    clear()
    ```
- ```typescript
    length // getter
    ```

## Example

### setItem & getItem

```typescript
import { typeSafeLocalStorage as localStorage } from "type-safe-storage";
import * as t from "io-ts";
import { isRight } from "fp-ts/lib/either";

const codec = t.type({
  id: t.number,
  value: t.string,
});

const res = localStorage.setItem(
  "key",
  {
    id: 1,
    value: "First",
  },
  codec
);

// setItem returns either Left<"ERROR"> or Right<"Ok"> depending if the value passes the validation

if (isRight(res)) {
  console.log("Success!");
  const retrieved = localStorage.getItem("key", codec);
  // Returns null for non-existent storage value
  // Returns instance of Left<t.Errors> if the decoding fails
  // Returns Right<{ id: number, value: string }> for a successfull decoding
  if (retrieved === null) {
    console.error("Value does not exist!");
  }
  if (isLeft(retrieved)) {
    console.error("Failed to decode value!");
  } else {
    console.log(`The value is: "${retrieved.right.value}"`);
    // Output: The value is: "First"
  }
}
```
