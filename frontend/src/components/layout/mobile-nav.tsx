"use client";

import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { MelodycLogo } from "~/components/brand/melodyc-logo";
import { AuthHeaderActions } from "~/components/layout/auth-header-actions";
import { GitHubRepoButton } from "~/components/layout/github-repo-button";
import { ModeToggle } from "~/components/theme/mode-toggle";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import type { SiteNavItem } from "~/lib/site-config";
import { cn } from "~/lib/utils";

function MobileNav({
  items,
  className,
}: {
  items: SiteNavItem[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("size-9", className)}>
          <MenuIcon aria-hidden="true" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader className="border-b">
          <SheetTitle>
            <MelodycLogo />
            <span className="sr-only">Melodyc navigation</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-4" aria-label="Mobile navigation">
          {items.map((item) => {
            const Icon = item.icon;

            if ("items" in item) {
              return (
                <div key={item.label} className="py-1">
                  <div className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-foreground">
                    <Icon aria-hidden="true" strokeWidth={1.75} className="size-4" />
                    {item.label}
                  </div>
                  <div className="ml-4 border-l pl-3">
                    {item.items.map((child) => {
                      const ChildIcon = child.icon;

                      return (
                        <SheetClose key={child.href} asChild>
                          <Link
                            href={child.href}
                            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                          >
                            <ChildIcon aria-hidden="true" strokeWidth={1.75} className="size-4" />
                            {child.label}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <SheetClose key={item.href} asChild>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-base text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon aria-hidden="true" strokeWidth={1.75} className="size-4" />
                  {item.label}
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        <SheetFooter className="border-t">
          <div className="flex items-center justify-between">
            <GitHubRepoButton />
            <ModeToggle />
          </div>
          <AuthHeaderActions className="grid grid-cols-2 [&>*]:w-full" />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export { MobileNav };
