import Link from "next/link";
import { MelodycLogo } from "~/components/brand/melodyc-logo";
import { repositoryUrl } from "~/lib/site-config";

function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/" aria-label="Melodyc home"><MelodycLogo /></Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Open-source AI music generation, hosted for convenience and free to self-host.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium" aria-label="Footer navigation">
          <Link href="/#features" className="hover:text-primary">Features</Link>
          <Link href="/#pricing" className="hover:text-primary">Pricing</Link>
          <Link href={repositoryUrl} target="_blank" rel="noreferrer" className="hover:text-primary">GitHub</Link>
          <Link href="/auth/sign-in" className="hover:text-primary">Sign in</Link>
        </nav>
      </div>
      <div className="border-t px-4 py-4 text-center text-xs text-muted-foreground">Melodyc · Released under the MIT License</div>
    </footer>
  );
}

export { SiteFooter };