import Keyv from "keyv";
import md5 from "md5";
import { curryN } from "rambda";
// util util util util util util util util util util util util util util util
type Awaitable<R> = Promise<R> | R;
type Repromise<T> = Promise<Awaited<T>>;
type KeyvType<KV extends Keyv> = KV extends Keyv<infer R>
  ? Awaitable<R>
  : never;
type CacheFun<KEV extends Keyv<any>> = (
  arg: unknown,
  ...rest: any[]
) => KeyvType<KEV>;

type FunArgs<KEV extends Keyv<any>, FUN extends CacheFun<KEV>> = FUN extends (
  arg: infer A,
  ...args: infer P
) => any
  ? [A, ...P]
  : never;

type Ret<FUN extends CacheFun<KEV>, KEV extends Keyv<any>> = Repromise<
  ReturnType<FUN> & KeyvType<KEV>
>;

// type type type type type type type type type type type type type type type
// prettier-ignore
type $<
  KEV extends Keyv<any>
            = Keyv<any>,
  FUN extends CacheFun<KEV>
            = (arg: any, ...rest: any[])=> KeyvType<KEV>,
  ARG extends FunArgs<KEV, FUN>
            = FunArgs<KEV, FUN>,
  RET extends Ret<FUN, KEV>
            = Ret<FUN, KEV>,
> = [RET, KEV, FUN, ARG];
// impl impl impl impl impl impl impl impl impl impl impl impl impl impl impl
/**
 * @author snomiao<snomiao@gmail.com>
 * @param keyv = new Keyv<unknown>() object
 *
 * Note: please use `new Keyv<unknown>()` as the instance.
 * Otherwise KeyvCachedWith will not return correct type because of Keyv default typed as any.
 *
 * @param fn function to be cached.
 */
export const KeyvCachedWith: CurriedKeyvCachedWith = curryN(3, _KeyvCachedWith);
async function _KeyvCachedWith<
  A extends $[1],
  B extends $<A>[2],
  C extends $<A, B>[3],
  Z extends $<A, B, C>[0]
>(keyv: A, fn: B, ...args: C): Promise<Z> {
  const needleArgs = args.slice(0, fn.length);
  const argsKey = JSON.stringify(needleArgs);
  const fnKey = String(fn);
  const readableKey = (argsKey + fnKey).replace(/\W+/g, "").slice(0, 16);
  const hashKey = md5(String(fn)).slice(0, 8) + md5(argsKey).slice(0, 8);
  const key = readableKey + hashKey;
  const cache = await keyv.get(key);
  if (cache) return cache as Z;
  const result = await fn(args[0], ...args.slice(1));
  await keyv.set(key, result);
  return result as Z;
}
// prettier-ignore
type CurriedKeyvCachedWith = (
<A extends $[1], B extends $<A>[2], C extends $<A, B>[3]>(keyv: A, fn: B, ...args: C) => $<A, B, C>[0]) & (
<A extends $[1], B extends $<A>[2]>(keyv: A, fn: B) =>
<C extends $<A, B>[3]>(...args: C) => $<A, B, C>[0]) & (
<A extends $[1]>(keyv: A) => ((
<B extends $<A>[2], C extends $<A, B>[3]>(fn: B, ...args: C) => $<A, B, C>[0]) & (
<B extends $<A>[2]>(fn: B) =>
<C extends $<A, B>[3]>(...args: C) => $<A, B, C>[0])))

export { KeyvCachedWithKey } from "./KeyvCachedWithKey";
