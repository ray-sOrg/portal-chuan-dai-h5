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
    <div className="container mx-auto space-y-6 p-4">
      {user && profile ? (
        <AuthenticatedContent 
          profile={profile} 
        />
      ) : (
        <GuestContent />
      )}
    </div>
  );
}

function GuestContent() {
  const t = useTranslations("auth");

  return (
    <section className="card-base p-6 text-center">
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
  lastLoginIp: string | null;
};

function AuthenticatedContent({ 
  profile,
}: { 
  profile: Profile;
}) {
  const t = useTranslations();

  return (
    <>
      {/* User Profile Section */}
      <Suspense fallback={<Spinner />}>
        <ProfileSection profile={profile} />
      </Suspense>

      {/* My Favorites */}
      <section className="card-base overflow-hidden">
        <h3 className="text-lg font-semibold p-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          {t("profile.myFavorites")}
        </h3>
        <div>
          <Link href={{ pathname: "/menu", query: { tab: "favorites" } }} className="block">
            <SettingsItem icon={UtensilsCrossed} label="我的菜单" />
          </Link>
          <Link href={{ pathname: "/photo", query: { tab: "favorites" } }} className="block">
            <SettingsItem icon={Image} label="我的照片" />
          </Link>
        </div>
      </section>

      {/* Order History */}
      <section className="card-base overflow-hidden">
        <h3 className="text-lg font-semibold p-4 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          {t("profile.orderHistory")}
        </h3>
        <div>
          <Link href="/orders" className="block">
            <SettingsItem icon={Clock} label="历史订单" />
          </Link>
        </div>
      </section>

      {/* Last Login Info */}
      {profile.lastLoginAt && (
        <section className="card-base p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{t("auth.lastLoginTime")}: {new Date(profile.lastLoginAt).toLocaleString()}</span>
          </div>
          {profile.lastLoginIp && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Shield className="w-4 h-4" />
              <span>{t("auth.lastLoginIp")}: {profile.lastLoginIp}</span>
            </div>
          )}
        </section>
      )}

      {/* App Settings */}
      <section className="card-base overflow-hidden">
        <h3 className="text-lg font-semibold p-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          {t("profile.appSettings")}
        </h3>
        <div>
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
          <LogoutButton />
        </div>
      </section>
    </>
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
    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border cursor-pointer">
      <div className={`flex items-center gap-3 ${iconColor || ''}`}>
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </div>
  );
}
