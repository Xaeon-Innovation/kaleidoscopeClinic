import type { Metadata } from "next";
import {
  DEFAULT_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  absoluteUrl,
  getSiteBaseUrl,
} from "./site";

type BuildPageMetadataOptions = {
  title: string;
  description?: string;
  path: string;
  ogImage?: string;
  noindex?: boolean;
};

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  ogImage,
  noindex = false,
}: BuildPageMetadataOptions): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const url = absoluteUrl(canonicalPath);
  const imageUrl = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : absoluteUrl(ogImage)
    : absoluteUrl("/opengraph-image");

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };

  if (noindex) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}

export function getMetadataBase(): URL {
  return new URL(getSiteBaseUrl());
}
