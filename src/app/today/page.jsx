import { TrackPageView } from "@/components/site/analytics/TrackPageView";
import { TodayCounter } from "@/features/today/components/TodayCounter";
import { fetchTodayStats } from "@/features/today/todayStats";
import { EVENTS } from "@/lib/analytics";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Today on HireDue",
  description:
    "Live: applications HireDue sent today, recruiter replies this week, and how many companies wrote back.",
  path: "/today",
  // The live share image, so a pasted link previews today's numbers.
  image: "/today/opengraph-image",
  imageAlt: "Today on HireDue: live application and recruiter reply counts",
});

// Matches the backend's own one-minute cache: one render a minute serves everyone.
export const revalidate = 60;

export default async function TodayPage() {
  const stats = await fetchTodayStats();
  return (
    <>
      <TrackPageView event={EVENTS.todayPageViewed} />
      <TodayCounter initial={stats} />
    </>
  );
}
