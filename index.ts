import Keyv from "keyv";
import { F } from "ts-toolbelt";
import md5 from "md5";
import { curry, type AnyFunction, type ArgumentTypes } from "rambda";
const _KeyvCachedWith =
  <Fn extends AnyFunction, V extends Awaited<ReturnType<Fn>>>(
    keyv: Keyv<V>,
    fn: Fn
  ) =>
  async (...args: ArgumentTypes<Fn>): Promise<V> => {
    const key =
      md5(String(fn)).slice(0, 8) + md5(JSON.stringify(args)).slice(0, 8);
    const cache = (await keyv.get(key)) as V;
    if (cache) return cache;
    const result = (await fn(...args)) as V;
    await keyv.set(key, result);
    return result;
  };

export const KeyvCachedWith = curry(_KeyvCachedWith) as F.Curry<
  typeof _KeyvCachedWith
>;
