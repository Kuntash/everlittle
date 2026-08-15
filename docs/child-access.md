# Child access security

Child access is a parent-managed, child-specific credential. It is intentionally separate from an
adult account and is scoped to one immutable archive ID and child ID.

## PIN storage and compatibility

New PINs use PBKDF2-HMAC-SHA-256 with 120,000 iterations, a random 128-bit salt, and the dedicated
`CHILD_PIN_PEPPER` secret. The stored value is versioned so iteration counts or derivation schemes
can be upgraded without changing the database schema. `CHILD_PIN_PEPPER` must be independent from
`BETTER_AUTH_SECRET` and must never be committed.

Older HMAC-based PIN values remain verifiable during the transition. A successful legacy sign-in
atomically replaces that value with the current versioned derivation. Changing or disabling a PIN
revokes every active child session.

## Attempt controls

Failed attempts are keyed to the family route, selected child, connecting IP, and user-agent signal.
After three failures, requests receive a 15-second lockout; after five, one minute; and after eight,
15 minutes. A successful sign-in starts a fresh failure window. Responses include `Retry-After`
without revealing whether a family, child, or PIN exists.

## Session visibility and future credentials

Parents can see the last child-access time and active-device count, change the PIN, or turn child
access off. The credential is stored as a versioned value and sessions are separate records, leaving
a migration path for passkeys, named trusted devices, and an eventual adult-account transition.
