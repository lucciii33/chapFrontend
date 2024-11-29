import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
// import resolveConfig from "tailwindcss/resolveConfig";
// import tailwindConfig from "../tailwind.config";
import { GlobalProvider } from "./context/GlobalProvider"; // Importa el GlobalProvider
import Navbar from "./components/navbar";

import "./tailwind.css";
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
  return (
    <html lang="en">
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
  return (
    // <ThemeProvider theme={theme}>
    //   <CssBaseline />
    <GlobalProvider>
      {/* <Layout> */}
      <Navbar />
      <Outlet />
      {/* </Layout> */}
    </GlobalProvider>
    // {/* </ThemeProvider> */}
  );
}
