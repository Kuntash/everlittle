# Tenant-isolation inventory

Every authenticated family API resolves the signed-in user and readable family slug to an immutable
`archive_id`. Browser-provided UUIDs are record selectors only and never establish tenant access.

## Tenant-owned records

| Record                 | Archive boundary                            | Additional boundary                                           |
| ---------------------- | ------------------------------------------- | ------------------------------------------------------------- |
| `family_archive`       | immutable `id` resolved from the route slug | membership required                                           |
| `family_member`        | direct `archive_id`                         | role checks for owner-only mutations                          |
| `family_invitation`    | direct `archive_id`                         | unique, hashed, expiring token for acceptance                 |
| `child_profile`        | direct `archive_id`                         | child slug resolved inside the archive                        |
| `child_access_session` | direct `archive_id`                         | child ID and hashed session token                             |
| `memory`               | direct `archive_id`                         | child must belong to the same archive                         |
| `media_asset`          | direct `archive_id`                         | memory must match; R2 key starts with `archives/{archiveId}/` |
| `time_capsule`         | direct `archive_id`                         | child must match; unlock date enforced server-side            |
| `memory_public_share`  | direct `archive_id`                         | one hashed token authorizes one memory only                   |
| `audit_event`          | direct `archive_id`                         | actor may be null after account deletion                      |

`onboarding_draft` is user-scoped rather than archive-scoped because it exists before a family is
created. Child sign-in attempts are keyed with a secret hash of family slug, child slug, IP, and
device signal and contain no family content.

## Query rules

- Reads, updates, and deletes repeat `archive_id` anywhere a tenant record ID is accepted.
- Child and memory joins require both the record ID and matching archive ID.
- Database triggers reject cross-archive memory, media, capsule, child-session, and public-share
  relationships even if application code regresses.
- R2 objects are fetched only after authorized D1 metadata lookup. New objects use the
  `archives/{archiveId}/{memoryId}/{assetId}.{extension}` prefix.
- Invitation and public-share preview routes are intentionally token-scoped. Their token hashes are
  globally unique, so a valid token resolves to exactly one archive and one intended resource.

## Deployment gate

`pnpm ready` runs the Cloudflare Workers Vitest suite before building. The suite applies real D1
migrations in isolated local Worker storage and covers cross-family reads, writes, media, members,
invitations, public shares, schema guards, migration backfill, and owner/parent/contributor/viewer/
child permissions.
