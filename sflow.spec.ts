import { sleep } from "bun";
import { expectTypeOf } from "expect-type";
import Keyv from "keyv";
import sflow from "sflow";
import { KeyvCachedWith } from "./index";
const cache1d = KeyvCachedWith(new Keyv<unknown>({ ttl: 86400e3 }));
it("survives with sflow", async () => {
  const st = +new Date();
  const fn = jest.fn();
  expect(
    await sflow([1, 2, 2, 3])
      .forEach(
        cache1d(async (e: number) => {
          fn(e);
          await sleep(100);
          console.log(e);
          return e;
        })
      )
      .toArray()
  ).toEqual([1, 2, 2, 3]);
  expect(fn).toHaveBeenCalledTimes(3);
  const et = +new Date();
  console.log(et - st);
  expect(((et - st) / 100).toFixed()).toEqual("3");
});
it("fix typing with sflow", async () => {
  const st = +new Date();
  const fn = jest.fn();
  expect(
    await sflow([1, 2, 2, 3])
      .map(
        cache1d(async (e: number) => {
          fn(e);
          await sleep(100);
          console.log(e);
          return "string";
        })
      )
      .map((e) => expectTypeOf(e).toBeString())
      .toArray()
  ).toEqual([1, 2, 2, 3]);
  expect(fn).toHaveBeenCalledTimes(3);
  const et = +new Date();
  console.log(et - st);
  expect(((et - st) / 100).toFixed()).toEqual("3");
});
