// Single-character mascots available in /public/mascots (band artwork is excluded).
export const MASCOTS = [
  "music-1-cyan-piano",
  "music-2-magenta-violin",
  "music-3-yellow-trumpet",
  "music-4-green-sax",
  "music-5-red-drums",
  "music-6-blue-harp",
  "music-8-pink-headphones",
  "music-9-brown-cello",
  "music-10-grey-accordion",
  "music-11-teal-bass",
  "music-12-maroon-maracas",
  "music-13-gold-xylophone",
  "music-14-navy-recorder",
  "music-15-olive-banjo",
  "music-16-violet-triangle",
  "music-17-emerald-harmonica",
  "music-18-crimson-bagpipes",
  "music-19-indigo-ukulele",
  "music-20-lavender-gong",
  "music-21-neon-synth",
  "music-22-saffron-sitar",
  "music-23-copper-tuba",
  "music-24-black-metal-guitar",
  "music-25-mint-tambourine",
  "music-26-wood-lute",
  "music-27-sand-didgeridoo",
  "music-28-plum-oboe",
  "music-29-electric-keytar",
  "music-30-tan-panflute",
  "music-31-ghostly-theremin",
  "music-32-tropical-bongos",
  "music-33-greek-baglamas",
  "music-34-quirky-otamatone",
  "music-35-sunset-kalimba",
  "music-36-neon-turntables",
  "music-37-electric-congas",
  "music-38-lemon-kazoo",
  "music-39-ruby-castanets",
  "music-40-teal-keytar-alt",
  "music-character-1",
  "music-character-3",
] as const;

export type MascotId = (typeof MASCOTS)[number];

export function isMascotId(value: string): value is MascotId {
  return (MASCOTS as readonly string[]).includes(value);
}

export function mascotSrc(id: string) {
  return `/mascots/${id}.webp`;
}

export function mascotLabel(id: string) {
  const label = id
    .replace(/^music-/, "")
    .replace(/^\d+-/, "")
    .replace(/-alt$/, "")
    .replaceAll("-", " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}
