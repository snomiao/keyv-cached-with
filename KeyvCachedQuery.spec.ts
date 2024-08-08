import { expectTypeOf } from "expect-type";
import Keyv from "keyv";
import { KeyvCachedQuery as kcq } from "./KeyvCachedQuery";
it("works in slot3", async () => {
  const r1 = await kcq(new Keyv(), async (a: string) => 123, "asdf");
  expectTypeOf(r1).toEqualTypeOf<any>(); // because of Keyv<Value = any>
  const r2 = await kcq(new Keyv(), async (a: number) => 123, 1234);
  expectTypeOf(r2).toEqualTypeOf<any>(); // because of Keyv<Value = any>
  const r3 = await kcq(new Keyv<string>(), async (a: number) => "123", 1234);
  expectTypeOf(r3).toEqualTypeOf<string>();
  const r4 = await kcq(new Keyv<number>(), async (a: number) => 123, 1234);
  expectTypeOf(r4).toEqualTypeOf<number>();
  const r5 = await kcq(new Keyv<unknown>(), async (a: number) => "123", 1234);
  expectTypeOf(r5).toEqualTypeOf<string>();
  const r6 = await kcq(new Keyv<number>(), async (a: number) => 123, 1234);
  expectTypeOf(r6).toEqualTypeOf<number>();
  const r9 = await kcq(new Keyv<unknown>(), async (a) => 1 as unknown, 1234);
  expectTypeOf(r9).toEqualTypeOf<unknown>();

  // num
  const withoutArgs = await kcq(new Keyv<unknown>(), () => 123, null);
  expectTypeOf(withoutArgs).toEqualTypeOf<number>();
  const r7: number = await kcq(new Keyv<unknown>(), async () => 123, undefined);
  expectTypeOf(r7).toEqualTypeOf<number>();
  expect(r7).toBe(123);
  // obj
  const r8: { a: number } = await kcq(
    new Keyv<unknown>(),
    () => ({ a: 123 }),
    undefined
  );
  expectTypeOf(r8).toEqualTypeOf<{ a: number }>();
  expect(r8.a).toBe(123);
});
it("works in slot2", async () => {
  let i = 0;
  const kv = new Keyv<unknown>();
  const f1 = kcq(kv, async (a: number) => `${a}/${++i}`);
  expectTypeOf(f1).not.toEqualTypeOf<any>();
  expectTypeOf(f1).not.toEqualTypeOf<unknown>();
  expect(await f1(1)).toBe("1/1");
  expect(await f1(5)).toBe("5/2");
  expect(await f1(1)).toBe("1/1");
  expectTypeOf(await f1(1)).toEqualTypeOf<string>();

  const f2 = kcq(kv, async (a: number) => `${a}/${++i}`);
  expectTypeOf(f2).not.toEqualTypeOf<(...args: any) => Promise<any>>();
  expectTypeOf(f2).not.toEqualTypeOf<any>();
  expectTypeOf(f2).not.toEqualTypeOf<unknown>();
  expect(await f2(1)).toBe("1/1");
  expect(await f2(5)).toBe("5/2");
  expectTypeOf(await f2(1)).toEqualTypeOf<string>();
  expect(await f2(1)).toBe("1/1");

  const f3 = kcq(new Keyv(), async (a: number) => 123);
  await f3(1234);
  const f4 = kcq(new Keyv(), async (a) => 123);
  await f4("zxcv");

  const fStr1 = kcq(new Keyv<string>(), <T>(a: T) => a);
  expectTypeOf(await fStr1("abc")).toEqualTypeOf<string>();
  const fStr2 = kcq(new Keyv<unknown>(), (a: string) => a);
  expectTypeOf(await fStr2("abc")).toEqualTypeOf<string>();
  const fStr3 = kcq(new Keyv<unknown>(), (a) => String(a));
  expectTypeOf(await fStr3("abc")).toEqualTypeOf<string>();
  expectTypeOf(await fStr3(123)).toEqualTypeOf<string>();

  const fUnknown = kcq(new Keyv<unknown>(), <T>(a: T) => a);
  const abc = await fUnknown("abc");
  expectTypeOf(abc).toEqualTypeOf<unknown>();

  const fAny = kcq(new Keyv(), <T>(a: T) => a);
  expectTypeOf(await fAny("abc")).toEqualTypeOf<any>();
  const fAny2 = kcq(new Keyv<unknown>(), <T>(a: T) => a as any);
  expectTypeOf(await fAny2("abc")).toEqualTypeOf<any>();
  const fAny3 = kcq(new Keyv<unknown>(), <T>(a: T) => a);
  expectTypeOf(await fAny3("abc" as any)).toEqualTypeOf<unknown>();
  const fWithoutArgs = kcq(new Keyv<unknown>(), () => 123);
  expectTypeOf(await fWithoutArgs(null)).toEqualTypeOf<number>();
});

it("works in slot1", async () => {
  let i = 0;
  const CachedWith = kcq(new Keyv<string>());
  const f2 = CachedWith((a: number) => `${a}/${++i}`);
  expectTypeOf(f2).not.toEqualTypeOf<any>();
  expectTypeOf(f2).not.toEqualTypeOf<unknown>();
  expectTypeOf(await f2(123)).toEqualTypeOf<string>();
  expect(await f2(2)).toBe("2/2");
  expect(await f2(5)).toBe("5/3");
  expect(await f2(2)).toBe("2/2"); // use cache

  const cached = kcq(new Keyv<unknown>());
  const fWithoutArgs = cached(() => 123);
  expectTypeOf(await fWithoutArgs(null)).toEqualTypeOf<number>();
  expectTypeOf(fWithoutArgs).parameters.toEqualTypeOf<[unknown]>();

  const CachedWith1 = kcq(new Keyv<string>());
  const v1 = await CachedWith1((a: number) => `${a}/${++i}`, 123);
  expectTypeOf(v1).toBeString();
  const CachedWith2 = kcq(new Keyv<unknown>());
  const v2 = await CachedWith2((a: number) => `${a}/${++i}`, 123);
  expectTypeOf(v2).toBeString();
  const v3 = await CachedWith2((a: string) => `${a}/${++i}`, "123");
  expectTypeOf(v3).toBeString();
});
