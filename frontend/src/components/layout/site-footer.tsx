import Link from "next/link";
import { GithubIcon, MailIcon } from "lucide-react";
import { MelodycLogo } from "~/components/brand/melodyc-logo";
import { repositoryUrl } from "~/lib/site-config";

function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const contactIconClassName =
    "flex size-9 items-center justify-center rounded-md border bg-card text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground";

  return (
    <footer className="relative w-full overflow-hidden border-t bg-background px-4 pt-16 pb-8 sm:px-6 lg:px-10">
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
        <div className="col-span-2 md:col-span-4 lg:col-span-1">
          <Link href="/" aria-label="Melodyc home" className="inline-flex">
            <MelodycLogo />
          </Link>
          <p className="mt-4 max-w-xs text-base leading-7 text-muted-foreground">
            Turn your ideas into original music with an open-source AI studio built for creators.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Released under the MIT License.
          </p>
        </div>

        <nav aria-label="Product links">
          <h2 className="mb-4 text-base font-semibold">Product</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/#features" className="transition-colors hover:text-foreground">Features</Link></li>
            <li><Link href="/#pricing" className="transition-colors hover:text-foreground">Pricing</Link></li>
            <li><Link href="/discover" className="transition-colors hover:text-foreground">Discover</Link></li>
            <li><Link href="/create" className="transition-colors hover:text-foreground">Create music</Link></li>
          </ul>
        </nav>

        <nav aria-label="Resource links">
          <h2 className="mb-4 text-base font-semibold">Resources</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href="/help" className="transition-colors hover:text-foreground">Help center</Link></li>
            <li><Link href="/changelog" className="transition-colors hover:text-foreground">Changelog</Link></li>
            <li><Link href="/#faq" className="transition-colors hover:text-foreground">FAQ</Link></li>
            <li><Link href="/auth/sign-in" className="transition-colors hover:text-foreground">Sign in</Link></li>
          </ul>
        </nav>

        <nav aria-label="Open-source links">
          <h2 className="mb-4 text-base font-semibold">Open source</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link href={repositoryUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">GitHub</Link></li>
            <li><Link href={`${repositoryUrl}/blob/main/LICENSE.MD`} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">License</Link></li>
            <li><Link href={`${repositoryUrl}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">Contributing</Link></li>
            <li><Link href={`${repositoryUrl}/blob/main/SECURITY.md`} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">Security</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-base font-semibold">Contact</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <a
                href="mailto:info@melodyc.com"
                className="break-all transition-colors hover:text-foreground"
              >
                info@melodyc.com
              </a>
            </li>
            <li>
              <a
                href="mailto:info@andreadambrosio.io"
                className="break-all transition-colors hover:text-foreground"
              >
                info@andreadambrosio.io
              </a>
            </li>
          </ul>
          <div className="mt-5 flex items-center gap-2">
            <a
              href={repositoryUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Melodyc on GitHub"
              title="GitHub"
              className={contactIconClassName}
            >
              <GithubIcon className="size-4" aria-hidden="true" />
            </a>
            <a
              href="mailto:info@melodyc.com"
              aria-label="Email Melodyc"
              title="Email"
              className={contactIconClassName}
            >
              <MailIcon className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-16 flex max-w-7xl flex-col gap-5 border-t pt-6 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
        <p>&copy; {currentYear} Melodyc. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-3">
          <span>Created by</span>
          <div className="flex -space-x-2">
            <a
              href="https://github.com/andrebuilds"
              target="_blank"
              rel="noreferrer"
              aria-label="Andrea D'Ambrosio on GitHub"
              title="Andrea D'Ambrosio"
              className="relative z-10 rounded-full ring-2 ring-background transition-transform hover:z-20 hover:-translate-y-0.5"
            >
              <img
                src="https://avatars.githubusercontent.com/u/191748583?v=4"
                alt=""
                width="32"
                height="32"
                className="size-8 rounded-full object-cover"
              />
            </a>
            <a
              href="https://github.com/fortunathomas"
              target="_blank"
              rel="noreferrer"
              aria-label="Thomas Fortuna on GitHub"
              title="Thomas Fortuna"
              className="relative rounded-full ring-2 ring-background transition-transform hover:z-20 hover:-translate-y-0.5"
            >
              <img
                src="https://avatars.githubusercontent.com/u/231452582?v=4"
                alt=""
                width="32"
                height="32"
                className="size-8 rounded-full object-cover"
              />
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-1 font-medium text-foreground">
            <a href="https://github.com/andrebuilds" target="_blank" rel="noreferrer" className="transition-colors hover:text-primary">
              Andrea D&apos;Ambrosio
            </a>
            <span aria-hidden="true">&amp;</span>
            <a href="https://github.com/fortunathomas" target="_blank" rel="noreferrer" className="transition-colors hover:text-primary">
              Thomas Fortuna
            </a>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex h-40 items-end justify-center overflow-hidden sm:h-48 lg:h-56"
        aria-hidden="true"
      >
        <span className="translate-y-[20%] select-none whitespace-nowrap text-[7rem] leading-none font-black tracking-normal text-primary/10 sm:text-[10rem] lg:text-[14rem]">
          Melodyc
        </span>
      </div>
    </footer>
  );
}

export { SiteFooter };