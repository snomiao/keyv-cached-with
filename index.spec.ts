import Keyv from "keyv";
import { KeyvCachedWith as fn } from "./index";
import { expectTypeOf } from "expect-type";
it("works in slot3", async () => {
  const r1 = await fn(new Keyv(), async (a: string) => 123, "asdf");
  expectTypeOf(r1).toEqualTypeOf<any>(); // because of Keyv<Value = any>
  const r2 = await fn(new Keyv(), async (a: number) => 123, 1234);
  expectTypeOf(r2).toEqualTypeOf<any>(); // because of Keyv<Value = any>
  const r3 = await fn(new Keyv<string>(), async (a: number) => "123", 1234);
  expectTypeOf(r3).toEqualTypeOf<string>();
  const r4 = await fn(new Keyv<number>(), async (a: number) => 123, 1234);
  expectTypeOf(r4).toEqualTypeOf<number>();
  const r5 = await fn(new Keyv<unknown>(), async (a: number) => "123", 1234);
  expectTypeOf(r5).toEqualTypeOf<string>();
  const r6 = await fn(new Keyv<number>(), async (a: number) => 123, 1234);
  expectTypeOf(r6).toEqualTypeOf<number>();
  const r9 = await fn(new Keyv<unknown>(), async (a) => 1 as unknown, 1234);
  expectTypeOf(r9).toEqualTypeOf<unknown>();

  // num
  const r7: number = await fn(new Keyv<unknown>(), async () => 123);
  expectTypeOf(r7).toEqualTypeOf<number>();
  // obj
  const r8: { a: number } = await fn(new Keyv<unknown>(), () => ({ a: 123 }));
  expectTypeOf(r8).toEqualTypeOf<{ a: number }>();
});
it("works in slot2", async () => {
  let i = 0;
  const kv = new Keyv<unknown>();
  const f1 = fn(kv, async (a: number) => `${a}/${++i}`);
  expectTypeOf(f1).not.toEqualTypeOf<any>();
  expectTypeOf(f1).not.toEqualTypeOf<unknown>();
  expect(await f1(1)).toBe("1/1");
  expect(await f1(5)).toBe("5/2");
  expect(await f1(1)).toBe("1/1");
  expectTypeOf(await f1(1)).toEqualTypeOf<string>();

  const f2 = fn(kv, async (a: number) => `${a}/${++i}`);
  expectTypeOf(f2).not.toEqualTypeOf<(...args: any) => Promise<any>>();
  expectTypeOf(f2).not.toEqualTypeOf<any>();
  expectTypeOf(f2).not.toEqualTypeOf<unknown>();
  expect(await f2(1)).toBe("1/1");
  expect(await f2(5)).toBe("5/2");
  expectTypeOf(await f2(1)).toEqualTypeOf<string>();
  expect(await f2(1)).toBe("1/1");

  const f3 = fn(new Keyv(), async (a: number) => 123);
  await f3(1234);
  const f4 = fn(new Keyv(), async (a) => 123);
  await f4("zxcv");

  const fStr1 = fn(new Keyv<string>(), <T>(a: T) => a);
  expectTypeOf(await fStr1("abc")).toEqualTypeOf<string>();
  const fStr2 = fn(new Keyv<unknown>(), (a: string) => a);
  expectTypeOf(await fStr2("abc")).toEqualTypeOf<string>();
  const fStr3 = fn(new Keyv<unknown>(), (a) => String(a));
  expectTypeOf(await fStr3("abc")).toEqualTypeOf<string>();
  expectTypeOf(await fStr3(123)).toEqualTypeOf<string>();

  const fUnknown = fn(new Keyv<unknown>(), <T>(a: T) => a);
  const abc = await fUnknown("abc");
  expectTypeOf(abc).toEqualTypeOf<unknown>();

  const fAny = fn(new Keyv(), <T>(a: T) => a);
  expectTypeOf(await fAny("abc")).toEqualTypeOf<any>();
  const fAny2 = fn(new Keyv<unknown>(), <T>(a: T) => a as any);
  expectTypeOf(await fAny2("abc")).toEqualTypeOf<any>();
  const fAny3 = fn(new Keyv<unknown>(), <T>(a: T) => a);
  expectTypeOf(await fAny3("abc" as any)).toEqualTypeOf<unknown>();
});

it("works in slot1", async () => {
  let i = 0;
  const CachedWith = fn(new Keyv<string>());
  const f2 = CachedWith((a: number) => `${a}/${++i}`);
  expectTypeOf(f2).not.toEqualTypeOf<any>();
  expectTypeOf(f2).not.toEqualTypeOf<unknown>();
  expectTypeOf(await f2(123)).toEqualTypeOf<string>();
  expect(await f2(2)).toBe("2/1");
  expect(await f2(5)).toBe("5/2");
  expect(await f2(2)).toBe("2/1"); // use cache

  const CachedWith1 = fn(new Keyv<string>());
  const v1 = await CachedWith1((a: number) => `${a}/${++i}`, 123);
  expectTypeOf(v1).toBeString();
  const CachedWith2 = fn(new Keyv<unknown>());
  const v2 = await CachedWith2((a: number) => `${a}/${++i}`, 123);
  expectTypeOf(v2).toBeString();
  const v3 = await CachedWith2((a: string) => `${a}/${++i}`, "123");
  expectTypeOf(v3).toBeString();
});
