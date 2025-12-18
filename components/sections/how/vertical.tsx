"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { HowWeDoItSection } from "./defualt";
import DimmedCard from "./dimmedCard";
import { cn } from "@/lib/utils";

function TimeLineCardVertical({
  events,
  className,
}: {
  events: HowWeDoItSection[];
  className: string;
}) {
  const containerRef = useRef<HTMLOListElement | null>(null);
  const prefixRef = useRef<HTMLDivElement | null>(null);
  const suffixRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!prefixRef || !prefixRef.current) return;
    if (!suffixRef || !suffixRef.current) return;

    const items = containerRef.current.querySelectorAll("li");

    const tl = gsap.timeline({ repeatDelay: 0.5 });
    const animationDuration = 0.6;
    tl.set([prefixRef.current, suffixRef.current], {
      opacity: 0.4,
      color: "white",
    });
    tl.to(prefixRef.current, {
      opacity: 1,
      color: "rgba(253, 186, 114)",
      duration: animationDuration,
      ease: "power1.inOut",
    });
    items.forEach((item) => {
      const dot = item.querySelector("span");
      const card = item.querySelector(".card-anim");

      tl.to([dot, card], {
        opacity: 1,
        duration: animationDuration,
        ease: "power1.inOut",
      }).to([dot, card], {
        opacity: 1,
        duration: 0.6,
        ease: "power1.inOut",
      });
    });
    tl.to(suffixRef.current, {
      opacity: 1,
      duration: animationDuration,
      color: "rgba(253, 186, 114)",
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div className={cn(className)}>
      <ol
        ref={containerRef}
        className="relative space-y-8 before:absolute before:-ml-px before:h-full before:w-0.5 before:rounded-full before:bg-gray-200 dark:before:bg-gray-700"
      >
        <div className="flex justify-start items-start w-fit gap-3 ml-3 ">
          <div
            className="w-fit text-center text-md h-fit 
			font-semibold text-white sm:text-2xl opacity-40"
          >
            From
          </div>
          <div
            className="w-fit text-center text-md h-fit
			font-semibold sm:text-2xl"
            ref={prefixRef}
          >
            Hire Due
          </div>
        </div>

        {events.map((event, idx) => (
          <li
            key={idx}
            className="relative -ms-1.5 flex rounded-full items-start gap-4"
          >
            <span className="block w-3 h-3 rounded-full bg-brand/70 opacity-30"></span>

            <DimmedCard
              heading={event.heading}
              description={event.description}
              className="mt-2"
              image={`/image-${idx+1}.png`}
            ></DimmedCard>
          </li>
        ))}

        <div className="flex flex-col justify-start items-start w-fit gap-3 ml-3">
          <div
            className="w-fit text-center text-md h-fit 
			font-semibold text-white sm:text-2xl opacity-40"
          >
            To
          </div>
          <div
            className="w-fit text-center text-md h-fit
		font-semibold sm:text-2xl"
            ref={suffixRef}
          >
            Hired You
          </div>
        </div>
      </ol>
    </div>
  );
}

export default TimeLineCardVertical;
