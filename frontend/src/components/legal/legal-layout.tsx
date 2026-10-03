import { ScaleIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { LegalLanguageSwitcher } from "~/components/legal/legal-language-switcher";
import { legalEntity } from "~/lib/legal";
import type { LegalLanguage } from "~/lib/legal-language";
import { cn } from "~/lib/utils";

export const legalLinkClass = "font-medium text-primary hover:underline";
export const legalStrongClass = "font-semibold text-foreground";

function staggerStyle(index: number): CSSProperties {
  return { animationDelay: `${index * 60}ms`, animationFillMode: "both" };
}

export function LegalPageHero({
  title,
  updatedAt,
  lang = "en",
}: {
  title: string;
  updatedAt: string;
  lang?: LegalLanguage;
}) {
  const isItalian = lang === "it";

  return (
    <section className="border-b bg-muted/25 px-4 py-20 text-center sm:px-6 sm:py-24">
      <p className="inline-flex items-center gap-2 text-sm font-bold text-primary uppercase">
        <ScaleIcon className="size-4" aria-hidden="true" />
        {isItalian ? "Note legali" : "Legal"}
      </p>
      <h1 className="animate-in fade-in slide-in-from-bottom-3 mt-4 text-4xl font-black duration-500 sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mx-auto mt-6 text-base text-muted-foreground">
        {isItalian ? "Ultimo aggiornamento" : "Last updated"}: {updatedAt}
      </p>
      <div className="mt-6 flex flex-col items-center gap-3">
        <LegalLanguageSwitcher current={lang} />
        <p className="max-w-xl text-xs leading-5 text-muted-foreground">
          {isItalian
            ? "Questo documento è disponibile in italiano e in inglese. In caso di differenze tra le due versioni, prevale la versione italiana."
            : "This document is available in Italian and English. In case of any discrepancy between the two versions, the Italian version prevails."}
        </p>
      </div>
    </section>
  );
}

export function LegalContent({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
      {children}
    </div>
  );
}

export function LegalControllerCard({
  index = 0,
  title,
  lang = "en",
}: {
  index?: number;
  title?: string;
  lang?: LegalLanguage;
}) {
  const isItalian = lang === "it";

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-4 mb-12 rounded-xl border bg-card p-6 shadow-sm duration-500"
      style={staggerStyle(index)}
    >
      <h2 className="mb-4 text-xl font-semibold">
        {title ?? (isItalian ? "Titolare del trattamento" : "Data Controller")}
      </h2>
      <div className="grid grid-cols-1 gap-4 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
        <div>
          <strong className={legalStrongClass}>{legalEntity.name}</strong>
          <br />
          {legalEntity.parentCompany
            ? isItalian
              ? `Società soggetta all'attività di direzione e coordinamento di ${legalEntity.parentCompany}`
              : `Company subject to the direction and coordination of ${legalEntity.parentCompany}`
            : legalEntity.legalForm}
        </div>
        <div>
          {legalEntity.address}
          <br />
          {legalEntity.city}
        </div>
        <div>VAT / P.IVA: {legalEntity.vatNumber}</div>
        <div>
          <a href={`mailto:${legalEntity.email}`} className={legalLinkClass}>
            {legalEntity.email}
          </a>
          <br />
          PEC:{" "}
          <a href={`mailto:${legalEntity.pec}`} className={legalLinkClass}>
            {legalEntity.pec}
          </a>
        </div>
      </div>
    </div>
  );
}

export function LegalSection({
  title,
  index = 0,
  children,
}: {
  title: string;
  index?: number;
  children: ReactNode;
}) {
  return (
    <section
      className="animate-in fade-in slide-in-from-bottom-4 mb-12 duration-500 last:mb-0 [&_p+p]:mt-3"
      style={staggerStyle(index)}
    >
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      <div className="text-base leading-7 text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function LegalExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={legalLinkClass}
    >
      {children}
    </a>
  );
}

export function LegalMail({ address }: { address: string }) {
  return (
    <a href={`mailto:${address}`} className={legalLinkClass}>
      {address}
    </a>
  );
}

export function LegalSubheading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-6 mb-3 text-lg font-semibold text-foreground">
      {children}
    </h3>
  );
}

export function LegalList({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ul className={cn("mt-3 list-disc space-y-2 pl-6", className)}>
      {children}
    </ul>
  );
}

export function LegalTable({
  headers,
  rows,
  monoFirstColumn = false,
}: {
  headers: string[];
  rows: ReactNode[][];
  monoFirstColumn?: boolean;
}) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[40rem] text-sm">
        <thead className="bg-muted/50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-4 py-3 text-left font-semibold text-foreground"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    "px-4 py-3 align-top",
                    cellIndex === 0 &&
                      (monoFirstColumn
                        ? "font-mono text-xs text-foreground"
                        : "font-medium text-foreground"),
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
