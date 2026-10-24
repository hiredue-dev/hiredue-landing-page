import { createDefaultSocialImage, socialImageContentType, socialImageSize } from "@/components/site/seo/DefaultSocialImage";
import { fetchTodayStats, formatCount } from "@/features/today/todayStats";

export const alt = "Today on HireDue: live application and recruiter reply counts";
export const size = socialImageSize;
export const contentType = socialImageContentType;

// Link previews carry the day's numbers, a few minutes old at most.
export const revalidate = 300;

export default async function OpenGraphImage() {
  const stats = await fetchTodayStats({ revalidate });
  if (!stats) {
    return createDefaultSocialImage({
      title: "Today on HireDue",
      subtitle: "Applications sent today and recruiter replies this week, live.",
    });
  }
  return createDefaultSocialImage({
    title: `${formatCount(stats.applicationsToday)} applications sent today`,
    subtitle: `${formatCount(stats.applications7d)} applications and ${formatCount(stats.recruiterReplies7d)} recruiter replies in the last 7 days. Live at hiredue.com/today`,
  });
}
