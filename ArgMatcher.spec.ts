// import { expectTypeOf } from "expect-type";
// const add = (n: number): number => n + 1;

// it("works", async () => {
//   function wrapper<F extends (n: number) => number>(fn: F) {
//     return fn(0);
//   }
//   let n: number = wrapper((n) => {
//     expectTypeOf(n).toBeNumber();
//     return n + 1;
//   });
// });
// it("works", async () => {
//   function wrapper<R, F extends (n: R) => R>(fn: F) {
//     return fn(R);
//   }
//   let n: number = wrapper((n) => {
//     expectTypeOf(n).toBeNumber();
//     return n + 1;
//   });
// });
