import type { LucideIcon } from "lucide-react";

type DashboardPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

function DashboardPageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
}: DashboardPageHeaderProps) {
  return (
    <header className="border-b pb-8">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-bold tracking-normal text-primary uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-1 text-3xl font-bold">{title}</h1>
          <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </header>
  );
}

export { DashboardPageHeader };