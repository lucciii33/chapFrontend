import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { useMatches } from "@remix-run/react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./stripeConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "~/utils/interceptFetch";
import { useTranslation } from "react-i18next";
import i18n from "i18n"; // ajusta si está en otro lugar

// import resolveConfig from "tailwindcss/resolveConfig";
// import tailwindConfig from "../tailwind.config";
import { GlobalProvider } from "./context/GlobalProvider"; // Importa el GlobalProvider
import Navbar from "./components/navbar";

import "./tailwind.css";
import { useEffect } from "react";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import { CssBaseline } from "@mui/material";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];
// const tailwind = resolveConfig(tailwindConfig);
// const theme = createTheme({
//   palette: {
//     mode: "dark",
//     primary: {
//       main: `${tailwind.theme.colors.blue["500"]} !important`,
//     },
//     secondary: {
//       main: `${tailwind.theme.colors.yellow["500"]} !important`,
//     },
//   },
// });

export function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  console.log("Rutas cargadas:", matches);
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const matches = useMatches();
  console.log("Rutas cargadas:", matches);
  const { t } = useTranslation();

  useEffect(() => {
    // inicia el i18n en frontend
    i18n.init();
  }, []);

  return (
    <GlobalProvider>
      <Elements stripe={stripePromise}>
        <Navbar />
        <Outlet />
        <ToastContainer />
      </Elements>
    </GlobalProvider>
  );
}
