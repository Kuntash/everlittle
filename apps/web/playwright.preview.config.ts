import base from "./playwright.config";
import { defineConfig } from "@playwright/test";
// Runs the end-to-end tests against an already running local preview build on port 3015.
export default defineConfig({
  ...base,
  use: { ...base.use, channel: undefined },
  webServer: undefined,
});
