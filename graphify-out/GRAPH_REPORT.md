# Graph Report - everlittle  (2026-08-14)

## Corpus Check
- 44 files · ~401,183 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2195 nodes · 2638 edges · 179 communities (33 shown, 146 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.55)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f7227c40`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- worker-configuration.d.ts
- archive-api.ts
- index.tsx
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
- __root.tsx
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
- Everlittle
- zod
- pre-commit
- family_archive
- Everlittle hosted and self-hosted migration checklist
- Everlittle preliminary trademark knockout search
- invitation-email.ts

## God Nodes (most connected - your core abstractions)
1. `getRuntimeEnv()` - 41 edges
2. `handleArchiveApi()` - 37 edges
3. `unauthorized()` - 26 edges
4. `Event` - 25 edges
5. `getMembershipContext()` - 23 edges
6. `isSameOrigin()` - 23 edges
7. `forbidden()` - 23 edges
8. `Console` - 21 edges
9. `auditStatement()` - 19 edges
10. `getDeploymentConfig()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `completeOnboarding()` --calls--> `slugify()`  [EXTRACTED]
  apps/web/src/lib/archive-api.ts → packages/domain/src/index.ts
- `createChildProfile()` --calls--> `slugify()`  [EXTRACTED]
  apps/web/src/lib/archive-api.ts → packages/domain/src/index.ts
- `bootstrapFamily()` --calls--> `slugify()`  [EXTRACTED]
  apps/web/src/server.ts → packages/domain/src/index.ts
- `onboarding_draft` --references--> `"user"`  [EXTRACTED]
  apps/web/migrations/0009_onboarding_drafts.sql → apps/web/migrations/0001_foundation.sql
- `child_access_session` --references--> `child_profile`  [EXTRACTED]
  apps/web/migrations/0005_child_access.sql → apps/web/migrations/0001_foundation.sql

## Import Cycles
- None detected.

## Communities (179 total, 146 thin omitted)

### Community 0 - "worker-configuration.d.ts"
Cohesion: 0.00
Nodes (848): AgentMemoryGetSummaryOptions, AgentMemoryGetSummaryResponse, AgentMemoryIncomingMemory, AgentMemoryIngestOptions, AgentMemoryListMemoriesOptions, AgentMemoryListMemoriesResult, AgentMemoryMemory, AgentMemoryMemoryListEntry (+840 more)

### Community 1 - "archive-api.ts"
Cohesion: 0.06
Nodes (109): acceptInvitation(), acceptInvitationForCurrentUser(), auditStatement(), capsuleSchema, checkOnboardingSlug(), ChildAccessContext, childPinSchema, childSchema (+101 more)

### Community 2 - "index.tsx"
Cohesion: 0.05
Nodes (68): authClient, ChildSession, Route, PublicChild, Route, Route, AccessScreen(), apiFetch() (+60 more)

### Community 3 - "ServiceWorkerGlobalScope"
Cohesion: 0.04
Nodes (7): AbortSignal, EventSource, EventTarget, MessagePort, ServiceWorkerGlobalScope, WebSocket, WorkerGlobalScope

### Community 4 - "Event"
Cohesion: 0.04
Nodes (12): CloseEvent, CustomEvent, EmailEvent, ErrorEvent, Event, ExtendableEvent, FetchEvent, MessageEvent (+4 more)

### Community 5 - "compilerOptions"
Cohesion: 0.08
Nodes (24): compilerOptions, allowImportingTsExtensions, jsx, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch (+16 more)

### Community 6 - "scripts"
Cohesion: 0.08
Nodes (25): devDependencies, vite-plus, engines, node, license, name, packageManager, private (+17 more)

### Community 7 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, better-auth, @everlittle/domain, @everlittle/ui, @fontsource-variable/cormorant-garamond, @fontsource-variable/inter, lucide-react, react (+13 more)

### Community 9 - "TransformStream"
Cohesion: 0.10
Nodes (7): CompressionStream, DecompressionStream, FixedLengthStream, IdentityTransformStream, TextDecoderStream, TextEncoderStream, TransformStream

### Community 11 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, @cloudflare/vite-plugin, @tanstack/router-cli, @types/node, @types/react, @types/react-dom, typescript, vite (+11 more)

### Community 13 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, build:production, cf-typegen, db:fixtures:clear:production, db:fixtures:production, db:migrate:local, db:migrate:production (+7 more)

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

### Community 105 - "BasicImageTransformations"
Cohesion: 0.67
Nodes (3): BasicImageTransformations, RequestInitCfPropertiesImage, RequestInitCfPropertiesImageDraw

### Community 122 - "RequestInitCfPropertiesVaryHeader"
Cohesion: 0.67
Nodes (3): RequestInitCfPropertiesVaryAcceptHeader, RequestInitCfPropertiesVaryAcceptLanguageHeader, RequestInitCfPropertiesVaryHeader

### Community 168 - "Everlittle"
Cohesion: 0.11
Nodes (16): Capability policy, Everlittle deployment modes, Hosted, Local fixtures, Runtime validation, Self-hosted, Authentication, Deployment (+8 more)

### Community 171 - "family_archive"
Cohesion: 0.16
Nodes (20): "account", child_profile, family_archive, family_member, media_asset, memory, "session", time_capsule (+12 more)

### Community 176 - "Everlittle hosted and self-hosted migration checklist"
Cohesion: 0.11
Nodes (17): Decisions already made, Domain candidates checked on 2026-08-14, Everlittle hosted and self-hosted migration checklist, Launch gates, Phase 0: Naming and domain, Phase 10: Create `everlittle-dikichoetso`, Phase 11: Migrate `dikichoetso.com`, Phase 12: Operations, privacy, and release readiness (+9 more)

### Community 177 - "Everlittle preliminary trademark knockout search"
Cohesion: 0.15
Nodes (12): EverLittle 3D, United States, Everlittle Baby domain, EverLittle Co., United States-facing marketplace use, Everlittle, India, Everlittle preliminary trademark knockout search, Material commercial uses found, Practical domain decision, Preliminary assessment (+4 more)

### Community 178 - "invitation-email.ts"
Cohesion: 0.43
Nodes (6): buildInvitationEmail(), escapeHtml(), InvitationEmailInput, roleDescriptions, sendInvitationEmail(), titleCase()

## Knowledge Gaps
- **1066 isolated node(s):** `"verification"`, `child_access_attempt`, `name`, `version`, `private` (+1061 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **146 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `WritableStreamDefaultWriter` connect `WritableStreamDefaultWriter` to `worker-configuration.d.ts`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `URLPattern` connect `URLPattern` to `worker-configuration.d.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `FormData` connect `FormData` to `worker-configuration.d.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `"verification"`, `child_access_attempt`, `name` to the rest of the system?**
  _1066 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `worker-configuration.d.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.002347417840375587 - nodes in this community are weakly interconnected._
- **Should `archive-api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.062090007627765065 - nodes in this community are weakly interconnected._
- **Should `index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05058717253839205 - nodes in this community are weakly interconnected._