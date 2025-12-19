"use server";

import { cookies } from "next/headers";

import { redirect } from "@/i18n/routing";
import { lucia } from "@/lib/lucia";
import { profilePath } from "@/paths";

import { getAuth } from "../queries/get-auth";

export const signOut = async () => {
  const { session } = await getAuth();

  if (!session) {
    return redirect({ href: profilePath, locale: "zh" });
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  const _cookie = await cookies();
  _cookie.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect({ href: profilePath, locale: "zh" });
};
