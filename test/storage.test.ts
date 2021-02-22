import {
  typeSafeLocalStorage as localStorage,
  CustomStorage,
} from "../src/index";
import * as t from "io-ts";
import { isRight } from "fp-ts/lib/These";
describe("withCustomStorage", () => {
  afterEach(() => {
    localStorage.clear();
  });
  it("Should set item correctly", () => {
    const res = localStorage.setItem("test", "value", t.string);
    expect(res._tag).toEqual("Right");
    expect(localStorage.length).toEqual(1);
  });
  it("Should get item correctly after calling setItem", () => {
    const setResult = localStorage.setItem("test", "testvalue", t.string);
    expect(setResult._tag).toEqual("Right");
    const result = localStorage.getItem("test", t.string);
    expect(localStorage.length).toEqual(1);
    expect(result).toBeDefined();
    expect(result?._tag).toBe("Right");
    if (isRight(result!)) {
      expect(result.right).toEqual("testvalue");
    }
  });
  it("Should set object correctly", () => {
    const expected = {
      key1: "value1",
      key2: 2,
      key3: true,
      key4: null,
    };
    const codec = t.type({
      key1: t.string,
      key2: t.number,
      key3: t.boolean,
      key4: t.null,
    });
    const setResult = localStorage.setItem("test", expected, codec);
    expect(setResult._tag).toEqual("Right");
    const result = localStorage.getItem("test", codec);
    expect(localStorage.length).toEqual(1);
    expect(result).toBeDefined();
    expect(result?._tag).toBe("Right");
    if (isRight(result!)) {
      expect(result.right).toStrictEqual(expected);
    }
  });
  it("Should show error if the decoding fails", () => {
    const failing = {
      key1: 5,
      key2: 2,
      key3: true,
      key4: null,
    };
    const codec = t.type({
      key1: t.string,
      key2: t.number,
      key3: t.boolean,
      key4: t.null,
    });
    // @ts-expect-error
    const setResult = localStorage.setItem("test", failing, codec);
    expect(setResult._tag).toEqual("Left");
    // @ts-expect-error
    expect(setResult.left).toEqual("ERROR");
    const getRes = localStorage.getItem("test", t.string);
    expect(getRes).toEqual(null);
    // @ts-expect-error
    const setResult2 = localStorage.setItem("test", failing, t.string);
    expect(setResult2._tag).toEqual("Left");
    // @ts-expect-error
    expect(setResult2.left).toEqual("ERROR");
    const getRes2 = localStorage.getItem("test", t.string);
    expect(getRes2).toEqual(null);
  });
  it("Should remove item from storage", () => {
    const setResult = localStorage.setItem("test", "testvalue", t.string);
    expect(setResult._tag).toEqual("Right");
    localStorage.removeItem("test");
    expect(localStorage.getItem("test", t.string)).toEqual(null);
  });
  it("Should clear local storage", () => {
    localStorage.setItem("test1", "testvalue1", t.string);
    localStorage.setItem("test2", "testvalue2", t.string);
    localStorage.setItem("test3", "testvalue3", t.string);
    localStorage.setItem("test4", "testvalue4", t.string);
    localStorage.clear();
    expect(localStorage.getItem("test1", t.string)).toStrictEqual(null);
    expect(localStorage.getItem("test2", t.string)).toStrictEqual(null);
    expect(localStorage.getItem("test3", t.string)).toStrictEqual(null);
    expect(localStorage.getItem("test4", t.string)).toStrictEqual(null);
  });
  it("Should get key correctly", () => {
    localStorage.setItem("test1", "testvalue1", t.string);
    localStorage.setItem("test2", "testvalue2", t.string);
    localStorage.setItem("test3", "testvalue3", t.string);
    localStorage.setItem("test4", "testvalue4", t.string);
    expect(localStorage.key(0)).toEqual("test1");
    expect(localStorage.key(1)).toEqual("test2");
    expect(localStorage.key(2)).toEqual("test3");
    expect(localStorage.key(3)).toEqual("test4");
    localStorage.clear();
    expect(localStorage.key(0)).toStrictEqual(null);
    expect(localStorage.key(1)).toStrictEqual(null);
    expect(localStorage.key(2)).toStrictEqual(null);
    expect(localStorage.key(3)).toStrictEqual(null);
  });
  it("Should get count of items storage", () => {
    const storage = window.localStorage;
    storage.setItem("testi1", "testvalue1");
    storage.setItem("testi2", "testvalue2");
    storage.setItem("testi3", "testvalue3");
    storage.setItem("testi4", "testvalue4");
    const mockStorage = new CustomStorage(storage);
    expect(mockStorage.length).toEqual(4);
    mockStorage.clear();
    expect(mockStorage.length).toEqual(0);
  });
  it("Should work with proxy", () => {
    expect(localStorage.length).toEqual(0);
    // @ts-expect-error
    localStorage.hello = "world";
    expect(localStorage.length).toEqual(1);
    // @ts-expect-error
    expect(localStorage.getItem("hello", t.string).right).toStrictEqual(
      "world"
    );
    // @ts-expect-error
    expect(localStorage.hello).toStrictEqual("world");
  });
  it("Should return null with proxy if the key is non-existent", () => {
    // @ts-expect-error
    expect(localStorage.hello).toStrictEqual(null);
  });
});
