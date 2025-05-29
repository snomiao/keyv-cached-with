# keyv-cached-with

A higher-order function (HOF) for caching function results using [Keyv](https://github.com/jaredwray/keyv).

[![npm version](https://badge.fury.io/js/keyv-cached-with.svg)](https://badge.fury.io/js/keyv-cached-with)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install keyv-cached-with keyv
# or
yarn add keyv-cached-with keyv
# or
bun add keyv-cached-with keyv
```

## Features

- Cache function results with Keyv
- Support for curried and direct function calls
- Type-safe with TypeScript
- Minimal dependencies

## Usage

### Basic Usage

```ts
import Keyv from "keyv";
import { KeyvCachedWith } from "keyv-cached-with";

// Create a Keyv instance
const keyv = new Keyv();

// Create a cached function
const expensiveFunction = KeyvCachedWith(keyv, async (a: number) => {
  // Expensive operation here
  return `Result for ${a}`;
});

// First call will execute the function
await expensiveFunction(1); // "Result for 1"

// Second call with same argument will use cached result
await expensiveFunction(1); // "Result for 1" (from cache)
```

### Curried Usage

```ts
import Keyv from "keyv";
import { KeyvCachedWith } from "keyv-cached-with";

// Create a caching function with a specific Keyv instance
const CachedWith = KeyvCachedWith(new Keyv());

// Create multiple cached functions using the same Keyv instance
const cachedFunction1 = CachedWith(async (param: string) => {
  // Function implementation
  return `Result for ${param}`;
});

const cachedFunction2 = CachedWith(async (a: number, b: number) => {
  // Another function implementation
  return a + b;
});
```

## API

### KeyvCachedWith

```ts
KeyvCachedWith(keyv: Keyv, fn: Function): CachedFunction
// or curried form
KeyvCachedWith(keyv: Keyv)(fn: Function): CachedFunction
```

### Additional Exports

- `KeyvCachedQuery` - For caching database or API queries
- `KeyvCachedWithKey` - For custom cache key generation

## License

MIT © [snomiao](https://github.com/snomiao)
