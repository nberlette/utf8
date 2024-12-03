import { TextDecoderStream } from "../src/text_decoder_stream.ts";
import { describe, it } from "jsr:@std/testing@1/bdd";
import { expect } from "jsr:@std/expect@1";

describe("TextDecoderStream", () => {
  it("should decode UTF-8 bytes to strings", async () => {
    const decoderStream = new TextDecoderStream();
    const writer = decoderStream.writable.getWriter();
    const reader = decoderStream.readable.getReader();

    const input = new TextEncoder().encode("Hello, World!");
    const expectedOutput = "Hello, World!";

    writer.write(input);
    writer.close();

    const chunks = [];
    let result;
    while (!(result = await reader.read()).done) {
      chunks.push(result.value);
    }

    const output = chunks.join("");
    expect(output).toBe(expectedOutput);
  });

  it("should handle empty Uint8Array", async () => {
    const decoderStream = new TextDecoderStream();
    const writer = decoderStream.writable.getWriter();
    const reader = decoderStream.readable.getReader();

    const input = new Uint8Array([]);
    const expectedOutput = "";

    writer.write(input);
    writer.close();

    const chunks = [];
    let result;
    while (!(result = await reader.read()).done) {
      chunks.push(result.value);
    }

    const output = chunks.join("");
    expect(output).toBe(expectedOutput);
  });

  it("should handle multiple writes", async () => {
    const decoderStream = new TextDecoderStream();
    const writer = decoderStream.writable.getWriter();
    const reader = decoderStream.readable.getReader();

    const inputs = ["Hello", " ", "World", "!"].map((str) =>
      new TextEncoder().encode(str)
    );
    const expectedOutput = "Hello World!";

    for (const input of inputs) {
      writer.write(input);
    }
    writer.close();

    const chunks = [];
    let result;
    while (!(result = await reader.read()).done) {
      chunks.push(result.value);
    }

    const output = chunks.join("");
    expect(output).toBe(expectedOutput);
  });
});

describe("TextDecoderStream Ponyfill vs Native TextDecoderStream", () => {
  it("should decode UTF-8 bytes to strings", async () => {
    const ponyfillStream = new TextDecoderStream();
    const ponyfillWriter = ponyfillStream.writable.getWriter();
    const ponyfillReader = ponyfillStream.readable.getReader();
    const nativeStream = new globalThis.TextDecoderStream();
    const nativeWriter = nativeStream.writable.getWriter();
    const nativeReader = nativeStream.readable.getReader();

    const input = new TextEncoder().encode("Hello, World!");
    const expectedOutput = "Hello, World!";

    ponyfillWriter.write(input);
    ponyfillWriter.close();
    nativeWriter.write(input);
    nativeWriter.close();

    const ponyfillChunks = [], nativeChunks = [];
    let ponyfillResult, nativeResult;
    while (!(ponyfillResult = await ponyfillReader.read()).done) {
      ponyfillChunks.push(ponyfillResult.value);
    }
    while (!(nativeResult = await nativeReader.read()).done) {
      nativeChunks.push(nativeResult.value);
    }

    const ponyfillOutput = ponyfillChunks.join("");
    const nativeOutput = nativeChunks.join("");
    expect(ponyfillOutput).toBe(nativeOutput);
    expect(ponyfillOutput).toBe(expectedOutput);
  });

  it("should handle empty Uint8Array", async () => {
    const ponyfillStream = new TextDecoderStream();
    const nativeStream = new globalThis.TextDecoderStream();
    const ponyfillWriter = ponyfillStream.writable.getWriter();
    const nativeWriter = nativeStream.writable.getWriter();
    const ponyfillReader = ponyfillStream.readable.getReader();
    const nativeReader = nativeStream.readable.getReader();

    const input = new Uint8Array([]);
    const expectedOutput = "";

    ponyfillWriter.write(input);
    ponyfillWriter.close();
    nativeWriter.write(input);
    nativeWriter.close();

    const ponyfillChunks = [];
    const nativeChunks = [];
    let ponyfillResult, nativeResult;
    while (!(ponyfillResult = await ponyfillReader.read()).done) {
      ponyfillChunks.push(ponyfillResult.value);
    }
    while (!(nativeResult = await nativeReader.read()).done) {
      nativeChunks.push(nativeResult.value);
    }

    const ponyfillOutput = ponyfillChunks.join("");
    const nativeOutput = nativeChunks.join("");
    expect(ponyfillOutput).toBe(nativeOutput);
    expect(ponyfillOutput).toBe(expectedOutput);
  });

  it("should handle multiple writes", async () => {
    const ponyfillStream = new TextDecoderStream();
    const nativeStream = new globalThis.TextDecoderStream();
    const ponyfillWriter = ponyfillStream.writable.getWriter();
    const nativeWriter = nativeStream.writable.getWriter();
    const ponyfillReader = ponyfillStream.readable.getReader();
    const nativeReader = nativeStream.readable.getReader();

    const inputs = ["Hello", " ", "World", "!"].map((str) =>
      new TextEncoder().encode(str)
    );
    const expectedOutput = "Hello World!";

    for (const input of inputs) {
      ponyfillWriter.write(input);
      nativeWriter.write(input);
    }
    ponyfillWriter.close();
    nativeWriter.close();

    const ponyfillChunks = [];
    const nativeChunks = [];
    let ponyfillResult, nativeResult;
    while (!(ponyfillResult = await ponyfillReader.read()).done) {
      ponyfillChunks.push(ponyfillResult.value);
    }
    while (!(nativeResult = await nativeReader.read()).done) {
      nativeChunks.push(nativeResult.value);
    }

    const ponyfillOutput = ponyfillChunks.join("");
    const nativeOutput = nativeChunks.join("");
    expect(ponyfillOutput).toBe(nativeOutput);
    expect(ponyfillOutput).toBe(expectedOutput);
  });
});
