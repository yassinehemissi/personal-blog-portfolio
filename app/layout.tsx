import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider, themeInitScript } from "../contexts/theme-context";
import MainLayout from "../components/layouts/main-layout";
import {
  DEFAULT_OG_IMAGE,
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  absoluteUrl,
  getSiteUrl,
} from "../lib/seo";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const siteUrl = getSiteUrl();
const defaultTitle = `${SITE_NAME} | ${SITE_TAGLINE}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_AUTHOR, url: siteUrl }],
  creator: SITE_AUTHOR,
  publisher: SITE_AUTHOR,
  keywords: [
    "Mohamed Yassine Hemissi",
    "AI engineer",
    "AI engineering student",
    "machine learning",
    "data engineering",
    "software engineer",
    "portfolio",
    "blog",
    "Next.js",
    "Tunisia",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: defaultTitle,
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: SITE_AUTHOR,
  url: siteUrl,
  image: absoluteUrl(DEFAULT_OG_IMAGE),
  jobTitle: "AI Engineering Student and Software Engineer",
  description: SITE_DESCRIPTION,
  email: "mailto:hemissiyassine@gmail.com",
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "ESPRIT - Private Higher School of Engineering and Technology",
    },
    { "@type": "CollegeOrUniversity", name: "University of Science of Tunis" },
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Data Engineering",
    "System Design",
    "Software Architecture",
  ],
  sameAs: [
    "https://github.com/yassinehemissi",
    "https://www.linkedin.com/in/mohamed-yassine-hemissi/",
  ],
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: SITE_NAME,
  url: siteUrl,
  description: SITE_DESCRIPTION,
  inLanguage: "en",
  publisher: { "@id": `${siteUrl}/#person` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([personJsonLd, siteJsonLd]),
          }}
        />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="34939e4a-2a35-4432-9523-3c67b37d70d4"
        />
        <ThemeProvider>
          <MainLayout>{children}</MainLayout>
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  );
}
