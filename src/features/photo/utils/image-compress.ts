/**
 * 图片压缩工具
 * 在客户端压缩图片，减少上传大小
 */

interface CompressOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    mimeType?: 'image/jpeg' | 'image/webp';
}

interface CompressResult {
    blob: Blob;
    width: number;
    height: number;
    dataUrl: string;
}

const DEFAULT_OPTIONS: Required<CompressOptions> = {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.8,
    mimeType: 'image/jpeg',
};

/**
 * 压缩单张图片
 */
export async function compressImage(
    file: File,
    options: CompressOptions = {}
): Promise<CompressResult> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
        }

        img.onload = () => {
            // 计算缩放后的尺寸
            let { width, height } = img;
            const ratio = Math.min(
                opts.maxWidth / width,
                opts.maxHeight / height,
                1 // 不放大
            );

            width = Math.round(width * ratio);
            height = Math.round(height * ratio);

            // 设置 canvas 尺寸
            canvas.width = width;
            canvas.height = height;

            // 绘制图片
            ctx.drawImage(img, 0, 0, width, height);

            // 转换为 blob
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Failed to compress image'));
                        return;
                    }

                    const dataUrl = canvas.toDataURL(opts.mimeType, opts.quality);
                    resolve({ blob, width, height, dataUrl });
                },
                opts.mimeType,
                opts.quality
            );
        };

        img.onerror = () => reject(new Error('Failed to load image'));

        // 读取文件
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

/**
 * 生成缩略图
 */
export async function generateThumbnail(
    file: File,
    size: number = 300
): Promise<CompressResult> {
    return compressImage(file, {
        maxWidth: size,
        maxHeight: size,
        quality: 0.7,
    });
}

/**
 * 批量压缩图片
 */
export async function compressImages(
    files: File[],
    options: CompressOptions = {}
): Promise<CompressResult[]> {
    return Promise.all(files.map((file) => compressImage(file, options)));
}
