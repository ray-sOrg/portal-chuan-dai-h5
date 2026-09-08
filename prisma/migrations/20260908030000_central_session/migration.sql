ALTER TABLE "Session" ADD COLUMN "oidcRefreshToken" TEXT;
ALTER TABLE "Session" ADD COLUMN "oidcCheckedAt" TIMESTAMP(3);
