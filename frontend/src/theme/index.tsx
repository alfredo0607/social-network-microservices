/* eslint-disable react-hooks/exhaustive-deps */
// AppTheming.tsx
import { useMemo } from "react";
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
  GlobalStyles as MuiGlobalStyles,
} from "@mui/material";
import typographyTheme from "./typographyTheme";
import shadows from "./shadows";
import AppRouting from "../router";
import { useAuth } from "../context/authContext";

const AppTheming = () => {
  const { mode } = useAuth();

  const lightMode = useMemo(() => {
    const stored = mode === "light" ? true : false;

    return stored;
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: lightMode ? "light" : "dark",

          background: {
            default: lightMode ? "#FAFAFA" : "#000000",
            paper: lightMode ? "#FFFFFF" : "#121212",
          },

          primary: {
            main: "#E1306C", // Pink
            light: "#F77737", // Orange
            dark: "#833AB4", // Purple
            contrastText: "#FFFFFF",
          },

          secondary: {
            main: "#0095F6",
            contrastText: "#FFFFFF",
          },

          error: {
            main: "#ED4956",
          },

          text: {
            primary: lightMode ? "#262626" : "#FFFFFF",
            secondary: lightMode ? "#737373" : "#A8A8A8",
            disabled: lightMode ? "#BDBDBD" : "#6E6E6E",
          },

          divider: lightMode ? "#DBDBDB" : "#262626",
        },

        typography: typographyTheme,
        shadows,
      }),
    [lightMode]
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <MuiGlobalStyles
          styles={(theme) => ({
            "*": {
              boxSizing: "border-box",
              margin: 0,
              padding: 0,

              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor:
                  theme.palette.mode === "light" ? "#C7C7C7" : "#262626",
                borderRadius: 10,
                transition: "background-color .3s ease",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor:
                  theme.palette.mode === "light" ? "#A8A8A8" : "#3A3A3A",
              },
            },

            html: {
              "-webkit-font-smoothing": "antialiased",
              "-moz-osx-font-smoothing": "grayscale",
              height: "100%",
              width: "100%",
            },

            body: {
              backgroundColor: theme.palette.background.default,
              height: "100%",
              width: "100%",
            },

            a: {
              textDecoration: "none",
              color: "inherit",
            },

            "#root": {
              height: "100%",
              width: "100%",
            },
          })}
        />

        <AppRouting />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default AppTheming;
