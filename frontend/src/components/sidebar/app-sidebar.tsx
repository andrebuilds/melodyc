"use server";

import { UserButton } from "@daveyplate/better-auth-ui";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
import SidebarMenuItems from "./sidebar-menu-items";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { MelodycLogo } from "~/components/brand/melodyc-logo";

export async function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-2 pt-4 pb-3">
        <Link
          href="/discover"
          aria-label="Melodyc dashboard"
          className="overflow-hidden group-data-[collapsible=icon]:[&>span]:gap-0 group-data-[collapsible=icon]:[&>span>span]:hidden"
        >
          <MelodycLogo />
        </Link>
      </SidebarHeader>
      <div className="px-3 pb-2" aria-hidden="true">
        <SidebarSeparator className="mx-0 w-full bg-sidebar-border/80" />
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <UserButton
          variant="outline"
          className="w-full justify-start overflow-hidden group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:p-0!"
          classNames={{
            trigger: {
              base: "group-data-[collapsible=icon]:[&>svg:last-child]:hidden",
              user: {
                base: "group-data-[collapsible=icon]:[&>*:not(:first-child)]:hidden",
              },
            },
          }}
          additionalLinks={[
            {
              label: "Customer Portal",
              href: "/customer-portal",
              icon: <UserIcon />,
            },
          ]}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
