import { Bone, HERO_TOP, HeroBones, SkeletonPage, TextBones } from "@/components/site/ui/Skeleton";

export default function Loading() {
  return (
    <SkeletonPage label="Loading product updates" className={`${HERO_TOP} pb-[120px] min-[1200px]:pb-[200px]`}>
      <div className="mx-auto w-full max-w-[720px] px-[30px] pb-[60px] min-[1200px]:pb-20">
        <HeroBones />
      </div>
      <div className="mx-auto flex w-full max-w-[1220px] flex-col gap-[7px] px-[30px]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="grid gap-[15px] rounded-[15px] border border-dashed border-line bg-white md:grid-cols-2">
            <div className="p-[25px] pb-0 md:pb-[25px]">
              <Bone className="h-4 w-32" />
            </div>
            <div className="flex flex-col gap-[15px] p-[25px] pt-0 md:border-l md:border-dashed md:border-line md:pt-[25px]">
              <Bone className="h-3.5 w-20" />
              <Bone className="h-7 w-2/3" />
              <TextBones lines={3} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonPage>
  );
}
