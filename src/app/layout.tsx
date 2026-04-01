import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import VersionInfo from "@/components/VersionInfo";

export const metadata: Metadata = {
  title: "Chuan-Dai",
  description: "A Family-Style Sichuan Restaurant with Dai Ethnic Flavors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body>
        {children}
        <Toaster position="top-center" />
        <VersionInfo />
      </body>
    </html>
  );
}
