import { Bone, HeroBones, SkeletonPage, TextBones } from "@/components/site/ui/Skeleton";

export default function Loading() {
  return (
    <SkeletonPage label="Loading article" className="pb-[100px] min-[810px]:pb-[160px] min-[1200px]:pb-[200px]">
      <div className="mx-auto w-full max-w-[860px] px-[30px] pt-[128px] pb-[50px] min-[810px]:pt-[158px] min-[1200px]:pt-[194px]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2.5">
            <Bone className="h-7 w-24 rounded-full" />
            <Bone className="h-5 w-28" />
          </div>
          <HeroBones eyebrow={false} />
          <div className="mt-2 flex items-center gap-3">
            <Bone className="size-10 rounded-full" />
            <Bone className="h-5 w-32" />
          </div>
        </div>
      </div>
      <div className="container-page flex flex-col items-center gap-[50px]">
        <Bone className="aspect-[1200/680] w-full rounded-[20px]" />
        <div className="flex w-full max-w-[760px] flex-col gap-10">
          <TextBones lines={5} />
          <Bone className="h-7 w-1/2" />
          <TextBones lines={6} />
        </div>
      </div>
    </SkeletonPage>
  );
}
