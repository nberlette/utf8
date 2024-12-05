/**
 * This module provides a streaming encoder for UTF-8 text, which is based on
 * the `TextEncoder` API.
 *
 * This is a zero-dependency ponyfill for the native `TextEncoderStream` Web
 * API, which can be used in any ES2015+ environment with support for the
 * `TransformStream` API.
 *
 * **Note**: This was directly adapted from the Deno `TextEncoderStream`
 * implementation (MIT License), which is based on the WHATWG Streams standard.
 *
 * @module text-encoder-stream
 */
import { TransformStream } from "./_internal.ts";
import { TextEncoder } from "./text_encoder.ts";

/**
 * Zero-dependency ponyfill for the native `TextEncoderStream` Web API.
 *
 * Uses the {@linkcode TextEncoder} ponyfill to encode strings into UTF-8
 * bytes in a streaming fashion. Requires the `TransformStream` API to be
 * available in the current environment.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream
 * @category Streams
 * @tags utf-8, encoder
 */
export class TextEncoderStream {
  #encoder: TextEncoder;
  #transform: TransformStream<string, Uint8Array>;

  constructor() {
    this.#encoder = new TextEncoder();
    this.#transform = new TransformStream({
      transform: (chunk, controller) => {
        const encoded = this.#encoder.encode(chunk);
        controller.enqueue(encoded);
      },
    });
  }

  /** The encoding standard to use. This is always `"utf-8"`. */
  get encoding(): string {
    return "utf-8";
  }

  /**
   * @returns the readable stream side of the `TextEncoderStream`, which can be
   * used to read the encoded bytes as they are produced by the encoder.
   */
  get readable(): ReadableStream<Uint8Array> {
    return this.#transform.readable;
  }

  /**
   * @returns the writable stream side of the `TextEncoderStream`, which can be
   * used to write strings to be encoded by the underlying `TextEncoder`.
   */
  get writable(): WritableStream<string> {
    return this.#transform.writable;
  }
}
