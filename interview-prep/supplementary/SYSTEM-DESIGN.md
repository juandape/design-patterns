# System Design - EPAM Interview Prep

> **Target**: EPAM Round 3 - System Design Interview
> **Focus**: Scalable system architecture for senior full stack developer

---

## Table of Contents

1. [System Design Framework](#framework)
2. [Scalability Concepts](#scalability)
3. [Load Balancing](#load-balancing)
4. [Caching Strategies](#caching)
5. [Database Design](#database)
6. [Microservices vs Monolith](#microservices)
7. [Message Queues](#message-queues)
8. [API Design](#api-design)
9. [Real-World Examples](#examples)
10. [Interview Tips](#interview-tips)

---

## System Design Framework

### Step-by-Step Approach

```
1. Understand Requirements
   - Functional requirements (features)
   - Non-functional requirements (performance, scalability, availability)
   - Clarify constraints (users, data volume, latency)

2. Estimate Capacity
   - Traffic estimates (QPS, DAU)
   - Storage estimates
   - Bandwidth estimates

3. High-Level Design
   - Draw major components
   - Identify data flow
   - Choose appropriate architecture

4. Detailed Design
   - Deep dive into core components
   - Database schema
   - API design
   - Algorithms

5. Identify Bottlenecks & Trade-offs
   - Single points of failure
   - Scalability concerns
   - Performance optimization
   - Consistency vs Availability

6. Discuss Further Improvements
   - Monitoring & alerting
   - Security
   - Testing strategy
```

---

## Scalability Concepts

### Vertical vs Horizontal Scaling

```
Vertical Scaling (Scale Up):
┌─────────────┐         ┌─────────────┐
│   Server    │         │   Server    │
│  CPU: 4     │  ───>   │  CPU: 8     │
│  RAM: 8GB   │         │  RAM: 32GB  │
└─────────────┘         └─────────────┘

Pros: Simple, no code changes
Cons: Expensive, single point of failure, hardware limits

Horizontal Scaling (Scale Out):
┌─────────────┐         ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Server 1  │         │   Server 1  │  │   Server 2  │  │   Server 3  │
│  CPU: 4     │  ───>   │  CPU: 4     │  │  CPU: 4     │  │  CPU: 4     │
│  RAM: 8GB   │         │  RAM: 8GB   │  │  RAM: 8GB   │  │  RAM: 8GB   │
└─────────────┘         └─────────────┘  └─────────────┘  └─────────────┘

Pros: Better fault tolerance, cost-effective, no limits
Cons: Complex, data consistency challenges
```

### CAP Theorem

```
CAP: Choose 2 of 3
┌─────────────────┐
│   Consistency   │  All nodes see same data
├─────────────────┤
│  Availability   │  Every request gets response
├─────────────────┤
│Partition Tolerance│  System works despite network failures
└─────────────────┘

Real-world systems:
- CA: RDBMS (PostgreSQL, MySQL) - Not partition tolerant
- CP: MongoDB, HBase - Sacrifices availability
- AP: Cassandra, DynamoDB - Eventual consistency

Most distributed systems: Choose between CP or AP
```

---

## Load Balancing

### Load Balancer Algorithms

```typescript
// Round Robin
class RoundRobinBalancer {
  private servers: string[];
  private current = 0;

  constructor(servers: string[]) {
    this.servers = servers;
  }

  getNextServer(): string {
    const server = this.servers[this.current];
    this.current = (this.current + 1) % this.servers.length;
    return server;
  }
}

// Weighted Round Robin
class WeightedRoundRobinBalancer {
  private servers: Array<{ url: string; weight: number }>;
  private currentWeights: number[];

  constructor(servers: Array<{ url: string; weight: number }>) {
    this.servers = servers;
    this.currentWeights = servers.map(s => s.weight);
  }

  getNextServer(): string {
    let maxIndex = 0;
    let maxWeight = this.currentWeights[0];

    for (let i = 1; i < this.currentWeights.length; i++) {
      if (this.currentWeights[i] > maxWeight) {
        maxWeight = this.currentWeights[i];
        maxIndex = i;
      }
    }

    this.currentWeights[maxIndex] -= this.getTotalWeight();
    this.currentWeights.forEach((_, i) => {
      this.currentWeights[i] += this.servers[i].weight;
    });

    return this.servers[maxIndex].url;
  }

  private getTotalWeight(): number {
    return this.servers.reduce((sum, s) => sum + s.weight, 0);
  }
}

// Least Connections
class LeastConnectionsBalancer {
  private servers: Map<string, number>; // server -> active connections

  constructor(serverUrls: string[]) {
    this.servers = new Map();
    serverUrls.forEach(url => this.servers.set(url, 0));
  }

  getNextServer(): string {
    let minServer = '';
    let minConnections = Infinity;

    for (const [server, connections] of this.servers) {
      if (connections < minConnections) {
        minConnections = connections;
        minServer = server;
      }
    }

    this.servers.set(minServer, this.servers.get(minServer)! + 1);
    return minServer;
  }

  releaseConnection(server: string): void {
    const current = this.servers.get(server) || 0;
    this.servers.set(server, Math.max(0, current - 1));
  }
}

// IP Hash (Sticky Sessions)
class IPHashBalancer {
  private servers: string[];

  constructor(servers: string[]) {
    this.servers = servers;
  }

  getNextServer(clientIP: string): string {
    const hash = this.hashIP(clientIP);
    const index = hash % this.servers.length;
    return this.servers[index];
  }

  private hashIP(ip: string): number {
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
      hash = ((hash << 5) - hash) + ip.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
```

### Load Balancer Layers

```
Layer 4 (Transport Layer):
- Route based on IP + Port
- Fast (no content inspection)
- TCP/UDP level
- Examples: AWS NLB, HAProxy

Layer 7 (Application Layer):
- Route based on HTTP headers, URL, cookies
- Slower (inspects content)
- Can cache, compress, SSL termination
- Examples: AWS ALB, Nginx, Envoy

Architecture:
           ┌─────────────────┐
           │     Client      │
           └────────┬────────┘
                    │
           ┌────────▼────────┐
           │ Layer 7 LB (ALB)│
           │  - SSL term     │
           │  - Path routing │
           └────────┬────────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
    ┌────▼───┐ ┌───▼────┐ ┌───▼────┐
    │Server 1│ │Server 2│ │Server 3│
    └────────┘ └────────┘ └────────┘
```

---

## Caching Strategies

### Cache Patterns

```typescript
// 1. Cache-Aside (Lazy Loading)
async function getCacheAside(key: string): Promise<any> {
  // Check cache first
  let data = await cache.get(key);

  if (data) {
    return data; // Cache hit
  }

  // Cache miss - load from database
  data = await database.query(key);

  // Store in cache
  await cache.set(key, data, TTL);

  return data;
}

// 2. Write-Through Cache
async function writeThrough(key: string, value: any): Promise<void> {
  // Write to cache and database together
  await Promise.all([
    cache.set(key, value, TTL),
    database.save(key, value)
  ]);
}

// 3. Write-Behind (Write-Back) Cache
class WriteBehindCache {
  private writeQueue: Array<{ key: string; value: any }> = [];

  async write(key: string, value: any): Promise<void> {
    // Write to cache immediately
    await cache.set(key, value, TTL);

    // Queue database write
    this.writeQueue.push({ key, value });

    // Async flush to database
    this.scheduleFlush();
  }

  private async scheduleFlush(): Promise<void> {
    setTimeout(async () => {
      const batch = this.writeQueue.splice(0, 100);
      await database.batchWrite(batch);
    }, 1000);
  }
}

// 4. Read-Through Cache
async function getReadThrough(key: string): Promise<any> {
  // Cache automatically loads from database on miss
  return await cache.get(key, async () => {
    return await database.query(key);
  });
}
```

### Cache Eviction Policies

```typescript
// LRU (Least Recently Used)
class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;

    // Move to end (most recent)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key: K, value: V): void {
    // Remove if exists
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Add to end
    this.cache.set(key, value);

    // Evict oldest if over capacity
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

// LFU (Least Frequently Used)
class LFUCache<K, V> {
  private capacity: number;
  private cache: Map<K, { value: V; freq: number }>;
  private freqMap: Map<number, Set<K>>;
  private minFreq: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.freqMap = new Map();
    this.minFreq = 0;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;

    const item = this.cache.get(key)!;
    this.updateFrequency(key, item.freq);

    return item.value;
  }

  put(key: K, value: V): void {
    if (this.capacity === 0) return;

    if (this.cache.has(key)) {
      const item = this.cache.get(key)!;
      item.value = value;
      this.updateFrequency(key, item.freq);
    } else {
      if (this.cache.size >= this.capacity) {
        this.evict();
      }

      this.cache.set(key, { value, freq: 1 });
      this.addToFreqMap(key, 1);
      this.minFreq = 1;
    }
  }

  private updateFrequency(key: K, oldFreq: number): void {
    this.freqMap.get(oldFreq)?.delete(key);
    if (this.freqMap.get(oldFreq)?.size === 0) {
      this.freqMap.delete(oldFreq);
      if (this.minFreq === oldFreq) {
        this.minFreq++;
      }
    }

    const newFreq = oldFreq + 1;
    this.cache.get(key)!.freq = newFreq;
    this.addToFreqMap(key, newFreq);
  }

  private addToFreqMap(key: K, freq: number): void {
    if (!this.freqMap.has(freq)) {
      this.freqMap.set(freq, new Set());
    }
    this.freqMap.get(freq)!.add(key);
  }

  private evict(): void {
    const keysToEvict = this.freqMap.get(this.minFreq);
    const keyToEvict = keysToEvict?.values().next().value;

    if (keyToEvict) {
      keysToEvict?.delete(keyToEvict);
      this.cache.delete(keyToEvict);
    }
  }
}
```

### CDN (Content Delivery Network)

```
Origin Server (Main)
        │
        ▼
┌───────────────────┐
│   Edge Servers    │  Distributed globally
│  (CDN Nodes)      │
└───────────────────┘
   │      │      │
   ▼      ▼      ▼
User1  User2  User3

Benefits:
- Reduced latency (geographic proximity)
- Reduced bandwidth costs
- DDoS protection
- Static content delivery (images, CSS, JS)

Examples: CloudFront, Cloudflare, Akamai
```

---

## Database Design

### Replication

```
Master-Slave Replication:
┌──────────┐
│  Master  │ (Write)
└─────┬────┘
      │ Replicate
  ┌───┼───┐
  │   │   │
  ▼   ▼   ▼
┌──┐┌──┐┌──┐
│S1││S2││S3│ (Read)
└──┘└──┘└──┘

Pros: Scale reads, backup
Cons: Replication lag, single write point

Master-Master Replication:
┌──────────┐    ┌──────────┐
│ Master 1 │◄──►│ Master 2 │
└──────────┘    └──────────┘
     ▲               ▲
     │               │
  ┌──┴──┐         ┌──┴──┐
  │Read │         │Read │
  │Write│         │Write│
  └─────┘         └─────┘

Pros: Scale writes, high availability
Cons: Conflict resolution complexity
```

### Sharding (Horizontal Partitioning)

```typescript
// Hash-based sharding
function getShardByHash(userId: string, numShards: number): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % numShards;
}

// Range-based sharding
function getShardByRange(userId: number): string {
  if (userId < 1000000) return 'shard_1';
  if (userId < 2000000) return 'shard_2';
  return 'shard_3';
}

// Geographic sharding
function getShardByLocation(country: string): string {
  const regions = {
    'US': 'shard_na',
    'UK': 'shard_eu',
    'JP': 'shard_asia'
  };
  return regions[country] || 'shard_default';
}
```

```
Sharding Example:
┌──────────────────────────────┐
│      Application Layer       │
└──────────┬───────────────────┘
           │
    ┌──────┼──────┐
    │      │      │
    ▼      ▼      ▼
┌────┐  ┌────┐  ┌────┐
│Sh 1│  │Sh 2│  │Sh 3│
│U:0 │  │U:1M│  │U:2M│
│-1M │  │-2M │  │-3M │
└────┘  └────┘  └────┘

Pros: Scale writes, distribute data
Cons: Complex queries, rebalancing
```

### SQL vs NoSQL

```
SQL (RDBMS):
- Structured data
- ACID transactions
- Complex queries (JOINs)
- Vertical scaling
Examples: PostgreSQL, MySQL

NoSQL:
- Unstructured/semi-structured
- Eventual consistency
- Horizontal scaling
- High throughput

Types:
1. Document: MongoDB, CouchDB
2. Key-Value: Redis, DynamoDB
3. Column-Family: Cassandra, HBase
4. Graph: Neo4j, Amazon Neptune
```

---

## Microservices vs Monolith

### Monolithic Architecture

```
┌─────────────────────────────┐
│       Single Application    │
│  ┌──────────────────────┐  │
│  │    User Service      │  │
│  ├──────────────────────┤  │
│  │   Product Service    │  │
│  ├──────────────────────┤  │
│  │    Order Service     │  │
│  ├──────────────────────┤  │
│  │   Payment Service    │  │
│  └──────────────────────┘  │
│        Shared Database      │
└─────────────────────────────┘

Pros:
- Simple to develop/deploy
- Easier to test
- No network overhead

Cons:
- Hard to scale
- Technology lock-in
- Long deployment cycles
- Single point of failure
```

### Microservices Architecture

```
       ┌──────────────┐
       │   API Gateway│
       └──────┬───────┘
              │
    ┌─────────┼─────────┐
    │         │         │
    ▼         ▼         ▼
┌──────┐  ┌───────┐  ┌──────┐
│User  │  │Product│  │Order │
│Service│  │Service│  │Service│
└───┬──┘  └───┬───┘  └───┬──┘
    │         │          │
    ▼         ▼          ▼
┌──────┐  ┌───────┐  ┌──────┐
│User  │  │Product│  │Order │
│  DB  │  │  DB   │  │  DB  │
└──────┘  └───────┘  └──────┘

Pros:
- Independent scaling
- Technology flexibility
- Fault isolation
- Faster deployments

Cons:
- Complex infrastructure
- Network latency
- Data consistency challenges
- Testing complexity
```

---

## Message Queues

### Purpose & Benefits

```
Producer → Queue → Consumer

Benefits:
- Asynchronous processing
- Decoupling services
- Load leveling
- Fault tolerance
```

### Implementation Example

```typescript
// Using RabbitMQ
import amqp from 'amqplib';

// Producer
async function sendMessage(queue: string, message: string) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: true });

  channel.sendToQueue(queue, Buffer.from(message), {
    persistent: true
  });

  console.log('Sent:', message);

  await channel.close();
  await connection.close();
}

// Consumer
async function consumeMessages(queue: string) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: true });
  channel.prefetch(1); // Process one at a time

  channel.consume(queue, async (msg) => {
    if (msg) {
      const content = msg.content.toString();
      console.log('Received:', content);

      // Process message
      await processMessage(content);

      // Acknowledge
      channel.ack(msg);
    }
  });
}

async function processMessage(message: string) {
  // Heavy processing
  console.log('Processing:', message);
}
```

### Kafka vs RabbitMQ

```
RabbitMQ:
- Traditional message broker
- Complex routing (exchanges, bindings)
- Lower throughput
- Message acknowledgment
- Use: Task queues, RPC

Kafka:
- Distributed streaming platform
- High throughput
- Message persistence
- Pub/sub + replay
- Use: Event sourcing, log aggregation
```

---

## API Design

### RESTful API Best Practices

```typescript
// Resource naming (plural nouns)
GET    /api/users           // List users
GET    /api/users/:id       // Get user
POST   /api/users           // Create user
PUT    /api/users/:id       // Update user
PATCH  /api/users/:id       // Partial update
DELETE /api/users/:id       // Delete user

// Nested resources
GET    /api/users/:id/posts // Get user's posts
POST   /api/users/:id/posts // Create post for user

// Filtering, sorting, pagination
GET /api/users?role=admin&sort=-createdAt&page=2&limit=20

// Versioning
GET /api/v1/users
GET /api/v2/users

// Status codes
200 OK - Success
201 Created - Resource created
204 No Content - Success (no body)
400 Bad Request - Invalid input
401 Unauthorized - Authentication required
403 Forbidden - No permission
404 Not Found
500 Internal Server Error
```

### Rate Limiting

```typescript
// Token Bucket Algorithm
class RateLimiter {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private maxTokens: number,
    private refillRate: number // tokens per second
  ) {
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  allowRequest(): boolean {
    this.refill();

    if (this.tokens >= 1) {
      this.tokens--;
      return true;
    }

    return false;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    const tokensToAdd = elapsed * this.refillRate;

    this.tokens = Math.min(
      this.maxTokens,
      this.tokens + tokensToAdd
    );
    this.lastRefill = now;
  }
}

// Usage in Express
import { Request, Response, NextFunction } from 'express';

const limiters = new Map<string, RateLimiter>();

function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const clientId = req.ip || 'anonymous';

  if (!limiters.has(clientId)) {
    limiters.set(clientId, new RateLimiter(100, 10)); // 100 tokens, 10/sec refill
  }

  const limiter = limiters.get(clientId)!;

  if (limiter.allowRequest()) {
    next();
  } else {
    res.status(429).json({ error: 'Too many requests' });
  }
}
```

---

## Real-World Examples

### Design URL Shortener (bit.ly)

```
Requirements:
- Shorten long URLs
- Redirect to original URL
- Track clicks

Capacity:
- 100M new URLs per month
- 10:1 read:write ratio
- Store for 10 years

High-Level Design:
┌────────┐    POST /shorten     ┌─────────────┐
│ Client │─────────────────────►│ API Server  │
└────────┘                      └──────┬──────┘
    ▲                                  │
    │                                  ▼
    │                         ┌────────────────┐
    │     GET /:shortURL      │  Hash Generator│
    │◄────────────────────────┤  (Base62)      │
                              └────────┬───────┘
                                       │
                                       ▼
                              ┌────────────────┐
                              │    Database    │
                              │ shortURL→longURL│
                              │   + metadata   │
                              └────────────────┘

API:
POST /api/shorten
{
  "longURL": "https://example.com/very/long/url",
  "customAlias": "mylink" // optional
}

Response:
{
  "shortURL": "https://short.ly/abc123",
  "longURL": "https://example.com/very/long/url"
}

GET /:shortURL
→ 302 Redirect to longURL

Database Schema:
Table: urls
- id (PK)
- shortURL (unique index)
- longURL
- userId
- createdAt
- expiresAt
- clicks (counter)

Algorithm (Base62 encoding):
function generateShortURL(id: number): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  while (id > 0) {
    result = chars[id % 62] + result;
    id = Math.floor(id / 62);
  }

  return result || '0';
}

Optimizations:
- Cache popular URLs (Redis)
- Use CDN for redirects
- Analytics (write to queue, process async)
- Database sharding by hash
```

### Design Twitter

```
Requirements:
- Post tweets (280 chars)
- Follow users
- Timeline (own + following)
- Search tweets

Capacity:
- 500M users
- 200M daily active
- 100M tweets per day
- 500M timeline reads per day

High-Level Design:
                    ┌──────────────┐
                    │  API Gateway │
                    └───────┬──────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │  Tweet   │  │Timeline  │  │  User    │
        │ Service  │  │ Service  │  │ Service  │
        └─────┬────┘  └─────┬────┘  └─────┬────┘
              │             │             │
              ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Tweet DB │  │ Cache    │  │ User DB  │
        │(Cassandra)│  │ (Redis)  │  │(Postgres)│
        └──────────┘  └──────────┘  └──────────┘
              │
              ▼
        ┌──────────┐
        │  Queue   │
        │(Fanout)  │
        └──────────┘

Database Schema:
users: id, username, email, createdAt
tweets: id, userId, content, createdAt
follows: followerId, followeeId
likes: userId, tweetId

Timeline Generation:
1. Fan-out on write (pre-compute):
   - When user tweets, push to all followers' timelines
   - Fast reads
   - Slow writes for users with many followers

2. Fan-out on read (compute on request):
   - Fetch tweets from followed users
   - Merge and sort
   - Slow reads
   - Fast writes

Hybrid: Fan-out on write for most users, fan-out on read for celebrities
```

---

## Interview Tips

### How to Approach

1. **Ask Clarifying Questions** (5 min)
   - Functional requirements
   - Non-functional (scale, performance)
   - Constraints

2. **Estimate Capacity** (5 min)
   - QPS, storage, bandwidth
   - Shows you think about scale

3. **High-Level Design** (10 min)
   - Draw main components
   - Explain data flow
   - Keep it simple initially

4. **Deep Dive** (15 min)
   - Focus on 2-3 components
   - Database schema
   - API design
   - Algorithms

5. **Bottlenecks & Trade-offs** (5 min)
   - Single points of failure
   - Scalability issues
   - Performance optimizations

6. **Wrap Up** (5 min)
   - Monitoring
   - Security
   - Future improvements

### Common Mistakes

❌ Jumping to solution without requirements
❌ Not considering scale from the start
❌ Over-engineering (keep it simple first)
❌ Not explaining trade-offs
❌ Ignoring failure scenarios
❌ Not asking questions

### Key Topics to Know

✅ Load balancing
✅ Caching strategies
✅ Database replication & sharding
✅ CAP theorem
✅ Microservices vs monolith
✅ Message queues
✅ Rate limiting
✅ CDN
✅ Consistent hashing
✅ API design

### Practice Systems

- URL shortener
- Twitter/Facebook feed
- Instagram
- Uber/Lyft
- Netflix
- WhatsApp
- Google Drive
- E-commerce site
- Real-time chat
- Rate limiter

Good luck! 🚀
