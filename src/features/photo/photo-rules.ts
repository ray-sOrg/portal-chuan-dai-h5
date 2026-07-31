import { z } from "zod";

export const storedPhotoUrlSchema = z
  .string()
  .regex(
    /^https:\/\/img\.tt829\.cn\/chuan-dai\/photos\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:jpg|png|webp|gif)$/,
    "图片地址无效"
  );

export const cleanupPhotoUploadsInputSchema = z.object({
  urls: z
    .array(storedPhotoUrlSchema)
    .min(1)
    .max(9)
    .transform((urls) => Array.from(new Set(urls))),
});

const imageDimensionSchema = z
  .number()
  .int("图片尺寸必须为整数")
  .min(1, "图片尺寸无效")
  .max(100_000, "图片尺寸超出限制")
  .optional();

export const savePhotosInputSchema = z
  .object({
    title: z.string().trim().min(1, "请输入标题").max(50, "标题最多50字"),
    description: z
      .string()
      .trim()
      .max(500, "描述最多500字")
      .optional()
      .transform((value) => value || undefined),
    emotionTag: z
      .enum(["HAPPY", "EXCITED", "WARM", "NOSTALGIC", "FUNNY"])
      .optional(),
    images: z
      .array(
        z.object({
          url: storedPhotoUrlSchema,
          width: imageDimensionSchema,
          height: imageDimensionSchema,
        })
      )
      .min(1, "请至少上传一张照片")
      .max(9, "一次最多上传9张照片"),
  })
  .superRefine((input, ctx) => {
    const urls = new Set(input.images.map((image) => image.url));
    if (urls.size !== input.images.length) {
      ctx.addIssue({
        code: "custom",
        path: ["images"],
        message: "不能重复发布同一张照片",
      });
    }
  });

export type SavePhotosInput = z.input<typeof savePhotosInputSchema>;
