import {
  CreditCardIcon,
  GithubIcon,
  HeadphonesIcon,
  WandSparklesIcon,
  type LucideIcon,
} from "lucide-react";

export type SiteNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const mainNav: SiteNavItem[] = [
  { href: "/#features", label: "Features", icon: HeadphonesIcon },
  { href: "/#how-it-works", label: "How it works", icon: WandSparklesIcon },
  { href: "/#open-source", label: "Open source", icon: GithubIcon },
  { href: "/#pricing", label: "Pricing", icon: CreditCardIcon },
];

export const repositoryUrl = "https://github.com/andrebuilds/melodyc";
