import { Bone, SkeletonPage } from "@/components/site/ui/Skeleton";

export default function Loading() {
  return (
    <SkeletonPage
      label="Loading today's numbers"
      className="pt-[120px] pb-[64px] min-[810px]:pt-[150px] min-[1200px]:pt-[170px] min-[1200px]:pb-[96px]"
    >
      <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-4 px-4 min-[810px]:px-[30px]">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="flex flex-col gap-2">
            <Bone className="h-9 w-64 rounded-[12px] min-[810px]:h-11" />
            <Bone className="h-5 w-80 max-w-full" />
          </div>
          <Bone className="h-9 w-40 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-4">
          <Bone className="h-[320px] min-w-0 flex-[1_1_380px] rounded-[30px]" />
          <Bone className="h-[320px] min-w-0 flex-[1_1_380px] rounded-[30px]" />
        </div>
      </div>
    </SkeletonPage>
  );
}
