import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/branding";

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${siteConfig.name} | Leilões Online`,
  description: siteConfig.description,
  applicationName: `${siteConfig.name} | Leilões Online`,
  openGraph: {
    title: `${siteConfig.name} | Leilões Online`,
    description: siteConfig.description,
    siteName: `${siteConfig.name} | Leilões Online`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${siteConfig.name} | Leilões Online`,
    description: siteConfig.description,
  },
  icons: {
    icon: "/favicon.webp",
    shortcut: "/favicon.webp",
    apple: "/favicon.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
