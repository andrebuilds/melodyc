"use client";

import { usePathname } from "next/navigation";
import { BreadcrumbPage } from "../ui/breadcrumb";

export default function BreadcrumbPageClient() {
  const path = usePathname();

  return (
    <BreadcrumbPage>
      {path === "/" && "Home"}
      {path === "/create" && "Create"}
    </BreadcrumbPage>
  );
}
