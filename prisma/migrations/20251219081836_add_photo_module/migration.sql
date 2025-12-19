-- CreateEnum
CREATE TYPE "EmotionTag" AS ENUM ('HAPPY', 'EXCITED', 'WARM', 'NOSTALGIC', 'FUNNY');

-- CreateTable
CREATE TABLE "Gathering" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" VARCHAR(500),
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gathering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" VARCHAR(500),
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "mediumUrl" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "emotionTag" "EmotionTag",
    "gatheringId" UUID,
    "uploaderId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoFavorite" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "photoId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhotoFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoComment" (
    "id" UUID NOT NULL,
    "content" VARCHAR(500) NOT NULL,
    "photoId" UUID NOT NULL,
    "authorId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhotoComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Photo_uploaderId_idx" ON "Photo"("uploaderId");

-- CreateIndex
CREATE INDEX "Photo_gatheringId_idx" ON "Photo"("gatheringId");

-- CreateIndex
CREATE INDEX "Photo_createdAt_idx" ON "Photo"("createdAt");

-- CreateIndex
CREATE INDEX "PhotoFavorite_userId_idx" ON "PhotoFavorite"("userId");

-- CreateIndex
CREATE INDEX "PhotoFavorite_photoId_idx" ON "PhotoFavorite"("photoId");

-- CreateIndex
CREATE UNIQUE INDEX "PhotoFavorite_userId_photoId_key" ON "PhotoFavorite"("userId", "photoId");

-- CreateIndex
CREATE INDEX "PhotoComment_photoId_idx" ON "PhotoComment"("photoId");

-- CreateIndex
CREATE INDEX "PhotoComment_authorId_idx" ON "PhotoComment"("authorId");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_gatheringId_fkey" FOREIGN KEY ("gatheringId") REFERENCES "Gathering"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoFavorite" ADD CONSTRAINT "PhotoFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoFavorite" ADD CONSTRAINT "PhotoFavorite_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoComment" ADD CONSTRAINT "PhotoComment_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoComment" ADD CONSTRAINT "PhotoComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
