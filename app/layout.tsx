import type { Metadata } from "next";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SentinalHills | AI Automation Agency Nairobi, Kenya",
  description:
    "Lead generation systems, intelligent websites, apps and SaaS — built with AI and delivered fast for Kenyan businesses.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sentinalhills.com"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "SentinalHills",
  description: "AI automation agency in Nairobi, Kenya",
  url: "https://sentinalhills.com",
  telephone: "+14193229820",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  priceRange: "KES 40,000 - 600,000",
  openingHours: "Mo-Fr 08:00-18:00",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-[#0A0A0F] text-[#F0F0FF]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
