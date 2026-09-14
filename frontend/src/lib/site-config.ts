import {
  BookOpenIcon,
  CircleHelpIcon,
  CreditCardIcon,
  GithubIcon,
  HeadphonesIcon,
  HistoryIcon,
  LifeBuoyIcon,
  type LucideIcon,
} from "lucide-react";

type SiteNavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type SiteNavGroup = {
  label: string;
  icon: LucideIcon;
  items: SiteNavLink[];
};

export type SiteNavItem = SiteNavLink | SiteNavGroup;

export const mainNav: SiteNavItem[] = [
  { href: "/#features", label: "Features", icon: HeadphonesIcon },
  { href: "/#pricing", label: "Pricing", icon: CreditCardIcon },
  { href: "/#faq", label: "FAQ", icon: CircleHelpIcon },
  { href: "/#open-source", label: "Open source", icon: GithubIcon },
  {
    label: "Help",
    icon: LifeBuoyIcon,
    items: [
      { href: "/help", label: "Help Center", icon: BookOpenIcon },
      { href: "/changelog", label: "Changelog", icon: HistoryIcon },
    ],
  },
];

export const repositoryUrl = "https://github.com/andrebuilds/melodyc";
