import { Project, TechItem, ExperienceItem, ADRItem } from '../types/index.ts';

export const PROJECTS: Project[] = [
  {
    id: 'hyperion-kv',
    title: 'Hyperion KV',
    slug: 'hyperion-distributed-kv',
    category: 'distributed',
    categoryLabel: 'Distributed Systems',
    summary: 'Ultra-low latency distributed key-value storage engine with Raft consensus and lock-free memory indexing.',
    description: 'Hyperion is an embedded & distributed key-value store crafted for real-time edge workloads. Built with custom log-structured merge (LSM) trees, memory-mapped write-ahead logs (WAL), and optimized Raft election protocols capable of sustaining millions of operations per second with microsecond p99 latencies.',
    ideFilePath: 'src/core/hyperion/consensus_raft.go',
    architectureHighlights: [
      'Lock-free SkipList memory table with atomic pointer swapping for concurrent ingestion',
      'Zero-copy disk serialization via memory-mapped IO and vector compaction routines',
      'Dynamic quorum leases avoiding leader roundtrips for linearizable reads',
      'WebAssembly runtime plugin sandbox for real-time edge triggers and filtering'
    ],
    metrics: [
      { label: 'Throughput', value: '1.8M op/s', accent: 'emerald' },
      { label: 'p99 Read Latency', value: '1.2ms', accent: 'cyan' },
      { label: 'Replication Lag', value: '< 4ms', accent: 'indigo' },
      { label: 'Test Coverage', value: '98.4%', accent: 'emerald' }
    ],
    techStack: ['Go', 'Rust', 'TypeScript', 'Raft Consensus', 'Wasm', 'gRPC'],
    codeFiles: [
      {
        filename: 'consensus_raft.go',
        language: 'go',
        code: `package hyperion

import (
  "context"
  "sync/atomic"
  "time"
)

type NodeRole uint32

const (
  Follower NodeRole = iota
  Candidate
  Leader
)

type RaftNode struct {
  currentTerm uint64
  votedFor    string
  role        NodeRole
  commitIndex uint64
  lastApplied uint64
  logStore    *LogStore
  peers       map[string]*ClientConn
}

// Propose appends an entry to the WAL and broadcasts to active peers
func (r *RaftNode) Propose(ctx context.Context, cmd []byte) (*WriteResult, error) {
  if atomic.LoadUint32((*uint32)(&r.role)) != uint32(Leader) {
    return nil, ErrNotLeader
  }

  term := atomic.LoadUint64(&r.currentTerm)
  entry := &LogEntry{
    Term:      term,
    Index:     r.logStore.NextIndex(),
    Data:      cmd,
    Timestamp: time.Now().UnixNano(),
  }

  if err := r.logStore.AppendSync(entry); err != nil {
    return nil, err
  }

  return r.replicateQuorum(ctx, entry)
}`
      },
      {
        filename: 'storage_engine.ts',
        language: 'typescript',
        code: `export interface StorageOptions {
  walSyncPolicy: 'always' | 'interval' | 'adaptive';
  maxMemtableBytes: number;
  bloomFilterBitsPerKey: number;
}

export class HyperionStorageClient {
  private socket: WebSocket | null = null;
  private readonly clusterNodes: string[];

  constructor(endpoints: string[], private opts: StorageOptions) {
    this.clusterNodes = endpoints;
  }

  public async get(key: string): Promise<Uint8Array | null> {
    const leader = await this.discoverHealthyLeader();
    const packet = this.encodePacket(0x01, key);
    return this.sendWithTelemetry(leader, packet);
  }

  public async set(key: string, value: Uint8Array): Promise<{ seq: number; latencyMs: number }> {
    const start = performance.now();
    const leader = await this.discoverHealthyLeader();
    const payload = this.encodeSetPacket(key, value);
    const seq = await this.dispatchQuorumWrite(leader, payload);
    return { seq, latencyMs: performance.now() - start };
  }
}`
      }
    ],
    diagramNodes: [
      { id: 'client', label: 'Edge Client', sublabel: 'gRPC / HTTP/3', type: 'client' },
      { id: 'lb', label: 'L4 Proxy Gateway', sublabel: 'Consistent Hashing', type: 'gateway' },
      { id: 'leader', label: 'Raft Leader (Node-01)', sublabel: 'In-Memory SkipList', type: 'service' },
      { id: 'follower1', label: 'Follower (Node-02)', sublabel: 'Replication Quorum', type: 'service' },
      { id: 'wal', label: 'Append-Only WAL', sublabel: 'Direct I/O Storage', type: 'storage' }
    ],
    simulationType: 'kv-store',
    githubUrl: 'https://github.com/example/hyperion-kv',
    demoUrl: 'https://hyperion-demo.example.dev'
  },
  {
    id: 'krypton-canvas',
    title: 'Krypton Studio',
    slug: 'krypton-edge-canvas',
    category: 'frontend',
    categoryLabel: 'High-Perf Frontend',
    summary: 'Multiplayer infinite whiteboard & vector drawing engine powered by CRDT state resolution at 60 FPS.',
    description: 'A browser-based spatial architecture tool and collaborative whiteboard. Engineered with custom WebGL shader passes, quad-tree spatial indexing for 100,000+ elements, and hybrid Yjs/WebSocket delta compression for seamless real-time multi-cursor collaboration.',
    ideFilePath: 'src/render/viewport_engine.tsx',
    architectureHighlights: [
      'QuadTree spatial partitioning ensuring $O(\\log N)$ boundary intersection & viewport culling',
      'Dual-buffered canvas pipeline with sub-pixel antialiasing and GPU transform matrix calculations',
      'Conflict-free Replicated Data Type (CRDT) document synchronization over encrypted WebSockets',
      'Offline-first reconciliation with IndexedDB persistent snapshots and vector rollback'
    ],
    metrics: [
      { label: 'Render Target', value: '60 FPS', accent: 'emerald' },
      { label: 'Sync Latency', value: '< 18ms', accent: 'cyan' },
      { label: 'Viewport Objects', value: '150k+', accent: 'indigo' },
      { label: 'Bundle Size', value: '42 kB', accent: 'emerald' }
    ],
    techStack: ['React 19', 'TypeScript', 'WebGL', 'CRDT / Yjs', 'Tailwind CSS', 'WebSockets'],
    codeFiles: [
      {
        filename: 'viewport_engine.tsx',
        language: 'typescript',
        code: `import { QuadTree, SpatialRect } from './spatial_index';
import { YDoc, applyUpdate } from 'yjs';

export class CanvasRenderPipeline {
  private gl: WebGL2RenderingContext;
  private quadTree: QuadTree<CanvasElement>;
  private transformMatrix: Float32Array;

  constructor(canvas: HTMLCanvasElement) {
    this.gl = canvas.getContext('webgl2', { alpha: false, antialias: true })!;
    this.quadTree = new QuadTree(0, 0, 100000, 100000);
    this.transformMatrix = new Float32Array(9);
  }

  public render(visibleBounds: SpatialRect): void {
    const visibleElements = this.quadTree.query(visibleBounds);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Batch draw calls by material shader ID
    this.batchAndDraw(visibleElements);
  }
}`
      }
    ],
    diagramNodes: [
      { id: 'clientA', label: 'Peer A (Browser)', sublabel: 'Local CRDT State', type: 'client' },
      { id: 'clientB', label: 'Peer B (Browser)', sublabel: 'Local CRDT State', type: 'client' },
      { id: 'relay', label: 'WebSocket Relay', sublabel: 'Binary Delta Broadcast', type: 'gateway' },
      { id: 'docStore', label: 'Document Snapshot', sublabel: 'S3 + IndexedDB', type: 'storage' }
    ],
    simulationType: 'canvas-sync',
    githubUrl: 'https://github.com/example/krypton-canvas',
    demoUrl: 'https://krypton.example.dev'
  },
  {
    id: 'aetheria-telemetry',
    title: 'Aetheria Observability',
    slug: 'aetheria-distributed-tracing',
    category: 'infra',
    categoryLabel: 'Systems & Infra',
    summary: 'High-throughput distributed tracing & metric aggregation pipeline ingesting 250M events per day.',
    description: 'Enterprise observability backend capable of streaming span ingestion, real-time service map topology reconstruction, and predictive anomaly detection. Connects OpenTelemetry instrumentation to column-oriented storage with sub-second analytical querying.',
    ideFilePath: 'src/pipeline/collector_ingest.ts',
    architectureHighlights: [
      'Partitioned Kafka event stream consuming OpenTelemetry Protocol (OTLP) gRPC payloads',
      'ClickHouse columnar data warehouse with custom ZSTD dictionary compression',
      'Real-time dependency graph topology synthesis using sliding-window stream processing',
      'Automated SLO budget burn rate alerting and correlated trace exemplars'
    ],
    metrics: [
      { label: 'Event Throughput', value: '250M / day', accent: 'emerald' },
      { label: 'Ingest Lag', value: '< 250ms', accent: 'cyan' },
      { label: 'Storage Savings', value: '84% (ZSTD)', accent: 'indigo' },
      { label: 'Availability', value: '99.99%', accent: 'emerald' }
    ],
    techStack: ['Node.js', 'Go', 'Kafka', 'ClickHouse', 'OpenTelemetry', 'Docker'],
    codeFiles: [
      {
        filename: 'collector_ingest.ts',
        language: 'typescript',
        code: `import { CompressionType, KafkaBatchConsumer } from './streaming';
import { ClickHouseWriter } from './clickhouse';

export class TelemetryCollector {
  private writer: ClickHouseWriter;

  constructor() {
    this.writer = new ClickHouseWriter({
      table: 'distributed_spans',
      compression: CompressionType.ZSTD,
      bufferThreshold: 10_000,
      flushIntervalMs: 250
    });
  }

  public async processSpanBatch(batch: Uint8Array[]): Promise<void> {
    const parsed = batch.map(b => this.decodeOTLPSpan(b));
    await this.writer.insertBatch(parsed);
  }
}`
      }
    ],
    diagramNodes: [
      { id: 'probes', label: 'Service Probes', sublabel: 'OTLP gRPC Spans', type: 'client' },
      { id: 'collector', label: 'Telemetry Gateway', sublabel: 'Rate Limiter & Validation', type: 'gateway' },
      { id: 'kafka', label: 'Kafka Stream Buffer', sublabel: '32 Partitions', type: 'queue' },
      { id: 'storage', label: 'ClickHouse Columnar', sublabel: 'Cold & Hot Tiers', type: 'storage' }
    ],
    simulationType: 'tracing-pipeline',
    githubUrl: 'https://github.com/example/aetheria',
    demoUrl: 'https://aetheria.example.dev'
  },
  {
    id: 'nexus-orchestrator',
    title: 'Nexus Control Plane',
    slug: 'nexus-cloud-orchestrator',
    category: 'infra',
    categoryLabel: 'Systems & Infra',
    summary: 'Multi-cloud GitOps deployment engine and traffic director with zero-downtime blue/green rollouts.',
    description: 'A cloud infrastructure automation framework that acts as a declarative orchestrator across Kubernetes clusters and serverless fleets. Features automatic drift reconciliation, integrated canary telemetry evaluation, and instant rollback on error threshold triggers.',
    ideFilePath: 'src/controller/reconciler.go',
    architectureHighlights: [
      'Custom Kubernetes Operator watching Custom Resource Definitions (CRDs)',
      'Automated traffic weighting via Envoy service mesh sidecars and Cloudflare DNS',
      'Cryptographic provenance verification using Sigstore and Cosign signing artifacts',
      'Declarative state synchronization with bidirectional git branch mirrors'
    ],
    metrics: [
      { label: 'Clusters Managed', value: '18 Global', accent: 'emerald' },
      { label: 'Deploy Velocity', value: '45s avg', accent: 'cyan' },
      { label: 'Rollback MTTR', value: '< 8s', accent: 'indigo' },
      { label: 'Uptime History', value: '100% Q1-Q4', accent: 'emerald' }
    ],
    techStack: ['Kubernetes', 'Go', 'Terraform', 'Envoy', 'GraphQL', 'Prometheus'],
    codeFiles: [
      {
        filename: 'reconciler.go',
        language: 'go',
        code: `package controller

import (
  "context"
  "time"
)

type DeploymentPlan struct {
  ClusterID   string
  TargetSHA   string
  CanaryRatio float64
  MaxWaitTime time.Duration
}

func (r *Reconciler) ReconcileDeployment(ctx context.Context, plan *DeploymentPlan) error {
  // Step 1: Verify cryptographic signature of container image
  if err := r.verifySignature(plan.TargetSHA); err != nil {
    return err
  }

  // Step 2: Spawn canary pods alongside stable revision
  canaryRevision, err := r.deployCanaryPods(ctx, plan)
  if err != nil {
    return err
  }

  // Step 3: Shift 10% traffic and observe metric anomalies
  return r.evaluateCanaryHealth(ctx, canaryRevision, plan)
}`
      }
    ],
    diagramNodes: [
      { id: 'git', label: 'GitOps Repository', sublabel: 'Signed Commits', type: 'client' },
      { id: 'nexus', label: 'Nexus Operator', sublabel: 'Drift Controller', type: 'service' },
      { id: 'envoy', label: 'Envoy Ingress', sublabel: 'Traffic Weighting', type: 'gateway' },
      { id: 'clusters', label: 'Regional K8s Fleets', sublabel: 'US / EU / APAC', type: 'storage' }
    ],
    simulationType: 'cloud-deploy',
    githubUrl: 'https://github.com/example/nexus-cloud',
    demoUrl: 'https://nexus.example.dev'
  },
  {
    id: 'chronos-orderbook',
    title: 'Chronos Stream',
    slug: 'chronos-time-series',
    category: 'realtime',
    categoryLabel: 'Real-Time & AI',
    summary: 'High-frequency orderbook replay and streaming backtesting platform with microsecond timestamp fidelity.',
    description: 'Engineered for financial algorithmic backtesting and tick-by-tick market telemetry. Pairs high-speed Rust/WASM computation directly in the browser with Web Workers to render order depth heatmaps and volume profiles at native display refresh rates.',
    ideFilePath: 'src/engine/orderbook_matching.rs',
    architectureHighlights: [
      'Price-time priority matching engine compiled to WebAssembly with SIMD acceleration',
      'SharedArrayBuffer worker threading eliminating main-thread GC pauses',
      'Microsecond timestamp replay with dynamic time-dilation controls (1x to 100x)',
      'Sub-millisecond order placement and synthetic latency simulation'
    ],
    metrics: [
      { label: 'Tick Processing', value: '140k / sec', accent: 'emerald' },
      { label: 'Replay Accuracy', value: '1 μs precision', accent: 'cyan' },
      { label: 'Worker Latency', value: '< 0.4ms', accent: 'indigo' },
      { label: 'UI Frame Rate', value: '120 Hz', accent: 'emerald' }
    ],
    techStack: ['Rust', 'WebAssembly', 'TypeScript', 'Web Workers', 'Canvas2D', 'WebSockets'],
    codeFiles: [
      {
        filename: 'orderbook_matching.rs',
        language: 'rust',
        code: `use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct OrderBook {
    bids: Vec<PriceLevel>,
    asks: Vec<PriceLevel>,
    seq: u64,
}

#[wasm_bindgen]
impl OrderBook {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            bids: Vec::with_capacity(1024),
            asks: Vec::with_capacity(1024),
            seq: 0,
        }
    }

    pub fn apply_delta(&mut self, is_bid: bool, price: f64, size: f64) -> u64 {
        self.seq += 1;
        let book = if is_bid { &mut self.bids } else { &mut self.asks };
        // Binary search and atomic mutation
        insert_or_update_level(book, price, size);
        self.seq
    }
}`
      }
    ],
    diagramNodes: [
      { id: 'feed', label: 'WebSocket Market Feed', sublabel: 'L2 Depth Updates', type: 'client' },
      { id: 'worker', label: 'WASM Matching Engine', sublabel: 'Rust SIMD Buffer', type: 'service' },
      { id: 'canvas', label: 'GPU Depth Heatmap', sublabel: '120Hz VSync', type: 'gateway' },
      { id: 'history', label: 'Tick Snapshot Buffer', sublabel: 'SharedArrayBuffer', type: 'storage' }
    ],
    simulationType: 'orderbook',
    githubUrl: 'https://github.com/example/chronos-engine',
    demoUrl: 'https://chronos.example.dev'
  },
  {
    id: 'omnigraph-gateway',
    title: 'OmniGraph Gateway',
    slug: 'omnigraph-unified-federation',
    category: 'distributed',
    categoryLabel: 'Distributed Systems',
    summary: 'Federated GraphQL and gRPC microservice gateway with automatic schema deduplication and query planning.',
    description: 'An API orchestration proxy designed for distributed engineering teams. Automatically stitches subgraph schemas across TypeScript, Go, and Python services into a unified strongly-typed graph, optimizing query execution plans with zero duplicate over-fetching.',
    ideFilePath: 'src/federation/query_planner.ts',
    architectureHighlights: [
      'AST-based query plan caching reducing compile time to 0.1ms per request',
      'Automatic DataLoader batching across heterogeneous upstream gRPC and REST backends',
      'Edge JWT verification with asynchronous JWKS rotation and role validation',
      'Client-side schema explorer and simulated playground with autocomplete'
    ],
    metrics: [
      { label: 'Cache Hit Ratio', value: '94.2%', accent: 'emerald' },
      { label: 'Gateway Overhead', value: '1.8ms', accent: 'cyan' },
      { label: 'Federated Subgraphs', value: '24 Services', accent: 'indigo' },
      { label: 'Daily Requests', value: '45M+', accent: 'emerald' }
    ],
    techStack: ['TypeScript', 'Node.js', 'GraphQL', 'gRPC', 'Redis', 'Docker'],
    codeFiles: [
      {
        filename: 'query_planner.ts',
        language: 'typescript',
        code: `import { DocumentNode, FieldNode, OperationDefinitionNode } from 'graphql';

export interface PlanStep {
  serviceName: string;
  subQuery: string;
  dependsOn?: string[];
}

export class DistributedQueryPlanner {
  public compileExecutionPlan(ast: DocumentNode): PlanStep[] {
    const operation = ast.definitions.find(
      d => d.kind === 'OperationDefinition'
    ) as OperationDefinitionNode;

    const steps: PlanStep[] = [];
    for (const selection of operation.selectionSet.selections) {
      if (selection.kind === 'Field') {
        const step = this.resolveServiceOwner(selection.name.value);
        steps.push(step);
      }
    }
    return this.topologicalSort(steps);
  }
}`
      }
    ],
    diagramNodes: [
      { id: 'clients', label: 'Web & Mobile Clients', sublabel: 'GraphQL / HTTP', type: 'client' },
      { id: 'gateway', label: 'OmniGraph Proxy', sublabel: 'Federation Planner', type: 'gateway' },
      { id: 'redis', label: 'Response Cache', sublabel: 'Redis Cluster', type: 'storage' },
      { id: 'subgraphs', label: '24 Upstream Services', sublabel: 'gRPC / JSON RPC', type: 'service' }
    ],
    simulationType: 'graphql-stitch',
    githubUrl: 'https://github.com/example/omnigraph',
    demoUrl: 'https://omnigraph.example.dev'
  }
];

export const TECH_ITEMS: TechItem[] = [
  // Frontend
  {
    name: 'TypeScript',
    category: 'Frontend & UI Engine',
    icon: 'ts',
    level: 'Expert',
    years: '8 yrs',
    projectsCount: 32,
    featuredIn: ['Hyperion KV', 'Krypton Studio', 'OmniGraph Gateway'],
    description: 'Strict typing, advanced conditional types, AST tooling, and end-to-end schema generators.'
  },
  {
    name: 'React 19',
    category: 'Frontend & UI Engine',
    icon: 'react',
    level: 'Expert',
    years: '8 yrs',
    projectsCount: 28,
    featuredIn: ['Krypton Studio', 'Chronos Stream'],
    description: 'Server Actions, React Compiler, concurrent rendering, and performance profiling.'
  },
  {
    name: 'WebGL / Three.js',
    category: 'Frontend & UI Engine',
    icon: 'webgl',
    level: 'Advanced',
    years: '5 yrs',
    projectsCount: 9,
    featuredIn: ['Krypton Studio', 'System Flow Simulator'],
    description: 'Custom GLSL shaders, buffer geometry optimization, viewport culling, and 60FPS pipelines.'
  },
  {
    name: 'Tailwind CSS',
    category: 'Frontend & UI Engine',
    icon: 'tailwind',
    level: 'Expert',
    years: '6 yrs',
    projectsCount: 30,
    featuredIn: ['Obsidian Terminal', 'Krypton Studio'],
    description: 'Tailwind v4 architecture, custom variants, dark mode design systems, and zero-pill discipline.'
  },

  // Backend
  {
    name: 'Node.js / Express',
    category: 'Backend & Distributed',
    icon: 'node',
    level: 'Expert',
    years: '8 yrs',
    projectsCount: 35,
    featuredIn: ['Aetheria Observability', 'OmniGraph Gateway'],
    description: 'High-concurrency event loops, stream processing, native ESM, and zero-allocation serialization.'
  },
  {
    name: 'Go (Golang)',
    category: 'Backend & Distributed',
    icon: 'go',
    level: 'Advanced',
    years: '6 yrs',
    projectsCount: 16,
    featuredIn: ['Hyperion KV', 'Nexus Control Plane'],
    description: 'Goroutines, channel concurrency, Raft consensus protocols, and Kubernetes operator tooling.'
  },
  {
    name: 'Rust / WebAssembly',
    category: 'Backend & Distributed',
    icon: 'rust',
    level: 'Advanced',
    years: '4 yrs',
    projectsCount: 8,
    featuredIn: ['Chronos Stream', 'Hyperion KV'],
    description: 'Memory safety without GC, WASM compilation, SIMD instructions, and microsecond orderbook engines.'
  },
  {
    name: 'GraphQL & gRPC',
    category: 'Backend & Distributed',
    icon: 'graphql',
    level: 'Expert',
    years: '6 yrs',
    projectsCount: 20,
    featuredIn: ['OmniGraph Gateway', 'Aetheria Observability'],
    description: 'Schema federation, DataLoader batching, protocol buffer definitions, and bidirectional streaming.'
  },

  // Data & Storage
  {
    name: 'PostgreSQL / Cloud SQL',
    category: 'Data & Storage',
    icon: 'postgres',
    level: 'Expert',
    years: '8 yrs',
    projectsCount: 26,
    featuredIn: ['Aetheria', 'Nexus Control Plane'],
    description: 'Schema design, index tuning, pg_stat_statements query analysis, and connection pooling.'
  },
  {
    name: 'Redis',
    category: 'Data & Storage',
    icon: 'redis',
    level: 'Expert',
    years: '7 yrs',
    projectsCount: 24,
    featuredIn: ['OmniGraph Gateway', 'Hyperion KV'],
    description: 'Distributed locking (Redlock), caching tiers, pub/sub messaging, and Redis streams.'
  },
  {
    name: 'Kafka / Streaming',
    category: 'Data & Storage',
    icon: 'kafka',
    level: 'Advanced',
    years: '5 yrs',
    projectsCount: 12,
    featuredIn: ['Aetheria Observability'],
    description: 'Partition strategy, exactly-once semantics, consumer groups, and high-throughput pipelines.'
  },
  {
    name: 'ClickHouse',
    category: 'Data & Storage',
    icon: 'clickhouse',
    level: 'Advanced',
    years: '4 yrs',
    projectsCount: 7,
    featuredIn: ['Aetheria Observability'],
    description: 'Columnar storage optimization, time-series aggregations, and sub-second distributed analytics.'
  },

  // Cloud & DevOps
  {
    name: 'Docker & Containerd',
    category: 'Cloud & DevOps',
    icon: 'docker',
    level: 'Expert',
    years: '8 yrs',
    projectsCount: 38,
    featuredIn: ['Nexus Control Plane', 'Hyperion KV'],
    description: 'Multi-stage builds, alpine distroless baselines, security scanning, and layer caching.'
  },
  {
    name: 'Kubernetes',
    category: 'Cloud & DevOps',
    icon: 'k8s',
    level: 'Advanced',
    years: '6 yrs',
    projectsCount: 15,
    featuredIn: ['Nexus Control Plane'],
    description: 'Custom controllers, Helm charts, ingress controllers, HPA, and GitOps deployments.'
  },
  {
    name: 'Google Cloud Platform',
    category: 'Cloud & DevOps',
    icon: 'gcp',
    level: 'Expert',
    years: '7 yrs',
    projectsCount: 22,
    featuredIn: ['Nexus Control Plane', 'Cloud Run Fleets'],
    description: 'Cloud Run, VPC peering, Cloud SQL, Pub/Sub, IAM security, and Cloud Monitoring.'
  },
  {
    name: 'CI/CD & GitHub Actions',
    category: 'Cloud & DevOps',
    icon: 'github',
    level: 'Expert',
    years: '8 yrs',
    projectsCount: 40,
    featuredIn: ['All Production Deployments'],
    description: 'Automated test matrices, semantic release tagging, container signing, and artifact caches.'
  }
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    period: '2023 — Present',
    role: 'Principal Systems Architect & Staff Engineer',
    company: 'Strata Cloud Solutions',
    location: 'San Francisco, CA / Distributed',
    summary: 'Directing core platform architecture for distributed cloud management systems processing 1.4B monthly requests across 12 regions.',
    achievements: [
      'Architected global edge mesh routing layer, reducing p99 API latencies by 38% across US and APAC regions',
      'Spearheaded transition from monolithic micro-sprawl to unified federated gateway with 94% cache utilization',
      'Mentored 18 engineers across backend, infrastructure, and frontend UI design disciplines',
      'Established zero-downtime deployment pipelines with automated canary error budget triggers'
    ],
    technologies: ['Go', 'TypeScript', 'Kubernetes', 'GraphQL', 'Kafka', 'PostgreSQL', 'Terraform']
  },
  {
    period: '2020 — 2023',
    role: 'Lead Full Stack Engineer',
    company: 'Veloce Data Systems',
    location: 'Austin, TX',
    summary: 'Led a cross-functional team of 9 engineers delivering real-time financial telemetry visualization and algorithmic replay tooling.',
    achievements: [
      'Built high-performance 60FPS WebGL and Canvas visualizer processing 100k+ concurrent data points in-browser',
      'Designed distributed event ingestion pipeline handling 50k sustained events per second with ClickHouse',
      'Eliminated client memory leaks and achieved 99.98% crash-free sessions across 80,000 active daily users',
      'Standardized corporate design system and internal UI library with full dark/light theme support'
    ],
    technologies: ['React', 'TypeScript', 'Rust', 'WebAssembly', 'Node.js', 'ClickHouse', 'Docker']
  },
  {
    period: '2017 — 2020',
    role: 'Senior Software Engineer',
    company: 'Helios Distributed Labs',
    location: 'Seattle, WA',
    summary: 'Engineered backend APIs and responsive web interfaces for high-concurrency developer infrastructure tools.',
    achievements: [
      'Developed real-time collaborative workspace editor with operational transformation and CRDTs',
      'Migrated legacy REST endpoints to typed GraphQL schema, reducing mobile data payload size by 62%',
      'Authored 4 production open-source libraries with over 15,000 cumulative GitHub stars'
    ],
    technologies: ['TypeScript', 'Node.js', 'React', 'Redis', 'PostgreSQL', 'Jest', 'AWS']
  }
];

export const ARCHITECTURE_DECISION_RECORDS: ADRItem[] = [
  {
    id: 'ADR-008',
    title: 'Adoption of Raft Consensus over Paxos for Distributed State Machine',
    status: 'Accepted',
    date: '2025-08-14',
    context: 'We required a linearizable replication protocol for the cluster metadata coordinator. While Multi-Paxos offers strong academic credentials, its implementation complexity often introduces subtle edge-case state desynchronizations under network partition scenarios.',
    decision: 'Selected Raft consensus algorithm with explicit leader leases and log compaction. Implemented in Go with strong type boundaries and deterministic state machine replay tests.',
    consequences: [
      'Significantly reduced audit overhead and onboarding time for new systems engineers',
      'Deterministic crash recovery with write-ahead log replay within 1.2 seconds',
      'Trade-off: slightly higher message overhead during election phases compared to specialized Paxos variants'
    ]
  },
  {
    id: 'ADR-011',
    title: 'Zero-Copy SharedArrayBuffer for WebAssembly Replay Engine',
    status: 'Implemented',
    date: '2025-11-22',
    context: 'Transferring tick streams from background Web Workers to the main UI thread via standard postMessage introduced 12ms–18ms structured cloning serialization overhead, causing UI frame drops during market volatility spikes.',
    decision: 'Utilized SharedArrayBuffer with Atomics and ring buffer structures to share byte buffers directly between Rust/Wasm workers and Canvas rendering threads.',
    consequences: [
      'Completely eliminated data serialization latency (reduced from 15ms to 0.02ms)',
      'Stable 60–120 FPS rendering during peak market load bursts of 140k ticks/sec',
      'Requirement: Enabled Cross-Origin-Opener-Policy (COOP) and Cross-Origin-Embedder-Policy (COEP) headers on host'
    ]
  },
  {
    id: 'ADR-014',
    title: 'Federated GraphQL Subgraph Decomposition vs Central Schema Monolith',
    status: 'Implemented',
    date: '2026-02-18',
    context: 'As engineering teams scaled to 6 autonomous squads, schema merge conflicts and coordination overhead in a single central repository became the primary blocker for deployment velocity.',
    decision: 'Adopted Federated GraphQL architecture with automated schema composition validation in CI. Squads own and deploy their respective subgraphs independently.',
    consequences: [
      'Decoupled deployment schedules: teams deploy subgraphs 4x more frequently without central bottlenecks',
      'Gateway query planner compiles cached AST execution plans with under 2ms routing overhead',
      'Required robust OTLP distributed tracing across gateway-subgraph network boundaries'
    ]
  }
];
