export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const IMAGE_TYPES = {
  "image/jpeg": {
    ext: ".jpg",
    matches: (buffer: Buffer) =>
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff,
  },
  "image/png": {
    ext: ".png",
    matches: (buffer: Buffer) =>
      buffer.length >= 8 &&
      buffer.subarray(0, 8).equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
      ),
  },
  "image/webp": {
    ext: ".webp",
    matches: (buffer: Buffer) =>
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP",
  },
  "image/gif": {
    ext: ".gif",
    matches: (buffer: Buffer) => {
      const signature = buffer.subarray(0, 6).toString("ascii");
      return signature === "GIF87a" || signature === "GIF89a";
    },
  },
} as const;

export type AllowedImageMimeType = keyof typeof IMAGE_TYPES;

export interface ValidatedImage {
  buffer: Buffer;
  mimeType: AllowedImageMimeType;
  ext: string;
}

export class UploadBodyTooLargeError extends Error {
  constructor() {
    super("Upload request body is too large");
    this.name = "UploadBodyTooLargeError";
  }
}

export function parseImageBuffer(
  buffer: Buffer,
  mimeType: unknown
): ValidatedImage | null {
  if (
    typeof mimeType !== "string" ||
    !(mimeType in IMAGE_TYPES) ||
    buffer.length === 0 ||
    buffer.length > MAX_IMAGE_BYTES
  ) {
    return null;
  }

  const allowedMimeType = mimeType as AllowedImageMimeType;
  const imageType = IMAGE_TYPES[allowedMimeType];
  if (!imageType.matches(buffer)) {
    return null;
  }

  return { buffer, mimeType: allowedMimeType, ext: imageType.ext };
}

export function parseImageDataUrl(value: unknown): ValidatedImage | null {
  if (typeof value !== "string") {
    return null;
  }

  const match = value.match(
    /^data:(image\/(?:jpeg|png|webp|gif));base64,([a-zA-Z0-9+/]+={0,2})$/
  );
  if (!match || match[2].length % 4 !== 0) {
    return null;
  }

  const mimeType = match[1] as AllowedImageMimeType;
  const buffer = Buffer.from(match[2], "base64");
  return parseImageBuffer(buffer, mimeType);
}

export async function readRequestBufferWithLimit(
  request: Request,
  maxBytes = MAX_IMAGE_BYTES
) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new UploadBodyTooLargeError();
  }

  if (!request.body) {
    return Buffer.alloc(0);
  }

  const reader = request.body.getReader();
  const chunks: Buffer[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      throw new UploadBodyTooLargeError();
    }
    chunks.push(Buffer.from(value));
  }

  return Buffer.concat(chunks, totalBytes);
}
