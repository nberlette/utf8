<div align="center">

# [`@nick/utf8`]

##### Blazing fast ponyfills for `TextEncoder`, `TextDecoder`, and more.

</div>

---

## Overview

This package provides a set of high performance [ponyfill]s for `TextEncoder`
and `TextDecoder`. They're dependency-free and platform-agnostic, suitable for
use in any ES2015+ environment.

- [`TextEncoder`](#textencoder)
- [`TextDecoder`](#textdecoder)
- [`TextEncoderStream`](#textencoderstream)[^1]
- [`TextDecoderStream`](#textdecoderstream)[^1]

[^1]: Requires the `TransformStream` API to be available in the environment.

---

## Install

<picture align="left" width="32" height="48">
  <source media="(prefers-color-scheme: dark)" srcset="https://api.iconify.design/simple-icons:deno.svg?height=2.75rem&width=3rem&color=%23fff" />
  <img align="left" src="https://api.iconify.design/simple-icons:deno.svg?height=2.75rem&width=3rem" alt="Deno" width="32" height="48" />
</picture>

```sh
deno add @nick/utf8
```

<img align="left" src="https://api.iconify.design/simple-icons:jsr.svg?color=%23fc0" alt="JSR" width="32" height="48" />

```sh
npx jsr add @nick/utf8
```

<img align="left" src="https://api.iconify.design/logos:bun.svg" alt="Bun" width="32" height="48" />

```sh
bunx jsr add @nick/utf8
```

<img align="left" src="https://api.iconify.design/devicon:pnpm.svg?height=2.5rem&width=2.5rem&inline=true" alt="PNPM" width="32" height="48" />

```sh
pnpm dlx jsr add @nick/utf8
```

<img align="left" src="https://api.iconify.design/logos:yarn.svg?height=2rem&width=2rem&inline=true" alt="Yarn" width="32" height="48" />

```sh
yarn add @nick/utf8
```

<br>

**Mirrored on NPM as `@nberlette/utf8`**:

<img align="left" src="https://api.iconify.design/logos:npm.svg?height=2rem&width=2rem&inline=true" alt="NPM" width="32" height="48" />

```sh
npm install @nberlette/utf8
```

---

## Usage

```ts
import { TextDecoder, TextEncoder } from "@nick/utf8";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const encoded = encoder.encode("Hello, World!");
const decoded = decoder.decode(encoded);

console.log(decoded); // Hello, World!
```

---

## API

### `TextEncoder`

The `TextEncoder` class encodes strings into UTF-8 byte sequences.

#### `encode(input?: string)`

Encodes the given `input` into a new `Uint8Array`.

**Returns**: a new `Uint8Array` containing the encoded bytes.

```ts
import { TextEncoder } from "@nick/utf8";

const encoder = new TextEncoder();
const encoded = encoder.encode("Hello, World!");
console.log(encoded); // Uint8Array([...])
```

#### `encodeInto(input: string, output: Uint8Array)`

Encodes an `input` string into an existing `Uint8Array` output buffer.

**Returns**: the number of characters read and bytes written.

```ts
import { TextEncoder } from "@nick/utf8";

const encoder = new TextEncoder();
const output = new Uint8Array(16);
const input = "Hello, my name is Nick!"; // 23 characters
const { read, written } = encoder.encodeInto(input, output);
```

<br /><div align="center">·<b>·</b>•<b>•</b>•<b>·</b>·</div>

### `TextDecoder`

The `TextDecoder` class decodes UTF-8 byte sequences into strings.

#### `decode(input?: BufferSource, options?: TextDecodeOptions)`

Decodes UTF-8 bytes from the given `BufferSource` into a string.

```ts
import { TextDecoder } from "@nick/utf8";

const decoder = new TextDecoder();
const encoded = new Uint8Array([72, 101, 108, 108, 111, 33]);
const decoded = decoder.decode(encoded);
console.log(decoded); // Hello!
```

<br /><div align="center">·<b>·</b>•<b>•</b>•<b>·</b>·</div>

### `TextEncoderStream`

Provides a full-duplex UTF-8 encoding stream, allowing strings to be written to
its writable side, and the encoded bytes to be read from its readable side.

> **Note**: Requires `TransformStream` to be available in the environment.

#### Usage

```ts ignore
import { TextEncoderStream } from "@nick/utf8";

const chunks = ["Hello", ", ", "World!", "\n"];

// encode the strings and write them to stdout
await ReadableStream
  .from(chunks)
  .pipeThrough(new TextEncoderStream())
  .pipeTo(Deno.stdout.writable, { preventClose: true });
```

#### Properties

##### `encoding: string`

The encoding used. Always `"utf-8"`.

##### `readable: ReadableStream<Uint8Array>`

Returns a readable stream of encoded UTF-8 bytes.

##### `writable: WritableStream<string>`

Returns a writable stream, to which strings can be written for encoding.

<br /><div align="center">·<b>·</b>•<b>•</b>•<b>·</b>·</div>

### `TextDecoderStream`

Provides a full-duplex UTF-8 decoding stream, allowing UTF-8 bytes to be written
to its writable side, and the decoded strings to be read from its readable side.

Just like the [`TextDecoder`](#textdecoder) API, this class supports any type of
`BufferSource` containing UTF-8 bytes, such as `Uint8Array`, `DataView`,
`ArrayBuffer`, and more. It also supports the same `fatal` and `ignoreBOM`
decoding options, which can be passed to the constructor.

> **Note**: Requires `TransformStream` to be available in the environment.

#### Usage

```ts
import { TextDecoderStream } from "@nick/utf8";

const decoderStream = new TextDecoderStream();

const writer = decoderStream.writable.getWriter();
writer.write(new Uint8Array([72, 101, 108, 108, 111]));
writer.close();

const reader = decoderStream.readable.getReader();
reader.read().then(({ value, done }) => {
  console.log(value); // Hello
});
```

#### Properties

##### `encoding: string`

The encoding used by the underlying decoder.

##### `readable: ReadableStream<string>`

The readable stream of decoded strings.

##### `writable: WritableStream<BufferSource>`

The writable stream to which UTF-8 bytes can be written for decoding.

---

## Performance

The implementations in this package are highly optimized for performance. They
are written in a way that minimizes the number of allocations and copies, and
they take advantage of the fastest available APIs in the environment.

Take a look at the benchmarks below to see how this package compares to the
native APIs in Deno:

```scala
> deno bench -A --no-check

    CPU | Apple M1 Pro
Runtime | Deno 2.1.2+7c03677 (x86_64-apple-darwin)


benchmark                    time/iter (avg)        iter/s      (min … max)           p75      p99     p995
---------------------------- ----------------------------- --------------------- --------------------------

Native TextDecoder                    1.8 µs       543,200 (  1.4 µs …  13.7 ms)   1.6 µs   2.9 µs   3.6 µs
Ponyfill TextDecoder                769.0 ns     1,300,000 (583.0 ns …   1.5 ms) 708.0 ns   1.4 µs   1.8 µs

summary
  Ponyfill TextDecoder
     2.39x faster than Native TextDecoder



Native TextDecoderStream             24.6 µs        40,730 ( 13.3 µs …   5.6 ms)  18.9 µs 219.8 µs 574.2 µs
Ponyfill TextDecoderStream            5.4 µs       185,700 (  4.5 µs …   1.5 ms)   5.1 µs   7.4 µs   9.2 µs

summary
  Ponyfill TextDecoderStream
     4.56x faster than Native TextDecoderStream



Native TextEncoder                    1.1 µs       926,900 (630.1 ns …   1.6 µs)   1.3 µs   1.6 µs   1.6 µs
Ponyfill TextEncoder                  1.1 µs       870,300 (708.0 ns …   6.9 ms)   1.0 µs   3.6 µs   6.1 µs

summary
  Ponyfill TextEncoder
     1.06x slower than Native TextEncoder



Native TextEncoderStream              8.0 µs       124,500 (  4.9 µs …   3.6 ms)   6.0 µs  19.9 µs  44.6 µs
Ponyfill TextEncoderStream            5.8 µs       171,100 (  4.7 µs …   1.1 ms)   5.4 µs   9.2 µs  14.9 µs

summary
  Ponyfill TextEncoderStream
     1.37x faster than Native TextEncoderStream
```

---

<div align="center">

##### [MIT] © [Nicholas Berlette]. All rights reserved.

###### [GitHub] · [JSR] · [NPM] · [Bugs]

</div>

[MIT]: https://nick.mit-license.org "MIT © Nicholas Berlette. All rights reserved."
[Nicholas Berlette]: https://github.com/nberlette "Nicholas Berlette's GitHub Profile"
[`@nick/utf8`]: https://jsr.io/@nick/utf8 "Blazing fast ponyfills for `TextEncoder`, `TextDecoder`, and more."
[ponyfill]: https://ponyfill.com "A polyfill that doesn't overwrite the native implementation."
[GitHub]: https://github.com/nberlette/utf8#readme "Give me a star on GitHub! :) 🌟"
[JSR]: https://jsr.io/@nick/utf8 "View on JSR - The JavaScript Registry"
[NPM]: https://www.npmjs.com/package/@nick/utf8 "View @nberlette/utf8 on NPM"
[Bugs]: https://github.com/nberlette/utf8/issues "Submit a bug report or feature request"
