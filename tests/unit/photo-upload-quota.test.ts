import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const transaction = {
    $queryRaw: vi.fn(),
  };

  return {
    transaction,
    prisma: {
      $transaction: vi.fn(
        async (callback: (client: typeof transaction) => unknown) =>
          callback(transaction)
      ),
    },
  };
});

vi.mock("@/lib/prisma", () => ({
  prisma: mocks.prisma,
}));

import {
  consumePhotoUploadQuota,
  PhotoUploadQuotaExceededError,
} from "@/features/photo/utils/photo-upload-quota";

describe("consumePhotoUploadQuota", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("consumes hourly and daily quotas in one transaction", async () => {
    mocks.transaction.$queryRaw
      .mockResolvedValueOnce([
        { attempts: 30, windowStartedAt: new Date() },
      ])
      .mockResolvedValueOnce([
        { attempts: 200, windowStartedAt: new Date() },
      ]);

    await expect(consumePhotoUploadQuota("user-1")).resolves.toBeUndefined();

    expect(mocks.prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(mocks.transaction.$queryRaw).toHaveBeenCalledTimes(2);
  });

  it("rejects the first upload beyond the hourly limit", async () => {
    mocks.transaction.$queryRaw.mockResolvedValueOnce([
      { attempts: 31, windowStartedAt: new Date() },
    ]);

    await expect(consumePhotoUploadQuota("user-1")).rejects.toBeInstanceOf(
      PhotoUploadQuotaExceededError
    );
    expect(mocks.transaction.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it("rejects the first upload beyond the daily limit", async () => {
    mocks.transaction.$queryRaw
      .mockResolvedValueOnce([
        { attempts: 10, windowStartedAt: new Date() },
      ])
      .mockResolvedValueOnce([
        { attempts: 201, windowStartedAt: new Date() },
      ]);

    await expect(consumePhotoUploadQuota("user-1")).rejects.toMatchObject({
      name: "PhotoUploadQuotaExceededError",
      retryAfterSeconds: expect.any(Number),
    });
  });
});
