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
- creates a starter family archive for each direct signup;
- supports the future marketing, billing, and multiple-archive surfaces; and
- rejects `DEFAULT_ARCHIVE_SLUG`, because tenant selection must come from the request route.

The starter archive is transitional. Phase 6 will replace automatic creation with resumable family
onboarding and explicit slug selection.

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
- may define a default archive slug for a future root redirect.

`DEFAULT_ARCHIVE_SLUG` is optional until slug-based routing is implemented.

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

Generate a unique secret instead of committing a real one. D1, R2, email, routes, and custom
domains remain Wrangler bindings and must be configured for each deployment environment.
