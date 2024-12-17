<div align="center">

# [`@nick/utf8`]

##### Blazing fast [ponyfills] for `TextEncoder`, `TextDecoder`, and more.

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nberlette/utf8/ci.yml)
![GitHub package.json version](https://img.shields.io/npm/v/@nberlette/utf8)
![JSR Latest Version](https://jsr.io/badges/@nick/utf8)
![JSR Package Score](https://jsr.io/badges/@nick/utf8/score)

</div>

## Overview

This package provides dependency-free TypeScript implementations of the native
text encoding classes, designed as [ponyfills] for the following standard APIs.

| API                                       | Description                                | Notes                           |
| ----------------------------------------- | ------------------------------------------ | ------------------------------- |
| [`TextEncoder`](#textencoder)             | Encodes strings into UTF-8 byte sequences. | `--`                            |
| [`TextDecoder`](#textdecoder)             | Decodes UTF-8 byte sequences into strings. | Currently only supports UTF-8.  |
| [`TextEncoderStream`](#textencoderstream) | Full-duplex text-to-bytes encoding stream. | Requires `TransformStream` API. |
| [`TextDecoderStream`](#textdecoderstream) | Full-duplex bytes-to-text decoding stream. | Requires `TransformStream` API. |

[^1]: Requires the `TransformStream` API to be available in the environment.

---

## Install

<picture align="left" width="32" height="48">
  <source media="(prefers-color-scheme: dark)" srcset="https://api.iconify.design/simple-icons:deno.svg?height=2.75rem&width=3rem&color=%23fff" />
  <img align="left" src="https://api.iconify.design/simple-icons:deno.svg?height=2.75rem&width=3rem" alt="Deno" width="32" height="48" />
</picture>

```sh
deno add jsr:@nick/utf8
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

## `TextEncoder`

The `TextEncoder` class encodes strings into UTF-8 byte sequences.

### `constructor`

Creates a new `TextEncoder` instance.

#### Signature

```ts ignore
new TextEncoder();
```

<br /><div align="center">·<b>·</b>•<b>•</b>•<b>·</b>·</div>

<a id="textencoder.encode"></a>

### `encode` <sup><small>[📚 MDN][textencoderencode-mdn]</small></sup>

Encodes the given `input` into a new `Uint8Array`.

#### Signature

```ts ignore
encode(input: string): Uint8Array;
```

##### Parameters

- `input`: The string to encode.

##### Returns

A new `Uint8Array` containing the encoded bytes.

#### Example

```ts
import { TextEncoder } from "@nick/utf8";

const encoder = new TextEncoder();
const encoded = encoder.encode("Hello, World!");
console.log(encoded); // Uint8Array([...])
```

<br /><div align="center">·<b>·</b>•<b>•</b>•<b>·</b>·</div>

<a id="textencoder.encodeinto"></a>

### `encodeInto` <sup><small>[📚 MDN][textencoderencodeinto-mdn]</small></sup>

Encodes an `input` string into an existing `Uint8Array` output buffer.

#### Signature

```ts ignore
encodeInto(input: string, output: Uint8Array): TextEncoderEncodeIntoResult;
```

##### Parameters

- `input`: The string to encode.
- `output`: The output buffer to write the encoded bytes into.

##### Returns

A [`TextEncoderEncodeIntoResult`] object, containing the number of characters
read and number of bytes written.

> [!NOTE]
>
> Refer to the [MDN documentation][textencoderencodeinto-mdn] for more
> information.

[`TextEncoderEncodeIntoResult`]: ./#textencoderencodeintoresult--mdn

#### Example

```ts
import { TextEncoder } from "@nick/utf8";

const encoder = new TextEncoder();
const output = new Uint8Array(16);
const input = "Hello, my name is Nick!"; // 23 characters
const { read, written } = encoder.encodeInto(input, output);
```

---

## `TextDecoder`

The `TextDecoder` class decodes encoded byte sequences into strings.

### `constructor`

Creates a new `TextDecoder` instance with the given `encoding` and `options`.

#### Signature

```ts ignore
new TextDecoder(encoding?: string, options?: TextDecoderOptions)
```

- `encoding`: The encoding to use. Currently, only `"utf-8"` is supported.
- `options`: An optional [`TextDecoderOptions`](#textdecoderoptions) object.

<br /><div align="center">·<b>·</b>•<b>•</b>•<b>·</b>·</div>

### `decode` <sup><small>[📚 MDN][textdecoderdecode-mdn]</small></sup>

Decodes UTF-8 bytes from the given `BufferSource` into a string.

#### Signature

```ts ignore
decode(input?: BufferSource, options?: TextDecodeOptions): string;
```

##### Parameters

- `input`: The `BufferSource` containing the UTF-8 bytes to decode. If omitted,
  defaults to an empty `Uint8Array`.
- `options`: An optional [`TextDecodeOptions`](#textdecodeoptions) object.

##### Returns

The decoded bytes as a string.

<br /><div align="center">·<b>·</b>•<b>•</b>•<b>·</b>·</div>

#### Example

```ts
import { TextDecoder } from "@nick/utf8";

const decoder = new TextDecoder();
const encoded = new Uint8Array([72, 101, 108, 108, 111, 33]);
const decoded = decoder.decode(encoded);
console.log(decoded); // Hello!
```

---

## `TextDecoderStream`

Provides a full-duplex decoding stream, allowing UTF-8 bytes to be written to
its writable side, and the decoded strings to be read from its readable side.

### `constructor`

Creates a new `TextDecoderStream` instance with an optional `encoding` standard
and `options` to configure the underlying `TextDecoder` instance.

#### Signature

```ts ignore
new TextDecoderStream(encoding?: string, options?: TextDecoderOptions)
```

This class supports the same arguments as the `TextDecoder` API, which it uses
under the hood to perform the decoding. The `fatal` and `ignoreBOM` options,
just like in the `TextDecoder` class, go on to become read-only properties of
the same name on the new `TextDecoderStream` instance.

##### Parameters

- `encoding`: The encoding to use. Currently, only `"utf-8"` is supported.
- `options`: An optional [`TextDecoderOptions`](#textdecoderoptions) object.

<br /><div align="center">·<b>·</b>•<b>•</b>•<b>·</b>·</div>

### Properties

#### `encoding: string` <sup>[📚 MDN][textdecoderstreamencoding-mdn]</sup>

The encoding used by the underlying decoder. Represents the value passed to the
constructor as the `encoding` parameter.

#### `fatal: boolean` <sup>[📚 MDN][textdecoderstreamfatal-mdn]</sup>

Whether to throw an error if the input contains invalid bytes. Represents the
value passed to the constructor as the `fatal` option.

#### `ignoreBOM: boolean` <sup>[📚 MDN][textdecoderstreamignorebom-mdn]</sup>

Whether to ignore a leading BOM character in the input. Represents the value
passed to the constructor as the `ignoreBOM` option.

#### `readable: ReadableStream<string>` <sup>[📚 MDN][textdecoderstreamreadable-mdn]</sup>

The _output_ side of the duplex stream, from which decoded strings are read.

#### `writable: WritableStream<BufferSource>` <sup>[📚 MDN][textdecoderstreamwritable-mdn]</sup>

The _input_ side of the duplex, into which `BufferSource` objects are written.

Just like the [`TextDecoder`](#textdecoder) API, the `writable` stream supports
any type of `BufferSource` object (an `ArrayBuffer` or a view of one) as input.

<br>

> [!IMPORTANT]
>
> `TextDecoderStream` requires runtime support for [`TransformStream`].

---

## `TextEncoderStream`

Provides a full-duplex encoding stream, allowing strings to be written to its
writable side, and the encoded bytes to be read from its readable side.

### `constructor`

Creates a new `TextEncoderStream` instance with an optional `encoding` standard
and `options` to configure the underlying `TextEncoder` instance.

#### Signature

```ts ignore
new TextEncoderStream();
```

<br /><div align="center">·<b>·</b>•<b>•</b>•<b>·</b>·</div>

### Properties

#### `encoding: string` <sup>[📚 MDN][textencoderstreamencoding-mdn]</sup>

The encoding used by the underlying encoder. Represents the value passed to the
constructor as the `encoding` parameter.

#### `readable: ReadableStream<Uint8Array>` <sup>[📚 MDN][textencoderstreamreadable-mdn]</sup>

The _output_ side of the duplex stream, from which encoded chunks are read.

#### `writable: WritableStream<string>` <sup>[📚 MDN][textencoderstreamwritable-mdn]</sup>

The _input_ side of the duplex, into which strings are written.

<br>

> [!IMPORTANT]
>
> `TextEncoderStream` requires runtime support for [`TransformStream`].

---

---

## Interfaces and Types

### `TextDecodeOptions`

Options that can be passed to [`TextDecoder.decode`](./#textdecoder.decode).

#### Signature

```ts
interface TextDecodeOptions {
  stream?: boolean;
}
```

##### `stream`

Boolean flag that indicates the call to `decode` is part of a stream, which
affects the behavior of the decoder.

When set to `true`, incomplete byte sequences will be buffered internally and
their errors will be suppressed, allowing the stream to continue processing. The
next call to `decode` will resume decoding from the buffered bytes.

> [!TIP]
>
> It is important to flush any buffered bytes from the `TextDecoder` internal
> state once the stream is complete. This can be done by calling `decode` with
> no arguments, as shown in the example below.
>
> ```ts
> import { TextDecoder } from "@nick/utf8";
>
> const decoder = new TextDecoder();
> const stream = new Uint8Array([0xF0, 0x9F, 0x98, 0x8A]);
>
> let result = "";
> for (const chunk of stream) {
>   result += decoder.decode(chunk, { stream: true });
> }
>
> // Flush any remaining bytes from the internal state.
> result += decoder.decode();
> ```

<br /><div align="center">·<b>·</b>•<b>•</b>•<b>·</b>·</div>

### `TextDecoderOptions`

Options that can be passed to the [`TextDecoder`](#textdecoder) and
[`TextDecoderStream`](#textdecoderstream) class constructors to configure the
behavior of the decoder instance.

#### Signature

```ts
interface TextDecoderOptions {
  fatal?: boolean;
  ignoreBOM?: boolean;
}
```

##### `fatal`

Boolean flag that indicates whether to throw an error if the input contains
invalid bytes. The value passed to this option will be exposed as the `fatal`
property on the decoder instance (read-only).

**Default**: `false`

##### `ignoreBOM`

Instructs the `TextDecoder` to ignore a leading BOM character in the input. The
value passed to this option will be exposed as the `ignoreBOM` property on the
decoder instance (read-only).

**Default**: `false`

<br /><div align="center">·<b>·</b>•<b>•</b>•<b>·</b>·</div>

### `TextEncoderEncodeIntoResult` <sup><small>[📚 MDN][textencoderencodeinto-mdn]</small></sup>

The object returned by [`TextEncoder.encodeInto`](./#textencoder.encodeinto),
containing the number of characters read from the input string and the number of
bytes written to the output buffer.

#### Signature

```ts
interface TextEncoderEncodeIntoResult {
  read: number;
  written: number;
}
```

##### `read`

The number of characters read from the input string.

##### `written`

The number of bytes written to the output buffer.

---

## Polyfill (shim)

This package is **not a polyfill**, but rather a **_[ponyfill]_** that doesn't
overwrite the native implementation. It provides a drop-in replacement for the
native APIs, allowing you to use them in environments that don't support them.

That being said, some users and use cases may indeed require a side-effecting
polyfill that patches the native APIs. For those cases, you can import the
`./shim` module, which will gracefully patch the native APIs **as needed**.

If the APIs already exist on the global scope, no changes will be made. If the
`TransformStream` API is not available, the streaming APIs will not be patched.

```ts
import "@nick/utf8/shim";

// The native APIs are now patched if needed.
console.log(new TextEncoder().encode("Hello, World!"));
```

#### Type Definitions and Augmentation

[JSR], the primary distribution channel for this package, does not support type
augmentation on the global scope. As a result, this package cannot provide an
"all-in-one" polyfill experience from a single import of the `./shim` module.

If you need type definitions for the patched APIs, or if for some reason you're
only looking for type definitions alone, the `@nick/utf8/shim.d.ts` module has
ambient declarations for all of the APIs provided by this package.

```ts
import type {} from "@nick/utf8/shim.d.ts";
```

```ts
/// <reference types="@nick/utf8/shim.d.ts" />
```

> Deno users will need to include the `.d.ts` extension as seen above. Users of
> TypeScript in Node.js / Bun environments _might_ be able to omit that in their
> triple-slash references, but I'm not 100% certain in that regard.

---

## Compatibility

This package is compatible with all modern browsers, Deno, Node.js, Bun, and
Cloudflare Workers. The streaming APIs require support for the
[`TransformStream`] interface, which is available in all of the previously
mentioned environments.

> If you're running in an environment that doesn't support the `TransformStream`
> interface, you can find a full-featured polyfill for it in [core-js].

[core-js]: https://github.com/zloirock/core-js "A modular standard library for JavaScript."

---

## Performance

The implementations in this package are highly optimized for performance. They
are written in a way that minimizes the number of allocations and copies, and
they take advantage of the fastest available APIs in the environment.

Take a look at the benchmarks below for a performance sample comparing this
package side-by-side with the native APIs in Deno v2.1.2.

> While benchmarks are far from a definitive measure of performance, they're a
> good indicator of general performance characteristics. The results may vary
> depending on the environment, machine, workload, and other factors.

<details><summary><b><u>View Benchmarks</u>: <code>@nick/utf8</code></b> <small>vs.</small> <b>Deno v2.1.2</b></summary>

<br>

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

</details>

---

<div align="center">

##### [MIT] © [Nicholas Berlette]. All rights reserved.

###### [GitHub] · [JSR] · [NPM] · [Bugs]

</div>

[MIT]: https://nick.mit-license.org "MIT © Nicholas Berlette. All rights reserved."
[Nicholas Berlette]: https://github.com/nberlette "Nicholas Berlette's GitHub Profile"
[`@nick/utf8`]: https://jsr.io/@nick/utf8 "Blazing fast ponyfills for `TextEncoder`, `TextDecoder`, and more."
[ponyfills]: https://ponyfill.com "A polyfill that doesn't overwrite the native implementation."
[GitHub]: https://github.com/nberlette/utf8#readme "Give me a star on GitHub! :) 🌟"
[JSR]: https://jsr.io/@nick/utf8 "View on JSR - The JavaScript Registry"
[NPM]: https://www.npmjs.com/package/@nick/utf8 "View @nberlette/utf8 on NPM"
[Bugs]: https://github.com/nberlette/utf8/issues "Submit a bug report or feature request"

<!-- mdn links -->

[`TransformStream`]: https://developer.mozilla.org/en-US/docs/Web/API/TransformStream "View MDN reference for the TransformStream API."
[textdecoderstream-mdn]: https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream "View MDN reference for the TextDecoderStream API."
[textdecoderstreamencoding-mdn]: https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream/encoding "View MDN reference for the TextDecoderStream.encoding API."
[textdecoderstreamfatal-mdn]: https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream/fatal "View MDN reference for the TextDecoderStream.fatal API."
[textdecoderstreamignorebom-mdn]: https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream/ignoreBOM "View MDN reference for the TextDecoderStream.ignoreBOM API."
[textdecoderstreamreadable-mdn]: https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream/readable "View MDN reference for the TextDecoderStream.readable API."
[textdecoderstreamwritable-mdn]: https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream/writable "View MDN reference for the TextDecoderStream.writable API."
[textencoderstream-mdn]: https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream "View MDN reference for the TextEncoderStream API."
[textencoderstreamencoding-mdn]: https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream/encoding "View MDN reference for the TextEncoderStream.encoding API."
[textencoderstreamreadable-mdn]: https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream/readable "View MDN reference for the TextEncoderStream.readable API."
[textencoderstreamwritable-mdn]: https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream/writable "View MDN reference for the TextEncoderStream.writable API."
[textdecoderdecode-mdn]: https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/decode "View MDN reference for the TextDecoder.decode API."
[textencoderencodeinto-mdn]: https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/encodeInto "View MDN reference for the TextEncoder.encodeInto API."
[textencoderencode-mdn]: https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder/encode "View MDN reference for the TextEncoder.encode API."
