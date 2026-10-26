import { Bone, CardBones, SkeletonPage } from "@/components/site/ui/Skeleton";

export default function Loading() {
  return (
    <SkeletonPage label="Loading articles" className="pb-[30px] min-[810px]:pb-20 min-[1200px]:pb-[100px]">
      <div className="flex justify-center px-[30px] pt-[140px] pb-[60px] min-[810px]:pt-[170px] min-[810px]:pb-20 min-[1200px]:pt-[194px] min-[1200px]:pb-[100px]">
        <Bone className="h-12 w-full max-w-[420px] rounded-[12px] min-[810px]:h-16" />
      </div>
      <div className="container-page grid gap-[30px] min-[810px]:grid-cols-2 min-[1200px]:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <CardBones key={i} />
        ))}
      </div>
    </SkeletonPage>
  );
}
