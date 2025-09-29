import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Merriweather, Merriweather_Sans } from "next/font/google";
import "./globals.css";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
});

const merriweather_sans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
});

// NOTE: Favicon needs to be a multiple of 48
// Sitemap can be looked into in the future
export const metadata: Metadata = {
  metadataBase: new URL("https://personifine.com"),
  title: { template: "%s | Personifine", default: "Personifine" },
  description: "Bringing stories to life!",
  generator: "Next.js",
  applicationName: "personifine-writing",
  keywords: [
    "writing",
    "persona",
    "personify",
    "refine",
    "personified",
    "wioleta",
  ],
  creator: "Wholesome100",
  openGraph: {
    title: "Personifine",
    description: "Bringing stories to life!",
    url: "https://personifine.com",
    siteName: "Personifine",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${merriweather_sans.variable} ${merriweather.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
