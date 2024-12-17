/// <reference lib="deno.web" />
/// <reference types="./shim.d.ts" />

import type {} from "./shim.d.ts";

/**
 * This module provides a shim (polyfill) for the native `TextEncoder` and
 * `TextDecoder` APIs, as well as `TextEncoderStream` and `TextDecoderStream`.
 *
 * The ponyfills provided from this package are added to the global scope, but
 * only if the native APIs are not already available. This allows you to use
 * the native APIs when available, and fallback to the ponyfills if needed.
 *
 * #### Streaming APIs
 *
 * The streaming APIs are only polyfilled if the `TransformStream` API is
 * available in the current environment. Otherwise, they are not added.
 *
 * #### Type Augmentation
 *
 * In addition to polyfilling the runtime APIs, this module also augments the
 * global scope with the necessary types and interfaces to support the APIs.
 * The types are designed to avoid conflicts with the native APIs, should they
 * happen to already be available in the current environment.
 *
 * #### Usage
 *
 * To use the polyfills, simply import this module at the top of your script,
 * using a side-effect import type. This will add the ponyfills to the global
 * scope, and augment the necessary type definitions all at once, allowing you
 * to use them as if they were native APIs.
 *
 * @example
 * ```ts
 * // the shim module has no exports. we just import it for its side-effects:
 * import "@nick/utf8/shim";
 *
 * const encoder = new TextEncoder(), decoder = new TextDecoder();
 *
 * const buffer = encoder.encode("Hello, world!");
 * const text = decoder.decode(buffer);
 *
 * console.log(text); // Outputs: "Hello, world!"
 * ```
 * @module shim
 */
import { TextEncoder } from "./text_encoder.ts";
import { TextDecoder } from "./text_decoder.ts";
import { TextDecoderStream, TextEncoderStream } from "./streams.ts";

import { $global, gracefulDefine } from "./_internal.ts";

gracefulDefine($global, "TextEncoder", TextEncoder);
gracefulDefine($global, "TextDecoder", TextDecoder);

// only add the streams APIs if TransformStream is available.
if (typeof $global.TransformStream === "function") {
  gracefulDefine($global, "TextEncoderStream", TextEncoderStream);
  gracefulDefine($global, "TextDecoderStream", TextDecoderStream);
}
