import { describe, expect, it } from "vitest";

import {
  parseImageDataUrl,
  parseImageBuffer,
  readRequestBufferWithLimit,
  UploadBodyTooLargeError,
} from "@/features/photo/photo-upload-rules";

const toDataUrl = (mimeType: string, bytes: number[]) =>
  `data:${mimeType};base64,${Buffer.from(bytes).toString("base64")}`;

describe("parseImageDataUrl", () => {
  it.each([
    ["image/jpeg", [0xff, 0xd8, 0xff, 0x00], ".jpg"],
    [
      "image/png",
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
      ".png",
    ],
    [
      "image/webp",
      [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50],
      ".webp",
    ],
    ["image/gif", [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], ".gif"],
  ])("accepts a valid %s signature", (mimeType, bytes, extension) => {
    const image = parseImageDataUrl(toDataUrl(mimeType, bytes as number[]));

    expect(image?.mimeType).toBe(mimeType);
    expect(image?.ext).toBe(extension);
  });

  it("rejects MIME spoofing", () => {
    const fakePng = toDataUrl("image/png", [0xff, 0xd8, 0xff, 0x00]);
    expect(parseImageDataUrl(fakePng)).toBeNull();
  });

  it("validates a raw image buffer without Base64 conversion", () => {
    const buffer = Buffer.from([0xff, 0xd8, 0xff, 0x00]);

    expect(parseImageBuffer(buffer, "image/jpeg")?.buffer).toBe(buffer);
    expect(parseImageBuffer(buffer, "image/png")).toBeNull();
    expect(parseImageBuffer(buffer, "image/svg+xml")).toBeNull();
  });

  it("rejects SVG and malformed base64", () => {
    expect(
      parseImageDataUrl(
        `data:image/svg+xml;base64,${Buffer.from("<svg/>").toString("base64")}`
      )
    ).toBeNull();
    expect(parseImageDataUrl("data:image/png;base64,%%%")).toBeNull();
  });
});

describe("readRequestBufferWithLimit", () => {
  it("reads a request within the limit", async () => {
    const request = new Request("https://local.invalid/upload", {
      method: "POST",
      body: "12345",
    });

    const buffer = await readRequestBufferWithLimit(request, 5);
    expect(buffer.toString()).toBe("12345");
  });

  it("rejects an oversized request from content-length", async () => {
    const request = new Request("https://local.invalid/upload", {
      method: "POST",
      headers: { "content-length": "6" },
      body: "small",
    });

    await expect(readRequestBufferWithLimit(request, 5)).rejects.toBeInstanceOf(
      UploadBodyTooLargeError
    );
  });

  it("rejects an oversized streamed body without content-length", async () => {
    const request = new Request("https://local.invalid/upload", {
      method: "POST",
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode("123456"));
          controller.close();
        },
      }),
      // Required by Node's Request implementation for streamed request bodies.
      duplex: "half",
    } as RequestInit & { duplex: "half" });

    await expect(readRequestBufferWithLimit(request, 5)).rejects.toBeInstanceOf(
      UploadBodyTooLargeError
    );
  });
});
