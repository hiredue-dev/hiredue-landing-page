"use client";

import React, { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

import { Button, type ButtonProps } from "../../ui/button";
import Glow from "../../ui/glow";
import { Section } from "../../ui/section";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CTAButtonProps {
  href: string;
  text: string;
  variant?: ButtonProps["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
}

interface CTAProps {
  title?: string;
  description?: string;
  buttons?: CTAButtonProps[] | false;
  className?: string;
}

export default function CTA({
  title = "Get Beta Access",
  description = "Be among the first to experience the future of job applications. Join thousands of professionals already on our waitlist.",
  buttons = [
    {
      href: siteConfig.getStartedUrl,
      text: "Get Beta Access",
      variant: "default",
      iconRight: <ArrowRight className="ml-2 h-4 w-4" />,
    },
  ],
  className,
}: CTAProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const endpoint = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ENDPOINT;

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
    <Section   id="cta" className={cn("group relative overflow-hidden", className)}>
      <div className="max-w-container relative z-10 mx-auto flex flex-col items-center gap-6 text-center sm:gap-8">
        <h2 className="max-w-[640px] text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
          {title}
        </h2>
        <div className="max-w-2xl text-muted-foreground">{description}</div>
        {buttons !== false && buttons.length > 0 && (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-center gap-4">
            <Input
              type="email"
              placeholder="Enter your email for beta access and offers"
              className="min-w-85 h-10 px-4 py-2 glass-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {buttons.map((button, index) => (
              <Button type="submit" key={index} variant={button.variant || "default"} size="lg">
                <div className="flex items-center">
                  {button.text}
                  {button.iconRight}
                </div>
              </Button>
            ))}
          </form>
        )}
        {status && (
          <div className="mt-4 text-sm">
            {status}
          </div>
        )}
      </div>

      <div className="absolute top-0 left-0 h-full w-full translate-y-[1rem] opacity-80 transition-all duration-500 ease-in-out group-hover:translate-y-[-2rem] group-hover:opacity-100">
        <Glow variant="bottom" />
      </div>
    </Section>
  );
}
