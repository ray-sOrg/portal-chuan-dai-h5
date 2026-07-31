'use server';

import { getAuth } from '@/features/auth/queries/get-auth';
import { parseImageDataUrl } from '@/features/photo/photo-upload-rules';
import { uploadValidatedImageToCOS } from '@/lib/cos';

interface UploadImageInput {
    base64Data: string;
}

interface UploadImageResult {
    success: boolean;
    url?: string;
    error?: 'UNAUTHORIZED' | 'UPLOAD_FAILED' | 'INVALID_DATA';
}

/**
 * 上传单张图片到 COS（不保存到数据库）
 */
export async function uploadImage(input: UploadImageInput): Promise<UploadImageResult> {
    try {
        // 检查登录状态
        const { user } = await getAuth();
        if (!user) {
            return { success: false, error: 'UNAUTHORIZED' };
        }

        // 验证数据
        const image = parseImageDataUrl(input.base64Data);
        if (!image) {
            return { success: false, error: 'INVALID_DATA' };
        }

        // 上传到 COS
        const result = await uploadValidatedImageToCOS(image, 'photos');
        if (!result.success || !result.url) {
            return { success: false, error: 'UPLOAD_FAILED' };
        }

        return { success: true, url: result.url };
    } catch (error) {
        console.error('Upload image error:', error);
        return { success: false, error: 'UPLOAD_FAILED' };
    }
}
