import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "../contexts/theme-context";
import MainLayout from "../components/layouts/main-layout";
import { getSiteUrl } from "../lib/seo";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Mohamed Yassine Hemissi | AI Engineering & Data Science",
  description:
    "Personal blog of Mohamed Yassine Hemissi - AI Engineering Student and software engineer exploring data-driven platforms and machine learning systems.",
  openGraph: {
    title: "Mohamed Yassine Hemissi | AI Engineering & Data Science",
    description:
      "Personal blog of Mohamed Yassine Hemissi - AI Engineering Student and software engineer exploring data-driven platforms and machine learning systems.",
    type: "website",
    url: "/",
    siteName: "Mohamed Yassine Hemissi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Yassine Hemissi | AI Engineering & Data Science",
    description:
      "Personal blog of Mohamed Yassine Hemissi - AI Engineering Student and software engineer exploring data-driven platforms and machine learning systems.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ThemeProvider>
          <MainLayout>{children}</MainLayout>
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  );
}
