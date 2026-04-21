import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import VersionInfo from "@/components/VersionInfo";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={`${bodySans.variable} ${displaySerif.variable}`}>
        {children}
        <Toaster position="top-center" />
        <VersionInfo />
      </body>
    </html>
  );
}
