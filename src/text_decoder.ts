import {
  normalizeEncoding,
  StringFromCharCode,
  toUint8Array,
  TypeError,
  Uint8Array,
  Uint8ArrayPrototypeSubarray,
  undefined,
} from "./_internal.ts";

/**
 * Options for the {@linkcode TextDecoder} constructor.
 */
export interface TextDecoderOptions {
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

/** Options for the {@linkcode TextDecoder.decode} method. */
export interface TextDecoderDecodeOptions {
  /**
   * If true, indicates that the data being decoded is part of a larger stream.
   * This allows the decoder to handle incomplete byte sequences appropriately.
   * @default {false}
   */
  stream?: boolean;
}

/**
 * Decodes an encoded sequence of bytes into a string, using the specified
 * encoding standard. Currently, only UTF-8 encoding is supported.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder
 * @category Encoding
 * @tags utf-8, decoder
 */
export class TextDecoder {
  readonly #encoding: string;
  readonly #fatal: boolean;
  readonly #ignoreBOM: boolean;

  #buffer = new Uint8Array(0);

  /**
   * Creates a new TextDecoder instance.
   * @param label The encoding to use. Currently, only "utf-8" is supported.
   * @param options Configuration options.
   */
  constructor(label = "utf-8", options: TextDecoderOptions = {}) {
    this.#encoding = normalizeEncoding(label);
    this.#fatal = !!options.fatal;
    this.#ignoreBOM = !!options.ignoreBOM;

    if (this.#encoding !== "utf-8") {
      throw new TypeError(`The encoding "${label}" is not supported.`);
    }
  }

  /** The encoding standard to use. */
  get encoding(): string {
    return this.#encoding;
  }

  /** If true, invalid bytes will throw a TypeError. */
  get fatal(): boolean {
    return this.#fatal;
  }

  /** If true, the BOM (Byte Order Mark) will be ignored. */
  get ignoreBOM(): boolean {
    return this.#ignoreBOM;
  }

  /**
   * Decodes a BufferSource into a string using UTF-8 decoding.
   *
   * @param input The bytes to decode. Defaults to an empty Uint8Array.
   * @param [options] Decoding options.
   * @returns The decoded string.
   * @throws if the input is not a BufferSource.
   * @throws if fatal is true and an invalid byte sequence is encountered.
   */
  decode(input?: BufferSource, options?: TextDecoderDecodeOptions): string {
    const stream = options?.stream ?? false;
    let bytes = toUint8Array(input);

    // Concatenate any leftover bytes from the previous decode call
    if (this.#buffer.length > 0) {
      const combined = new Uint8Array(this.#buffer.length + bytes.length);
      combined.set(this.#buffer, 0);
      combined.set(bytes, this.#buffer.length);
      bytes = combined;
      this.#buffer = new Uint8Array();
    }

    let string = "", i = 0;

    // Handle BOM
    if (
      !this.ignoreBOM &&
      bytes.length >= 3 &&
      bytes[0] === 0xef &&
      bytes[1] === 0xbb &&
      bytes[2] === 0xbf
    ) i += 3;

    while (i < bytes.length) {
      const startIndex = i;
      const byte1 = bytes[i++];

      if (byte1 <= 0x7f) {
        string += StringFromCharCode(byte1);
      } else if (byte1 >= 0xc0 && byte1 <= 0xdf) {
        // 2-byte sequence
        const byte2 = bytes[i++];
        if (byte2 === undefined) {
          // Incomplete sequence
          if (stream) {
            this.#buffer = Uint8ArrayPrototypeSubarray(bytes, startIndex);
            break;
          } else {
            if (this.fatal) throw new TypeError("Incomplete byte sequence");
            string += "\uFFFD";
            break;
          }
        }
        if ((byte2 & 0xc0) !== 0x80) {
          if (this.fatal) throw new TypeError("Invalid continuation byte");
          string += "\uFFFD";
          i = startIndex + 1;
          continue;
        }
        const codePoint = ((byte1 & 0x1f) << 6) | (byte2 & 0x3f);
        string += StringFromCharCode(codePoint);
      } else if (byte1 >= 0xe0 && byte1 <= 0xef) {
        // 3-byte sequence
        const byte2 = bytes[i++];
        if (byte2 === undefined) {
          // Incomplete sequence
          if (stream) {
            this.#buffer = Uint8ArrayPrototypeSubarray(bytes, startIndex);
            break;
          } else {
            if (this.fatal) throw new TypeError("Incomplete byte sequence");
            string += "\uFFFD";
            break;
          }
        }
        const byte3 = bytes[i++];
        if (byte3 === undefined) {
          // Incomplete sequence
          if (stream) {
            this.#buffer = Uint8ArrayPrototypeSubarray(bytes, startIndex);
            break;
          } else {
            if (this.fatal) throw new TypeError("Incomplete byte sequence");
            string += "\uFFFD";
            break;
          }
        }
        if ((byte2 & 0xc0) !== 0x80 || (byte3 & 0xc0) !== 0x80) {
          if (this.fatal) throw new TypeError("Invalid continuation bytes");
          string += "\uFFFD";
          i = startIndex + 1;
          continue;
        }
        const codePoint = ((byte1 & 0x0f) << 12) |
          ((byte2 & 0x3f) << 6) |
          (byte3 & 0x3f);
        string += StringFromCharCode(codePoint);
      } else if (byte1 >= 0xf0 && byte1 <= 0xf7) {
        // 4-byte sequence
        const byte2 = bytes[i++];
        if (byte2 === undefined) {
          // Incomplete sequence
          if (stream) {
            this.#buffer = Uint8ArrayPrototypeSubarray(bytes, startIndex);
            break;
          } else {
            if (this.fatal) throw new TypeError("Incomplete byte sequence");
            string += "\uFFFD";
            break;
          }
        }
        const byte3 = bytes[i++];
        if (byte3 === undefined) {
          // Incomplete sequence
          if (stream) {
            this.#buffer = Uint8ArrayPrototypeSubarray(bytes, startIndex);
            break;
          } else {
            if (this.fatal) throw new TypeError("Incomplete byte sequence");
            string += "\uFFFD";
            break;
          }
        }
        const byte4 = bytes[i++];
        if (byte4 === undefined) {
          // Incomplete sequence
          if (stream) {
            this.#buffer = Uint8ArrayPrototypeSubarray(bytes, startIndex);
            break;
          } else {
            if (this.fatal) throw new TypeError("Incomplete byte sequence");
            string += "\uFFFD";
            break;
          }
        }
        if (
          (byte2 & 0xc0) !== 0x80 ||
          (byte3 & 0xc0) !== 0x80 ||
          (byte4 & 0xc0) !== 0x80
        ) {
          if (this.fatal) throw new TypeError("Invalid continuation bytes");
          string += "\uFFFD";
          i = startIndex + 1;
          continue;
        }
        let codePoint = ((byte1 & 0x07) << 18) |
          ((byte2 & 0x3f) << 12) |
          ((byte3 & 0x3f) << 6) |
          (byte4 & 0x3f);
        codePoint -= 0x10000;
        string += StringFromCharCode(
          0xd800 + ((codePoint >> 10) & 0x3ff),
          0xdc00 + (codePoint & 0x3ff),
        );
      } else {
        if (this.fatal) throw new TypeError("Invalid byte");
        string += "\uFFFD";
      }
    }

    // If not streaming, reset the buffer
    if (!stream) this.#buffer = new Uint8Array();

    return string;
  }
}
