import { redirect } from "next/navigation";

import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { getUserProfile } from "@/features/auth/queries/get-user-profile";

import { EditProfileClient } from "./edit-profile-client";

export default async function EditProfilePage() {
  await getAuthOrRedirect();

  const profile = await getUserProfile();

  if (!profile) {
    redirect("/profile");
  }

  return (
    <EditProfileClient
      initialData={{
        nickname: profile.nickname,
        gender: profile.gender,
        birthday: profile.birthday,
        bio: profile.bio,
      }}
    />
  );
}
