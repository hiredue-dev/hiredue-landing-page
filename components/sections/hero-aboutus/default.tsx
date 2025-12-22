"use client";
import { ArrowRightIcon } from "lucide-react";
import { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Github from "@/public/logos/github";
import { Badge } from "../../ui/badge";
import { Button, type ButtonProps } from "../../ui/button";
import Glow from "../../ui/glow";
import { Mockup, MockupFrame } from "../../ui/mockup";
import Screenshot from "../../ui/screenshot";
import { Section } from "../../ui/section";
import { imageUrls } from "@/config/images";

interface HeroButtonProps {
  href: string;
  text: string;
  variant?: ButtonProps["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
}

interface HeroProps {
  title?: string;
  description?: string;
  mockup?: ReactNode | false;
  badge?: ReactNode | false;
  buttons?: HeroButtonProps[] | false;
  className?: string;
}

export default function Hero({
  title = "Who are we ?",
  description = "At HireDue, we’re a team of engineers currently working in top global tech companies like Amazon, Visa, and others, united by a shared vision to make the job application journey smarter and faster. We’ve experienced firsthand how talented candidates waste countless hours filling out repetitive forms, logging into multiple portals, and tracking applications manually — so we built HireDue to change that. Our mission is to automate the tedious parts of job hunting, allowing professionals to focus on what truly matters: showcasing their skills. With intelligent browser automation, AI-driven analytics, and personalized message generation, HireDue streamlines every step of your application process — securely running on your local machine to keep your credentials private and safe.",
  mockup = (
    <Screenshot
                          srcLight={imageUrls.hero.banner.first.light}
                          srcDark={imageUrls.hero.banner.first.dark}
                          alt="HireDue app screenshot"
                          width={1248}
                          height={765}
                          className="w-full"
                        />
  ),
  badge = (
    <Badge variant="outline" className="animate-appear">
      <span className="text-muted-foreground">
        Beta version of HireDue is out!
      </span>
      <a href="#cta" className="flex items-center gap-1">
        Register Now
        <ArrowRightIcon className="size-3" />
      </a>
    </Badge>
  ),
  buttons = [
    {
      href: siteConfig.getStartedUrl,
      text: "Register Now",
      variant: "default",
    },
    {
      href: siteConfig.links.github,
      text: "Github",
      variant: "glow",
      icon: <Github className="mr-2 size-4" />,
    },
  ],
  className,
}: HeroProps) { 
 
  return (
    <Section
      className={cn(
        "fade-bottom overflow-hidden pb-0 sm:pb-0 md:pb-0",
        className,
      )}
    >
      {/* pt-16 */}
      <div className="max-w-container mx-auto flex flex-col gap-12 sm:gap-24"> 
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {badge !== false && badge}
          <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground relative z-10 inline-block bg-linear-to-r bg-clip-text text-4xl leading-tight font-semibold text-balance text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight">
            {title}
          </h1>
          <p className="text-md animate-appear text-muted-foreground relative z-10 max-w-[740px] font-medium text-balance opacity-0 delay-100 sm:text-xl">
            {description}
          </p>
         
          {mockup !== false && (
            <div className="relative w-full pt-12">
              <MockupFrame
                className="animate-appear opacity-0 delay-700"
                size="small"
              >
                <Mockup
                  type="responsive"
                  className="bg-background/90 w-full rounded-xl border-0"
                >
                  {mockup}
                </Mockup>
              </MockupFrame>
              <Glow
                variant="top"
                className="animate-appear-zoom opacity-0 delay-1000"
              />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}