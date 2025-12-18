import { redirect } from "next/navigation";

import { signInPath } from "@/paths";

import { getAuth } from "./get-auth";

export const getAuthOrRedirect = async () => {
  const { user, session } = await getAuth();

  if (!user || !session) {
    redirect(signInPath);
  }

  return { user, session };
};
