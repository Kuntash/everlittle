import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  use: {
    baseURL: "http://localhost:3015",
    channel: process.env.CI ? undefined : "chrome",
    trace: "retain-on-failure",
    // API fixtures must not be bypassed by a previously installed service worker.
    serviceWorkers: "block",
    // A fake microphone that plays a steady tone, for the voice recording tests.
    launchOptions: {
      args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"],
    },
  },
  projects: [
    { name: "tablet", use: { viewport: { width: 820, height: 1180 } } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: {
    command: "node scripts/start-e2e.mjs",
    url: "http://localhost:3015",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
