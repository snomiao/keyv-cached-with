import Keyv from "keyv";
import md5 from "md5";
import { curry } from "rambda";

export function KeyvCachedWith<V, Fn extends (...args: any) => V>(
  keyv: Keyv<V>,
  fn: Fn
): (...args: Parameters<Fn>) => Promise<Awaited<ReturnType<Fn>>>;
export function KeyvCachedWith<V>(
  keyv: Keyv<V>
): <Fn extends (...args: any) => V>(
  fn: Fn
) => (...args: Parameters<Fn>) => Promise<Awaited<ReturnType<Fn>>>;
export function KeyvCachedWith<
  Fn extends (...args: any) => any,
  V extends ReturnType<Fn> = ReturnType<Fn>
>(keyv: Keyv<V>, fn?: Fn) {
  if (!fn) return curry(KeyvCachedWith)(keyv);
  return async (...args: Parameters<Fn>) => {
    const key =
      md5(String(fn)).slice(0, 8) +
      md5(JSON.stringify(args.slice(0, fn.length))).slice(0, 8);
    const cache = (await keyv.get(key)) as V;
    if (cache) return cache;
    const result = (await fn(...args)) as V;
    await keyv.set(key, result);
    return result;
  };
}
