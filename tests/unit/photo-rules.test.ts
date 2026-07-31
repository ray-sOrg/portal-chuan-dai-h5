import { describe, expect, it } from "vitest";

import { savePhotosInputSchema } from "@/features/photo/photo-rules";

const photoUrl = (suffix: string) =>
  `https://img.tt829.cn/chuan-dai/photos/123e4567-e89b-42d3-a456-426614174000/123e4567-e89b-42d3-a456-42661417400${suffix}.jpg`;

describe("savePhotosInputSchema", () => {
  it("accepts and normalizes a valid multi-photo batch", () => {
    const result = savePhotosInputSchema.parse({
      title: "  夏日聚会  ",
      description: "  一起吃饭  ",
      emotionTag: "HAPPY",
      images: [
        { url: photoUrl("a"), width: 1920, height: 1080 },
        { url: photoUrl("b"), width: 1080, height: 1920 },
      ],
    });

    expect(result.title).toBe("夏日聚会");
    expect(result.description).toBe("一起吃饭");
    expect(result.images).toHaveLength(2);
  });

  it("rejects arbitrary external URLs", () => {
    const result = savePhotosInputSchema.safeParse({
      title: "照片",
      images: [{ url: "https://evil.example/photo.jpg" }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate images and batches larger than nine", () => {
    const duplicateResult = savePhotosInputSchema.safeParse({
      title: "照片",
      images: [{ url: photoUrl("a") }, { url: photoUrl("a") }],
    });
    const oversizedResult = savePhotosInputSchema.safeParse({
      title: "照片",
      images: Array.from({ length: 10 }, (_, index) => ({
        url: photoUrl(index.toString(16)),
      })),
    });

    expect(duplicateResult.success).toBe(false);
    expect(oversizedResult.success).toBe(false);
  });

  it("rejects invalid dimensions and overlong metadata", () => {
    const result = savePhotosInputSchema.safeParse({
      title: "a".repeat(51),
      description: "b".repeat(501),
      images: [{ url: photoUrl("a"), width: 0, height: 1.5 }],
    });

    expect(result.success).toBe(false);
  });
});
