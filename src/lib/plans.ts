export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    limits: {
      members: 1,
      projects: 3,
    },
  },
  pro: {
    name: "Pro",
    price: 12,
    limits: {
      members: 5,
      projects: 20,
    },
  },
  team: {
    name: "Team",
    price: 29,
    limits: {
      members: Infinity,
      projects: Infinity,
    },
  },
} as const

export type Plan = keyof typeof PLANS