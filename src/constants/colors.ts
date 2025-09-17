type ColorPalette = {
  primary: string;
  accent: string;
  background: {
    light: string;
    dark: string;
  };
  text: {
    dark: string;
    gray: string;
    light: string;
    placeholder: string;
  };
  border: {
    light: string;
    subtle: string;
  };
  link: string;
  destructive: string;
};

export const Colors: ColorPalette = {
  // Brand colors
  primary: "#15203e", // The dark blue you've been using
  accent: "#be185d", // Your pink accent color

  // Backgrounds
  background: {
    light: "#FFFFFF",
    dark: "#F3F4F6", // Or another light gray like #E5E7EB
  },

  // Text colors
  text: {
    dark: "#1F2937",
    gray: "#6B7280",
    light: "#FFFFFF",
    placeholder: "#9CA3AF",
  },

  // Borders & Dividers
  border: {
    light: "#E5E7EB",
    subtle: "#D1D5DB",
  },

  // Other colors
  link: "#3B82F6",
  destructive: "#EF4444",
};
