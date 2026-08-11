import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const buildId =
  process.env.GITHUB_SHA ?? process.env.CF_VERSION_METADATA_ID ?? Date.now().toString(36);

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
