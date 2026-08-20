import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-pool-workers";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "#": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    cloudflareTest(async () => ({
      main: "./test/worker.ts",
      miniflare: {
        bindings: {
          APP_NAME: "Everlittle",
          BETTER_AUTH_SECRET: "test-secret-at-least-32-characters-long",
          CHILD_PIN_PEPPER: "independent-test-pin-pepper-at-least-32-characters",
          DEPLOYMENT_MODE: "hosted",
          INVITATION_FROM_EMAIL: "invites@example.com",
          PUBLIC_APP_URL: "http://localhost:3000",
          TEST_MIGRATIONS: await readD1Migrations(
            fileURLToPath(new URL("./migrations", import.meta.url)),
          ),
        },
        compatibilityDate: "2026-08-18",
        compatibilityFlags: ["nodejs_compat"],
        d1Databases: ["DB", "UPGRADE_DB"],
        r2Buckets: ["MEDIA"],
      },
    })),
  ],
  test: {
    setupFiles: ["./test/apply-migrations.ts"],
  },
});
