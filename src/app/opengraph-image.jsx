import {
  createDefaultSocialImage,
  socialImageAlt,
  socialImageContentType,
  socialImageSize,
} from "@/components/site/seo/DefaultSocialImage";

export const alt = socialImageAlt;
export const size = socialImageSize;
export const contentType = socialImageContentType;

export default function OpenGraphImage() {
  return createDefaultSocialImage();
}
