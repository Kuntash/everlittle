# Everlittle www redirect

Small independent Cloudflare Worker that redirects www.geteverlittle.com to https://geteverlittle.com with HTTP 308, preserving path and query parameters.

Deploy from the repository root:

```sh
pnpm --filter @everlittle/web exec wrangler deploy --config ../www-redirect/wrangler.jsonc
```

Deployed 11 September 2026, version `93345649-716a-4563-b68a-2f212016d0d6`. Verified public HTTPS response for `/pricing?utm_source=instagram` is 308 with Location `https://geteverlittle.com/pricing?utm_source=instagram`.

This Worker is independent of the main app release.
