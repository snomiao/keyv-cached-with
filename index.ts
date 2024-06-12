import Keyv from "keyv";
import md5 from "md5";
import { curry, curryN } from "rambda";
import type { Function } from "ts-toolbelt/out/Function/Function";
// util util util util util util util util util util util util util util util
type Awaitable<R> = Promise<R> | R;
type Repromise<T> = Promise<Awaited<T>>;
type KeyV<KV extends Keyv> = KV extends Keyv<infer R> ? Awaitable<R> : never;
// type type type type type type type type type type type type type type type
// prettier-ignore
type $<
  KEV extends Keyv<any>
            = Keyv<any>,
  FUN extends (arg: unknown, ...rest: any[])=> KeyV<KEV>
            = (arg: any, ...rest: any[])=> KeyV<KEV>,
  ARG extends FUN extends (arg: infer A, ...args: infer P) => any ? [A, ...P] : never
            = FUN extends (arg: infer A, ...args: infer P) => any ? [A, ...P] : never,
  RET extends Repromise<ReturnType<FUN> & KeyV<KEV>>
            = Repromise<ReturnType<FUN> & KeyV<KEV>>
> = [RET, KEV, FUN, ARG];
// impl impl impl impl impl impl impl impl impl impl impl impl impl impl impl
async function _<
  A extends $[1],
  B extends $<A>[2],
  C extends $<A, B>[3],
  Z extends $<A, B, C>[0]
>(keyv: A, fn: B, ...args: C): Promise<Z> {
  const needleArgs = args.slice(0, fn.length);
  const argsKey = JSON.stringify(needleArgs);
  const fnKey = String(fn);
  const readableKey = (fnKey + argsKey).replace(/\W+/g, "").slice(0, 16);
  const hashKey = md5(String(fn)).slice(0, 8) + md5(argsKey).slice(0, 8);
  const key = readableKey + hashKey;
  const cache = await keyv.get(key);
  if (cache) return cache as Z;
  const result = await fn(args[0], ...args.slice(1));
  await keyv.set(key, result);
  return result as Z;
}
// export export export export export export export export export export expo
export const KeyvCachedWith = curryN(3, _) as CURRIED;
// prettier-ignore
type CURRIED = (
<A extends $[1], B extends $<A>[2], C extends $<A, B>[3]>(keyv: A, fn: B, ...args: C) => $<A, B, C>[0]) & (
<A extends $[1], B extends $<A>[2]>(keyv: A, fn: B) =>
<C extends $<A, B>[3]>(...args: C) => $<A, B, C>[0]) & (
<A extends $[1]>(keyv: A) => ((
<B extends $<A>[2], C extends $<A, B>[3]>(fn: B, ...args: C) => $<A, B, C>[0]) & (
<B extends $<A>[2]>(fn: B) =>
<C extends $<A, B>[3]>(...args: C) => $<A, B, C>[0])))
