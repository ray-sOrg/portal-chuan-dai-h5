ALTER TABLE "User" ADD COLUMN "oidcSubject" TEXT;
CREATE UNIQUE INDEX "User_oidcSubject_key" ON "User"("oidcSubject");
