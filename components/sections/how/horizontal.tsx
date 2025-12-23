"use client";

import { Timeline } from "@/components/ui/timeline";
import { HowWeDoItSection } from "./defualt";
import { Card } from "@/components/ui/card";
import DimmedCard from "./dimmedCard";
import { cn } from "@/lib/utils";

function TimeLineCardHorizontal({
  events,
  className,
}: {
  className?: string;
  events: HowWeDoItSection[];
}) {
  return (
    <section
      className={cn(
        "w-full mt-4 flex justify-center pt-20 md:px-25 overflow-visible",
        className
      )}
    >
      <div className="  w-full flex items-center  h-auto relative">
        <div className="flex flex-col items-end  ">
          <span className="text-sm text-muted-foreground  ">From</span>
          <span className="text-2xl text-brand font-semibold opacity-80">HireDue</span>
        </div>

        <div className="flex-1 h-auto">
          <Timeline
            data={events.map((event,index) => ({
              title: event.heading,
              content: (
                <DimmedCard
                  heading={event.heading}
                  description={event.description}
                  image={`/image-${index+1}.png`}
                />
              ),
            }))}
          />
        </div>

        <div className="flex flex-col items-start w-fit ">
          <span className="text-sm text-muted-foreground">To</span>
          <span className="text-2xl font-semibold text-brand opacity-80">Hired You</span>
        </div>
      </div>
    </section>
  );
}

export default TimeLineCardHorizontal;
