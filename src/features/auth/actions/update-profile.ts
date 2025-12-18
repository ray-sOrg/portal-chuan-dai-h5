"use server";

import { z } from "zod";

import {
  ActionState,
  formErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";

import { getAuthOrRedirect } from "../queries/get-auth-or-redirect";

const updateProfileSchema = z.object({
  nickname: z
    .string()
    .min(1, "昵称不能为空")
    .max(20, "昵称最多20个字符")
    .optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().nullable(),
  birthday: z.string().optional().nullable(),
  bio: z.string().max(200, "简介最多200个字符").optional().nullable(),
});

export const updateProfile = async (
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const { user } = await getAuthOrRedirect();

    const data = updateProfileSchema.parse({
      nickname: formData.get("nickname") || undefined,
      gender: formData.get("gender") || null,
      birthday: formData.get("birthday") || null,
      bio: formData.get("bio") || null,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        nickname: data.nickname,
        gender: data.gender,
        birthday: data.birthday ? new Date(data.birthday) : null,
        bio: data.bio,
      },
    });

    return toActionState("SUCCESS", "资料更新成功", formData);
  } catch (error) {
    return formErrorToActionState(error, formData);
  }
};
