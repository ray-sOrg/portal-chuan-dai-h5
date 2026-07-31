import { NextRequest, NextResponse } from "next/server";

import { getAuth } from "@/features/auth/queries/get-auth";
import { cleanupPhotoUploadsInputSchema } from "@/features/photo/photo-rules";
import { cleanupPendingPhotoUploads } from "@/features/photo/utils/cleanup-pending-uploads";

export async function POST(request: NextRequest) {
  const { user } = await getAuth();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  try {
    const input = cleanupPhotoUploadsInputSchema.safeParse(
      await request.json()
    );
    if (!input.success) {
      return NextResponse.json(
        { success: false, error: "INVALID_DATA" },
        { status: 400 }
      );
    }

    const deletedCount = await cleanupPendingPhotoUploads({
      uploaderId: user.id,
      urls: input.data.urls,
      take: 9,
    });

    return NextResponse.json({ success: true, deletedCount });
  } catch (error) {
    console.error("Cleanup photo uploads error:", error);
    return NextResponse.json(
      { success: false, error: "CLEANUP_FAILED" },
      { status: 500 }
    );
  }
}
