# Everlittle deployment modes

Everlittle ships one application with two product policies. `DEPLOYMENT_MODE` changes signup,
onboarding, marketing, billing, and archive-switching capabilities without forking product logic.

## Hosted

Use hosted mode for the multi-tenant service at `geteverlittle.com`.

```text
DEPLOYMENT_MODE=hosted
PUBLIC_APP_URL=https://geteverlittle.com
```

Hosted mode currently:

- allows public adult signup;
- sends each direct signup through resumable family onboarding;
- supports marketing, billing, and multiple-archive surfaces; and
- rejects `DEFAULT_ARCHIVE_SLUG`, because tenant selection must come from the request route.

Family slugs are selected during onboarding and are immutable. This keeps installed PWA routes,
bookmarks, and shared family links stable without requiring slug-history redirects.

## Self-hosted

Use self-hosted mode for one family or a private organization running its own Cloudflare resources.

```text
DEPLOYMENT_MODE=self-hosted
PUBLIC_APP_URL=https://family.example.com
DEFAULT_ARCHIVE_SLUG=your-family
```

Self-hosted mode currently:

- allows the first adult account to bootstrap the installation;
- closes public signup after the first owner exists;
- continues to allow accounts created through valid invitations;
- does not require billing; and
- redirects the signed-in root to `DEFAULT_ARCHIVE_SLUG`, then a remembered or first accessible
  archive as a fallback.

`DEFAULT_ARCHIVE_SLUG` is optional, but recommended for a single-family installation. It must name
an archive the signed-in user can access; it is routing preference, never authorization.

## Capability policy

Application code should consume semantic capabilities from `src/lib/deployment.ts` rather than
checking the raw environment variable in components or route handlers.

| Capability                    | Hosted | Self-hosted |
| ----------------------------- | ------ | ----------- |
| `allowsPublicSignup`          | yes    | no          |
| `allowsInitialOwnerBootstrap` | no     | yes         |
| `supportsMultipleArchives`    | yes    | no          |
| `showsMarketingSite`          | yes    | no          |
| `requiresBilling`             | yes    | no          |

## Runtime validation

The Worker refuses to serve requests when:

- `BETTER_AUTH_SECRET` or the independent `CHILD_PIN_PEPPER` secret is missing;
- `DEPLOYMENT_MODE` is missing or unknown;
- `PUBLIC_APP_URL` is missing, is not an origin, or uses insecure HTTP outside localhost;
- `DEFAULT_ARCHIVE_SLUG` is malformed; or
- hosted mode defines a default archive slug.

`PUBLIC_APP_URL` is the canonical origin used by Better Auth and generated invitation and public
share links. Request host headers are not trusted when creating external URLs.

## Local fixtures

Choose one fixture and copy it to `.dev.vars`:

```sh
cp apps/web/.dev.vars.self-hosted.example apps/web/.dev.vars
```

or:

```sh
cp apps/web/.dev.vars.hosted.example apps/web/.dev.vars
```

Generate unique, independent values for `BETTER_AUTH_SECRET` and `CHILD_PIN_PEPPER` instead of
committing real secrets. D1, R2, email, routes, and custom domains remain Wrangler bindings and
must be configured for each deployment environment. See [`self-hosting.md`](self-hosting.md) for
the production configuration, verification, backup, and downstream update workflow.
