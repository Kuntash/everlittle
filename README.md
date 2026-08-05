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
3. The first successful signup bootstraps a family archive and owner membership.
4. Public signup closes after the owner exists; additional adults should join through invitations.
5. Child profiles use parent-managed access rather than public email accounts.

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
```

## Validation

```sh
pnpm typecheck
pnpm build
pnpm ready
```

## Deployment

1. Create a D1 database and R2 bucket.
2. Replace the placeholder resource identifiers in `apps/web/wrangler.jsonc`.
3. Apply migrations with `pnpm db:migrate:remote`.
4. Add `BETTER_AUTH_SECRET` with `wrangler secret put BETTER_AUTH_SECRET`.
5. Deploy with `pnpm --filter @everlittle/web deploy`.

## Privacy posture

Everlittle is designed as a private family archive, not a social network. Deployers are responsible
for access control, data residency, backups, consent, retention, and child-safety requirements in
their jurisdiction. Media objects should remain private and be served through authorized,
short-lived requests.

## License

[MIT](LICENSE)
