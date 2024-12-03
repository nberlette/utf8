import { TextDecoder as PonyfillTextDecoder } from "../src/text_decoder.ts";
import { TextDecoderStream as PonyfillTextDecoderStream } from "../src/text_decoder_stream.ts";

const input = new TextEncoder().encode(
  "Hello, World! This is a performance benchmark for TextDecoder.",
);

Deno.bench({
  group: "TextDecoder",
  baseline: false,
  name: "Native TextDecoder",
  fn() {
    const decoder = new TextDecoder();
    decoder.decode(input);
  },
});

Deno.bench({
  group: "TextDecoder",
  baseline: true,
  name: "Ponyfill TextDecoder",
  fn() {
    const decoder = new PonyfillTextDecoder();
    decoder.decode(input);
  },
});

Deno.bench({
  group: "TextDecoderStream",
  baseline: false,
  name: "Native TextDecoderStream",
  async fn() {
    const decoderStream = new TextDecoderStream();
    const writer = decoderStream.writable.getWriter();
    const reader = decoderStream.readable.getReader();

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
  group: "TextDecoderStream",
  baseline: true,
  name: "Ponyfill TextDecoderStream",
  async fn() {
    const decoderStream = new PonyfillTextDecoderStream();
    const writer = decoderStream.writable.getWriter();
    const reader = decoderStream.readable.getReader();

    writer.write(input);
    writer.close();

    const chunks = [];
    let result;
    while (!(result = await reader.read()).done) {
      chunks.push(result.value);
    }
  },
});
