import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const configPath = resolve(process.cwd(), process.argv[2] ?? "wrangler.self-hosted.jsonc");

let source;
try {
  source = await readFile(configPath, "utf8");
} catch {
  fail(
    `Missing ${configPath}. Copy wrangler.self-hosted.example.jsonc to wrangler.self-hosted.jsonc and fill in the deployment-owned values.`,
  );
}

const requiredPatterns = [
  ['"DEPLOYMENT_MODE": "self-hosted"', "DEPLOYMENT_MODE must be self-hosted"],
  ['"BETTER_AUTH_SECRET"', "BETTER_AUTH_SECRET must be declared as a required secret"],
  ['"CHILD_PIN_PEPPER"', "CHILD_PIN_PEPPER must be declared as a required secret"],
  ['"binding": "DB"', "the D1 binding must be named DB"],
  ['"binding": "MEDIA"', "the R2 binding must be named MEDIA"],
  ['"name": "EMAIL"', "the email binding must be named EMAIL"],
];

for (const [pattern, message] of requiredPatterns) {
  if (!source.includes(pattern)) fail(message);
}

for (const placeholder of ["replace-with", "family.example.com", "your-family"]) {
  if (source.includes(placeholder)) fail(`replace the placeholder value containing ${placeholder}`);
}

const publicUrl = source.match(/"PUBLIC_APP_URL"\s*:\s*"([^"]+)"/)?.[1];
if (!publicUrl?.startsWith("https://")) {
  fail("PUBLIC_APP_URL must be the final HTTPS origin for this installation");
}

const route = source.match(/"pattern"\s*:\s*"([^"]+)"/)?.[1];
if (!route) fail("configure a custom-domain route for the installation");
if (new URL(publicUrl).hostname !== route) {
  fail("the custom-domain route must match the PUBLIC_APP_URL hostname");
}

const sender = source.match(/"INVITATION_FROM_EMAIL"\s*:\s*"([^"]+)"/)?.[1];
const allowedSenders = source.match(/"allowed_sender_addresses"\s*:\s*\[([^\]]+)\]/)?.[1];
if (!sender || !allowedSenders?.includes(`"${sender}"`)) {
  fail("INVITATION_FROM_EMAIL must be present in EMAIL.allowed_sender_addresses");
}

console.log(`Self-hosted configuration looks complete: ${configPath}`);

function fail(message) {
  console.error(`Self-hosted configuration error: ${message}`);
  process.exit(1);
}
