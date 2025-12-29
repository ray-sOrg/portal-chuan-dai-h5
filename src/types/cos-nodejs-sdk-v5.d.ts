declare module 'cos-nodejs-sdk-v5' {
    interface COSConfig {
        SecretId: string;
        SecretKey: string;
        FileParallelLimit?: number;
        ChunkParallelLimit?: number;
        ChunkSize?: number;
    }

    interface PutObjectParams {
        Bucket: string;
        Region: string;
        Key: string;
        Body: Buffer | string;
        ContentType?: string;
        ContentLength?: number;
        onProgress?: (progressData: { loaded: number; total: number; speed: number; percent: number }) => void;
    }

    interface PutObjectResult {
        statusCode: number;
        headers: Record<string, string>;
        Location: string;
        ETag: string;
    }

    class COS {
        constructor(config: COSConfig);
        putObject(
            params: PutObjectParams,
            callback: (err: Error | null, data?: PutObjectResult) => void
        ): void;
    }

    export = COS;
}
