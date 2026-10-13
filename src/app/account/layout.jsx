import { createPageMetadata } from "@/lib/seo";

// The page itself is a client component, which cannot export metadata.
export const metadata = createPageMetadata({
  title: "Your Account",
  description: "Your HireDue plan, billing and desktop app.",
  path: "/account",
  noIndex: true,
});

export default function AccountLayout({ children }) {
  return children;
}
