import { Suspense } from "react";
import { useTranslations } from "next-intl";
import {
  User,
  Heart,
  Clock,
  Settings,
  Bell,
  Shield,
  ChevronRight,
} from "lucide-react";
import { Spinner } from "@/components/spinner";
import { Link } from "@/i18n/routing";
import { ThemeToggle } from "@/components/theme";
import { LanguageToggle } from "@/components/language-toggle";
import { getAuth } from "@/features/auth/queries/get-auth";
import { getUserProfile } from "@/features/auth/queries/get-user-profile";
import { signInPath } from "@/paths";

import { ProfileSection } from "./profile-section";
import { LogoutButton } from "./logout-button";

export default async function ProfilePage() {
  const { user } = await getAuth();
  const profile = await getUserProfile();

  return (
    <div className="flex flex-1 flex-col min-h-screen bg-background text-foreground">
      <ProfileHeader />

      <main className="flex-1 p-4 pb-20">
        <div className="container mx-auto space-y-6">
          {user && profile ? (
            <AuthenticatedContent profile={profile} />
          ) : (
            <GuestContent />
          )}
        </div>
      </main>
    </div>
  );
}

function ProfileHeader() {
  const t = useTranslations();

  return (
    <header className="border-b border-border p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t("common.profile")}</h1>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function GuestContent() {
  const t = useTranslations("auth");

  return (
    <section className="bg-card rounded-lg p-6 border border-border text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <User className="w-8 h-8 text-primary" />
      </div>
      <p className="text-muted-foreground mb-4">{t("loginRequired")}</p>
      <Link
        href={signInPath}
        className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
      >
        {t("signIn")}
      </Link>
    </section>
  );
}

type Profile = {
  id: string;
  account: string;
  nickname: string | null;
  avatar: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  birthday: Date | null;
  bio: string | null;
  createdAt: Date;
  lastLoginAt: Date | null;
};

function AuthenticatedContent({ profile }: { profile: Profile }) {
  const t = useTranslations();

  return (
    <>
      {/* User Profile Section */}
      <Suspense fallback={<Spinner />}>
        <ProfileSection profile={profile} />
      </Suspense>

      {/* My Favorites */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          {t("profile.myFavorites")}
        </h3>
        <div className="bg-card rounded-lg p-4 border border-border text-center text-muted-foreground">
          暂无收藏
        </div>
      </section>

      {/* Order History */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          {t("profile.orderHistory")}
        </h3>
        <div className="bg-card rounded-lg p-4 border border-border text-center text-muted-foreground">
          暂无订单
        </div>
      </section>

      {/* App Settings */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          {t("profile.appSettings")}
        </h3>
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <SettingsItem icon={Settings} label={t("profile.generalSettings")} />
          <SettingsItem icon={Bell} label={t("profile.notifications")} />
          <SettingsItem icon={Shield} label={t("profile.privacyPolicy")} />
          <LogoutButton />
        </div>
      </section>
    </>
  );
}

function SettingsItem({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}
