# Everlittle

> A place for the memories they’ll grow into.

Everlittle is an open-source, mobile-first family memory archive. Parents and trusted family can
keep photographs, stories, voice notes, milestones, and letters that unlock later. Children receive
a calmer, age-appropriate view of the story their family kept for them.

## What is in this repository

- `apps/web` — TanStack Start application targeting Cloudflare Workers
- `packages/domain` — shared family, memory, and audience types
- `packages/ui` — the Everlittle design tokens
- `assets/design` — canonical mobile UI reference sheets

The workspace follows the Vite+ and pnpm monorepo shape used by `ai-native-portfolio`.

### Design references

- [`everlittle-mobile-flow.png`](assets/design/everlittle-mobile-flow.png) — core capture flow
- [`everlittle-auth-flow.png`](assets/design/everlittle-auth-flow.png) — Better Auth access flow
- [`everlittle-parent-flow.png`](assets/design/everlittle-parent-flow.png) — parent experience
- [`everlittle-child-flow.png`](assets/design/everlittle-child-flow.png) — child experience

## Product surfaces

- **Parent view:** capture memories, curate the timeline, write future capsules, and manage family
  access.
- **Child view:** read and listen to unlocked memories without receiving an email-based account.
- **Family contributors:** invitation-only access with limited permissions.
- **Installable app:** web app manifest, standalone mode, safe-area layout, Apple touch icon, and a
  small offline shell are included.

## Authentication

Everlittle uses [Better Auth](https://www.better-auth.com/) with the same self-hosted pattern as the
THS school-management system:

1. Better Auth runs inside the TanStack Start server entry.
2. Users and sessions are stored in Cloudflare D1.
3. In self-hosted mode, the first successful signup bootstraps a family archive and owner
   membership.
4. In hosted mode, public signup continues into resumable family and child onboarding.
5. Self-hosted public signup closes after the owner exists; additional adults join through
   invitations.
6. Child profiles use parent-managed access rather than public email accounts.

The invitation and child-PIN interfaces are represented in the schema and design references; their
server endpoints are the next implementation milestone.

## Local development

Requirements: Node.js 22.12+, pnpm 11, and a Cloudflare account for deployed D1/R2 resources.

```sh
pnpm install
cp apps/web/.dev.vars.example apps/web/.dev.vars
pnpm db:migrate:local
pnpm dev
```

Use a strong local secret in `apps/web/.dev.vars`:

```text
BETTER_AUTH_SECRET=at-least-32-random-characters
CHILD_PIN_PEPPER=a-different-random-secret-at-least-32-characters
DEPLOYMENT_MODE=self-hosted
PUBLIC_APP_URL=http://localhost:3000
```

See [`docs/deployment-modes.md`](docs/deployment-modes.md) for hosted and self-hosted policy,
validation, and configuration fixtures.

## Validation

```sh
pnpm typecheck
pnpm build
pnpm ready
```

## Deployment

The canonical repository contains the hosted Everlittle environment and safe placeholder defaults
for local or self-hosted use.

```sh
pnpm db:migrate:hosted
pnpm deploy:hosted
```

Installation-specific domains, Cloudflare resource IDs, bootstrap data, and operational scripts
belong in the installation's deployment repository rather than this canonical product repository.

For another self-hosted installation:

1. Create a D1 database and private R2 bucket.
2. Create a deployment-owned Wrangler configuration with its resource identifiers and custom
   domain.
3. Apply migrations against that environment.
4. Add unique, independent `BETTER_AUTH_SECRET` and `CHILD_PIN_PEPPER` values with
   `wrangler secret put`.
5. Build with the deployment configuration and deploy the generated Worker configuration.

## Privacy posture

Everlittle is designed as a private family archive, not a social network. Deployers are responsible
for access control, data residency, backups, consent, retention, and child-safety requirements in
their jurisdiction. Media objects should remain private and be served through authorized,
short-lived requests.

## License

[MIT](LICENSE)
