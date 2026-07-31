/**
 * 腾讯云 COS 上传服务
 */
import COS from 'cos-nodejs-sdk-v5';
import { createHash } from 'crypto';

import {
    parseImageDataUrl,
    type ValidatedImage,
} from '@/features/photo/photo-upload-rules';

// COS 单例（避免重复创建）
let cosInstance: COS | null = null;

function getCOS(): COS {
    if (!cosInstance) {
        cosInstance = new COS({
            SecretId: process.env.COS_SECRET_ID!,
            SecretKey: process.env.COS_SECRET_KEY!,
        });
    }
    return cosInstance;
}

const BUCKET = 'tt829-1256312718';
const REGION = process.env.COS_REGION || 'ap-chengdu';
const BASE_PATH = 'chuan-dai';
const CDN_DOMAIN = 'img.tt829.cn'; // CDN 域名

interface UploadResult {
    success: boolean;
    url?: string;
    key?: string;
    error?: string;
}

/**
 * 生成文件内容的 SHA-256 hash
 */
function generateFileHash(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
}

/**
 * 上传已验证的图片到 COS
 */
export async function uploadValidatedImageToCOS(
    image: ValidatedImage,
    subFolder?: string,
    objectName?: string
): Promise<UploadResult> {
    try {
        const { buffer, mimeType, ext } = image;
        const fileHash = objectName || generateFileHash(buffer);
        const key = subFolder
            ? `${BASE_PATH}/${subFolder}/${fileHash}${ext}`
            : `${BASE_PATH}/${fileHash}${ext}`;

        return new Promise((resolve) => {
            getCOS().putObject(
                {
                    Bucket: BUCKET,
                    Region: REGION,
                    Key: key,
                    Body: buffer,
                    ContentType: mimeType,
                },
                (err: Error | null) => {
                    if (err) {
                        console.error('COS upload error:', err);
                        resolve({ success: false, error: err.message });
                    } else {
                        // 使用 CDN 域名
                        const url = `https://${CDN_DOMAIN}/${key}`;
                        resolve({ success: true, url, key });
                    }
                }
            );
        });
    } catch (error) {
        console.error('Upload error:', error);
        return { success: false, error: 'Upload failed' };
    }
}

export async function deleteObjectFromCOS(key: string): Promise<boolean> {
    return new Promise((resolve) => {
        getCOS().deleteObject(
            {
                Bucket: BUCKET,
                Region: REGION,
                Key: key,
            },
            (error: Error | null) => {
                if (error) {
                    console.error('COS delete error:', error);
                    resolve(false);
                    return;
                }
                resolve(true);
            }
        );
    });
}

/**
 * 验证并上传 base64 图片到 COS
 */
export async function uploadBase64ToCOS(
    base64Data: string,
    subFolder?: string
): Promise<UploadResult> {
    const image = parseImageDataUrl(base64Data);
    if (!image) {
        return { success: false, error: 'Invalid image data' };
    }

    return uploadValidatedImageToCOS(image, subFolder);
}

/**
 * 批量上传图片
 */
export async function uploadMultipleBase64ToCOS(
    base64DataList: string[],
    subFolder?: string
): Promise<UploadResult[]> {
    return Promise.all(base64DataList.map((data) => uploadBase64ToCOS(data, subFolder)));
}
