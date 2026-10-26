import { Bone, HERO_TOP, HeroBones, SkeletonPage, TextBones } from "@/components/site/ui/Skeleton";

/** Loading state for the long-form text pages: legal pages and About. */
export function LegalSkeleton({ contents = true }) {
  return (
    <SkeletonPage className={`${HERO_TOP} pb-[100px] min-[810px]:pb-[160px] min-[1200px]:pb-[200px]`}>
      <div className="container-narrow">
        <HeroBones lede={false} />
        {contents && <Bone className="mt-[50px] h-[180px] rounded-[20px]" />}
        <div className="mt-[50px] flex flex-col gap-10 border-t border-line pt-[50px]">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-4">
              <Bone className="h-7 w-1/2" />
              <TextBones lines={5} />
            </div>
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
