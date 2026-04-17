import { Metadata } from 'next';

export function generatePageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sentinalhills.com';
  // Use our own dynamic OG Image generator!
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title: `${title} | SentinalHills`,
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: `${title} | SentinalHills`,
      description,
      url: `${siteUrl}${path}`,
      siteName: 'SentinalHills',
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      locale: 'en_KE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | SentinalHills`,
      description,
      images: [ogImageUrl],
    },
    alternates: { canonical: `${siteUrl}${path}` },
    robots: { index: true, follow: true },
  };
}
