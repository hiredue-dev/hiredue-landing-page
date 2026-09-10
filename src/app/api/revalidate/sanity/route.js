import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

const ROUTES_BY_TYPE = {
  aboutPage: ["/about"],
  changelogEntry: ["/changelog"],
  faq: ["/"],
  jobOpening: ["/career"],
  legalPage: ["/privacy", "/terms"],
  testimonial: ["/"],
};

export async function POST(request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { revalidated: false, message: "Webhook secret is not configured." },
      { status: 503 },
    );
  }

  try {
    const { body, isValidSignature } = await parseBody(request, secret, true);

    if (!isValidSignature) {
      return NextResponse.json(
        { revalidated: false, message: "Invalid webhook signature." },
        { status: 401 },
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        { revalidated: false, message: "Missing document type." },
        { status: 400 },
      );
    }

    const paths = new Set(ROUTES_BY_TYPE[body._type] ?? []);

    if (body._type === "post") {
      paths.add("/blog");
      paths.add("/sitemap.xml");
      if (body.slug) paths.add(`/blog/${body.slug}`);
    }

    for (const path of paths) revalidatePath(path);

    return NextResponse.json({
      revalidated: true,
      paths: [...paths],
      now: Date.now(),
    });
  } catch (error) {
    console.error("Sanity revalidation failed:", error);
    return NextResponse.json(
      { revalidated: false, message: "Unable to process webhook." },
      { status: 500 },
    );
  }
}
