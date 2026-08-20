# Self-hosting Everlittle on Cloudflare

Everlittle's supported self-hosted shape is one private installation backed by its own Cloudflare
Worker, D1 database, R2 bucket, email sender, secrets, and custom domain. The application code stays
upstream; installation-specific identifiers and operations stay in the downstream deployment
repository.

This is a manual, auditable deployment path. It is not a one-click Cloudflare template.

## Prerequisites

- Node.js 22.12 or newer and pnpm 11;
- a Cloudflare account with Workers, D1, R2, and Email Sending available;
- a domain in Cloudflare for the application and its verified sender address; and
- Wrangler authenticated with `pnpm --filter @everlittle/web exec wrangler login`.

Use a separate production Cloudflare account or narrowly scoped API token where practical. The
operator is responsible for backups, data residency, consent, retention, and child-safety rules in
their jurisdiction.

## 1. Install and create the resources

```sh
pnpm install
pnpm --filter @everlittle/web exec wrangler d1 create everlittle-family-db
pnpm --filter @everlittle/web exec wrangler r2 bucket create everlittle-family-media
```

Keep the D1 database ID returned by Wrangler.

## 2. Create the deployment configuration

```sh
cp apps/web/wrangler.self-hosted.example.jsonc apps/web/wrangler.self-hosted.jsonc
```

Edit `apps/web/wrangler.self-hosted.jsonc` and replace every example value. In particular:

- give the Worker, D1 database, and R2 bucket installation-specific names;
- paste the D1 database ID;
- set the final custom domain and matching `PUBLIC_APP_URL`;
- choose an immutable `DEFAULT_ARCHIVE_SLUG`, such as `choetso-family`;
- configure a verified `INVITATION_FROM_EMAIL` and the same allowed sender; and
- optionally set `APP_NAME`, which is used by email, passkeys, and authenticator apps.

The real configuration is ignored by the canonical repository so infrastructure IDs do not enter
upstream commits. A private downstream repository may deliberately track it with
`git add -f apps/web/wrangler.self-hosted.jsonc`.

## 3. Add independent secrets

Generate two different random values of at least 32 bytes. Enter them interactively so they do not
appear in shell history:

```sh
pnpm --filter @everlittle/web exec wrangler secret put BETTER_AUTH_SECRET --config wrangler.self-hosted.jsonc
pnpm --filter @everlittle/web exec wrangler secret put CHILD_PIN_PEPPER --config wrangler.self-hosted.jsonc
```

Never reuse these values across installations. Changing `BETTER_AUTH_SECRET` invalidates adult
authentication; changing `CHILD_PIN_PEPPER` invalidates stored child PIN verification.

## 4. Validate, migrate, and deploy

Run these commands from the repository root:

```sh
pnpm self-host:check
pnpm db:migrate:self-hosted
pnpm deploy:self-hosted
```

The check validates the deployment contract, builds against the self-hosted bindings, and asks
Wrangler to perform a dry-run bundle. Migrations are forward-only and must succeed before the new
Worker is deployed.

Open the final HTTPS URL. The first adult signup becomes the installation owner and bootstraps the
archive. Public signup then closes; additional adults must use invitations from the Family screen.

## Local development

```sh
cp apps/web/.dev.vars.self-hosted.example apps/web/.dev.vars
pnpm db:migrate:local
pnpm dev
```

Replace the fixture secrets before using real data. Local development uses local D1 and R2 state;
it does not need the production resource IDs.

## Back up before an upgrade

Create the destination directory first, then export D1 from `apps/web`:

```sh
pnpm --filter @everlittle/web exec wrangler d1 export DB --remote --config wrangler.self-hosted.jsonc --output ../../backups/everlittle-before-upgrade.sql
pnpm --filter @everlittle/web exec wrangler versions list --config wrangler.self-hosted.jsonc
```

D1 export does not back up R2. Use an R2-compatible copy or sync tool to copy the private media
bucket to independent storage, and periodically rehearse restoring both database and media into
disposable resources.

## Keep Dikichoetso downstream

The downstream repository should contain only deployment configuration, private operational
notes, and any private migration data. Product changes should land in `everlittle` first.

Configure the remotes once in the downstream checkout:

```sh
git remote rename origin deployment
git remote add upstream https://github.com/OWNER/everlittle.git
git fetch upstream --tags
```

For each release, record the exact upstream tag or commit, back up D1 and R2, then merge that known
version and run the same validation sequence:

```sh
git fetch upstream --tags
git merge --ff-only UPSTREAM_TAG_OR_COMMIT
pnpm install --frozen-lockfile
pnpm self-host:check
pnpm db:migrate:self-hosted
pnpm deploy:self-hosted
```

If the downstream repository has its own commits, use a regular reviewed merge instead of
`--ff-only`. Do not resolve product conflicts by editing only the private copy; send the generic fix
upstream and consume it back downstream.

To roll back Worker code, choose a previous ID from `wrangler versions list` and run:

```sh
pnpm --filter @everlittle/web exec wrangler rollback VERSION_ID --config wrangler.self-hosted.jsonc
```

A Worker rollback does not reverse D1 migrations. Database migrations in this repository must stay
backward compatible across the rollback window; restoring a database requires a separately tested
recovery procedure.

## Self-hosting contract

The Worker expects these exact binding names:

| Name                 | Kind   | Purpose                                                        |
| -------------------- | ------ | -------------------------------------------------------------- |
| `DB`                 | D1     | users, sessions, archives, memories, invitations, and metadata |
| `MEDIA`              | R2     | private photos, audio, and video                               |
| `EMAIL`              | Email  | verification, recovery, and invitation messages                |
| `BETTER_AUTH_SECRET` | secret | adult authentication signing and encryption                    |
| `CHILD_PIN_PEPPER`   | secret | independent child-PIN protection                               |

`DEPLOYMENT_MODE=self-hosted`, `PUBLIC_APP_URL`, and `DEFAULT_ARCHIVE_SLUG` complete the runtime
policy. Self-hosted root responses and all archive routes are private, non-indexable, and
non-cacheable.
