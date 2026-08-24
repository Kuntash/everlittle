# Graph Report - everlittle  (2026-08-24)

## Corpus Check
- 80 files · ~1,540,976 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2345 nodes · 2871 edges · 201 communities (49 shown, 152 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.67)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `38f24272`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- worker-configuration.d.ts
- archive-api.ts
- getRuntimeEnv
- ServiceWorkerGlobalScope
- Event
- compilerOptions
- scripts
- dependencies
- Console
- TransformStream
- URL
- devDependencies
- URLSearchParams
- scripts
- DurableObjectStorage
- Container
- Element
- Headers
- SubtleCrypto
- Blob
- Body
- FormData
- URLPattern
- DurableObjectState
- WorkerEntrypoint
- domain/package.json
- StreamError
- Flagship
- R2ObjectBody
- compilerOptions
- AgentMemoryProfile
- ByteLengthQueuingStrategy
- WritableStream
- DurableObject
- DurableObjectTransaction
- ReadableStream
- Socket
- WritableStreamDefaultWriter
- AiSearchInstance
- DurableObjectNamespace
- R2Bucket
- SqlStorageCursor
- Vectorize
- ui/package.json
- web/package.json
- Ai
- AiSearchNamespace
- ReadableStreamBYOBReader
- VectorizeIndex
- WorkflowInstance
- AiSearchItem
- AiSearchItems
- Artifacts
- ArtifactsRepo
- D1Database
- D1PreparedStatement
- KVNamespace
- ReadableByteStreamController
- ReadableStreamDefaultReader
- TextDecoder
- AiGateway
- Comment
- DurableObjectFacets
- ForwardableEmailMessage
- HTMLRewriter
- HTMLRewriterDocumentContentHandlers
- ImageHandle
- ReadableStreamBYOBRequest
- ReadableStreamDefaultController
- StreamScopedCaptions
- StreamVideoHandle
- StreamWatermarks
- SyncKvStorage
- Table
- Text
- TextEncoder
- TransformStreamDefaultController
- Everlittle TODO
- router.tsx
- AbortController
- AiSearchJob
- AiSearchJobs
- AutoRAG
- Cache
- Crypto
- D1DatabaseSession
- EndTag
- HostedImagesBinding
- HTMLRewriterElementContentHandlers
- ImageTransformationResult
- ImageTransformer
- MediaTransformationResult
- Module
- Performance
- Queue
- R2MultipartUpload
- Span
- StreamBinding
- StreamScopedDownloads
- WebSocketRequestResponsePair
- Workflow
- WorkflowEntrypoint
- onboarding.tsx
- AgentMemoryNamespace
- BasicImageTransformations
- BrowserRun
- ColoLocalActorNamespace
- StubBase
- DOMException
- DurableObjectId
- ExecProcess
- ExecutionContext
- Global
- HelloWorldBinding
- ImagesBinding
- MediaTransformer
- Memory
- Message
- MessageBatch
- NodeStyleServer
- PipelineTransformationEntrypoint
- RequestInitCfPropertiesVaryHeader
- SqlStorage
- ToMarkdownService
- Tracing
- WorkerLoader
- WorkerStub
- WorkflowStep
- WritableStreamDefaultController
- tsconfig.json
- sw.js
- AnalyticsEngineDataset
- __BaseEnv_Env
- CacheContext
- CacheStorage
- CloudflareAccessContext
- CompileError
- DispatchNamespace
- DocumentEnd
- EventListenerObject
- Hyperdrive
- IncomingRequestCfPropertiesBotManagement
- Instance
- JsonWebKey
- MediaBinding
- MediaTransformationGenerator
- MessageChannel
- Navigator
- NonRetryableError
- Pipeline
- ProcessEnv
- R2Checksums
- RateLimit
- ResponseFunctionToolCall
- RpcTarget
- RuntimeError
- ScheduledController
- Scheduler
- SecretsStoreSecret
- SendEmail
- StreamVideos
- TraceItemFetchEventInfoRequest
- UnsafeTraceMetrics
- WebSearch
- web/vite.config.ts
- Self-hosting Everlittle on Cloudflare
- marketing-home.tsx
- pre-commit
- family_archive
- archive-api-isolation.test.ts
- Tenant-isolation inventory
- Everlittle hosted and self-hosted migration checklist
- Everlittle preliminary trademark knockout search
- invitation-email.ts
- auth-route.tsx
- Everlittle
- index.tsx
- ExtendableEvent
- ErrorEvent
- Everlittle landing design direction
- apply-migrations.ts
- migration-upgrade.test.ts
- Child access security
- check-self-host-config.mjs
- CustomEvent
- CloseEvent
- MessageEvent
- archive-navigation.ts
- MemoryComposer
- server.ts
- getDeploymentConfig
- index.ts
- signInChild

## God Nodes (most connected - your core abstractions)
1. `getRuntimeEnv()` - 44 edges
2. `handleArchiveApi()` - 42 edges
3. `unauthorized()` - 27 edges
4. `getMembershipContext()` - 25 edges
5. `isSameOrigin()` - 25 edges
6. `forbidden()` - 25 edges
7. `Event` - 25 edges
8. `getDeploymentConfig()` - 21 edges
9. `Console` - 21 edges
10. `auditStatement()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `completeOnboarding()` --calls--> `slugify()`  [EXTRACTED]
  apps/web/src/lib/archive-api.ts → packages/domain/src/index.ts
- `createChildProfile()` --calls--> `slugify()`  [EXTRACTED]
  apps/web/src/lib/archive-api.ts → packages/domain/src/index.ts
- `bootstrapFamily()` --calls--> `slugify()`  [EXTRACTED]
  apps/web/src/server.ts → packages/domain/src/index.ts
- `onboarding_draft` --references--> `"user"`  [EXTRACTED]
  apps/web/migrations/0009_onboarding_drafts.sql → apps/web/migrations/0001_foundation.sql
- `"passkey"` --references--> `"user"`  [EXTRACTED]
  apps/web/migrations/0011_adult_account_security.sql → apps/web/migrations/0001_foundation.sql

## Import Cycles
- None detected.

## Communities (201 total, 152 thin omitted)

### Community 0 - "worker-configuration.d.ts"
Cohesion: 0.00
Nodes (848): AgentMemoryGetSummaryOptions, AgentMemoryGetSummaryResponse, AgentMemoryIncomingMemory, AgentMemoryIngestOptions, AgentMemoryListMemoriesOptions, AgentMemoryListMemoriesResult, AgentMemoryMemory, AgentMemoryMemoryListEntry (+840 more)

### Community 1 - "archive-api.ts"
Cohesion: 0.06
Nodes (47): ArchiveStorage, ByteRange, capsuleSchema, ChildAccessContext, childPinSchema, childSchema, childSessionCookie(), decodeFileName() (+39 more)

### Community 2 - "getRuntimeEnv"
Cohesion: 0.32
Nodes (32): acceptInvitationForCurrentUser(), auditStatement(), createCapsule(), createChildProfile(), createInvitation(), createMemory(), createPublicMemoryShare(), deleteCapsule() (+24 more)

### Community 3 - "ServiceWorkerGlobalScope"
Cohesion: 0.04
Nodes (7): AbortSignal, EventSource, EventTarget, MessagePort, ServiceWorkerGlobalScope, WebSocket, WorkerGlobalScope

### Community 5 - "compilerOptions"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+17 more)

### Community 6 - "scripts"
Cohesion: 0.07
Nodes (28): devDependencies, vite-plus, engines, node, license, name, packageManager, private (+20 more)

### Community 7 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, better-auth, @everlittle/domain, @everlittle/ui, @fontsource-variable/cormorant-garamond, @fontsource-variable/geist, @fontsource-variable/geist-mono, lucide-react (+17 more)

### Community 9 - "TransformStream"
Cohesion: 0.10
Nodes (7): CompressionStream, DecompressionStream, FixedLengthStream, IdentityTransformStream, TextDecoderStream, TextEncoderStream, TransformStream

### Community 11 - "devDependencies"
Cohesion: 0.09
Nodes (23): devDependencies, @cloudflare/vite-plugin, @cloudflare/vitest-pool-workers, @tanstack/router-cli, @types/node, @types/react, @types/react-dom, typescript (+15 more)

### Community 13 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, build, build:self-hosted, cf-typegen, db:migrate:hosted, db:migrate:local, db:migrate:remote, db:migrate:self-hosted (+9 more)

### Community 20 - "Body"
Cohesion: 0.15
Nodes (3): Body, Request, Response

### Community 25 - "domain/package.json"
Cohesion: 0.13
Nodes (14): dependencies, zod, devDependencies, typescript, exports, typescript, zod, license (+6 more)

### Community 26 - "StreamError"
Cohesion: 0.18
Nodes (11): AlreadyUploadedError, BadRequestError, ForbiddenError, InternalError, InvalidURLError, MaxFileSizeError, NotFoundError, QuotaReachedError (+3 more)

### Community 29 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noEmit, skipLibCheck, strict, target, include (+1 more)

### Community 31 - "ByteLengthQueuingStrategy"
Cohesion: 0.22
Nodes (3): ByteLengthQueuingStrategy, CountQueuingStrategy, QueuingStrategy

### Community 44 - "ui/package.json"
Cohesion: 0.25
Nodes (7): exports, ./theme.css, license, name, private, type, version

### Community 45 - "web/package.json"
Cohesion: 0.29
Nodes (6): imports, license, name, private, type, version

### Community 78 - "Everlittle TODO"
Cohesion: 0.14
Nodes (13): Current invitation UX gaps, Everlittle TODO, P0 — Claim the reference installation, P1 — Family invitation and ownership handover, P1 — Privacy and durability, P1 — Real archive data, P2 — Child experience, P2 — Deferred account recovery (+5 more)

### Community 103 - "onboarding.tsx"
Cohesion: 0.12
Nodes (13): authClient, PwaInstallContext, shouldOfferPwaInstall(), Draft, Onboarding(), responseMessage(), Route, sections (+5 more)

### Community 105 - "BasicImageTransformations"
Cohesion: 0.67
Nodes (3): BasicImageTransformations, RequestInitCfPropertiesImage, RequestInitCfPropertiesImageDraw

### Community 122 - "RequestInitCfPropertiesVaryHeader"
Cohesion: 0.67
Nodes (3): RequestInitCfPropertiesVaryAcceptHeader, RequestInitCfPropertiesVaryAcceptLanguageHeader, RequestInitCfPropertiesVaryHeader

### Community 168 - "Self-hosting Everlittle on Cloudflare"
Cohesion: 0.06
Nodes (30): Capability policy, Everlittle deployment modes, Hosted, Local fixtures, Runtime validation, Self-hosted, Current founding access, Hosted plans and storage (+22 more)

### Community 169 - "marketing-home.tsx"
Cohesion: 0.11
Nodes (12): Brand(), MarketingHome(), MarketingPricingPage(), waveform, ResetPassword(), ChildSession, Route, PublicChild (+4 more)

### Community 171 - "family_archive"
Cohesion: 0.11
Nodes (25): "account", child_profile, family_archive, family_member, media_asset, memory, "session", time_capsule (+17 more)

### Community 172 - "archive-api-isolation.test.ts"
Cohesion: 0.22
Nodes (4): createFamily(), signUpAccount(), TestAccount, TestFamily

### Community 173 - "Tenant-isolation inventory"
Cohesion: 0.40
Nodes (4): Deployment gate, Query rules, Tenant-isolation inventory, Tenant-owned records

### Community 176 - "Everlittle hosted and self-hosted migration checklist"
Cohesion: 0.12
Nodes (16): Decisions already made, Everlittle hosted and self-hosted migration checklist, Launch gates, Phase 0: Naming and domain, Phase 10: Create `everlittle-dikichoetso`, Phase 11: Migrate `dikichoetso.com`, Phase 12: Operations, privacy, and release readiness, Phase 1: Deployment-mode foundation (+8 more)

### Community 177 - "Everlittle preliminary trademark knockout search"
Cohesion: 0.14
Nodes (13): EverLittle 3D, United States, Everlittle Baby domain, EverLittle Co., United States-facing marketplace use, Everlittle, India, Everlittle preliminary trademark knockout search, Material commercial uses found, Namespace screening update on 2026-08-16 Asia/Kolkata, Practical domain decision (+5 more)

### Community 178 - "invitation-email.ts"
Cohesion: 0.43
Nodes (6): buildInvitationEmail(), escapeHtml(), InvitationEmailInput, roleDescriptions, sendInvitationEmail(), titleCase()

### Community 179 - "auth-route.tsx"
Cohesion: 0.21
Nodes (8): AuthRoute(), safeRedirect(), InvitationPreview, Loading(), PlatformState, Route, Route, Route

### Community 180 - "Everlittle"
Cohesion: 0.15
Nodes (7): Route, Route, Route, Route, Route, Route, Everlittle()

### Community 181 - "index.tsx"
Cohesion: 0.09
Nodes (33): AccessScreen(), apiFetch(), ArchiveApp(), ArchiveMembership, ArchiveState, Capsule, CapsulesView(), Child (+25 more)

### Community 182 - "ExtendableEvent"
Cohesion: 0.17
Nodes (6): EmailEvent, ExtendableEvent, FetchEvent, QueueEvent, ScheduledEvent, TailEvent

### Community 184 - "Everlittle landing design direction"
Cohesion: 0.33
Nodes (5): Design bible, Everlittle landing design direction, Generation prompt spine, Mobile sequence, Web sequence

### Community 189 - "Child access security"
Cohesion: 0.40
Nodes (4): Attempt controls, Child access security, PIN storage and compatibility, Session visibility and future credentials

### Community 195 - "archive-navigation.ts"
Cohesion: 0.50
Nodes (3): ArchiveEntry, resolveArchiveEntry(), ArchiveRedirect()

### Community 196 - "MemoryComposer"
Cohesion: 0.16
Nodes (22): audienceLabel(), CapsuleComposer(), ChildView(), currentLocalDateTime(), defaultCapsuleDate(), formatMediaTime(), formatMemoryDate(), kindLabel() (+14 more)

### Community 197 - "server.ts"
Cohesion: 0.17
Nodes (16): acceptInvitation(), AuthOptions, createAuth(), AuthEmailInput, buildAuthEmail(), escapeHtml(), sendAuthEmail(), bootstrapFamily() (+8 more)

### Community 198 - "getDeploymentConfig"
Cohesion: 0.15
Nodes (18): checkOnboardingSlug(), completeOnboarding(), getOnboarding(), getSessionUser(), isValidBirthDate(), isValidTimezone(), listPublicChildren(), notFound() (+10 more)

### Community 199 - "index.ts"
Cohesion: 0.17
Nodes (11): Audience, audienceSchema, ChildProfile, childSlugSchema, FamilyRole, familyRoleSchema, familySlugSchema, Memory (+3 more)

### Community 200 - "signInChild"
Cohesion: 0.27
Nodes (10): base64UrlToBytes(), bytesToBase64Url(), childPinRetryAfter(), createSecureToken(), deriveChildPin(), hashChildPin(), keyedHash(), safeEqual() (+2 more)

## Knowledge Gaps
- **1120 isolated node(s):** `"verification"`, `child_access_attempt`, `name`, `version`, `private` (+1115 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **152 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `URL` connect `URL` to `worker-configuration.d.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `WebSocket` connect `ServiceWorkerGlobalScope` to `worker-configuration.d.ts`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `ImageHandle` connect `ImageHandle` to `worker-configuration.d.ts`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `"verification"`, `child_access_attempt`, `name` to the rest of the system?**
  _1120 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `worker-configuration.d.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.002347417840375587 - nodes in this community are weakly interconnected._
- **Should `archive-api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06462585034013606 - nodes in this community are weakly interconnected._
- **Should `ServiceWorkerGlobalScope` be split into smaller, more focused modules?**
  _Cohesion score 0.043478260869565216 - nodes in this community are weakly interconnected._