import Image from "next/image";
import { mascotLabel, mascotSrc } from "~/lib/mascots";

function MelodycLogo({ mascot }: { mascot?: string | null }) {
  return (
    <span className="flex items-center gap-2.5">
      {mascot ? (
        <img
          src={mascotSrc(mascot)}
          alt={mascotLabel(mascot)}
          className="size-8 shrink-0 object-contain"
        />
      ) : (
        <Image
          src="/logo.png"
          alt=""
          width={32}
          height={32}
          priority
          className="size-8 object-contain"
        />
      )}
      <span className="text-lg font-bold text-foreground">Melodyc</span>
    </span>
  );
}

export { MelodycLogo };
