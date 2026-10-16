import { createDefaultSocialImage, socialImageContentType, socialImageSize } from "@/components/site/seo/DefaultSocialImage";

export const alt = "Free ATS Resume Checker by HireDue: instant ATS score and fixes";
export const size = socialImageSize;
export const contentType = socialImageContentType;

export default function OpenGraphImage() {
  return createDefaultSocialImage({
    title: "Free ATS Resume Checker",
    subtitle: "Instant ATS score, the fixes that matter, and one-click tailoring to any job.",
  });
}
