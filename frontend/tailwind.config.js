/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        "primary-main": "#2D5A27",
        "primary-main-dark": "#1E3D1A",
        "primary-main-light": "#4A7C43",
        "primary-muted": "#F8F6F1",
        "secondary-light": "#FAF9F6",
        "secondary-light-dark": "#E8E6E1",
        "secondary-light-2": "#F0EDE8",
        "secondary-dark": "#1A1A1A",
        tertiary: "#2D5A27",
        "tertiary-dark": "#1E3D1A",
        "tertiary-light": "#4A7C43",
        "warm-cream": "#FAF9F6",
        "warm-beige": "#F0EDE8",
        "warm-tan": "#D4CFC7",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
          6: "hsl(var(--chart-6))",
          7: "hsl(var(--chart-7))",
          8: "hsl(var(--chart-8))",
          9: "hsl(var(--chart-9))",
          10: "hsl(var(--chart-10))",
        },
      },
      screens: {
        xsm: "480px",
        xmd: "850px",
      },
      fontFamily: {
        lalezar: ["Lalezar", "sans-serif"],
        coiny: ["Coiny", "serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      backgroundImage: {
        landingPage: "url('./assets/LandingPageBGImage (2).webp')",
        howDoesItWork: "url('./assets/weighing.webp')",
        ourPartners : "url('./assets/meeting.webp')",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
};
