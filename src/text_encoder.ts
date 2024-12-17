/**
 * This module provides a high performance dependency-free ponyfill for the
 * native `TextEncoder` Web API, allowing you to encode strings into UTF-8
 * encoded `Uint8Array` buffers in any ES2015+ environment.
 *
 * @module text-encoder
 */
import {
  getCodePoint,
  Uint8Array,
  Uint8ArrayPrototypeSubarray,
  utf8BytesNeeded,
} from "./_internal.ts";

/**
 * Represents the result of encoding a string into a `Uint8Array` using the
 * {@linkcode TextEncoder.encodeInto} method, with the number of characters
 * read from the source and number of bytes written to the destination.
 */
export interface TextEncoderEncodeIntoResult {
  /** The number of characters read from the input string. */
  read: number;
  /** The number of bytes written to the output buffer. */
  written: number;
}

/**
 * Encode strings into binary data (in the form of a `Uint8Array`) using the
 * UTF-8 encoding standard. This is a high performance ponyfill for the native
 * `TextEncoder` class.
 *
 * @category Encoding
 * @tags utf-8, encoder
 */
export class TextEncoder {
  /**
   * The encoding standard to use. This is always `"utf-8"`.
   * @returns "utf-8"
   */
  get encoding(): string {
    return "utf-8";
  }

  /**
   * Encodes a string into a `Uint8Array` with UTF-8 encoding.
   *
   * @param input The string to encode. Defaults to an empty string.
   * @returns A `Uint8Array` containing the UTF-8 encoded bytes.
   */
  encode(input = ""): Uint8Array {
    // speculatively allocate 4 B per character and trim the result later
    const buffer = new Uint8Array(input.length * 4);
    const result = this.encodeInto(input, buffer);
    return Uint8ArrayPrototypeSubarray(buffer, 0, result.written);
  }

  /**
   * Encodes a string into a provided Uint8Array using UTF-8 encoding.
   *
   * @param input The string to encode.
   * @param output The Uint8Array to write the encoded bytes into.
   * @returns Object containing the number of characters read and bytes written
   */
  encodeInto(input: string, output: Uint8Array): TextEncoderEncodeIntoResult {
    let read = 0, written = 0;
    for (let i = 0; i < input.length; i++) {
      const codePoint = getCodePoint(input, i);

      if (codePoint > 0xffff) i++; // handle surrogate pairs
      const bytesNeeded = utf8BytesNeeded(codePoint);
      if (written + bytesNeeded > output.length) break;
      if (codePoint <= 0x7f) {
        output[written++] = codePoint;
      } else if (codePoint <= 0x7ff) {
        output[written++] = 0xc0 | (codePoint >> 6);
        output[written++] = 0x80 | (codePoint & 0x3f);
      } else if (codePoint <= 0xffff) {
        output[written++] = 0xe0 | (codePoint >> 12);
        output[written++] = 0x80 | ((codePoint >> 6) & 0x3f);
        output[written++] = 0x80 | (codePoint & 0x3f);
      } else {
        output[written++] = 0xf0 | (codePoint >> 18);
        output[written++] = 0x80 | ((codePoint >> 12) & 0x3f);
        output[written++] = 0x80 | ((codePoint >> 6) & 0x3f);
        output[written++] = 0x80 | (codePoint & 0x3f);
      }
      read++;
    }
    return { read, written };
  }
}
