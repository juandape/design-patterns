# Node.js Performance Optimization - EPAM Interview Prep

> **Target**: Senior Full Stack Developer Position
> **Focus**: Profiling, Debugging, Memory Leaks, Compression, Caching, Load Balancing, Clustering

---

## Table of Contents

1. [JavaScript Profiling and Debugging](#javascript-profiling-and-debugging)
2. [Performance Optimization Techniques](#performance-optimization-techniques)
3. [Memory Leaks](#memory-leaks)
4. [Compression](#compression)
5. [Caching](#caching)
6. [Clusterization and Scaling](#clusterization-and-scaling)
7. [Load Balancing](#load-balancing)

---

## JavaScript Profiling and Debugging

### Chrome DevTools Profiling

```javascript
// 1. Performance Tab
// - Record runtime performance
// - Identify bottlenecks
// - Analyze flame chart
// - See frame rate drops

// 2. Memory Tab
// - Heap snapshots
// - Allocation timeline
// - Memory leaks detection

// 3. console.time/timeEnd
console.time('operation');
// ... code to measure
console.timeEnd('operation'); // operation: 123.456ms

// 4. Performance API
const start = performance.now();
// ... code to measure
const end = performance.now();
console.log(`Execution time: ${end - start}ms`);

// 5. Performance marks and measures
performance.mark('start-task');
// ... task execution
performance.mark('end-task');
performance.measure('task-duration', 'start-task', 'end-task');

const measures = performance.getEntriesByType('measure');
console.log(measures[0].duration);

// 6. User Timing API
class PerformanceMonitor {
  static start(label) {
    performance.mark(`${label}-start`);
  }

  static end(label) {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);

    const measure = performance.getEntriesByName(label)[0];
    console.log(`${label}: ${measure.duration.toFixed(2)}ms`);

    // Clean up
    performance.clearMarks(`${label}-start`);
    performance.clearMarks(`${label}-end`);
    performance.clearMeasures(label);
  }
}

// Usage
PerformanceMonitor.start('database-query');
await db.query('SELECT * FROM users');
PerformanceMonitor.end('database-query');
```

---

### Node.js Profiling

```javascript
// 1. Built-in profiler
// node --prof app.js
// node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt

// 2. V8 profiler
const profiler = require('v8-profiler-next');
const fs = require('fs');

// Start profiling
const title = 'my-profile';
profiler.startProfiling(title, true);

// Run code to profile
performExpensiveOperation();

// Stop and save profile
const profile = profiler.stopProfiling(title);
profile.export((error, result) => {
  fs.writeFileSync(`${title}.cpuprofile`, result);
  profile.delete();
});

// Open .cpuprofile in Chrome DevTools (Performance > Load profile)

// 3. Clinic.js (comprehensive profiling)
// npm install -g clinic
// clinic doctor -- node app.js
// clinic flame -- node app.js
// clinic bubbleprof -- node app.js

// 4. Node.js Inspector
// node --inspect app.js
// Open chrome://inspect
// Click "inspect" to open DevTools

// 5. Performance hooks
const { PerformanceObserver, performance } = require('perf_hooks');

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});

obs.observe({ entryTypes: ['measure'] });

performance.mark('A');
// ... code
performance.mark('B');
performance.measure('A to B', 'A', 'B');
```

---

### Debugging Memory Issues

```javascript
// 1. Heap snapshots
const v8 = require('v8');
const fs = require('fs');

function takeHeapSnapshot() {
  const filename = `heap-${Date.now()}.heapsnapshot`;
  const heapSnapshot = v8.writeHeapSnapshot(filename);
  console.log(`Heap snapshot written to ${heapSnapshot}`);
}

// Take snapshot at different points
takeHeapSnapshot(); // Before
// ... run application
takeHeapSnapshot(); // After

// Compare snapshots in Chrome DevTools Memory tab

// 2. Trace garbage collection
// node --trace-gc app.js

// 3. Heap statistics
console.log(process.memoryUsage());
/*
{
  rss: 4935680,        // Resident Set Size (total memory)
  heapTotal: 1826816,  // V8 heap allocated
  heapUsed: 650472,    // V8 heap used
  external: 49879,     // C++ objects bound to JS
  arrayBuffers: 9386   // ArrayBuffers and SharedArrayBuffers
}
*/

// 4. Monitor memory continuously
function monitorMemory(interval = 5000) {
  setInterval(() => {
    const usage = process.memoryUsage();
    console.log({
      heapUsed: `${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      rss: `${(usage.rss / 1024 / 1024).toFixed(2)} MB`
    });
  }, interval);
}

monitorMemory();

// 5. Force garbage collection (for testing)
// node --expose-gc app.js
if (global.gc) {
  global.gc();
  console.log('Garbage collection executed');
}
```

---

## Performance Optimization Techniques

### 1. Event Loop Optimization

```javascript
// ❌ BAD: Blocking event loop
app.get('/bad', (req, res) => {
  const result = [];
  for (let i = 0; i < 1e9; i++) {
    result.push(i);
  }
  res.json(result);
});

// ✅ GOOD: Non-blocking with setImmediate
app.get('/good', (req, res) => {
  const result = [];
  let i = 0;

  function processChunk() {
    const chunkSize = 1e6;
    const end = Math.min(i + chunkSize, 1e9);

    for (; i < end; i++) {
      result.push(i);
    }

    if (i < 1e9) {
      setImmediate(processChunk);
    } else {
      res.json(result);
    }
  }

  processChunk();
});

// ✅ BETTER: Use worker threads for CPU-intensive tasks
const { Worker } = require('worker_threads');

app.get('/worker', (req, res) => {
  const worker = new Worker('./worker.js');

  worker.on('message', (result) => {
    res.json(result);
  });

  worker.on('error', (error) => {
    res.status(500).json({ error: error.message });
  });

  worker.postMessage({ start: 0, end: 1e9 });
});

// worker.js
const { parentPort } = require('worker_threads');

parentPort.on('message', ({ start, end }) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  parentPort.postMessage(result);
});
```

---

### 2. Database Optimization

```javascript
// ❌ BAD: N+1 query problem
async function getPostsWithAuthors() {
  const posts = await Post.findAll();

  for (const post of posts) {
    post.author = await User.findById(post.authorId); // N queries!
  }

  return posts;
}

// ✅ GOOD: Eager loading
async function getPostsWithAuthors() {
  return Post.findAll({
    include: [User] // Single query with JOIN
  });
}

// Connection pooling
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydb',
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Indexes
/*
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_created_at ON posts(created_at DESC);
*/

// Prepared statements (prevent SQL injection + performance)
const query = {
  text: 'SELECT * FROM users WHERE email = $1',
  values: [email]
};

const result = await pool.query(query);

// Pagination
app.get('/posts', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const posts = await Post.findAll({
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  res.json({
    data: posts,
    page,
    limit,
    total: await Post.count()
  });
});
```

---

### 3. Code Optimization

```javascript
// ❌ BAD: Inefficient array operations
function sumArray(arr) {
  return arr.reduce((sum, num) => sum + num, 0);
}

// Array of 1 million numbers
const numbers = Array.from({ length: 1e6 }, (_, i) => i);
sumArray(numbers); // Slow

// ✅ GOOD: Simple loop (faster for large arrays)
function sumArrayFast(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

sumArrayFast(numbers); // Much faster

// Object property access optimization
// ❌ BAD: Repeated property access
function process(obj) {
  console.log(obj.data.user.profile.name);
  console.log(obj.data.user.profile.email);
  console.log(obj.data.user.profile.age);
}

// ✅ GOOD: Cache property access
function processOptimized(obj) {
  const profile = obj.data.user.profile;
  console.log(profile.name);
  console.log(profile.email);
  console.log(profile.age);
}

// Memoization
function memoize(fn) {
  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const expensiveFunction = memoize((n) => {
  console.log('Computing...');
  return n * 2;
});

expensiveFunction(5); // Computing... 10
expensiveFunction(5); // 10 (cached)

// Debounce (limit function calls)
function debounce(fn, delay) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Throttle (execute at most once per interval)
function throttle(fn, interval) {
  let lastCall = 0;

  return (...args) => {
    const now = Date.now();

    if (now - lastCall >= interval) {
      lastCall = now;
      fn(...args);
    }
  };
}
```

---

## Memory Leaks

### Common Causes

```javascript
// 1. Global variables
// ❌ BAD: Accidental global
function createLeak() {
  leak = 'This is a global variable'; // Missing 'var/let/const'
}

// ✅ GOOD: Use strict mode
'use strict';
function noLeak() {
  let notGlobal = 'This is local';
}

// 2. Forgotten timers
// ❌ BAD: Timer never cleared
function startTimer() {
  setInterval(() => {
    console.log(new Date());
  }, 1000);
}

// ✅ GOOD: Clear timer when done
function startTimerCorrectly() {
  const intervalId = setInterval(() => {
    console.log(new Date());
  }, 1000);

  // Clear when component unmounts or route changes
  return () => clearInterval(intervalId);
}

// 3. Event listeners
// ❌ BAD: Listeners not removed
function addListeners() {
  const handler = () => console.log('clicked');
  document.addEventListener('click', handler);
}

// ✅ GOOD: Remove listeners
function addListenersCorrectly() {
  const handler = () => console.log('clicked');
  document.addEventListener('click', handler);

  return () => {
    document.removeEventListener('click', handler);
  };
}

// 4. Closures holding references
// ❌ BAD: Closure holds large object
function createClosure() {
  const largeObject = new Array(1000000).fill('data');

  return () => {
    console.log(largeObject[0]); // Holds entire array!
  };
}

// ✅ GOOD: Only keep what's needed
function createClosureCorrectly() {
  const largeObject = new Array(1000000).fill('data');
  const firstItem = largeObject[0];

  return () => {
    console.log(firstItem); // Only holds one item
  };
}

// 5. Detached DOM nodes
// ❌ BAD: Keeping reference to removed DOM
let detachedDiv = document.createElement('div');
document.body.appendChild(detachedDiv);
document.body.removeChild(detachedDiv);
// detachedDiv still in memory!

// ✅ GOOD: Clear reference
detachedDiv = null;

// 6. Circular references (old issue, mostly solved in modern JS)
function createCircular() {
  const obj1 = {};
  const obj2 = { ref: obj1 };
  obj1.ref = obj2; // Circular!
}
// Modern garbage collectors handle this

// 7. Cache without limits
// ❌ BAD: Unbounded cache
const cache = new Map();

function getCachedData(key) {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const data = expensiveOperation(key);
  cache.set(key, data); // Cache grows forever!
  return data;
}

// ✅ GOOD: LRU cache with size limit
class LRUCache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }

    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  set(key, value) {
    // Delete if exists (to re-insert at end)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Add new entry
    this.cache.set(key, value);

    // Evict oldest if over limit
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

const lruCache = new LRUCache(1000);
```

---

### Detection Tools

```javascript
// 1. process.memoryUsage()
function checkMemory() {
  const usage = process.memoryUsage();
  console.log({
    rss: `${(usage.rss / 1024 / 1024).toFixed(2)} MB`,
    heapUsed: `${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    heapTotal: `${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    external: `${(usage.external / 1024 / 1024).toFixed(2)} MB`
  });
}

setInterval(checkMemory, 5000);

// 2. Heap dump
const v8 = require('v8');
const fs = require('fs');

function captureHeapDump() {
  const filename = `heap-${Date.now()}.heapsnapshot`;
  v8.writeHeapSnapshot(filename);
  console.log(`Heap snapshot saved: ${filename}`);
}

// Take snapshots at different times and compare

// 3. Memory leak detection library
// npm install memwatch-next
const memwatch = require('memwatch-next');

memwatch.on('leak', (info) => {
  console.log('Memory leak detected:');
  console.log(info);
});

// 4. Chrome DevTools
// node --inspect app.js
// Open chrome://inspect
// Memory tab > Take heap snapshot > Compare
```

---

## Compression

### 1. Response Compression

```javascript
// Express compression middleware
const compression = require('compression');
const express = require('express');

const app = express();

// Enable compression
app.use(compression({
  level: 6, // Compression level (0-9, higher = more compression but slower)
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    // Don't compress if client doesn't support it
    if (req.headers['x-no-compression']) {
      return false;
    }

    // Use compression filter
    return compression.filter(req, res);
  }
}));

// Manual compression
const zlib = require('zlib');

app.get('/data', (req, res) => {
  const data = JSON.stringify({ large: 'data' });

  // Check if client accepts gzip
  const acceptEncoding = req.headers['accept-encoding'] || '';

  if (acceptEncoding.includes('gzip')) {
    zlib.gzip(data, (err, compressed) => {
      if (err) {
        return res.status(500).send('Compression error');
      }

      res.set({
        'Content-Encoding': 'gzip',
        'Content-Type': 'application/json'
      });
      res.send(compressed);
    });
  } else {
    res.json(data);
  }
});

// Brotli compression (better than gzip but slower)
const brotli = require('iltorb'); // or use zlib.brotli in Node.js 11.7+

app.get('/brotli', (req, res) => {
  const data = JSON.stringify({ large: 'data' });

  if (req.headers['accept-encoding'].includes('br')) {
    zlib.brotliCompress(Buffer.from(data), (err, compressed) => {
      if (err) {
        return res.status(500).send('Compression error');
      }

      res.set({
        'Content-Encoding': 'br',
        'Content-Type': 'application/json'
      });
      res.send(compressed);
    });
  } else {
    res.json(data);
  }
});

// Stream compression (for large files)
const fs = require('fs');

app.get('/large-file', (req, res) => {
  res.set({
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'gzip'
  });

  fs.createReadStream('large-file.txt')
    .pipe(zlib.createGzip())
    .pipe(res);
});
```

---

### 2. Asset Minification

```javascript
// JavaScript minification with Terser
const terser = require('terser');
const fs = require('fs');

const code = fs.readFileSync('script.js', 'utf8');

const minified = terser.minify(code, {
  compress: {
    dead_code: true,
    drop_console: true,
    drop_debugger: true
  },
  mangle: true // Shorten variable names
});

fs.writeFileSync('script.min.js', minified.code);

// CSS minification with clean-css
const CleanCSS = require('clean-css');

const css = fs.readFileSync('style.css', 'utf8');
const minified = new CleanCSS().minify(css);

fs.writeFileSync('style.min.css', minified.styles);

// HTML minification
const minify = require('html-minifier').minify;

const html = fs.readFileSync('index.html', 'utf8');
const minified = minify(html, {
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  minifyCSS: true,
  minifyJS: true
});

fs.writeFileSync('index.min.html', minified);
```

---

## Caching

### 1. In-Memory Caching

```javascript
// Simple cache
const cache = new Map();

async function getCachedData(key) {
  if (cache.has(key)) {
    console.log('Cache hit');
    return cache.get(key);
  }

  console.log('Cache miss');
  const data = await fetchFromDatabase(key);
  cache.set(key, data);

  return data;
}

// Cache with TTL (Time To Live)
class TTLCache {
  constructor(ttl = 60000) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    const expiresAt = Date.now() + this.ttl;
    this.cache.set(key, { value, expiresAt });
  }

  get(key) {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear() {
    this.cache.clear();
  }
}

const ttlCache = new TTLCache(5 * 60 * 1000); // 5 minutes

// Redis caching
const redis = require('redis');
const client = redis.createClient();

async function getCachedFromRedis(key) {
  const cached = await client.get(key);

  if (cached) {
    return JSON.parse(cached);
  }

  const data = await fetchFromDatabase(key);

  // Cache for 1 hour
  await client.setEx(key, 3600, JSON.stringify(data));

  return data;
}

// Cache invalidation
async function updateUser(userId, updates) {
  await database.update(userId, updates);

  // Invalidate cache
  await client.del(`user:${userId}`);
}

// Cache-aside pattern
async function getUser(userId) {
  const cacheKey = `user:${userId}`;

  // 1. Check cache
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. Fetch from database
  const user = await database.getUser(userId);

  // 3. Update cache
  await client.setEx(cacheKey, 3600, JSON.stringify(user));

  return user;
}
```

---

### 2. HTTP Caching

```javascript
const express = require('express');
const app = express();

// Cache-Control header
app.get('/static', (req, res) => {
  res.set('Cache-Control', 'public, max-age=31536000'); // 1 year
  res.send('Static content');
});

app.get('/dynamic', (req, res) => {
  res.set('Cache-Control', 'no-cache'); // Revalidate every time
  res.send('Dynamic content');
});

// ETag (conditional requests)
app.get('/data', (req, res) => {
  const data = { foo: 'bar' };
  const etag = generateETag(data);

  // Check If-None-Match header
  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end(); // Not Modified
  }

  res.set('ETag', etag);
  res.json(data);
});

function generateETag(data) {
  const crypto = require('crypto');
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
}

// Last-Modified (conditional requests)
app.get('/file', (req, res) => {
  const stats = fs.statSync('file.txt');
  const lastModified = stats.mtime.toUTCString();

  // Check If-Modified-Since header
  if (req.headers['if-modified-since'] === lastModified) {
    return res.status(304).end();
  }

  res.set('Last-Modified', lastModified);
  res.sendFile('file.txt');
});
```

---

### 3. CDN Caching

```javascript
// Serve static assets from CDN
app.use('/static', express.static('public', {
  maxAge: '1y', // Cache for 1 year
  immutable: true // Don't revalidate
}));

// Use versioned URLs for cache busting
// <script src="/static/app.v123.js"></script>

// Cloudflare CDN configuration
/*
Cache-Control: public, max-age=31536000
CDN-Cache-Control: max-age=86400 (separate CDN cache time)
*/

// Purge CDN cache after deployment
const axios = require('axios');

async function purgeCDNCache() {
  await axios.post('https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache', {
    purge_everything: true
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
}
```

---

## Clusterization and Scaling

### 1. Node.js Cluster Module

```javascript
const cluster = require('cluster');
const http = require('http');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers (one per CPU core)
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);

    // Replace dead worker
    console.log('Starting new worker...');
    cluster.fork();
  });

  // Send message to all workers
  function broadcast(message) {
    for (const id in cluster.workers) {
      cluster.workers[id].send(message);
    }
  }

} else {
  // Workers share TCP connection
  const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Handled by worker ${process.pid}\n`);
  });

  server.listen(3000);

  console.log(`Worker ${process.pid} started`);

  // Receive messages from master
  process.on('message', (msg) => {
    console.log(`Worker ${process.pid} received:`, msg);
  });
}

// Express with cluster
if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  const express = require('express');
  const app = express();

  app.get('/', (req, res) => {
    res.send(`Worker ${process.pid}`);
  });

  app.listen(3000);
}
```

---

### 2. PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Start application with PM2
pm2 start app.js

# Start in cluster mode (use all CPUs)
pm2 start app.js -i max

# Start with specific number of instances
pm2 start app.js -i 4

# List processes
pm2 list

# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart app

# Graceful reload (zero downtime)
pm2 reload app

# Stop application
pm2 stop app

# Delete from PM2
pm2 delete app

# Save process list
pm2 save

# Startup script (run PM2 on boot)
pm2 startup
```

```javascript
// ecosystem.config.js (PM2 configuration)
module.exports = {
  apps: [{
    name: 'api',
    script: './app.js',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    max_memory_restart: '500M', // Restart if memory exceeds 500MB
    autorestart: true,
    watch: false,
    ignore_watch: ['node_modules', 'logs']
  }]
};

// Start with config
// pm2 start ecosystem.config.js
```

---

## Load Balancing

### 1. Nginx Load Balancer

```nginx
# nginx.conf
http {
  upstream backend {
    # Load balancing methods:

    # Round-robin (default)
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;

    # Least connections
    # least_conn;

    # IP hash (sticky sessions)
    # ip_hash;

    # Weighted round-robin
    # server 127.0.0.1:3000 weight=3;
    # server 127.0.0.1:3001 weight=1;
  }

  server {
    listen 80;

    location / {
      proxy_pass http://backend;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

      # Health checks
      proxy_next_upstream error timeout invalid_header http_500;
      proxy_connect_timeout 2s;
    }
  }
}
```

---

### 2. Node.js Load Balancer

```javascript
const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const backends = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002'
];

let current = 0;

// Round-robin load balancing
const server = http.createServer((req, res) => {
  const target = backends[current];
  current = (current + 1) % backends.length;

  proxy.web(req, res, { target });
});

server.listen(80);

// Least connections load balancing
class LoadBalancer {
  constructor(backends) {
    this.backends = backends.map(url => ({
      url,
      connections: 0
    }));
  }

  getNext() {
    // Find backend with least connections
    return this.backends.reduce((min, backend) =>
      backend.connections < min.connections ? backend : min
    );
  }

  handleRequest(req, res) {
    const backend = this.getNext();
    backend.connections++;

    proxy.web(req, res, { target: backend.url }, () => {
      backend.connections--;
    });
  }
}

const lb = new LoadBalancer(backends);

http.createServer((req, res) => {
  lb.handleRequest(req, res);
}).listen(80);
```

---

## Interview Tips

**Q: How do you profile Node.js applications?**
A: Use Node.js built-in profiler (--prof), V8 profiler, Chrome DevTools (--inspect), Clinic.js, or performance hooks API.

**Q: How do you detect memory leaks?**
A: Monitor process.memoryUsage(), take heap snapshots with v8.writeHeapSnapshot(), use Chrome DevTools Memory tab, or libraries like memwatch-next.

**Q: What compression methods do you know?**
A: Gzip (most common), Brotli (better compression but slower), Deflate. Use compression middleware in Express or manual with zlib module.

**Q: Explain caching strategies.**
A: Cache-aside (check cache → miss → fetch → update cache), Write-through (write to cache and database together), Write-behind (write to cache, async to database), TTL-based expiration, LRU eviction.

**Q: How do you scale Node.js applications?**
A: Vertical scaling (bigger server), Horizontal scaling (more servers), Clustering (use all CPU cores with cluster module or PM2), Load balancing (distribute traffic with Nginx or software load balancers).

Good luck! 🚀
