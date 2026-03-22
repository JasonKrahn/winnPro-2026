import type { Metadata, Viewport } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";

const exo2 = Exo_2({
  variable: "--font-exo-2",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

import { getSiteSettings } from "@/lib/content";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  colorScheme: "dark",
  themeColor: "#70A762",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://winnproconstruction.ca';

  return {
    metadataBase: new URL(siteUrl),
    title: settings?.title || "WinnPro Construction | Winnipeg Commercial Contractors",
    description: settings?.description || "WinnPro Construction is a leading commercial and industrial general contractor in Winnipeg.",
    keywords: ["Winnipeg Commercial Construction", "Industrial Contractors Manitoba", "Retail Build-Outs", "General Contractor Winnipeg", "WinnPro", "Commercial Renovations", "Construction Services"],
    authors: [{ name: 'WinnPro Construction' }],
    creator: 'WinnPro Construction',
    publisher: 'WinnPro Construction',
    formatDetection: {
      telephone: true,
    },
    alternates: {
      canonical: '/',
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    openGraph: {
      title: settings?.title || 'WinnPro Construction | Expert Commercial Contractors',
      description: settings?.description || "Winnipeg's top choice for high-performance commercial and industrial construction.",
      url: siteUrl,
      siteName: 'WinnPro Construction',
      images: [
        {
          url: `${siteUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'WinnPro Construction - Commercial & Industrial Contractors',
          type: 'image/jpeg',
        },
      ],
      locale: 'en_CA',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings?.title || 'WinnPro Construction',
      description: settings?.description || 'Commercial & Industrial General Contractors in Winnipeg',
      images: [`${siteUrl}/images/og-image.jpg`],
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'WinnPro Construction',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js" async></script>
      </head>
      <body
        className={`${exo2.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
