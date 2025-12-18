"use server";

import { prisma } from "@/lib/prisma";

import { getAuth } from "./get-auth";

export const getUserProfile = async () => {
  const { user } = await getAuth();

  if (!user) {
    return null;
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      account: true,
      nickname: true,
      avatar: true,
      gender: true,
      birthday: true,
      bio: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  return profile;
};
