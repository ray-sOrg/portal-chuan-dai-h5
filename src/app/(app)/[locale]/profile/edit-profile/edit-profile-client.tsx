"use client";

import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { ProfileForm } from "@/features/auth/components";
import { useRouter } from "@/i18n/routing";

type Props = {
  initialData: {
    nickname: string | null;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    birthday: Date | null;
    bio: string | null;
  };
};

export function EditProfileClient({ initialData }: Props) {
  const t = useTranslations("auth");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 p-4">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="rounded-full p-2 -ml-2 hover:bg-muted"
            aria-label={t("editProfile")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">{t("editProfile")}</h1>
        </div>
      </header>

      <main className="p-4">
        <div className="rounded-xl border bg-card p-4">
          <ProfileForm
            initialData={initialData}
            onSuccess={() => router.replace("/profile")}
          />
        </div>
      </main>
    </div>
  );
}
