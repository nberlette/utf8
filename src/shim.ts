// deno-lint-ignore-file no-var

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

declare const root: typeof globalThis;
declare const self: typeof globalThis;
declare const global: typeof globalThis;
declare const window: typeof globalThis;

const globalObject: typeof globalThis = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof global !== "undefined") return global;
  if (typeof window !== "undefined") return window;
  if (typeof root !== "undefined") return root;
  if (typeof this !== "undefined") return this;
  try { return (0, eval)("this") } catch (_) { /* ignore */ }
  throw new Error("Unable to locate global object");
})();

if (typeof globalObject.TextEncoder !== "function") {
  globalObject.TextEncoder = TextEncoder;
}

if (typeof globalObject.TextDecoder !== "function") {
  globalObject.TextDecoder = TextDecoder;
}

// only add the streams APIs if the native TransformStream is available.
if (typeof globalObject.TransformStream === "function") {
  if (typeof globalObject.TextEncoderStream !== "function") {
    globalObject.TextEncoderStream = TextEncoderStream;
  }
  if (typeof globalObject.TextDecoderStream !== "function") {
    globalObject.TextDecoderStream = TextDecoderStream;
  }
}

declare global {
  /**
   * Options for the {@linkcode TextDecoder} constructor.
   *
   * @category Encoding
   */
  interface TextDecoderOptions {
    /**
     * If true, invalid bytes will throw a TypeError. Otherwise, they will be
     * replaced with the Unicode replacement character.
     * @default {false}
     */
    fatal?: boolean;

    /**
     * If true, the BOM (Byte Order Mark) will be ignored.
     * @default {false}
     */
    ignoreBOM?: boolean;
  }

  /**
   * Options for the {@linkcode TextDecoder.decode} method.
   *
   * @category Encoding
   */
  interface TextDecodeOptions {
    stream?: boolean;
  }

  /**
   * Represents a decoder for a specific text encoding, allowing you to convert
   * binary data into a string given the encoding.
   *
   * @example
   * ```ts
   * const decoder = new TextDecoder('utf-8');
   * const buffer = new Uint8Array([72, 101, 108, 108, 111]);
   * const decodedString = decoder.decode(buffer);
   * console.log(decodedString); // Outputs: "Hello"
   * ```
   *
   * @category Encoding
   */
  interface TextDecoder {
    /** Returns encoding's name, lowercased. */
    readonly encoding: string;

    /** Returns true if error mode is "fatal", otherwise false. */
    readonly fatal: boolean;

    /** Returns the value of ignore BOM. */
    readonly ignoreBOM: boolean;

    /**
     * Decodes a sequence of bytes into a string using the specified encoding.
     *
     * @param input The buffer of bytes to decode.
     * @param options Configuration options.
     * @returns The decoded string.
     */
    decode(input?: BufferSource, options?: TextDecodeOptions): string;
  }

  /** @category Encoding */
  var TextDecoder: {
    /** The prototype shared by all instances of `TextDecoder`. */
    readonly prototype: TextDecoder;
    /**
     * Creates a new instance of `TextDecoder`, which can be used to decode
     * binary data into a string for a specific encoding.
     *
     * @param label The encoding to use.
     * @param [options] Configuration options.
     */
    new (label?: string, options?: TextDecoderOptions): TextDecoder;
  };

  /**
   * Represents the result of encoding a string into a `Uint8Array` using the
   * {@linkcode TextEncoder.encodeInto} method, with the number of characters
   * read from the source and number of bytes written to the destination.
   *
   * @category Encoding
   */
  interface TextEncoderEncodeIntoResult {
    read: number;
    written: number;
  }

  /**
   * Allows you to convert a string into binary data (in the form of a
   * Uint8Array) given the encoding.
   *
   * @example
   * ```ts
   * const encoder = new TextEncoder();
   * const str = "Hello";
   * const encodedData = encoder.encode(str);
   * console.log(encodedData); // Uint8Array(5) [72, 101, 108, 108, 111]
   * ```
   * @example
   * ```ts
   * const encoder = new TextEncoder();
   * const str = "Hello World!";
   * const buf = new Uint8Array(5);
   * const { read, written } = encoder.encodeInto(str, buf);
   * console.log(read, written); // 5 5
   * console.log(buf); // Uint8Array(5) [72, 101, 108, 108, 111]
   * ```
   * @category Encoding
   */
  interface TextEncoder extends TextEncoderCommon {
    /**
     * Encode a string into a new `Uint8Array` using UTF-8 encoding.
     *
     * @param input The string to encode. Defaults to an empty string.
     * @returns A `Uint8Array` containing the UTF-8 encoded bytes.
     */
    encode(input?: string): Uint8Array;

    /**
     * Encode a string into an existing `Uint8Array`, returning an object with
     * the number of characters read and aaenumber of bytes written.
     *
     * @param input The string to encode.
     * @param output The `Uint8Array` to write the encoded bytes into.
     * @returns An object with the number of characters read and bytes written.
     */
    encodeInto(input: string, dest: Uint8Array): TextEncoderEncodeIntoResult;
  }

  /**
   * Creates a new instance of `TextEncoder`, which can be used to encode
   * strings into `Uint8Array` buffers using UTF-8 encoding.
   *
   * @category Encoding
   */
  var TextEncoder: {
    /** The prototype shared by all instances of `TextEncoder`. */
    readonly prototype: TextEncoder;

    /** Creates a new instance of `TextEncoder`. */
    new (): TextEncoder;
  };

  /** @category Encoding */
  interface TextDecoderStream {
    /** Returns encoding's name, lowercased. */
    readonly encoding: string;

    /** Returns true if error mode is "fatal", otherwise false. */
    readonly fatal: boolean;

    /** Returns the value of ignore BOM. */
    readonly ignoreBOM: boolean;

    /** Returns the readable stream side of the `TextDecoderStream`. */
    readonly readable: ReadableStream<string>;

    /** Returns the writable stream side of the `TextDecoderStream`. */
    readonly writable: WritableStream<BufferSource>;
  }

  /**
   * Creates a new instance of `TextDecoderStream`, which can be used to decode
   * binary data into a string in a streaming fashion for a specific encoding.
   *
   * @category Encoding
   */
  var TextDecoderStream: {
    /** The prototype shared by all instances of `TextDecoderStream`. */
    readonly prototype: TextDecoderStream;

    /**
     * Creates a new instance of `TextDecoderStream`.
     *
     * @param label The encoding to use.
     * @param options Configuration options.
     */
    new (label?: string, options?: TextDecoderOptions): TextDecoderStream;
  };

  /**
   * Encodes strings into UTF-8 bytes in a streaming fashion.
   *
   * @category Encoding
   */
  interface TextEncoderStream {
    /** Returns "utf-8". */
    readonly encoding: string;

    /** Returns the readable stream side of the `TextEncoderStream`. */
    readonly readable: ReadableStream<Uint8Array>;

    /** Returns the writable stream side of the `TextEncoderStream`. */
    readonly writable: WritableStream<string>;
  }

  /**
   * Creates a new instance of `TextEncoderStream`, which can be used to encode
   * strings into UTF-8 bytes in a streaming fashion.
   *
   * @category Encoding
   */
  var TextEncoderStream: {
    /** The prototype shared by all instances of `TextEncoderStream`. */
    readonly prototype: TextEncoderStream;

    /** Creates a new instance of `TextEncoderStream`. */
    new (): TextEncoderStream;
  };
}
