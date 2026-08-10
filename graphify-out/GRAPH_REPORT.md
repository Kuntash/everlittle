# Graph Report - .  (2026-08-11)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2021 nodes · 2312 edges · 168 communities (24 shown, 144 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3a60d298`
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
- index.ts
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
- typescript
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
- env.d.ts
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

## God Nodes (most connected - your core abstractions)
1. `getRuntimeEnv()` - 29 edges
2. `handleArchiveApi()` - 25 edges
3. `Event` - 25 edges
4. `Console` - 21 edges
5. `getMembershipContext()` - 19 edges
6. `isSameOrigin()` - 18 edges
7. `unauthorized()` - 18 edges
8. `forbidden()` - 18 edges
9. `compilerOptions` - 17 edges
10. `URLSearchParams` - 16 edges

## Surprising Connections (you probably didn't know these)
- `fetch()` --calls--> `handleArchiveApi()`  [EXTRACTED]
  apps/web/src/server.ts → apps/web/src/lib/archive-api.ts
- `handleAuthRequest()` --calls--> `findValidInvitation()`  [EXTRACTED]
  apps/web/src/server.ts → apps/web/src/lib/archive-api.ts
- `handleAuthRequest()` --calls--> `acceptInvitation()`  [EXTRACTED]
  apps/web/src/server.ts → apps/web/src/lib/archive-api.ts
- `getArchiveState()` --calls--> `getRuntimeEnv()`  [EXTRACTED]
  apps/web/src/lib/archive-api.ts → apps/web/src/lib/runtime-env.ts
- `previewInvitation()` --calls--> `getRuntimeEnv()`  [EXTRACTED]
  apps/web/src/lib/archive-api.ts → apps/web/src/lib/runtime-env.ts

## Import Cycles
- None detected.

## Communities (168 total, 144 thin omitted)

### Community 0 - "worker-configuration.d.ts"
Cohesion: 0.00
Nodes (847): AgentMemoryGetSummaryOptions, AgentMemoryGetSummaryResponse, AgentMemoryIncomingMemory, AgentMemoryIngestOptions, AgentMemoryListMemoriesOptions, AgentMemoryListMemoriesResult, AgentMemoryMemory, AgentMemoryMemoryListEntry (+839 more)

### Community 1 - "archive-api.ts"
Cohesion: 0.11
Nodes (63): acceptInvitation(), acceptInvitationForCurrentUser(), auditStatement(), capsuleSchema, ChildAccessContext, childPinSchema, childSchema, childSessionCookie() (+55 more)

### Community 2 - "index.tsx"
Cohesion: 0.08
Nodes (50): authClient, AccessScreen(), apiFetch(), ArchiveApp(), ArchiveState, audienceLabel(), Capsule, CapsuleComposer() (+42 more)

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
Nodes (24): devDependencies, vite-plus, engines, node, license, name, packageManager, private (+16 more)

### Community 7 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, better-auth, @everlittle/domain, @everlittle/ui, @fontsource-variable/cormorant-garamond, @fontsource-variable/inter, lucide-react, react (+15 more)

### Community 9 - "TransformStream"
Cohesion: 0.10
Nodes (7): CompressionStream, DecompressionStream, FixedLengthStream, IdentityTransformStream, TextDecoderStream, TextEncoderStream, TransformStream

### Community 11 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, @cloudflare/vite-plugin, @tanstack/router-cli, @types/node, @types/react, @types/react-dom, vite, @vitejs/plugin-react (+9 more)

### Community 13 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, build:production, cf-typegen, db:fixtures:clear:production, db:fixtures:production, db:migrate:local, db:migrate:production (+7 more)

### Community 20 - "Body"
Cohesion: 0.15
Nodes (3): Body, Request, Response

### Community 25 - "domain/package.json"
Cohesion: 0.17
Nodes (11): dependencies, zod, exports, zod, license, name, private, scripts (+3 more)

### Community 26 - "StreamError"
Cohesion: 0.18
Nodes (11): AlreadyUploadedError, BadRequestError, ForbiddenError, InternalError, InvalidURLError, MaxFileSizeError, NotFoundError, QuotaReachedError (+3 more)

### Community 29 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, noEmit, skipLibCheck, strict, target, include (+1 more)

### Community 31 - "ByteLengthQueuingStrategy"
Cohesion: 0.22
Nodes (3): ByteLengthQueuingStrategy, CountQueuingStrategy, QueuingStrategy

### Community 38 - "index.ts"
Cohesion: 0.22
Nodes (8): Audience, audienceSchema, ChildProfile, FamilyRole, familyRoleSchema, Memory, MemoryKind, memoryKindSchema

### Community 44 - "ui/package.json"
Cohesion: 0.25
Nodes (7): exports, ./theme.css, license, name, private, type, version

### Community 45 - "web/package.json"
Cohesion: 0.29
Nodes (6): imports, license, name, private, type, version

### Community 78 - "typescript"
Cohesion: 0.50
Nodes (4): typescript, typescript, devDependencies, typescript

### Community 105 - "BasicImageTransformations"
Cohesion: 0.67
Nodes (3): BasicImageTransformations, RequestInitCfPropertiesImage, RequestInitCfPropertiesImageDraw

### Community 122 - "RequestInitCfPropertiesVaryHeader"
Cohesion: 0.67
Nodes (3): RequestInitCfPropertiesVaryAcceptHeader, RequestInitCfPropertiesVaryAcceptLanguageHeader, RequestInitCfPropertiesVaryHeader

## Knowledge Gaps
- **992 isolated node(s):** `name`, `version`, `private`, `license`, `type` (+987 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **144 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `URL` connect `URL` to `worker-configuration.d.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `ReadableStream` connect `ReadableStream` to `worker-configuration.d.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `Artifacts` connect `Artifacts` to `worker-configuration.d.ts`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _992 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `worker-configuration.d.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0023501762632197414 - nodes in this community are weakly interconnected._
- **Should `archive-api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11261872455902307 - nodes in this community are weakly interconnected._
- **Should `index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07581453634085213 - nodes in this community are weakly interconnected._