import { ReactNode } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import HireDue from "@/public/logos/hiredue";
import {
  Footer,
  FooterColumn,
  FooterContent,
} from "../../ui/footer";
import { ModeToggle } from "../../ui/mode-toggle";
import Image from "next/image";
import {
  Facebook,
  Instagram, Linkedin, Twitter, 
}from "lucide-react";
interface FooterLink {
  text: string;
  href: string;
} 
interface FooterColumnProps {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: ReactNode;
  name?: string;
  columns?: FooterColumnProps[];
  copyright?: string;
  policies?: FooterLink[];
  showModeToggle?: boolean;
  className?: string; 
}

export default function FooterSection({
  logo = <HireDue />,
  name = "HireDue",
  columns = [
    {
      title: "Company",
      links: [
        { text: "About Us", href: siteConfig.onSiteUrl.aboutUs },
        { text: "Careers", href: siteConfig.onSiteUrl.career },
        { text: "Support", href: siteConfig.onSiteUrl.support },
      ],
    },
  ],
  
  copyright = "© 2025 HireDue. All rights reserved",
  showModeToggle = true,
  className,
}: FooterProps) {
  return (
    <footer className={cn("bg-background w-full px-4", className)}>
      <div className="max-w-container mx-auto">
        <Footer className="w-full">
          <FooterContent className="border-border/15 border-t pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
             
            <FooterColumn className="flex justify-center items-center lg:justify-start order-1">
              <div className="flex items-center gap-2">
                {logo}
                <h3 className="text-xl font-bold  lg:text-left">{name}</h3>
              </div>
            </FooterColumn>
 
            <FooterColumn className="flex justify-center lg:justify-between items-center order-3 lg:order-2">
              <div className="flex gap-x-6 mb-3 lg:mt-7 lg:gap-x-10 text-foreground/90 ">
                 <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-brand transition ">
                   <Instagram />
                 </a>
                 <a href={process.env.NEXT_PUBLIC_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-brand transition">
                   <Facebook />
                 </a>
                 <a href={process.env.NEXT_PUBLIC_TWITTER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-brand transition">
                   <Twitter />
                 </a>
                 <a href={process.env.NEXT_PUBLIC_LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-brand transition">
                   <Linkedin />
                 </a>
              </div>
            </FooterColumn>
 
            <div className="flex justify-center lg:justify-end order-2 lg:order-3">
              <div className="flex flex-row gap-2 lg:flex-row lg:gap-8 h-auto lg:h-8">
                {columns.map((column, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-2 lg:flex-row lg:gap-6 h-full"
                  >
                    {column.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.href}
                        className="text-muted-foreground text-sm hover:text-foreground transition text-center lg:text-left"
                      >
                        {link.text}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>

          </FooterContent>

          <div className="flex justify-center text-foreground/70 items-center w-full pt-4">
            {copyright}
          </div>
        </Footer>
      </div>
    </footer>
  );
}
