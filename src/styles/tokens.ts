// src/styles/tokens.ts

export const tokens = {
  color: {
    background: "#FFFFFF",
    primary: "#1C1C1E", // deep charcoal
    textSecondary: "#6B7280", // cool gray
    border: "#E5E7EB", // light gray
  },

  space: {
    4: 4,
    8: 8,
    12: 12,
    16: 16,
    20: 20,
    24: 24,
    32: 32,
    40: 40,
    48: 48,
  },

  radius: {
    sm: 10,
    md: 16,
    lg: 20,
    pill: 999,
  },

  fontSize: {
    meta: 12,
    helper: 14,
    body: 16,
    button: 18,
    section: 20,
    title: 28,
  },

  motionMs: {
    fast: 150,
    normal: 200,
  },
} as const;