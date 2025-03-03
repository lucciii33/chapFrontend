import type { AppConfig } from "@remix-run/dev";

const config: AppConfig = {
  server: "./server.js",
  serverBuildPath: "build/server.js",
  ignoredRouteFiles: ["**/.*"],
};

export default config;
