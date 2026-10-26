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

// What HireDue is, in one sentence an answer engine can quote.
export const PRODUCT_DESCRIPTION =
  "HireDue is an AI job search agent: a desktop app for macOS and Windows that finds jobs across 50,000+ career pages and job boards, tailors your resume to each one, fills in and submits applications, and messages recruiters from your own LinkedIn and email. Sessions, credentials and email history stay encrypted on your device.";

/**
 * The X profile URL, or null when it isn't one. An X handle is 1–15 letters,
 * digits or underscores, so a value like twitter.com/hiredue-ai is dropped
 * rather than published as a broken link.
 */
export function xProfileUrl(url = process.env.NEXT_PUBLIC_TWITTER_URL) {
  return /^https:\/\/(www\.)?(twitter|x)\.com\/\w{1,15}\/?$/.test(url ?? "") ? url : null;
}

export function getOrganizationJsonLd() {
  const sameAs = [
    process.env.NEXT_PUBLIC_LINKEDIN_URL,
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_FACEBOOK_URL,
    xProfileUrl(),
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
        description: PRODUCT_DESCRIPTION,
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

/**
 * Structured data for the home page: the desktop app with its platforms and
 * the signed-out price list, and the FAQ exactly as the page shows it.
 * `plans` are billing products (see getPublicPlans); with none, the app is
 * described without offers rather than with made-up prices.
 */
export function getHomeJsonLd({ faq, plans = [], version }) {
  const offers = plans.map((plan) => {
    const amount = String((plan.price?.price ?? plan.priceMinor) / 100);
    const count = Number(plan.price?.payment_frequency_count) || 1;
    const unit = { day: "D", week: "W", month: "M", year: "Y" }[
      plan.price?.payment_frequency_interval?.toLowerCase()
    ];
    return {
      "@type": "Offer",
      name: plan.name,
      price: amount,
      priceCurrency: plan.currency,
      ...(unit && {
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: amount,
          priceCurrency: plan.currency,
          billingDuration: `P${count}${unit}`,
          valueAddedTaxIncluded: Boolean(plan.price?.tax_inclusive),
        },
      }),
    };
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#app`,
        name: SITE_NAME,
        url: SITE_URL,
        description: PRODUCT_DESCRIPTION,
        applicationCategory: "BusinessApplication",
        operatingSystem: "macOS (Apple Silicon), Windows 10, Windows 11",
        ...(version && { softwareVersion: version }),
        downloadUrl: absoluteUrl("/download"),
        featureList: [
          "Finds new jobs across 50,000+ career pages and job boards, including LinkedIn, Naukri, Indeed and Wellfound",
          "Tailors your resume to every job description",
          "Fills in and submits applications on LinkedIn Easy Apply, Greenhouse, Workday, Lever, Ashby and SmartRecruiters",
          "Sends personalised recruiter outreach from your own LinkedIn and email",
          "Tracks every application in one dashboard",
          "Keeps sessions, credentials and email history encrypted on your device",
        ],
        publisher: { "@id": `${SITE_URL}/#organization` },
        ...(offers.length && { offers }),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}
