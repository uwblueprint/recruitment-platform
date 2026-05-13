import { ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import {
  muiPaletteOptions,
  semanticColors,
} from "@/constants/palette";

// Augment MUI Palette to include custom semantic colors
declare module "@mui/material/styles" {
  interface Palette {
    semantics: typeof semanticColors;
  }
  interface PaletteOptions {
    semantics?: typeof semanticColors;
  }
}

const recruitmentPlatformTheme = createTheme({
  palette: {
    ...muiPaletteOptions,
    semantics: semanticColors,
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

interface RecruitmentPlatformThemeProviderProps {
  children: ReactNode;
}

export const RecruitmentPlatformThemeProvider = ({
  children,
}: RecruitmentPlatformThemeProviderProps) => {
  return (
    <ThemeProvider theme={recruitmentPlatformTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

