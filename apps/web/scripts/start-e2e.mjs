import { spawn, spawnSync } from "node:child_process";
// Use only the dedicated local test bindings; never run against remote data.
for (const args of [
  [
    "exec",
    "wrangler",
    "d1",
    "migrations",
    "apply",
    "DB",
    "--local",
    "--config",
    "wrangler.e2e.jsonc",
  ],
  [
    "exec",
    "wrangler",
    "d1",
    "execute",
    "DB",
    "--local",
    "--config",
    "wrangler.e2e.jsonc",
    "--command",
    "INSERT OR IGNORE INTO family_archive (id,name,slug) VALUES ('e2e-family','Test Family','test-family')",
  ],
]) {
  const result = spawnSync("pnpm", args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
const child = spawn("pnpm", ["dev"], {
  stdio: "inherit",
  env: {
    ...process.env,
    BETTER_AUTH_SECRET: "local-test-secret-never-use-in-production",
    CHILD_PIN_PEPPER: "local-test-pin-pepper-never-use-in-production",
    EVERLITTLE_WRANGLER_CONFIG: "wrangler.e2e.jsonc",
  },
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 0));
