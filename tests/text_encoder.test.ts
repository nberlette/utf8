// text-encoding.ponyfill.test.ts

import { TextEncoder as PonyfillTextEncoder } from "../src/text_encoder.ts";
import { describe, it } from "jsr:@std/testing@1/bdd";
import { expect } from "jsr:@std/expect@1";

describe("TextEncoder Ponyfill vs Native TextEncoder", () => {
  const nativeEncoder = new TextEncoder();
  const ponyfillEncoder = new PonyfillTextEncoder();

  describe("encode()", () => {
    it("should encode ASCII strings correctly", () => {
      const input = "Hello, World!";
      const nativeResult = nativeEncoder.encode(input);
      const ponyfillResult = ponyfillEncoder.encode(input);
      expect(ponyfillResult).toEqual(nativeResult);
    });

    it("should encode empty string correctly", () => {
      const input = "";
      const nativeResult = nativeEncoder.encode(input);
      const ponyfillResult = ponyfillEncoder.encode(input);
      expect(ponyfillResult).toEqual(nativeResult);
    });

    it("should encode Unicode characters correctly", () => {
      const input = "こんにちは世界🌏";
      const nativeResult = nativeEncoder.encode(input);
      const ponyfillResult = ponyfillEncoder.encode(input);
      expect(ponyfillResult).toEqual(nativeResult);
    });

    it("should handle surrogate pairs correctly", () => {
      const input = "𠜎 𠜱 𠝹 𠱓";
      const nativeResult = nativeEncoder.encode(input);
      const ponyfillResult = ponyfillEncoder.encode(input);
      expect(ponyfillResult).toEqual(nativeResult);
    });

    it("should handle large strings efficiently", () => {
      const input = "A".repeat(1000000); // 1 million characters
      const nativeResult = nativeEncoder.encode(input);
      const ponyfillResult = ponyfillEncoder.encode(input);
      expect(ponyfillResult).toEqual(nativeResult);
    });
  });

  describe("encodeInto()", () => {
    it("should encode into buffer correctly when buffer is large enough", () => {
      const input = "Hello, World!";
      const nativeEncoder = new TextEncoder();
      const ponyfillEncoderLocal = new PonyfillTextEncoder();
      const nativeBuffer = new Uint8Array(20);
      const ponyfillBuffer = new Uint8Array(20);

      const nativeResult = nativeEncoder.encodeInto(input, nativeBuffer);
      const ponyfillResult = ponyfillEncoderLocal.encodeInto(
        input,
        ponyfillBuffer,
      );

      expect(ponyfillResult).toEqual(nativeResult);
      expect(ponyfillBuffer.slice(0, ponyfillResult.written)).toEqual(
        nativeBuffer.slice(0, nativeResult.written),
      );
    });

    it("should handle buffer overflow correctly", () => {
      const input = "Hello, World!";
      const nativeEncoder = new TextEncoder();
      const ponyfillEncoderLocal = new PonyfillTextEncoder();
      const nativeBuffer = new Uint8Array(5); // Intentionally small buffer
      const ponyfillBuffer = new Uint8Array(5);

      const nativeResult = nativeEncoder.encodeInto(input, nativeBuffer);
      const ponyfillResult = ponyfillEncoderLocal.encodeInto(
        input,
        ponyfillBuffer,
      );

      expect(ponyfillResult).toEqual(nativeResult);
      expect(ponyfillBuffer.slice(0, ponyfillResult.written)).toEqual(
        nativeBuffer.slice(0, nativeResult.written),
      );
    });

    it("should correctly report read and written counts", () => {
      const input = "𠜎𠜱𠝹𠱓"; // Each character is 4 bytes in UTF-8
      const ponyfillEncoderLocal = new PonyfillTextEncoder();
      const buffer = new Uint8Array(8); // Can only fit two characters

      const result = ponyfillEncoderLocal.encodeInto(input, buffer);
      expect(result.read).toBe(2);
      expect(result.written).toBe(8);
    });

    it("should handle empty input string", () => {
      const input = "";
      const ponyfillEncoderLocal = new PonyfillTextEncoder();
      const buffer = new Uint8Array(10);

      const result = ponyfillEncoderLocal.encodeInto(input, buffer);
      expect(result.read).toBe(0);
      expect(result.written).toBe(0);
    });

    it("should handle buffer with zero length", () => {
      const input = "Test";
      const ponyfillEncoderLocal = new PonyfillTextEncoder();
      const buffer = new Uint8Array(0);

      const result = ponyfillEncoderLocal.encodeInto(input, buffer);
      expect(result.read).toBe(0);
      expect(result.written).toBe(0);
    });
  });
});
