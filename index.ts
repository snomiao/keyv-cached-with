import Keyv from "keyv";
import md5 from "md5";
import { curry } from "rambda";
import type { Function } from "ts-toolbelt/out/Function/Function";
// util util util util util util util util util util util util util util util
type Awaitable<R> = Promise<R> | R;
type Repromise<T> = Promise<Awaited<T>>;
type KeyV<KV extends Keyv> = KV extends Keyv<infer R> ? Awaitable<R> : never;
// type type type type type type type type type type type type type type type
type $<
  KV extends Keyv = Keyv,
  FN extends Function<any[], KeyV<KV>> = Function<any, KeyV<KV>>,
  AR extends Parameters<FN> = Parameters<FN>,
  RE extends Repromise<ReturnType<FN> & KeyV<KV>> = Repromise<
    ReturnType<FN> & KeyV<KV>
  >
> = [RE, KV, FN, AR];
// impl impl impl impl impl impl impl impl impl impl impl impl impl impl impl
async function _<
  A extends $[1],
  B extends $<A>[2],
  C extends $<A, B>[3],
  Z extends $<A, B, C>[0]
>(keyv: A, fn: B, ...args: C): Promise<Z> {
  const key =
    md5(String(fn)).slice(0, 8) +
    md5(JSON.stringify(args.slice(0, fn.length))).slice(0, 8);
  const cache = await keyv.get(key);
  if (cache) return cache;
  const result = await fn(...args);
  await keyv.set(key, result);
  return result;
}
// export export export export export export export export export export expo
// prettier-ignore
export const KeyvCachedWith = curry(_) as
  (<A extends $[1], B extends $<A>[2], C extends $<A, B>[3]>
    (keyv: A, fn: B, ...args: C) =>                           $<A, B, C>[0]) &
  (<A extends $[1], B extends $<A>[2]>
    (keyv: A, fn: B) =>
      <C extends $<A, B>[3]>
        (...args: C) =>                                       $<A, B, C>[0]) &
  (<A extends $[1]>
    (keyv: A) => (
      (<B extends $<A>[2], C extends $<A, B>[3]>
        (fn: B, ...args: C) =>                                $<A, B, C>[0]) &
      (<B extends $<A>[2]>
        (fn: B) =>
          <C extends $<A, B>[3]>
            (...args: C) =>                                   $<A, B, C>[0])))
