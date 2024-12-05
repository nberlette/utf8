/**
 * # `@nick/utf8`
 *
 * This package provides blazing-fast, zero-dependency ponyfills for the native
 * `TextEncoder` and `TextDecoder` APIs, as well as the streaming counterparts,
 * `TextEncoderStream` and `TextDecoderStream`.
 *
 * The ponyfills are based on the WHATWG Encoding standard, and are designed to
 * work in any ES2015+ environment, including Deno, Node, Bun, and the browser.
 *
 * @example
 * ```ts
 * import { TextEncoder, TextDecoder } from "@nick/utf8";
 *
 * const encoder = new TextEncoder();
 * const decoder = new TextDecoder();
 *
 * const buffer = encoder.encode("Hello, world!");
 * const text = decoder.decode(buffer);
 *
 * console.log(text); // Outputs: "Hello, world!"
 * ```
 * @module utf8
 */
export * from "./src/text_encoder.ts";
export * from "./src/text_decoder.ts";
export * from "./src/text_encoder_stream.ts";
export * from "./src/text_decoder_stream.ts";
