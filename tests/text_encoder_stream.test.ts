import { TextEncoderStream } from "../src/text_encoder_stream.ts";
import { describe, it } from "jsr:@std/testing@1/bdd";
import { expect } from "jsr:@std/expect@1";

describe("TextEncoderStream", () => {
  it("should encode strings to UTF-8 bytes", async () => {
    const encoderStream = new TextEncoderStream();
    const writer = encoderStream.writable.getWriter();
    const reader = encoderStream.readable.getReader();

    const input = "Hello, World!";
    const expectedOutput = new TextEncoder().encode(input);

    writer.write(input);
    writer.close();

    const chunks = [];
    let result;
    while (!(result = await reader.read()).done) {
      chunks.push(result.value);
    }

    const output = new Uint8Array(
      chunks.reduce(
        (acc, chunk) => acc.concat(Array.from(chunk)),
        [] as number[],
      ),
    );
    expect(output).toEqual(expectedOutput);
  });

  it("should handle empty strings", async () => {
    const encoderStream = new TextEncoderStream();
    const writer = encoderStream.writable.getWriter();
    const reader = encoderStream.readable.getReader();

    const input = "";
    const expectedOutput = new TextEncoder().encode(input);

    writer.write(input);
    writer.close();

    const chunks = [];
    let result;
    while (!(result = await reader.read()).done) {
      chunks.push(result.value);
    }

    const output = new Uint8Array(
      chunks.reduce(
        (acc, chunk) => acc.concat(Array.from(chunk)),
        [] as number[],
      ),
    );
    expect(output).toEqual(expectedOutput);
  });

  it("should handle multiple writes", async () => {
    const encoderStream = new TextEncoderStream();
    const writer = encoderStream.writable.getWriter();
    const reader = encoderStream.readable.getReader();

    const inputs = ["Hello", " ", "World", "!"];
    const expectedOutput = new TextEncoder().encode(inputs.join(""));

    for (const input of inputs) {
      writer.write(input);
    }
    writer.close();

    const chunks = [];
    let result;
    while (!(result = await reader.read()).done) {
      chunks.push(result.value);
    }

    const output = new Uint8Array(
      chunks.reduce(
        (acc, chunk) => acc.concat(Array.from(chunk)),
        [] as number[],
      ),
    );
    expect(output).toEqual(expectedOutput);
  });
});

describe("TextEncoderStream Ponyfill vs Native TextEncoderStream", () => {
  it("should encode strings to UTF-8 bytes", async () => {
    const ponyfillStream = new TextEncoderStream();
    const nativeStream = new globalThis.TextEncoderStream();
    const ponyfillWriter = ponyfillStream.writable.getWriter();
    const nativeWriter = nativeStream.writable.getWriter();
    const ponyfillReader = ponyfillStream.readable.getReader();
    const nativeReader = nativeStream.readable.getReader();

    const input = "Hello, World!";
    const expectedOutput = new TextEncoder().encode(input);

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

    const ponyfillOutput = new Uint8Array(
      ponyfillChunks.reduce(
        (acc, chunk) => acc.concat(Array.from(chunk)),
        [] as number[],
      ),
    );
    const nativeOutput = new Uint8Array(
      nativeChunks.reduce(
        (acc, chunk) => acc.concat(Array.from(chunk)),
        [] as number[],
      ),
    );
    expect(ponyfillOutput).toEqual(nativeOutput);
    expect(ponyfillOutput).toEqual(expectedOutput);
  });

  it("should handle empty strings", async () => {
    const ponyfillStream = new TextEncoderStream();
    const nativeStream = new globalThis.TextEncoderStream();
    const ponyfillWriter = ponyfillStream.writable.getWriter();
    const nativeWriter = nativeStream.writable.getWriter();
    const ponyfillReader = ponyfillStream.readable.getReader();
    const nativeReader = nativeStream.readable.getReader();

    const input = "";
    const expectedOutput = new TextEncoder().encode(input);

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

    const ponyfillOutput = new Uint8Array(
      ponyfillChunks.reduce(
        (acc, chunk) => acc.concat(Array.from(chunk)),
        [] as number[],
      ),
    );
    const nativeOutput = new Uint8Array(
      nativeChunks.reduce(
        (acc, chunk) => acc.concat(Array.from(chunk)),
        [] as number[],
      ),
    );
    expect(ponyfillOutput).toEqual(nativeOutput);
    expect(ponyfillOutput).toEqual(expectedOutput);
  });

  it("should handle multiple writes", async () => {
    const ponyfillStream = new TextEncoderStream();
    const nativeStream = new globalThis.TextEncoderStream();
    const ponyfillWriter = ponyfillStream.writable.getWriter();
    const nativeWriter = nativeStream.writable.getWriter();
    const ponyfillReader = ponyfillStream.readable.getReader();
    const nativeReader = nativeStream.readable.getReader();

    const inputs = ["Hello", " ", "World", "!"];
    const expectedOutput = new TextEncoder().encode(inputs.join(""));

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

    const ponyfillOutput = new Uint8Array(
      ponyfillChunks.reduce(
        (acc, chunk) => acc.concat(Array.from(chunk)),
        [] as number[],
      ),
    );
    const nativeOutput = new Uint8Array(
      nativeChunks.reduce(
        (acc, chunk) => acc.concat(Array.from(chunk)),
        [] as number[],
      ),
    );
    expect(ponyfillOutput).toEqual(nativeOutput);
    expect(ponyfillOutput).toEqual(expectedOutput);
  });
});
