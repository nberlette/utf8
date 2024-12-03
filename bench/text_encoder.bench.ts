import { TextEncoder as PonyfillTextEncoder } from "../src/text_encoder.ts";
import { TextEncoderStream as PonyfillTextEncoderStream } from "../src/text_encoder_stream.ts";

const input = "Hello, World! This is a performance benchmark for TextEncoder.";

Deno.bench({
  group: "TextEncoder",
  baseline: false,
  name: "Native TextEncoder",
  fn() {
    const encoder = new TextEncoder();
    encoder.encode(input);
  },
});

Deno.bench({
  group: "TextEncoder",
  baseline: true,
  name: "Ponyfill TextEncoder",
  fn() {
    const encoder = new PonyfillTextEncoder();
    encoder.encode(input);
  },
});

Deno.bench({
  group: "TextEncoderStream",
  baseline: false,
  name: "Native TextEncoderStream",
  async fn() {
    const encoderStream = new TextEncoderStream();
    const writer = encoderStream.writable.getWriter();
    const reader = encoderStream.readable.getReader();

    writer.write(input);
    writer.close();

    const chunks = [];
    let result;
    while (!(result = await reader.read()).done) {
      chunks.push(result.value);
    }
  },
});

Deno.bench({
  group: "TextEncoderStream",
  baseline: true,
  name: "Ponyfill TextEncoderStream",
  async fn() {
    const encoderStream = new PonyfillTextEncoderStream();
    const writer = encoderStream.writable.getWriter();
    const reader = encoderStream.readable.getReader();

    writer.write(input);
    writer.close();

    const chunks = [];
    let result;
    while (!(result = await reader.read()).done) {
      chunks.push(result.value);
    }
  },
});
