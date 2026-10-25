import { Bone, HERO_TOP, HeroBones, SkeletonPage } from "@/components/site/ui/Skeleton";

export default function Loading() {
  return (
    <SkeletonPage label="Loading careers" className={`${HERO_TOP} pb-[120px] md:pb-[200px]`}>
      <div className="mx-auto flex w-full max-w-[860px] flex-col items-center gap-[50px] px-[30px] pb-[60px]">
        <HeroBones />
        <Bone className="h-[160px] w-full rounded-[24px]" />
      </div>
      <div className="mx-auto flex w-full max-w-[1060px] flex-col items-center gap-[50px] px-[30px]">
        <HeroBones eyebrow={false} />
        <div className="grid w-full gap-5 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Bone key={i} className="h-[240px] rounded-[30px]" />
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
