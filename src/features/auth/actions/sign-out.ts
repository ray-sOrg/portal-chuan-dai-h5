"use server";

import { cookies } from "next/headers";

import { redirect } from "next/navigation";
import { lucia } from "@/lib/lucia";
import { profilePath } from "@/paths";
import * as oidc from "openid-client";
import { appUrl, oidcConfig } from "@/lib/oidc";

import { getAuth } from "../queries/get-auth";

export const signOut = async () => {
  const { session } = await getAuth();

  if (!session) {
    redirect(profilePath);
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  const _cookie = await cookies();
  _cookie.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  const config = await oidcConfig();
  redirect(oidc.buildEndSessionUrl(config, {
    client_id: config.clientMetadata().client_id,
    post_logout_redirect_uri: `${appUrl()}/zh/home`,
  }).href);
};
