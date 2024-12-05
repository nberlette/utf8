/**
 * This module provides a streaming text decoder implementation, as a ponyfill
 * for the native `TextDecoderStream` Web API.
 *
 * Under the hood, it uses the `TextDecoder` ponyfill from this package to
 * decode UTF-8 bytes into strings, and the native `TransformStream` API to
 * handle the streaming process. It requires the `TransformStream` API to be
 * available in the current environment.
 *
 * **Note**: This was directly adapted from the Deno `TextDecoderStream`
 * implementation (MIT License), which is based on the WHATWG Streams standard.
 *
 * @module text-decoder-stream
 */
import { PromiseReject, PromiseResolve, TransformStream } from "./_internal.ts";
import { TextDecoder, type TextDecoderOptions } from "./text_decoder.ts";

/**
 * Zero-dependency ponyfill for the native `TextDecoderStream` Web API.
 *
 * Uses the {@linkcode TextDecoder} ponyfill to decode UTF-8 bytes into strings
 * in a streaming fashion. Requires the `TransformStream` API to be available
 * in the current environment.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream
 * @category Streams
 * @tags utf-8, decoder
 */
export class TextDecoderStream {
  #decoder: TextDecoder;
  #transform: TransformStream<BufferSource, string>;

  constructor(
    label = "utf-8",
    options: TextDecoderOptions = { __proto__: null } as TextDecoderOptions,
  ) {
    this.#decoder = new TextDecoder(label, options);
    this.#transform = new TransformStream({
      transform: (chunk, controller) => {
        try {
          const decoded = this.#decoder.decode(chunk, { stream: true });
          if (decoded) controller.enqueue(decoded);
          return PromiseResolve();
        } catch (e) {
          return PromiseReject(e);
        }
      },
      flush: (controller) => {
        try {
          const flushed = this.#decoder.decode();
          if (flushed) controller.enqueue(flushed);
          return PromiseResolve();
        } catch (e) {
          return PromiseReject(e);
        }
      },
      cancel: () => {
        try {
          this.#decoder.decode();
          return PromiseResolve();
        } catch (e) {
          return PromiseReject(e);
        }
      },
    });
  }

  /**
   * @returns the encoding standard being used by the underlying `TextDecoder`.
   */
  get encoding(): string {
    return this.#decoder.encoding;
  }

  /**
   * If true, invalid bytes will throw a TypeError. This reflects the value of
   * the `fatal` option passed to the `TextDecoderStream` constructor.
   */
  get fatal(): boolean {
    return this.#decoder.fatal;
  }

  /**
   * If true, the BOM (Byte Order Mark) will be ignored. This reflects the
   * value of the `ignoreBOM` option passed to the `TextDecoderStream`
   * constructor.
   */
  get ignoreBOM(): boolean {
    return this.#decoder.ignoreBOM;
  }

  /**
   * @returns the readable stream side of the `TextDecoderStream`, which can be
   * used to read the decoded strings as they are produced by the decoder.
   */
  get readable(): ReadableStream<string> {
    return this.#transform.readable;
  }

  /**
   * @returns the writable stream side of the `TextDecoderStream`, which can be
   * used to write UTF-8 bytes to be decoded by the underlying `TextDecoder`.
   */
  get writable(): WritableStream<BufferSource> {
    return this.#transform.writable;
  }
}
