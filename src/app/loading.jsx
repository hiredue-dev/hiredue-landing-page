import { Bone, HeroBones, SkeletonPage } from "@/components/site/ui/Skeleton";

/* The home page's shape (hero, buttons, product shot, a row of cards); it
   also stands in for any route without a loading.jsx of its own. */
export default function Loading() {
  return (
    <SkeletonPage className="pt-[120px] pb-[120px] sm:pt-[150px]">
      <div className="container-page flex flex-col items-center gap-10">
        <HeroBones eyebrow={false} />
        <div className="flex flex-wrap justify-center gap-5">
          <Bone className="h-[60px] w-[180px] rounded-full" />
          <Bone className="h-[60px] w-[180px] rounded-full" />
        </div>
        <Bone className="aspect-[1200/675] w-full max-w-[1060px] rounded-[20px]" />
        <div className="grid w-full gap-5 md:grid-cols-3">
          <Bone className="h-[220px] rounded-[30px]" />
          <Bone className="h-[220px] rounded-[30px]" />
          <Bone className="h-[220px] rounded-[30px]" />
        </div>
      </div>
    </SkeletonPage>
  );
}
