import { TextDecoder as PonyfillTextDecoder } from "../src/text_decoder.ts";
import { describe, it } from "jsr:@std/testing@1/bdd";
import { expect } from "jsr:@std/expect@1";

describe("TextDecoder Ponyfill vs Native TextDecoder", () => {
  const nativeDecoder = new TextDecoder();
  const ponyfillDecoder = new PonyfillTextDecoder();

  describe("decode()", () => {
    it("should decode ASCII bytes correctly", () => {
      const input = new TextEncoder().encode("Hello, World!");
      const nativeResult = nativeDecoder.decode(input);
      const ponyfillResult = ponyfillDecoder.decode(input);
      expect(ponyfillResult).toBe(nativeResult);
    });

    it("should decode empty Uint8Array correctly", () => {
      const input = new Uint8Array([]);
      const nativeResult = nativeDecoder.decode(input);
      const ponyfillResult = ponyfillDecoder.decode(input);
      expect(ponyfillResult).toBe(nativeResult);
    });

    it("should decode Unicode bytes correctly", () => {
      const input = new TextEncoder().encode("こんにちは世界🌏");
      const nativeResult = nativeDecoder.decode(input);
      const ponyfillResult = ponyfillDecoder.decode(input);
      expect(ponyfillResult).toBe(nativeResult);
    });

    it("should handle surrogate pairs correctly", () => {
      const input = new TextEncoder().encode("𠜎 𠜱 𠝹 𠱓");
      const nativeResult = nativeDecoder.decode(input);
      const ponyfillResult = ponyfillDecoder.decode(input);
      expect(ponyfillResult).toBe(nativeResult);
    });

    it("should handle invalid byte sequences with fatal=false", () => {
      const invalidBytes = new Uint8Array([0xff, 0xfe, 0xfd]);
      const nativeResult = nativeDecoder.decode(invalidBytes);
      const ponyfillResult = ponyfillDecoder.decode(invalidBytes);
      expect(ponyfillResult).toBe(nativeResult);
      expect(ponyfillResult).toBe("\uFFFD\uFFFD\uFFFD");
    });

    it("should throw on invalid byte sequences with fatal=true", () => {
      const invalidBytes = new Uint8Array([0xff, 0xfe, 0xfd]);
      const nativeDecoderFatal = new TextDecoder("utf-8", { fatal: true });
      const ponyfillDecoderFatal = new PonyfillTextDecoder("utf-8", {
        fatal: true,
      });

      expect(() => nativeDecoderFatal.decode(invalidBytes)).toThrow();
      expect(() => ponyfillDecoderFatal.decode(invalidBytes)).toThrow();
    });

    it("should handle BOM correctly when ignoreBOM=false", () => {
      const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
      const input = new Uint8Array([
        ...bom,
        ...new TextEncoder().encode("Hello"),
      ]);
      const nativeResult = nativeDecoder.decode(input);
      const ponyfillResult = ponyfillDecoder.decode(input);
      expect(ponyfillResult).toBe(nativeResult);
      expect(ponyfillResult).toBe("Hello");
    });

    it("should include BOM when ignoreBOM=true", () => {
      const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
      const input = new Uint8Array([
        ...bom,
        ...new TextEncoder().encode("Hello"),
      ]);
      const nativeDecoderIgnoreBOM = new TextDecoder("utf-8", {
        ignoreBOM: true,
      });
      const ponyfillDecoderIgnoreBOM = new PonyfillTextDecoder("utf-8", {
        ignoreBOM: true,
      });

      const nativeResult = nativeDecoderIgnoreBOM.decode(input);
      const ponyfillResult = ponyfillDecoderIgnoreBOM.decode(input);
      expect(ponyfillResult).toBe(nativeResult);
      expect(ponyfillResult).toBe("\uFEFFHello");
    });

    it("should decode ArrayBuffer correctly", () => {
      const encoder = new TextEncoder();
      const input = encoder.encode("ArrayBuffer Test");
      const buffer = input.buffer.slice(
        input.byteOffset,
        input.byteOffset + input.byteLength,
      );

      const nativeResult = nativeDecoder.decode(buffer);
      const ponyfillResult = ponyfillDecoder.decode(buffer);
      expect(ponyfillResult).toBe(nativeResult);
    });

    it("should decode SharedArrayBuffer correctly", () => {
      if (typeof SharedArrayBuffer === "undefined") {
        // Skip test if SharedArrayBuffer is not supported
        return;
      }
      const encoder = new TextEncoder();
      const input = encoder.encode("SharedArrayBuffer Test");
      const sharedBuffer = new SharedArrayBuffer(input.length);
      const view = new Uint8Array(sharedBuffer);
      view.set(input);

      const nativeResult = nativeDecoder.decode(sharedBuffer);
      const ponyfillResult = ponyfillDecoder.decode(sharedBuffer);
      expect(ponyfillResult).toBe(nativeResult);
    });

    it("should handle streaming decode with incomplete sequences", () => {
      const encoder = new TextEncoder();
      const input = encoder.encode("Hello 🌍");
      const ponyfillDecoderLocal = new PonyfillTextDecoder("utf-8");

      const firstPart = input.slice(0, input.length - 2); // Remove last two bytes
      const secondPart = input.slice(input.length - 2);

      const firstDecode = ponyfillDecoderLocal.decode(firstPart, {
        stream: true,
      });
      const secondDecode = ponyfillDecoderLocal.decode(secondPart, {
        stream: false,
      });

      const nativeDecoderStream = new TextDecoder("utf-8");
      const nativeFirstDecode = nativeDecoderStream.decode(firstPart, {
        stream: true,
      });
      const nativeSecondDecode = nativeDecoderStream.decode(secondPart, {
        stream: false,
      });

      expect(firstDecode).toBe(nativeFirstDecode);
      expect(secondDecode).toBe(nativeSecondDecode);
    });

    it("should handle multiple decode calls with streaming", () => {
      const encoder = new TextEncoder();
      const input = encoder.encode(
        "Hello 🌍, this is a test of streaming decode.",
      );
      const ponyfillDecoderLocal = new PonyfillTextDecoder("utf-8");

      const chunkSize = 10;
      let result = "";
      for (let i = 0; i < input.length; i += chunkSize) {
        const chunk = input.slice(i, i + chunkSize);
        const isLastChunk = i + chunkSize >= input.length;
        result += ponyfillDecoderLocal.decode(chunk, { stream: !isLastChunk });
      }

      const nativeDecoderStream = new TextDecoder("utf-8");
      let nativeResult = "";
      for (let i = 0; i < input.length; i += chunkSize) {
        const chunk = input.slice(i, i + chunkSize);
        const isLastChunk = i + chunkSize >= input.length;
        nativeResult += nativeDecoderStream.decode(chunk, {
          stream: !isLastChunk,
        });
      }

      expect(result).toBe(nativeResult);
    });

    it("should reset buffer when not streaming", () => {
      const encoder = new TextEncoder();
      const input = encoder.encode("Hello");
      const ponyfillDecoderLocal = new PonyfillTextDecoder("utf-8");

      const firstDecode = ponyfillDecoderLocal.decode(input, { stream: true });
      const secondDecode = ponyfillDecoderLocal.decode(input, {
        stream: false,
      });

      const nativeDecoderStream = new TextDecoder("utf-8");
      const nativeFirstDecode = nativeDecoderStream.decode(input, {
        stream: true,
      });
      const nativeSecondDecode = nativeDecoderStream.decode(input, {
        stream: false,
      });

      expect(firstDecode).toBe(nativeFirstDecode);
      expect(secondDecode).toBe(nativeSecondDecode);
    });

    it("should throw TypeError for non-BufferSource inputs", () => {
      // @ts-expect-error Testing invalid input
      expect(() => ponyfillDecoder.decode("invalid")).toThrow(TypeError);
    });
  });
});
