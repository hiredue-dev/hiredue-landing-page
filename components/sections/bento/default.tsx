"use client"
import { ReactNode } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { Button, type ButtonProps } from "../../ui/button";
// import Glow from "../../ui/glow";
import { Section } from "../../ui/section";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card";
import Glow from "@/components/ui/glow";
import Image from "next/image";
import { useContent } from "@/components/contexts/content-provider";

const cardClass = "pt-5 rounded-lg shadow-md glass-3 from-brand-foreground/20 to-brand-foreground/0 bg-radial hover:from-brand-foreground/30 transition delay-150 duration-300 ease-in-out hover:to-brand-foreground/0";
// const cardClass = "pl-5 pt-4 rounded-lg shadow-md glass-3 from-brand-foreground/20 to-brand-foreground/0 bg-radial hover:from-brand-foreground/30 hover:to-brand-foreground/0 transition-all duration-3000";
export default function Bento() {
    const {whatIsHireduetitle, whatIsHireDueTitleDescription, whatIsHiredueHeading1, whatIsHiredueDescription1, whatIsHiredueHeading2, whatIsHiredueDescription2, whatIsHiredueHeading3, whatIsHiredueDescription3, whatIsHiredueHeading4, whatIsHiredueDescription4, whatIsHiredueHeading5, whatIsHiredueDescription5, whatIsHiredueHeading6, whatIsHiredueDescription6} = useContent();
  return (
    <Section className={cn("group relative overflow-hidden")}>
        <div className="max-w-container relative z-10 mx-auto flex flex-col items-center gap-6 text-center sm:gap-8">
        <h2 className="max-w-[640px] text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
            {whatIsHireduetitle}
        </h2>
        <div className="max-w-3xl text-muted-foreground text-xl">
            {whatIsHireDueTitleDescription}
            </div>
        </div>

        {/* <div className="flex h-full w-full items-center justify-center p-10"> */}
        {/* ml-2 sm:mx-auto sm:mt-4 object-[center_2rem] transition-[object-position] delay-150 duration-300 ease-in-out hover:object-center */}
            <div className="grid h-full w-full gap-4 p-3 grid-cols-1 lg:grid-cols-10 rounded-lg shadow-md px-2 md:px-26 py-10">
                <div className={cn("lg:col-span-4 col-span-1 px-4", cardClass)}>
                    <h2 className="px-0 md:pl-4 pt-2 text-xl font-bold">{whatIsHiredueHeading1}</h2>
                    <div className="px-0 md:pl-4 mt-3 text-muted-foreground max-w-xs">{whatIsHiredueDescription1}</div>
                    <div className="overflow-hidden h-80">
                    <Image src="/phone.png" alt="Design first" width={350} height={20} className="mx-auto mt-4 object-[center_2rem] transition-[object-position] delay-150 duration-300 ease-in-out hover:object-center"/>
                    </div>
                </div>
                <div className={cn("lg:col-span-6 col-span-1 ", cardClass)}>
                    <h2 className="px-4 md:px-8 pt-2 text-xl font-bold">{whatIsHiredueHeading2}</h2>
                    <div className="px-4 md:px-8 mt-3 text-muted-foreground max-w-lg">{whatIsHiredueDescription2}</div>
                    <div className="overflow-hidden h-80">
                    <Image src="/Container.png" alt="Design first" width={300} height={20} className="mx-auto transition-all delay-150 duration-300 ease-in-out hover:object-center scale-100 sm:scale-180 hover:sm:scale-200  hover:scale-120"/>
                    </div>
                </div>

                <div className={cn("lg:col-span-6 col-span-1 ", cardClass)}>
                    <h2 className="px-4 md:px-8 pt-2  text-xl font-bold">{whatIsHiredueHeading3}</h2>
                    <div className="px-4 md:px-8 mt-3 text-muted-foreground max-w-lg ">{whatIsHiredueDescription3}</div>
                    <div className="overflow-hidde ">
                    <Image src="/resume.png" alt="Design first" width={675} height={20} className="mx-auto mt-4 object-[center_2rem] transition-[object-position] delay-150 duration-300 ease-in-out hover:object-center"/>
                    </div>

                </div>
                 <div className={cn("lg:col-span-4 col-span-1", cardClass)}>
                    <h2 className="px-4 md:px-0 md:ml-8  text-xl pt-2  font-bold">{whatIsHiredueHeading4}</h2>
                    <div className="px-4 md:px-0 md:ml-8 mt-3 text-muted-foreground max-w-sm">{whatIsHiredueDescription4}</div>
                    <div className="overflow-hidden h-full">
                        <Image src="/globe2.png" alt="Design first" width={500} height={500} className="mx-auto mt-4 object-[center_2rem] transition-[object-position] delay-150 duration-300 ease-in-out hover:object-center"/>
                    </div>
                </div>

                <div className={cn("lg:col-span-4 col-span-1", cardClass)}>
                    <h2 className="px-4 md:px-8 text-xl pt-2  font-bold">{whatIsHiredueHeading5}</h2>
                    <div className="px-4 md:px-8 mt-3 text-muted-foreground max-w-sm">{whatIsHiredueDescription5}
                    </div>
                    <div className="overflow-visible h-full  ">
                    <Image src="/convo.png" alt="Design first" width={410} height={50} className="p-3 mx-auto mt-4 object-[center_1.5rem] transition-[object-position] delay-150 duration-300 ease-in-out hover:object-center"/>
                    </div>
                </div>
                <div className={cn("lg:col-span-6 col-span-1", "pt-5 rounded-lg shadow-md glass-3 from-brand-foreground/20 to-brand-foreground/0 bg-radial transition delay-150 duration-300 ease-in-out hover:to-brand-foreground/0")}>
                    <h2 className="px-4 md:px-8 text-xl pt-2  font-bold">{whatIsHiredueHeading6}</h2>
                    <div className="px-4 md:px-8 mt-3 text-muted-foreground max-w-sm">{whatIsHiredueDescription6}</div>
                    <div className="overflow-hidden h-full">
                    <Image src="/radar3.png" alt="Design first" width={450} height={20} className="mx-3 md:p-0 mx-auto mt-4 object-[center_1.5rem] transition-[object-position] delay-150 duration-300 ease-in-out hover:object-center"/>
                    </div>
                </div>
            </div>
        {/* </div> */}
  
    </Section>
  );
}
