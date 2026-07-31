import { randomUUID } from 'node:crypto';

import { after, NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/features/auth/queries/get-auth';
import {
    parseImageBuffer,
    readRequestBufferWithLimit,
    UploadBodyTooLargeError,
} from '@/features/photo/photo-upload-rules';
import { deleteObjectFromCOS, uploadValidatedImageToCOS } from '@/lib/cos';
import { prisma } from '@/lib/prisma';
import { cleanupStalePhotoUploads } from '@/features/photo/utils/cleanup-pending-uploads';
import {
    consumePhotoUploadQuota,
    PhotoUploadQuotaExceededError,
} from '@/features/photo/utils/photo-upload-quota';

/**
 * POST /api/photos/upload-image
 * 流式接收图片并登记为待发布 COS 对象
 */
export async function POST(request: NextRequest) {
    try {
        // 检查登录状态
        const { user } = await getAuth();
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'UNAUTHORIZED' },
                { status: 401 }
            );
        }

        const buffer = await readRequestBufferWithLimit(request);
        const image = parseImageBuffer(
            buffer,
            request.headers.get('content-type')
        );
        if (!image) {
            return NextResponse.json(
                { success: false, error: 'INVALID_DATA' },
                { status: 400 }
            );
        }

        await consumePhotoUploadQuota(user.id);

        const result = await uploadValidatedImageToCOS(
            image,
            `photos/${user.id}`,
            randomUUID()
        );
        if (!result.success || !result.url) {
            return NextResponse.json(
                { success: false, error: 'UPLOAD_FAILED' },
                { status: 500 }
            );
        }

        try {
            await prisma.pendingPhotoUpload.create({
                data: {
                    key: result.key!,
                    url: result.url,
                    uploaderId: user.id,
                },
            });
        } catch (error) {
            await deleteObjectFromCOS(result.key!);
            throw error;
        }

        after(() => cleanupStalePhotoUploads());

        return NextResponse.json({
            success: true,
            url: result.url,
            key: result.key,
        });
    } catch (error) {
        if (error instanceof UploadBodyTooLargeError) {
            return NextResponse.json(
                { success: false, error: 'FILE_TOO_LARGE' },
                { status: 413 }
            );
        }
        if (error instanceof PhotoUploadQuotaExceededError) {
            return NextResponse.json(
                { success: false, error: 'UPLOAD_LIMIT_EXCEEDED' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(error.retryAfterSeconds),
                    },
                }
            );
        }

        console.error('Upload image error:', error);
        return NextResponse.json(
            { success: false, error: 'UPLOAD_FAILED' },
            { status: 500 }
        );
    }
}
