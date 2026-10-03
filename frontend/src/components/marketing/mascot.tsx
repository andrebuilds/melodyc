import { cn } from "~/lib/utils";

// Decorative brand characters from /public/mascots (transparent WebP).
export function Mascot({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <img
      src={`/mascots/${name}.webp`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn(
        "pointer-events-none absolute h-auto select-none",
        className,
      )}
    />
  );
}
