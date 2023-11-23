import React, { useState, useEffect } from "react";
import Routes from "./routes";
import "react-toastify/dist/ReactToastify.css";

import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { ptBR } from "@material-ui/core/locale";

const App = () => {
  const [locale, setLocale] = useState();

  const theme = createTheme(
    {
      palette: {
        type: "dark",
        primary: {
          main: "#0070f0", // Azul oscuro principal
        },
        "grey": {
          "50": "#ffffff",
        },
        secondary: {
          main: "#ffffff", // Blanco
        },
        background: {
          default: "#000000", // Fondo negro
          paper: "#313131" // Fondo de papel ligeramente más claro que el negro
        },
        "action": {

        },
        text: {
          primary: "#ffffff", // Texto principal en blanco
          secondary: "#cccccc" // Texto secundario en gris claro
        },
      },

    },
    locale
  );

  useEffect(() => {
    const i18nlocale = localStorage.getItem("i18nextLng");
    const browserLocale =
      i18nlocale.substring(0, 2) + i18nlocale.substring(3, 5);

    if (browserLocale === "ptBR") {
      setLocale(ptBR);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  );
};

export default App;
