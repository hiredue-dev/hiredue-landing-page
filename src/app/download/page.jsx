import { DownloadHero } from "@/components/site/sections/download/DownloadHero";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Download the Desktop App",
  description:
    "Install the HireDue desktop app for macOS or Windows — free to download.",
  path: "/download",
  noIndex: true,
});

export default function DownloadPage() {
  return <DownloadHero />;
}
