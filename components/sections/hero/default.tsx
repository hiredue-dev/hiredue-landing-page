"use client";
import { ArrowRight, ArrowRightIcon } from "lucide-react";
import { ReactNode, useState } from "react";

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
import { useContent } from "@/components/contexts/content-provider";
import { Input } from "@/components/ui/input";

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
  textAlignment?: "left" | "center";
}

export default function Hero({
  title = "title",
  description = "description",
  mockup = (
    <Screenshot
      srcLight={imageUrls.hero.banner.third.light}
      srcDark={imageUrls.hero.banner.third.dark}
      alt="HireDue app screenshot"
      width={1248}
      height={765}
      className="w-full"
    />
  ),
  badge = (
    <Badge variant="outline" className="animate-appear">
      <span className="text-muted-foreground">title</span>
      <a href={siteConfig.getStartedUrl} className="flex items-center gap-1">
        trigger
        <ArrowRightIcon className="size-3" />
      </a>
    </Badge>
  ),
  // buttons = [
  //   {
  //     href: siteConfig.getStartedUrl,
  //     text: "Get Started",
  //     variant: "default",
  //   },
  //   {
  //     href: siteConfig.links.github,
  //     text: "Github",
  //     variant: "glow",
  //     icon: <Github className="mr-2 size-4" />,
  //   },
  // ],
  className,
  textAlignment = "left",
}: HeroProps) {
  const {
    HeroTitle,
    HeroSubTitle,
    HeroSubTrigger,
    HeroTitlDescription,
    HeroTitlDescriptionMobile,
  } = useContent();

  const endpoint = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ENDPOINT;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // runtime check — prevents passing `undefined` to fetch and gives a helpful message
    if (!endpoint) {
      console.error("NEXT_PUBLIC_GOOGLE_SHEET_ENDPOINT is not defined");
      setStatus("❌ Server endpoint not configured.");
      return;
    }

    setStatus("Submitting...");

    try {
      const body = new URLSearchParams({ email }).toString();

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });

      if (res.ok) {
        setStatus("✅ Thanks! You’re on the waitlist.");
        setEmail("");
      } else {
        console.error("Response status:", res.status, await res.text());
        setStatus("❌ Something went wrong. Try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error submitting form.");
    }
  };

  return (
    <Section
      className={cn("fade-bottom overflow-hidden mt-10 md:mt-0", className)}
    >
      <div className="max-w-container mx-auto md:mx-25 flex flex-col gap-12 sm:gap-24">
        <div
          className={`flex flex-col 
					items-${textAlignment === "left" ? "start" : "center"} gap-6 
					text-${textAlignment} sm:gap-12`}
        >
          <Badge variant="outline" className="animate-appear">
            <span className="text-muted-foreground">{HeroSubTitle}</span>
            <a href={siteConfig.url} className="flex items-center gap-1">
              {HeroSubTrigger}
              <ArrowRightIcon className="size-3" />
            </a>
          </Badge>

          <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground inline-block max-w-[840px] bg-linear-to-r bg-clip-text text-4xl leading-tight font-semibold text-balance text-transparent drop-shadow-2xl sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight">
            {HeroTitle}
          </h1>
          <p className="text-md animate-appear text-muted-foreground max-w-[840px] font-medium text-balance opacity-0 delay-100 lg:text-xl">
            <span className="hidden md:block">{HeroTitlDescription}</span>
            <span className="block md:hidden">{HeroTitlDescriptionMobile}</span>
          </p>
          {/* {buttons !== false && buttons.length > 0 && ( */}
          {/*   <div className="animate-appear relative z-10 flex justify-center gap-4 opacity-0 delay-300"> */}
          {/*     {buttons.map((button, index) => ( */}
          {/*       <Button */}
          {/*         key={index} */}
          {/*         variant={button.variant || "default"} */}
          {/*         size="lg" */}
          {/*         asChild */}
          {/*       > */}
          {/*         <a href={button.href}> */}
          {/*           {button.icon} */}
          {/*           {button.text} */}
          {/*           {button.iconRight} */}
          {/*         </a> */}
          {/*       </Button> */}
          {/*     ))} */}
          {/*   </div>)} */}
          {/* Custom CTA */}

          <form
            onSubmit={handleSubmit}
            className="z-20 flex justify-center gap-4"
          >
            <Input
              type="email"
              placeholder="Enter your email for early access and offers"
              className="w-fit md:min-w-85 h-10 px-4 py-2 glass-3 placeholder:truncate"
			  value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" variant="default" size="lg">
              <span className="hidden md:flex items-center">
                Get Early Access
              </span>
              <ArrowRight className="md:ml-2 h-4 w-4" />
            </Button>
          </form>
          {status && <div className="mt-4 text-sm">{status}</div>}
          {/* Custom CTA */}

          {mockup !== false && (
            <div className="relative w-full pt-16">
              <div className="group h-fit w-full">
                <MockupFrame
                  className="animate-appear absolute opacity-0 delay-700 transform -rotate-15 group-hover:translate-x-[-10rem] group-hover:-rotate-5 duration-500"
                  size="small"
                >
                  <Mockup
                    type="responsive"
                    className="bg-background/90 w-full rounded-xl border-0"
                  >
                    <Screenshot
                      srcLight={imageUrls.hero.banner.third.light}
                      srcDark={imageUrls.hero.banner.third.dark}
                      alt="HireDue app screenshot"
                      width={1248}
                      height={765}
                      className="w-full"
                    />
                  </Mockup>
                </MockupFrame>
                <MockupFrame
                  className="animate-appear absolute opacity-0 delay-700 transform -rotate-15 translate-x-[4rem] md:translate-x-[10rem] translate-y-[2rem] group-hover:-rotate-5 duration-500"
                  size="small"
                >
                  <Mockup
                    type="responsive"
                    className="bg-background/90 w-full rounded-xl border-0"
                  >
                    <Screenshot
                      srcLight={imageUrls.hero.banner.second.light}
                      srcDark={imageUrls.hero.banner.second.dark}
                      alt="HireDue app screenshot"
                      width={1248}
                      height={765}
                      className="w-full"
                    />
                  </Mockup>
                </MockupFrame>
                <MockupFrame
                  className="animate-appear w-fit opacity-0 delay-700 transform -rotate-15 translate-x-[8rem] md:translate-x-[20rem] translate-y-[4rem] group-hover:translate-x-[35rem] group-hover:-rotate-5 duration-500"
                  size="small"
                >
                  <Mockup
                    type="responsive"
                    className="bg-background/90 w-full rounded-xl border-0"
                  >
                    <Screenshot
                      srcLight={imageUrls.hero.banner.first.light}
                      srcDark={imageUrls.hero.banner.first.dark}
                      alt="HireDue app screenshot"
                      width={1248}
                      height={765}
                      className="w-full"
                    />
                  </Mockup>
                </MockupFrame>
              </div>
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
