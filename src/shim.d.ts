// deno-lint-ignore-file no-var
/// <reference no-default-lib="true" />
/// <reference lib="es2015" />

/**
 * Global type definitions for the `TextDecoder` and `TextEncoder` classes,
 * to be used with the `@nick/utf8/shim` side-effecting (polyfill) module.
 *
 * @module shim.d.ts
 */

// #region TextDecoder
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
  decode(
    // can't use BufferSource because of the no-default-lib reference. if we
    // try defining it, we get a duplicate identifier error.
    input?: ArrayBufferLike | ArrayBufferView,
    options?: TextDecodeOptions,
  ): string;
}

/** @category Encoding */
declare var TextDecoder: {
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
// #endregion TextDecoder

// #region TextEncoder

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
interface TextEncoder {
  /** Returns "utf-8". */
  readonly encoding: string;

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
declare var TextEncoder: {
  /** The prototype shared by all instances of `TextEncoder`. */
  readonly prototype: TextEncoder;

  /** Creates a new instance of `TextEncoder`. */
  new (): TextEncoder;
};
// #endregion TextEncoder
