/*
 * Everything that predates the redesign lives under this group. The tinted
 * page ground and the legacy body font used to sit on <body>; the redesigned
 * marketing routes are plain white, so they belong to this subtree instead.
 * `.legacyPage` is defined in the design system and paints both.
 *
 * A route group adds no path segment — /login, /pricing, … are unchanged.
 */
export const metadata = {
  robots: { index: false, follow: true },
};

export default function LegacyLayout({ children }) {
  return <div className="legacyPage">{children}</div>;
}
