// COLOR SCALES (for reference)
export const neutral = {
  50: "#FFFFFF",
  100: "#EEEEEE",
  200: "#C4C4C4",
  500: "#737373",
  600: "#2D3748",
  700: "#444444",
  800: "#252525",
  900: "#000000",
};

export const red = {
  50: "#FFF5F5",
  200: "#F7B9B9",
  500: "#CD5A5A",
  900: "#600002",
};

export const orange = {
  50: "#FFFCF5",
  500: "#CE812E",
  900: "#603000",
};

const yellow = {
  50: "#FFF8E9",
  100: "#FFF2A1",
  500: "#EAB01A",
  900: "#A45200",
};

export const green = {
  50: "#F5FFF5",
  100: "#CEEBB8",
  500: "#7EAE5A",
  700: "#4F7F2B",
  900: "#006002",
};

export const blue = {
  50: "#F4F9FF",
  100: "#E0F0FF",
  500: "#0573E8",
  600: "#135FC5",
  900: "#003884",
};

const magenta = {
  50: "#FCF5FF",
  100: "#F4DBFF",
  500: "#CE66FF",
  900: "#420060",
};

// semantic color definitions for the recruitment platform
export const semanticColors = {
  reviewStatus: {
    reviewed: {
      background: green[50],
      border: green[900],
      text: green[900],
    },
    inReview: {
      background: orange[50],
      border: orange[900],
      text: orange[900],
    },
    applied: {
      background: neutral[100],
      border: neutral[700],
      text: neutral[700],
    },
  },
  skillCategory: {
    junior: {
      background: magenta[50],
      border: magenta[900],
      text: magenta[900],
    },
    intermediate: {
      background: magenta[100],
      border: magenta[900],
      text: magenta[900],
    },
    senior: {
      background: magenta[500],
      border: magenta[900],
      text: magenta[900],
    },
  },
  border: {
    light: neutral[200],
    main: neutral[800],
  },
};
