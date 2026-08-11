import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const buildId = process.env.EVERLITTLE_BUILD_ID ?? hashApplicationSource();

function hashApplicationSource() {
  const hash = createHash("sha256");
  const inputs = ["src", "public", "package.json", "vite.config.ts"];

  function addPath(path: string) {
    const fullPath = join(projectRoot, path);
    if (statSync(fullPath).isDirectory()) {
      for (const child of readdirSync(fullPath).sort()) addPath(join(path, child));
      return;
    }
    if (path.endsWith("routeTree.gen.ts")) return;
    hash.update(relative(projectRoot, fullPath));
    hash.update(readFileSync(fullPath));
  }

  for (const input of inputs) addPath(input);
  return hash.digest("hex").slice(0, 12);
}

function releaseManifest(): Plugin {
  return {
    name: "everlittle-release-manifest",
    apply: "build",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "version.json",
        source: JSON.stringify({ buildId }),
      });
    },
  };
}

export default defineConfig({
  define: { __EVERLITTLE_BUILD_ID__: JSON.stringify(buildId) },
  resolve: { tsconfigPaths: true },
  plugins: [
    releaseManifest(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    viteReact(),
  ],
});
