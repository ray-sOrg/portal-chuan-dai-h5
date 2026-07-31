import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import type { UserRole } from "@prisma/client";
import { Lucia, TimeSpan } from "lucia";

import { prisma } from "./prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(7, "d"), // 会话7天过期
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },

  getUserAttributes: (attributes) => {
    return {
      phone: attributes.phone,
      nickname: attributes.nickname,
      avatar: attributes.avatar,
      role: attributes.role,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
  interface DatabaseUserAttributes {
    phone: string | null;
    nickname: string | null;
    avatar: string | null;
    role: UserRole;
  }
}
