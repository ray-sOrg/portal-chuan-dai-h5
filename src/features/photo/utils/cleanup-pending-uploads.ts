import { deleteObjectFromCOS } from "@/lib/cos";
import { prisma } from "@/lib/prisma";

interface CleanupPendingUploadsOptions {
  uploaderId?: string;
  urls?: string[];
  olderThan?: Date;
  take?: number;
}

export async function cleanupPendingPhotoUploads({
  uploaderId,
  urls,
  olderThan,
  take = 20,
}: CleanupPendingUploadsOptions) {
  const candidates = await prisma.pendingPhotoUpload.findMany({
    where: {
      uploaderId,
      url: urls ? { in: urls } : undefined,
      createdAt: olderThan ? { lt: olderThan } : undefined,
    },
    orderBy: { createdAt: "asc" },
    take,
  });

  const claimed = (
    await Promise.all(
      candidates.map(async (upload) => {
        const result = await prisma.pendingPhotoUpload.deleteMany({
          where: { id: upload.id },
        });
        return result.count === 1 ? upload : null;
      })
    )
  ).filter((upload): upload is NonNullable<typeof upload> => Boolean(upload));

  if (claimed.length === 0) {
    return 0;
  }

  const referencedPhotos = await prisma.photo.findMany({
    where: { url: { in: claimed.map((upload) => upload.url) } },
    select: { url: true },
  });
  const referencedUrls = new Set(referencedPhotos.map((photo) => photo.url));
  const deletable = claimed.filter(
    (upload) => !referencedUrls.has(upload.url)
  );

  const deletionResults = await Promise.all(
    deletable.map(async (upload) => ({
      upload,
      deleted: await deleteObjectFromCOS(upload.key),
    }))
  );
  const failed = deletionResults
    .filter((result) => !result.deleted)
    .map((result) => result.upload);

  if (failed.length > 0) {
    await prisma.pendingPhotoUpload.createMany({
      data: failed.map(({ id, key, url, uploaderId: ownerId, createdAt }) => ({
        id,
        key,
        url,
        uploaderId: ownerId,
        createdAt,
      })),
      skipDuplicates: true,
    });
  }

  return deletionResults.length - failed.length;
}

export const cleanupStalePhotoUploads = () =>
  cleanupPendingPhotoUploads({
    olderThan: new Date(Date.now() - 24 * 60 * 60 * 1000),
  });
