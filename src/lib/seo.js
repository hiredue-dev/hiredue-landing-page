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

/**
 * Structured data for /ats-checker: the tool as a free web application, its
 * place in the site, and its FAQ (the same questions shown on the page).
 */
export function getAtsCheckerJsonLd({ title, description, features, faq }) {
  const url = absoluteUrl("/ats-checker");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: `${SITE_NAME} ${title}`,
        url,
        description,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any (runs in the browser)",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        featureList: features,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": `${url}#app` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: title, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}
