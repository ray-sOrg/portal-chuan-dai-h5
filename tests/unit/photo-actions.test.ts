import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const transaction = {
    photo: {
      createMany: vi.fn(),
    },
    pendingPhotoUpload: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  };

  return {
    getAuth: vi.fn(),
    revalidatePath: vi.fn(),
    transaction,
    prisma: {
      $transaction: vi.fn(
        async (callback: (client: typeof transaction) => unknown) =>
          callback(transaction)
      ),
    },
  };
});

vi.mock("@/features/auth/queries/get-auth", () => ({
  getAuth: mocks.getAuth,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mocks.prisma,
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

import { uploadPhotos } from "@/features/photo/actions/upload-photo";

const photoUrl = (suffix: string) =>
  `https://img.tt829.cn/chuan-dai/photos/123e4567-e89b-42d3-a456-426614174000/123e4567-e89b-42d3-a456-42661417400${suffix}.jpg`;

describe("uploadPhotos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getAuth.mockResolvedValue({ user: { id: "user-1" } });
    mocks.transaction.photo.createMany.mockResolvedValue({ count: 2 });
    mocks.transaction.pendingPhotoUpload.findMany.mockResolvedValue([
      { id: "pending-1" },
      { id: "pending-2" },
    ]);
    mocks.transaction.pendingPhotoUpload.deleteMany.mockResolvedValue({
      count: 2,
    });
  });

  it("saves every validated photo in one transaction", async () => {
    const result = await uploadPhotos({
      title: "  聚会照片  ",
      description: "  周末晚餐  ",
      emotionTag: "WARM",
      images: [
        { url: photoUrl("a"), width: 1920, height: 1080 },
        { url: photoUrl("b"), width: 1080, height: 1920 },
      ],
    });

    expect(result).toEqual({ success: true, photoCount: 2 });
    expect(mocks.prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(mocks.transaction.photo.createMany).toHaveBeenCalledWith({
      data: [
        {
          title: "聚会照片",
          description: "周末晚餐",
          url: photoUrl("a"),
          thumbnailUrl: null,
          width: 1920,
          height: 1080,
          emotionTag: "WARM",
          uploaderId: "user-1",
        },
        {
          title: "聚会照片",
          description: "周末晚餐",
          url: photoUrl("b"),
          thumbnailUrl: null,
          width: 1080,
          height: 1920,
          emotionTag: "WARM",
          uploaderId: "user-1",
        },
      ],
    });
    expect(
      mocks.transaction.pendingPhotoUpload.deleteMany
    ).toHaveBeenCalledWith({
      where: { id: { in: ["pending-1", "pending-2"] } },
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith(
      "/[locale]/photo",
      "page"
    );
  });

  it("rejects invalid input before opening a transaction", async () => {
    const result = await uploadPhotos({
      title: "",
      images: [{ url: "https://evil.example/photo.jpg" }],
    });

    expect(result).toEqual({ success: false, error: "VALIDATION_ERROR" });
    expect(mocks.prisma.$transaction).not.toHaveBeenCalled();
  });

  it("requires authentication", async () => {
    mocks.getAuth.mockResolvedValue({ user: null });

    const result = await uploadPhotos({
      title: "照片",
      images: [{ url: photoUrl("a") }],
    });

    expect(result).toEqual({ success: false, error: "UNAUTHORIZED" });
    expect(mocks.prisma.$transaction).not.toHaveBeenCalled();
  });
});
