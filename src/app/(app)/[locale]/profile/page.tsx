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
  Key,
  UtensilsCrossed,
  Image,
  Receipt,
} from "lucide-react";

import { Spinner } from "@/components/spinner";
import { Link } from "@/i18n/routing";
import { getAuth } from "@/features/auth/queries/get-auth";
import { getUserProfile } from "@/features/auth/queries/get-user-profile";
import { signInPath } from "@/paths";

import { ProfileSection } from "./profile-section";
import { LogoutButton } from "./logout-button";

export default async function ProfilePage() {
  const { user } = await getAuth();
  const profile = await getUserProfile();

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-4 pb-4">
      {user && profile ? (
        <AuthenticatedContent profile={profile} />
      ) : (
        <GuestContent />
      )}
    </div>
  );
}

function GuestContent() {
  const t = useTranslations("auth");

  return (
    <section className="card-base overflow-hidden p-6 text-center">
      <div className="mb-5 inline-flex rounded-full border border-border/70 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
        Chuan-Dai Club
      </div>
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-white/55 bg-[linear-gradient(135deg,var(--hero-start),var(--hero-end))] shadow-[var(--shadow-soft)]">
        <User className="h-8 w-8 text-primary" />
      </div>
      <p className="mb-4 text-muted-foreground">{t("loginRequired")}</p>
      <Link
        href={signInPath}
        className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
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
  lastLoginIp: string | null;
};

function AuthenticatedContent({ profile }: { profile: Profile }) {
  const t = useTranslations();

  return (
    <>
      <Suspense fallback={<Spinner />}>
        <ProfileSection profile={profile} />
      </Suspense>

      <section className="card-base overflow-hidden">
        <SectionHeading icon={Heart} title={t("profile.myFavorites")} />
        <div className="grid gap-3 p-4 pt-0 sm:grid-cols-2">
          <Link href={{ pathname: "/menu", query: { tab: "favorites" } }} className="block">
            <SettingsItem icon={UtensilsCrossed} label="我的菜单" />
          </Link>
          <Link href={{ pathname: "/photo", query: { tab: "favorites" } }} className="block">
            <SettingsItem icon={Image} label="我的照片" />
          </Link>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="card-base overflow-hidden">
          <SectionHeading icon={Receipt} title={t("profile.orderHistory")} />
          <div className="p-4 pt-0">
            <Link href="/orders" className="block">
              <SettingsItem icon={Clock} label="历史订单" />
            </Link>
          </div>
        </section>

        {profile.lastLoginAt && (
          <section className="card-base p-4">
            <div className="mb-4 flex items-center gap-2 text-base font-semibold">
              <Shield className="h-5 w-5 text-primary" />
              {t("profile.appSettings")}
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="settings-tile rounded-[1.2rem] p-3">
                <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  {t("auth.lastLoginTime")}
                </div>
                <span>{new Date(profile.lastLoginAt).toLocaleString()}</span>
              </div>
              {profile.lastLoginIp && (
                <div className="settings-tile rounded-[1.2rem] p-3">
                  <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
                    <Shield className="h-4 w-4 text-primary" />
                    {t("auth.lastLoginIp")}
                  </div>
                  <span>{profile.lastLoginIp}</span>
                </div>
              )}
            </div>
          </section>
        )}
      </section>

      <section className="card-base overflow-hidden">
        <SectionHeading icon={Settings} title={t("profile.appSettings")} />
        <div className="grid gap-3 p-4 pt-0 sm:grid-cols-2">
          <Link href="/profile/change-password" className="block">
            <SettingsItem icon={Key} label={t("auth.changePassword")} />
          </Link>
          <Link href="/settings/general" className="block">
            <SettingsItem icon={Settings} label={t("profile.generalSettings")} />
          </Link>
          <Link href="/settings/notifications" className="block">
            <SettingsItem icon={Bell} label={t("profile.notifications")} />
          </Link>
          <Link href="/settings/privacy" className="block">
            <SettingsItem icon={Shield} label={t("profile.privacyPolicy")} />
          </Link>
        </div>
        <div className="px-4 pb-4">
          <LogoutButton />
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        {title}
      </h3>
      <span className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
        Curated
      </span>
    </div>
  );
}

function SettingsItem({
  icon: Icon,
  label,
  iconColor = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  iconColor?: string;
}) {
  return (
    <div className="settings-tile group flex items-center justify-between rounded-[1.35rem] p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/10">
      <div className={`flex items-center gap-3 ${iconColor || ""}`}>
        <Icon className="h-5 w-5" />
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
    </div>
  );
}
