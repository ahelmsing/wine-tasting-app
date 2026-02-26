// src/styles/brand.ts

export type Brand = {
  colors: {
    bgPlum: string;
    bgPlum2: string;

    paper: string;
    paper2: string; // legacy alias used by some screens
    surface: string;
    surfaceSoft: string;

    border: string; // legacy alias used by some screens
    borderSoft: string;

    textPrimary: string;
    textSecondary: string;

    accent: string;
    accentSoft: string;
  };

  radii: {
    page: number;
    card: number;
    pill: number;

    button: number; // legacy alias used by some screens
    large: number;
    medium: number;
    small: number;
  };

  // legacy alias used by some screens (BRAND.radius.*)
  radius: {
    page: number;
    card: number;
    pill: number;

    button: number;
    large: number;
    medium: number;
    small: number;
  };

  shadow: {
    card: string;
    soft: string;
  };

  typography: {
    displayFamily: string;
    bodyFamily: string;

    serif: string; // legacy alias used by some screens
  };
};

export const BRAND: Brand = {
  colors: {
    bgPlum: "#2A0F1D",
    bgPlum2: "#150813",

    paper: "#F5F2EC",
    paper2: "#F5F2EC",

    surface: "#FFFFFF",
    surfaceSoft: "rgba(255,255,255,0.72)",

    border: "rgba(0,0,0,0.12)",
    borderSoft: "rgba(0,0,0,0.10)",

    textPrimary: "#141820",
    textSecondary: "rgba(20,24,32,0.70)",

    accent: "#7B1E3A",
    accentSoft: "rgba(123,30,58,0.12)",
  },

  radii: {
    page: 36,
    card: 22,
    pill: 999,

    button: 999,
    large: 36,
    medium: 22,
    small: 14,
  },

  radius: {
    page: 36,
    card: 22,
    pill: 999,

    button: 999,
    large: 36,
    medium: 22,
    small: 14,
  },

  shadow: {
    card: "0 40px 140px rgba(0,0,0,0.28)",
    soft: "0 18px 60px rgba(0,0,0,0.18)",
  },

  typography: {
    displayFamily:
      '"Iowan Old Style","Palatino Linotype",Palatino,"Cormorant Garamond",Georgia,serif',
    bodyFamily:
      'ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji"',
    serif:
      '"Iowan Old Style","Palatino Linotype",Palatino,"Cormorant Garamond",Georgia,serif',
  },
};