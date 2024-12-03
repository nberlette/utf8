import { TextEncoder as PonyfillTextEncoder } from "../src/text_encoder.ts";
import { TextDecoder as PonyfillTextDecoder } from "../src/text_decoder.ts";
import { describe, it } from "jsr:@std/testing@1/bdd";
import { expect } from "jsr:@std/expect@1";

describe("Combined TextEncoder and TextDecoder Ponyfill vs Native", () => {
  it("should correctly encode and decode a complex string", () => {
    const encoderNative = new TextEncoder();
    const decoderNative = new TextDecoder();

    const encoderPonyfill = new PonyfillTextEncoder();
    const decoderPonyfill = new PonyfillTextDecoder();

    const input = "The quick brown 🦊 jumps over the lazy 🐶. こんにちは世界🌏";

    const nativeEncoded = encoderNative.encode(input);
    const ponyfillEncoded = encoderPonyfill.encode(input);

    expect(ponyfillEncoded).toEqual(nativeEncoded);

    const nativeDecoded = decoderNative.decode(nativeEncoded);
    const ponyfillDecoded = decoderPonyfill.decode(ponyfillEncoded);

    expect(ponyfillDecoded).toBe(nativeDecoded);
    expect(ponyfillDecoded).toBe(input);
  });

  it("should handle encoding and decoding with encodeInto and decode streams", () => {
    const encoderPonyfill = new PonyfillTextEncoder();
    const decoderPonyfill = new PonyfillTextDecoder("utf-8");
    const nativeEncoder = new TextEncoder();
    const nativeDecoder = new TextDecoder("utf-8");

    const input = "Stream test: 🌟✨🔥💧";
    const encoded = encoderPonyfill.encode(input);
    const nativeEncoded = nativeEncoder.encode(input);

    expect(encoded).toEqual(nativeEncoded);

    // now verify that the streaming decode behavior is consistent with
    // the native implementation
    let ponyfillResult = "", nativeResult = "";
    for (let i = 0; i < encoded.length; i += 5) {
      const chunk = encoded.slice(i, i + 5);
      ponyfillResult += decoderPonyfill.decode(chunk, { stream: true });
    }
    ponyfillResult += decoderPonyfill.decode();

    for (let i = 0; i < nativeEncoded.length; i += 5) {
      const chunk = nativeEncoded.slice(i, i + 5);
      nativeResult += nativeDecoder.decode(chunk, { stream: true });
    }
    nativeResult += nativeDecoder.decode();

    expect(ponyfillResult).toBe(nativeResult);
  });
});
