import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/features/auth/queries/get-auth';
import { uploadBase64ToCOS } from '@/lib/cos';

/**
 * POST /api/photos/upload-image
 * 上传图片到 COS（不保存到数据库）
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

        // 解析请求体
        const body = await request.json();
        const { base64Data } = body;

        // 验证数据
        if (!base64Data || !base64Data.startsWith('data:image/')) {
            return NextResponse.json(
                { success: false, error: 'INVALID_DATA' },
                { status: 400 }
            );
        }

        // 上传到 COS（直接上传到 chuan-dai 目录）
        const result = await uploadBase64ToCOS(base64Data);
        if (!result.success || !result.url) {
            return NextResponse.json(
                { success: false, error: 'UPLOAD_FAILED' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            url: result.url,
            key: result.key,
        });
    } catch (error) {
        console.error('Upload image error:', error);
        return NextResponse.json(
            { success: false, error: 'UPLOAD_FAILED' },
            { status: 500 }
        );
    }
}
