import { extendTheme } from "@chakra-ui/react";
import { lightThemeColors } from "./colors";
import { cardTheme } from "./card";
import { ButtonStyle } from "./button";

const themeConfig = {
  components: {
    Card: cardTheme,
    Button: ButtonStyle,
  },

  initialColorMode: "system",
  useSystemColorMode: true,

  semanticTokens: {
    colors: {
      "chakra-body-text": {
        _light: "#0F172A", // a blue-gray (darker than pure black)
        _dark: lightThemeColors.gray[50],
      },
      "chakra-body-bg": {
        _light: lightThemeColors.primary[50],
        _dark: "#0B0B0B",
      },
      "primary-default": {
        _light: lightThemeColors.primary[500],
        _dark: lightThemeColors.primary[300],
      },
      "accent-green": {
        _light: lightThemeColors.secondary[500],
        _dark: lightThemeColors.secondary[300],
      },
      "muted-text": {
        _light: lightThemeColors.gray[500],
        _dark: lightThemeColors.gray[300],
      },
    },
  },
  colors: {
    ...lightThemeColors,
  },
  styles: {
    global: {
      body: {
        bg: "chakra-body-bg",
        color: "chakra-body-text",
        // Improve font rendering
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
      a: {
        color: "primary.600",
      },
    },
  },
};

export const lightTheme = extendTheme({
  ...themeConfig,
});
