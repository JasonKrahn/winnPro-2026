import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";

const exo2 = Exo_2({
  variable: "--font-exo-2",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "WinnPro Construction | Winnipeg Commercial Contractors",
  description: "Winnipeg's premier commercial construction contractors. High-performance, industrial-grade building and renovations.",
};

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
