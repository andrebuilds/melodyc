import Image from "next/image";

function MelodycLogo() {
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt=""
        width={32}
        height={32}
        priority
        className="size-8 object-contain"
      />
      <span className="text-lg font-bold text-foreground">Melodyc</span>
    </span>
  );
}

export { MelodycLogo };
