/**
 * 腾讯云 COS 上传服务
 */
import COS from 'cos-nodejs-sdk-v5';
import { createHash } from 'crypto';

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
 * 生成文件内容的 MD5 hash
 */
function generateFileHash(buffer: Buffer): string {
    return createHash('md5').update(buffer).digest('hex');
}

/**
 * 从 base64 数据中提取文件信息
 */
function parseBase64(dataUrl: string): { buffer: Buffer; mimeType: string; ext: string } | null {
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return null;

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // 根据 MIME 类型确定扩展名
    const extMap: Record<string, string> = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
        'image/gif': '.gif',
    };
    const ext = extMap[mimeType] || '.jpg';

    return { buffer, mimeType, ext };
}

/**
 * 上传 base64 图片到 COS
 */
export async function uploadBase64ToCOS(
    base64Data: string,
    subFolder?: string
): Promise<UploadResult> {
    try {
        const parsed = parseBase64(base64Data);
        if (!parsed) {
            return { success: false, error: 'Invalid base64 data' };
        }

        const { buffer, mimeType, ext } = parsed;
        const fileHash = generateFileHash(buffer);
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

/**
 * 批量上传图片
 */
export async function uploadMultipleBase64ToCOS(
    base64DataList: string[],
    subFolder?: string
): Promise<UploadResult[]> {
    return Promise.all(base64DataList.map((data) => uploadBase64ToCOS(data, subFolder)));
}
