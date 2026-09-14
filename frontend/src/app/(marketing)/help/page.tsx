import type { Metadata } from "next";
import { HelpCenterView } from "~/components/help/help-center-view";

export const metadata: Metadata = {
  title: "Help Center | Melodyc",
  description:
    "Learn how to create music, manage tracks, use credits, and self-host Melodyc.",
};

export default function HelpCenterPage() {
  return <HelpCenterView />;
}