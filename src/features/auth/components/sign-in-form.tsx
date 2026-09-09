import { profilePath } from "@/paths";

interface SignInFormProps {
    redirectTo?: string;
}

export function SignInForm({ redirectTo = profilePath }: SignInFormProps) {
    return (
        <div className="space-y-4">
          <p className="text-center text-sm leading-6 text-muted-foreground">
            川傣餐馆仅使用 TT829 统一账号，不再支持独立注册或密码登录。
          </p>
          <a href={`/api/auth/oidc/login?returnTo=${encodeURIComponent(redirectTo)}`} className="flex h-10 w-full items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90">
            使用统一账号登录
          </a>
        </div>
    );
}
