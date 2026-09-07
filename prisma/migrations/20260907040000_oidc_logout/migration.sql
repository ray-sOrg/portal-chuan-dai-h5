ALTER TABLE "Session" ADD COLUMN "oidcSid" TEXT;
CREATE INDEX "Session_oidcSid_idx" ON "Session"("oidcSid");
