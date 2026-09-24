module.exports = {
    mode: "jit",
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./utils/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./common/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "media",
    theme: {
      colors: {
        transparent: "transparent",
        current: "currentColor",

        // Recruitment platform palette
        black: "#000000",
        white: "#FFFFFF",

        neutral: {
          50: "#F5F5F5",
          100: "#EEEEEE",
          200: "#C4C4C4",
          500: "#737373",
          600: "#2D3748",
          700: "#444444",
          800: "#252525",
          900: "#000000",
        },
        blue: {
          DEFAULT: "#0573E8",
          50: "#F4F9FF",
          100: "#E0F0FF",
          500: "#0573E8",
          600: "#135FC5",
          900: "#003884",
        },
        sky: {
          DEFAULT: "#E0F0FF",
          100: "#E0F0FF",
          200: "#F4F9FF",
          400: "#0573E8",
          500: "#135FC5",
        },
        green: {
          DEFAULT: "#7EAE5A",
          50: "#F5FFF5",
          100: "#CEEBB8",
          200: "#A8D88A",
          500: "#7EAE5A",
          700: "#4F7F2B",
          900: "#006002",
        },
        red: {
          DEFAULT: "#CD5A5A",
          50: "#FFF5F5",
          200: "#F7B9B9",
          500: "#CD5A5A",
          900: "#600002",
        },
        orange: {
          DEFAULT: "#CE812E",
          50: "#FFFCF5",
          100: "#FCE3C2",
          200: "#F7C98A",
          500: "#CE812E",
          900: "#603000",
        },
        yellow: {
          DEFAULT: "#EAB01A",
          50: "#FFF8E9",
          100: "#FFF2A1",
          200: "#FCE588",
          500: "#EAB01A",
          900: "#A45200",
        },
        magenta: {
          DEFAULT: "#CE66FF",
          50: "#FCF5FF",
          100: "#F4DBFF",
          500: "#CE66FF",
          900: "#420060",
        },
        purple: {
          DEFAULT: "#7C3AED",
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          500: "#7C3AED",
          700: "#6D28D9",
          900: "#4C1D95",
        },

        // Semantic tokens (recruitment UI)
        link: "#3279B7",
        icon: "#2E3A59",
        input: "#7D7D7D",
        success: "#00A403",
        error: "#CD5A5A",
        status: {
          interviewed: "#DAD7E9",
        },
        surface: {
          grey: "#F3F4F6",
          muted: "#FAFAFA",
          highlight: "#F1F1F1",
          info: "#F4FAFF",
        },
        alert: {
          errorBorder: "#E9B0B0",
          errorText: "#9F1C1C",
        },

        // Legacy aliases (map to recruitment palette)
        charcoal: {
          DEFAULT: "#252525",
          0: "#FFFFFF",
          100: "#FAFAFA",
          200: "#EEEEEE",
          300: "#C4C4C4",
          400: "#737373",
          500: "#737373",
          600: "#2D3748",
          700: "#000000",
        },
      },
      fontFamily: {
        inter: "Inter, sans-serif",
        poppins: "Poppins, sans-serif",
        source: "'Source Sans Pro', sans-serif",
      },
      extend: {
        gridTemplateColumns: {
          "auto-fit": "repeat(auto-fit, minmax(8rem, 1fr))",
          "auto-fill": "repeat(auto-fill, minmax(8rem, 1fr))",
        },
        backgroundImage: {
          "how-it-works": "url('/landing/how-it-works-background.svg')",
          "nonprofits-md": "url('/nonprofits/hero-background-md.svg')",
          "nonprofits-lg": "url('/nonprofits/hero-background-lg.svg')",
          "students-hero": "url('/students/students-landing-bg.svg')",
          "join-hero": "url('/join/hero-background.svg')",
          "about-us-mission": "url('/about/mission-background.svg')",
          "about-us-circles-md": "url('/about/circle-images-tablet.png')",
          "about-us-circles-lg": "url('/about/circle-images.png')",
        },
        width: {
          120: "30rem",
          160: "40rem",
          240: "60rem",
          card: "calc(100% - 2rem)",
        },
        height: {
          144: "36rem",
        },
        gap: {
          120: "28rem",
        },
      },
    },
    variants: {},
    plugins: [
      require("@tailwindcss/line-clamp"), // Multi-line text truncation
      require("@tailwindcss/forms"), // Form styling
    ],
  };
  