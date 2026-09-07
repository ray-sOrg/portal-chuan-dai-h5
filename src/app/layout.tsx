import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import VersionInfo from "@/components/VersionInfo";
import { SilentSso } from "@/components/silent-sso";
import { getAuth } from "@/features/auth/queries/get-auth";

const bodySans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body-sans",
  display: "swap",
});

const displaySerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-display-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chuan-Dai",
  description: "A Family-Style Sichuan Restaurant with Dai Ethnic Flavors",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getAuth();
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={`${bodySans.variable} ${displaySerif.variable}`}>
        {children}
        <SilentSso loginUrl="/api/auth/oidc/login?silent=1" enabled={!user} />
        <Toaster
          className="app-toaster"
          position="top-center"
          offset={{ top: "calc(3.65rem + env(safe-area-inset-top, 0px))" }}
          mobileOffset={{ top: "calc(3.65rem + env(safe-area-inset-top, 0px))" }}
          visibleToasts={1}
          gap={8}
          duration={1800}
          toastOptions={{
            classNames: {
              toast: "app-toast",
              title: "app-toast-title",
              icon: "app-toast-icon",
            },
          }}
        />
        <VersionInfo />
      </body>
    </html>
  );
}
