export const subscriptionPlans = [
  {
    slug: "track",
    name: "Track Pack",
    credits: 30,
    price: "$7.99",
    description:
      "A quick boost for creating new tracks, testing ideas, and finding your sound.",
    features: [
      "Full music creation studio",
      "Vocal and instrumental tracks",
      "Cloud library and downloads",
    ],
    featured: false,
  },
  {
    slug: "ep",
    name: "EP Pack",
    credits: 70,
    price: "$17.99",
    description:
      "Experiment freely, refine your sound, and build your next release.",
    features: [
      "Everything in Track Pack",
      "More room for experimentation",
      "About $0.26 per generated song",
    ],
    featured: true,
  },
  {
    slug: "discography",
    name: "Discography Pack",
    credits: 150,
    price: "$37.99",
    description:
      "The best value for prolific creators producing music regularly and at scale.",
    features: [
      "Everything in EP Pack",
      "Built for frequent production",
      "About $0.25 per generated song",
    ],
    featured: false,
  },
] as const;

export type ProductSlug = (typeof subscriptionPlans)[number]["slug"];