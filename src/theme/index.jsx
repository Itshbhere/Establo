// components/ThemeWrapper.js
"use client";

import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  keyframes,
  Fab,
} from "@mui/material";
// import Topbar from 'src/layout/_main/topbar/customTopBar';
// import Header from 'src/components/_website/Header';
// import Footer from 'src/layout/_main/footer/customFooter';
// import { Toaster } from 'react-hot-toast';
//import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const colors = {
  white: "#FAFAFA",
  grey: "#F0F0F0",
  whitesmoke: "#F5F5F5",
  black: "#323741",
  red: "#CC3340",
  paynesGrey: "#375E77",
  onyx: "#373E40",
  platinumGrey: "#CDD7D6",
  pureBlack: "#000000",
  blue: "#5043DF",
  darkBlue: "#5010BF",
};

// Helper function for setting opacity on colors
const withOpacity = (color, opacity) => {
  return `${color}${Math.round(opacity * 2.55)
    .toString(16)
    .padStart(2, "0")}`;
};

// Define the scrollText keyframes
const scrollText = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

// Define the theme based on the design system
export const theme = createTheme({
  palette: {
    common: {
      white: colors.white,
      black: colors.black,
      whiteSmoke: "#F5F5F5",
      darkBlue: colors.darkBlue,
    },
    primary: {
      main: colors.blue,
      light: withOpacity(colors.blue, 80),
      dark: withOpacity(colors.blue, 40),
    },
    secondary: {
      main: colors.paynesGrey,
      light: withOpacity(colors.paynesGrey, 80),
      dark: withOpacity(colors.paynesGrey, 40),
    },
    label: {
      main: colors.onyx,
      light: withOpacity(colors.onyx, 80),
      dark: withOpacity(colors.onyx, 40),
    },
    breadCrumbs: {
      main: colors.onyx,
      light: withOpacity(colors.onyx, 80),
      dark: withOpacity(colors.onyx, 40),
    },
    background: {
      default: colors.pureBlack,
      main: colors.pureBlack,
      red: colors.red,
      paper: colors.grey,
      black: colors.black,
      onyx: colors.onyx,
    },
    text: {
      main: colors.white,
      primary: colors.white,
      red: colors.red,
      secondary: colors.grey,
      blue: colors.blue,
      darkBlue: colors.darkBlue,
      white: colors.white,
    },
    customColors: {
      red: colors.red,
      paynesGrey: colors.paynesGrey,
      onyx: colors.onyx,
      platinumGrey: colors.platinumGrey,
    },
  },
  typography: {
    fontFamily: [
      "League Spartan",
      "Hanken Grotesk",
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontFamily: "League Spartan",
      fontSize: "28px",
      lineHeight: "36px",
      fontWeight: 600,
      [`@media (min-width:600px)`]: {
        fontSize: "32px",
        lineHeight: "40px",
        fontWeight: 700,
      },
      [`@media (min-width:960px)`]: {
        fontSize: "36px",
        lineHeight: "44px",
        fontWeight: 700,
      },
    },
    h2: {
      fontFamily: "League Spartan",
      fontSize: "28px",
      fontWeight: 700,
    },
    h3: {
      fontSize: "24px",
      lineHeight: "32px",
      fontWeight: 700,
    },
    // h3: {
    //   fontFamily: 'League Spartan',
    //   fontSize: '30px', // Default for small screens
    //   lineHeight: '40px',
    //   [`@media (min-width:600px)`]: {
    //     fontSize: '36px', // Slightly decrease font size for medium screens (if needed)
    //     lineHeight: '48px', // Adjust line height for medium screens
    //     fontWeight: 500
    //   },
    //   [`@media (min-width:960px)`]: {
    //     fontWeight: 500,
    //     fontSize: '40px', // Keep font size at 40px for larger screens
    //     lineHeight: '52px' // Adjust line height for large screens
    //   }
    // },
    h4: {
      fontSize: "20px",
      lineHeight: "28px",
      fontWeight: 700,
    },
    // h4: {
    //   fontFamily: 'League Spartan',
    //   fontSize: '32px',
    //   lineHeight: '42px',
    //   fontWeight: 500
    // },
    // h5: {
    //   fontFamily: 'League Spartan',
    //   fontSize: '24px',
    //   lineHeight: '32px',
    //   fontWeight: 500
    // },
    h5: {
      fontSize: "16px",
      lineHeight: "24px",
      fontWeight: 700,
    },
    h6: {
      fontSize: "14px",
      lineHeight: "20px",
      fontWeight: 700,
    },
    label: {
      fontFamily: "League Spartan",
      fontSize: "12px",
      fontWeight: 600,
      lineHeight: "16px",
    },
    breadCrumbs: {
      fontFamily: "League Spartan",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "20px",
    },
    subtitle1: {
      fontFamily: "Hanken Grotesk",
      fontSize: "18px",
      fontWeight: 600,
      lineHeight: "24px",
    },
    body1: {
      fontFamily: "Hanken Grotesk",
      fontSize: "16px",
      lineHeight: "24px",
      fontWeight: 400,
    },
    cto: {
      fontFamily: "Hanken Grotesk",
      fontSize: "18px",
      lineHeight: "24px",
      fontWeight: 700,
    },
    link: {
      fontFamily: "Gill",
      fontSize: "16px",
      lineHeight: "26px",
      fontWeight: 600,
    },
    link2: {
      fontFamily: "Hanken Grotesk",
      fontSize: "16px",
      lineHeight: "24px",
      fontWeight: 400,
    },
    navBar: {
      fontFamily: "Hanken Grotesk",
      fontSize: "16px",
      lineHeight: "24px",
      fontWeight: 700,
    },
    topHeader: {
      fontFamily: "Hanken Grotesk",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "24px",
    },
    footer: {
      fontFamily: "Hanken Grotesk",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "24px",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },

    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: "1280px !important",
          width: "100%",
          margin: "0 auto",
          padding: "0 16px !important", // Default padding for all screens
          "@media (min-width: 600px)": {
            padding: "0 24px !important", // Medium screens (e.g., tablets)
          },
          "@media (min-width: 960px)": {
            padding: "0 32px !important", // Large screens (e.g., desktops)
          },
          "@media (min-width: 1280px)": {
            padding: "0 !important", // No padding for extra-large screens
          },
        },
      },
    },

    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: "h1",
          h2: "h2",
          h3: "h3",
          h4: "h4",
          h5: "h5",
          subtitle1: "h6",
          body1: "p",
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        color: "#CC3340", // Custom color for all IconButtons
      },
    },
  },
  // Add the keyframes to the theme
  keyframes: {
    scrollText,
  },
});

export default function ThemeWrapper({ children }) {
  const handleClick = () => {
    window.open("https://wa.me/1234567890", "_blank"); // Replace with your WhatsApp number
  };
  return (
    <ThemeProvider theme={theme}>
      {/* <Toaster />
      <Topbar />
      <Header /> */}
      <CssBaseline />
      <div
        style={{
          backgroundColor: theme.palette.background.main,
          padding: "0 !important",
          margin: "0 !important",
        }}
      >
        {children}
      </div>
      {/* <Footer />
      <Fab
        color="success"
        aria-label="whatsapp"
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: 50,
          right: 30,
          backgroundColor: '#25D366',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1EBE57'
          }
        }}
      >
        <WhatsAppIcon />
      </Fab> */}
    </ThemeProvider>
  );
}
