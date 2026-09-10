export const SITE_NAME = "HireDue";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://hiredue.com"
).replace(/\/$/, "");

export const DEFAULT_TITLE =
  "AI Job Search Agent & Application Automation | HireDue";
export const DEFAULT_DESCRIPTION =
  "Discover relevant jobs, tailor every resume, reach hiring managers, and automate repetitive applications with HireDue.";
export const DEFAULT_OPEN_GRAPH_IMAGE = "/opengraph-image";
export const DEFAULT_TWITTER_IMAGE = "/twitter-image";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  image,
  imageAlt,
  noIndex = false,
}) {
  const socialTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const openGraphImages = [
    {
      url: image ?? DEFAULT_OPEN_GRAPH_IMAGE,
      width: 1200,
      height: 630,
      alt: imageAlt ?? socialTitle,
    },
  ];
  const twitterImages = [
    {
      url: image ?? DEFAULT_TWITTER_IMAGE,
      alt: imageAlt ?? socialTitle,
    },
  ];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title: socialTitle,
      description,
      images: openGraphImages,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: twitterImages,
    },
  };
}

export function getOrganizationJsonLd() {
  const sameAs = [
    process.env.NEXT_PUBLIC_LINKEDIN_URL,
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_FACEBOOK_URL,
    process.env.NEXT_PUBLIC_TWITTER_URL,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/assets/HireDue_Text_Logo.png"),
          width: 375,
          height: 375,
        },
        email: "support@hiredue.com",
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}
