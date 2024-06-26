// type type type type type type type type type type type type type type type

import type Keyv from "keyv";
import { curryN } from "rambda";

// prettier-ignore
type $<
KEV extends Keyv
          = Keyv,
KEY extends string
          = string,
FET extends (key: KEY) => Promise<KEV extends Keyv<infer RET> ? RET : unknown>
          = (key: KEY) => Promise<KEV extends Keyv<infer RET> ? RET : unknown>,
RET extends Promise<Awaited<ReturnType<FET>>>
          = Promise<Awaited<ReturnType<FET>>>,
> = [RET,KEV,KEY,FET]
// impl impl impl impl impl impl impl impl impl impl impl impl impl impl impl

export const KeyvCachedWithKey: Curried = curryN(3, _KeyvCachedWithKey);
async function _KeyvCachedWithKey<
  A extends $[1],
  B extends $<A>[2],
  C extends $<A, B>[3],
  Z extends $<A, B, C>[0],
>(keyv: A, key: B, fetcher: C): Promise<Z> {
  const cache = await keyv.get(key);
  if (cache) return cache as Z;
  const result = await fetcher(key);
  await keyv.set(key, result);
  return result as Z;
}
// prettier-ignore
type Curried = (
<A extends $[1], B extends $<A>[2], C extends $<A, B>[3]>(keyv: A, key:B, fetcher: C) => $<A, B, C>[0]) & (
<A extends $[1], B extends $<A>[2]>(keyv: A, key: B) =>
<C extends $<A, B>[3]>(fetcher: C) => $<A, B, C>[0]) & (
<A extends $[1]>(keyv: A) => ((
<B extends $<A>[2], C extends $<A, B>[3]>(key: B, fetcher: C) => $<A, B, C>[0]) & (
<B extends $<A>[2]>(key: B) =>
<C extends $<A, B>[3]>(fetcher: C) => $<A, B, C>[0]))) // prettier-ignore
