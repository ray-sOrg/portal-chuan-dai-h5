import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  deleteObjectFromCOS: vi.fn(),
  prisma: {
    pendingPhotoUpload: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
    photo: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/cos", () => ({
  deleteObjectFromCOS: mocks.deleteObjectFromCOS,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: mocks.prisma,
}));

import { cleanupPendingPhotoUploads } from "@/features/photo/utils/cleanup-pending-uploads";

describe("cleanupPendingPhotoUploads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.prisma.pendingPhotoUpload.deleteMany.mockResolvedValue({ count: 1 });
    mocks.prisma.pendingPhotoUpload.createMany.mockResolvedValue({ count: 0 });
    mocks.prisma.photo.findMany.mockResolvedValue([]);
    mocks.deleteObjectFromCOS.mockResolvedValue(true);
  });

  it("claims and deletes only the requested user's unreferenced upload", async () => {
    mocks.prisma.pendingPhotoUpload.findMany.mockResolvedValue([
      {
        id: "pending-1",
        key: "chuan-dai/photos/user/upload.jpg",
        url: "https://img.tt829.cn/chuan-dai/photos/user/upload.jpg",
        uploaderId: "user-1",
        createdAt: new Date("2026-01-01"),
      },
    ]);

    const deletedCount = await cleanupPendingPhotoUploads({
      uploaderId: "user-1",
      urls: ["https://img.tt829.cn/chuan-dai/photos/user/upload.jpg"],
      take: 9,
    });

    expect(deletedCount).toBe(1);
    expect(mocks.prisma.pendingPhotoUpload.findMany).toHaveBeenCalledWith({
      where: {
        uploaderId: "user-1",
        url: {
          in: ["https://img.tt829.cn/chuan-dai/photos/user/upload.jpg"],
        },
        createdAt: undefined,
      },
      orderBy: { createdAt: "asc" },
      take: 9,
    });
    expect(mocks.deleteObjectFromCOS).toHaveBeenCalledWith(
      "chuan-dai/photos/user/upload.jpg"
    );
  });

  it("keeps an object that is already referenced by a photo", async () => {
    mocks.prisma.pendingPhotoUpload.findMany.mockResolvedValue([
      {
        id: "pending-1",
        key: "key",
        url: "published-url",
        uploaderId: "user-1",
        createdAt: new Date(),
      },
    ]);
    mocks.prisma.photo.findMany.mockResolvedValue([{ url: "published-url" }]);

    const deletedCount = await cleanupPendingPhotoUploads({
      uploaderId: "user-1",
      urls: ["published-url"],
    });

    expect(deletedCount).toBe(0);
    expect(mocks.deleteObjectFromCOS).not.toHaveBeenCalled();
  });

  it("restores the pending record when COS deletion fails", async () => {
    const upload = {
      id: "pending-1",
      key: "key",
      url: "pending-url",
      uploaderId: "user-1",
      createdAt: new Date(),
    };
    mocks.prisma.pendingPhotoUpload.findMany.mockResolvedValue([upload]);
    mocks.deleteObjectFromCOS.mockResolvedValue(false);

    const deletedCount = await cleanupPendingPhotoUploads({
      uploaderId: "user-1",
      urls: ["pending-url"],
    });

    expect(deletedCount).toBe(0);
    expect(mocks.prisma.pendingPhotoUpload.createMany).toHaveBeenCalledWith({
      data: [upload],
      skipDuplicates: true,
    });
  });
});
