# Graph Report - everlittle  (2026-09-07)

## Corpus Check
- 117 files · ~2,159,699 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2549 nodes · 3248 edges · 219 communities (63 shown, 156 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d89c2a34`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- worker-configuration.d.ts
- archive-api.ts
- scripts
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
- onboarding.tsx
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
- Q: How would you market this to get the initial customers as fast as possible? Which funnels? Organic might take too much time
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
- AccessScreen
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
- setup-dodo-test.mjs
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
- memoryIcon
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
- web/package.json
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
- Q: How should public SEO landing pages integrate with the existing SSR routing, metadata, sitemap, server indexability, and marketing styles?
- CompileError
- RuntimeError
- Everlittle — Living Scrapbook redesign handoff
- __root.tsx
- 12. Continuation log — keep this current
- @fontsource-variable/cormorant-garamond
- 0014_dodo_billing.sql
- lucide-react
- @tanstack/react-router
- living-scrapbook-redesign-handoff.md
- Final generation prompts
- scopedApiPath
- Q: How should PostHog campaign attribution and conversion events integrate with signup, onboarding, memory creation, and billing?
- Q: Make sure icon-512.png is actually the logo on the landing page and not something else
- Everlittle product design options
- 9. Step-by-step execution plan
- FamilySettings
- audio-waveform.ts
- 1. User decisions and scope

## God Nodes (most connected - your core abstractions)
1. `getRuntimeEnv()` - 46 edges
2. `handleArchiveApi()` - 44 edges
3. `unauthorized()` - 29 edges
4. `getMembershipContext()` - 27 edges
5. `isSameOrigin()` - 27 edges
6. `forbidden()` - 27 edges
7. `Event` - 25 edges
8. `getDeploymentConfig()` - 23 edges
9. `Console` - 21 edges
10. `auditStatement()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `bootstrapFamily()` --calls--> `slugify()`  [EXTRACTED]
  apps/web/src/server.ts → packages/domain/src/index.ts
- `memoryIcon()` --indirect_call--> `Star()`  [INFERRED]
  apps/web/src/routes/index.tsx → apps/web/src/components/marketing-home.tsx
- `completeOnboarding()` --calls--> `slugify()`  [EXTRACTED]
  apps/web/src/lib/archive-api.ts → packages/domain/src/index.ts
- `createChildProfile()` --calls--> `slugify()`  [EXTRACTED]
  apps/web/src/lib/archive-api.ts → packages/domain/src/index.ts
- `onboarding_draft` --references--> `"user"`  [EXTRACTED]
  apps/web/migrations/0009_onboarding_drafts.sql → apps/web/migrations/0001_foundation.sql

## Import Cycles
- None detected.

## Communities (219 total, 156 thin omitted)

### Community 0 - "worker-configuration.d.ts"
Cohesion: 0.00
Nodes (848): AgentMemoryGetSummaryOptions, AgentMemoryGetSummaryResponse, AgentMemoryIncomingMemory, AgentMemoryIngestOptions, AgentMemoryListMemoriesOptions, AgentMemoryListMemoriesResult, AgentMemoryMemory, AgentMemoryMemoryListEntry (+840 more)

### Community 1 - "archive-api.ts"
Cohesion: 0.06
Nodes (124): acceptInvitation(), acceptInvitationForCurrentUser(), ArchiveStorage, auditStatement(), base64UrlToBytes(), billingCheckoutSchema, ByteRange, bytesToBase64Url() (+116 more)

### Community 2 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, billing:setup:test, build, build:self-hosted, cf-typegen, db:migrate:hosted, db:migrate:local, db:migrate:remote (+10 more)

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
Cohesion: 0.07
Nodes (27): dependencies, better-auth, dodopayments, @everlittle/domain, @everlittle/ui, @fontsource-variable/geist, @fontsource-variable/geist-mono, posthog-js (+19 more)

### Community 9 - "TransformStream"
Cohesion: 0.10
Nodes (7): CompressionStream, DecompressionStream, FixedLengthStream, IdentityTransformStream, TextDecoderStream, TextEncoderStream, TransformStream

### Community 11 - "devDependencies"
Cohesion: 0.09
Nodes (23): devDependencies, @cloudflare/vite-plugin, @cloudflare/vitest-pool-workers, @tanstack/router-cli, @types/node, @types/react, @types/react-dom, typescript (+15 more)

### Community 13 - "onboarding.tsx"
Cohesion: 0.06
Nodes (34): Brand(), MarketingHome(), MarketingPricingPage(), waveform, PasswordInput(), PasswordInputProps, ResetPassword(), waveform (+26 more)

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

### Community 45 - "Q: How would you market this to get the initial customers as fast as possible? Which funnels? Organic might take too much time"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How would you market this to get the initial customers as fast as possible? Which funnels? Organic might take too much time, Source Nodes

### Community 78 - "Everlittle TODO"
Cohesion: 0.14
Nodes (13): Current invitation UX gaps, Everlittle TODO, P0 — Claim the reference installation, P1 — Family invitation and ownership handover, P1 — Privacy and durability, P1 — Real archive data, P2 — Child experience, P2 — Deferred account recovery (+5 more)

### Community 103 - "AccessScreen"
Cohesion: 0.25
Nodes (7): AuthClientError, isExistingAccountError(), AccessScreen(), InvitationAcceptance(), requestedRedirect(), roleDescription(), roleLabel()

### Community 105 - "BasicImageTransformations"
Cohesion: 0.67
Nodes (3): BasicImageTransformations, RequestInitCfPropertiesImage, RequestInitCfPropertiesImageDraw

### Community 122 - "RequestInitCfPropertiesVaryHeader"
Cohesion: 0.67
Nodes (3): RequestInitCfPropertiesVaryAcceptHeader, RequestInitCfPropertiesVaryAcceptLanguageHeader, RequestInitCfPropertiesVaryHeader

### Community 138 - "setup-dodo-test.mjs"
Cohesion: 0.22
Nodes (8): assertProductConfiguration(), client, cloudflareSecrets, ensureProduct(), products, upload, variables, WEBHOOK_EVENTS

### Community 157 - "memoryIcon"
Cohesion: 0.22
Nodes (10): Star(), Kind, memoryPaper(), papers, audienceLabel(), kindLabel(), memoryIcon(), MemoryNote() (+2 more)

### Community 168 - "Self-hosting Everlittle on Cloudflare"
Cohesion: 0.06
Nodes (31): Capability policy, Everlittle deployment modes, Hosted, Local fixtures, Runtime validation, Self-hosted, Current founding access, Dodo Payments boundary (+23 more)

### Community 169 - "web/package.json"
Cohesion: 0.29
Nodes (6): imports, license, name, private, type, version

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
Cohesion: 0.18
Nodes (9): AuthRoute(), safeRedirect(), authClient, InvitationPreview, Loading(), PlatformState, Route, Route (+1 more)

### Community 180 - "Everlittle"
Cohesion: 0.15
Nodes (7): Route, Route, Route, Route, Route, Route, Everlittle()

### Community 181 - "index.tsx"
Cohesion: 0.09
Nodes (19): ArchiveTabs(), destinations, View, ScrapbookHome(), ArchiveMembership, ArchiveState, BillingDestination, Capsule (+11 more)

### Community 182 - "ExtendableEvent"
Cohesion: 0.17
Nodes (6): EmailEvent, ExtendableEvent, FetchEvent, QueueEvent, ScheduledEvent, TailEvent

### Community 184 - "Everlittle landing design direction"
Cohesion: 0.40
Nodes (5): Design bible, Everlittle landing design direction, Generation prompt spine, Mobile sequence, Web sequence

### Community 189 - "Child access security"
Cohesion: 0.40
Nodes (4): Attempt controls, Child access security, PIN storage and compatibility, Session visibility and future credentials

### Community 195 - "archive-navigation.ts"
Cohesion: 0.50
Nodes (3): ArchiveEntry, resolveArchiveEntry(), ArchiveRedirect()

### Community 196 - "MemoryComposer"
Cohesion: 0.25
Nodes (16): apiFetch(), CapsuleComposer(), CapsulesView(), ChildArchiveApp(), currentLocalDateTime(), defaultCapsuleDate(), memoryBodyPlaceholder(), MemoryComposer() (+8 more)

### Community 197 - "server.ts"
Cohesion: 0.07
Nodes (44): AuthOptions, createAuth(), AuthEmailInput, buildAuthEmail(), escapeHtml(), sendAuthEmail(), DEPLOYMENT_MODES, DeploymentConfig (+36 more)

### Community 198 - "Q: How should public SEO landing pages integrate with the existing SSR routing, metadata, sitemap, server indexability, and marketing styles?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How should public SEO landing pages integrate with the existing SSR routing, metadata, sitemap, server indexability, and marketing styles?, Source Nodes

### Community 201 - "Everlittle — Living Scrapbook redesign handoff"
Cohesion: 0.15
Nodes (13): 10. Verification and acceptance, 11. Mandatory rollout: hosted geteverlittle AND Dikichoetso, 2. Existing references and evidence, 3. Visual system — warm paper, clear structure, 4. Navigation — approved horizontal folder tabs, 5. US audience content and imagery, 6. Product coverage and behavioral requirements, 7. Motion specification — app and landing page (+5 more)

### Community 202 - "__root.tsx"
Cohesion: 0.15
Nodes (16): AnalyticsConfig, AnalyticsProvider(), resolveMarketingAttribution(), Toaster(), analyticsPath(), MARKETING_ATTRIBUTION_STORAGE_KEY, marketingAttribution, readMarketingAttribution() (+8 more)

### Community 203 - "12. Continuation log — keep this current"
Cohesion: 0.20
Nodes (10): 12. Continuation log — keep this current, Completed, Final release record — verified September 7, 2026, In progress / not yet released, Next-thread status template, Outstanding decisions / evidence, Release validation — September 6, 2026, September 6, 2026 — resumed through codex-alt (+2 more)

### Community 208 - "living-scrapbook-redesign-handoff.md"
Cohesion: 0.25
Nodes (4): Interaction references, Living Scrapbook visual and interaction review, Verification, Visual evidence

### Community 210 - "Final generation prompts"
Cohesion: 0.25
Nodes (7): A — Paper index, B — Folder tabs, Compare, Files, Final generation prompts, Living Scrapbook — navigation and mobile refinement, Mobile

### Community 211 - "scopedApiPath"
Cohesion: 0.28
Nodes (9): ArchiveApp(), currentArchiveView(), currentFamilySlug(), formatMediaTime(), formatMemoryDate(), MemoryMedia(), scopedApiPath(), SecureAudioPlayer() (+1 more)

### Community 212 - "Q: How should PostHog campaign attribution and conversion events integrate with signup, onboarding, memory creation, and billing?"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: How should PostHog campaign attribution and conversion events integrate with signup, onboarding, memory creation, and billing?, Source Nodes

### Community 213 - "Q: Make sure icon-512.png is actually the logo on the landing page and not something else"
Cohesion: 0.40
Nodes (4): Answer, Outcome, Q: Make sure icon-512.png is actually the logo on the landing page and not something else, Source Nodes

### Community 214 - "Everlittle product design options"
Cohesion: 0.25
Nodes (8): 01-quiet-heirloom, 02-living-scrapbook, 03-everyday-companion, Audit and limits, Corrections before implementation, Everlittle product design options, Final prompts, Recommendation

### Community 215 - "9. Step-by-step execution plan"
Cohesion: 0.25
Nodes (8): 9. Step-by-step execution plan, Phase 0 — resume and verify, Phase 1 — revised visual checkpoint, Phase 2 — shared foundations, Phase 3 — app first, Phase 4 — public pages and motion, Phase 5 — validation and review, Phase 6 — release both installations

### Community 216 - "FamilySettings"
Cohesion: 0.33
Nodes (7): billingStatusDetail(), billingStatusTitle(), FamilySettings(), formatDate(), formatDateTime(), formatFileSize(), initials()

### Community 217 - "audio-waveform.ts"
Cohesion: 0.53
Nodes (4): FALLBACK_WAVEFORM, Waveform, waveformFromAudio(), waveformFromChannels()

### Community 218 - "1. User decisions and scope"
Cohesion: 0.67
Nodes (3): 1. User decisions and scope, Accepted direction, Not approved or implied

## Knowledge Gaps
- **1204 isolated node(s):** `"verification"`, `child_access_attempt`, `billing_webhook_event`, `name`, `version` (+1199 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **156 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `FormData` connect `FormData` to `worker-configuration.d.ts`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `ReadableStream` connect `ReadableStream` to `worker-configuration.d.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `WritableStreamDefaultWriter` connect `WritableStreamDefaultWriter` to `worker-configuration.d.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `"verification"`, `child_access_attempt`, `billing_webhook_event` to the rest of the system?**
  _1204 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `worker-configuration.d.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.002347417840375587 - nodes in this community are weakly interconnected._
- **Should `archive-api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05777616279069767 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._