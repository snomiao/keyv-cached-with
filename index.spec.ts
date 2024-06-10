import Keyv from "keyv";
import { KeyvCachedWith } from "./index";

it("works in full-args call", async () => {
  let i = 0;
  const kv = new Keyv();
  const fn1 = KeyvCachedWith(kv, async (a: number) => `${a}/${++i}`) satisfies (
    a: number
  ) => Promise<string>;

  expect(await fn1(1)).toBe("1/1");
  expect(await fn1(5)).toBe("5/2");
  expect(await fn1(1)).toBe("1/1");
});

it("works with curry", async () => {
  const CachedWith = KeyvCachedWith(new Keyv());
  let i = 0;

  const fn2 = CachedWith((a: number) => `${a}/${++i}`) satisfies (
    a: number
  ) => Promise<string>;
  expect(await fn2(2)).toBe("2/1");
  expect(await fn2(5)).toBe("5/2");
  expect(await fn2(2)).toBe("2/1"); // use cache

  // fn3's content is same with fn2
  const fn3 = CachedWith((a: number) => `${a}/${++i}`) satisfies (
    a: number
  ) => Promise<string>;
  expect(await fn3(2)).toBe("2/1"); // use cache
  expect(await fn3(5)).toBe("5/2"); // use cache
  expect(await fn3(6)).toBe("6/3"); // eval

  // fn4's content is different
  const fn4 = CachedWith((a: number) => `${a}/${++i}` + "".trim());
  expect(await fn4(2)).toBe("2/4"); // use cache
  expect(await fn4(5)).toBe("5/5");
  expect(await fn4(2)).toBe("2/4"); // use cache
});
