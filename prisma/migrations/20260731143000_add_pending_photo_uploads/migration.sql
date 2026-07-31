CREATE TABLE "PendingPhotoUpload" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploaderId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingPhotoUpload_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PendingPhotoUpload_uploaderId_url_key"
ON "PendingPhotoUpload"("uploaderId", "url");

CREATE INDEX "PendingPhotoUpload_uploaderId_idx"
ON "PendingPhotoUpload"("uploaderId");

CREATE INDEX "PendingPhotoUpload_createdAt_idx"
ON "PendingPhotoUpload"("createdAt");

ALTER TABLE "PendingPhotoUpload"
ADD CONSTRAINT "PendingPhotoUpload_uploaderId_fkey"
FOREIGN KEY ("uploaderId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
