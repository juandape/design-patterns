# Day 3: Node.js Backend - Conceptual Questions

## 🎯 Senior Backend Developer Concepts

---

## 1. Node.js Architecture

### Q1: Explain Node.js event-driven architecture

**Answer:**

**Key components:**

1. **Event Loop**: Single-threaded, non-blocking I/O
2. **Event Queue**: Stores callbacks for async operations
3. **Thread Pool**: Handles heavy I/O operations (libuv)
4. **V8 Engine**: JavaScript execution

**How it works:**

- Node.js runs on single thread for JavaScript execution
- Async operations delegated to thread pool (libuv)
- When operation completes, callback added to event queue
- Event loop picks callbacks and executes them

**Benefits:**

- Handles many concurrent connections efficiently
- Non-blocking I/O
- Great for I/O-intensive applications

**Not ideal for:**

- CPU-intensive tasks (blocks event loop)
- Should use worker threads for heavy computation

```javascript
// Non-blocking I/O example
const fs = require('fs').promises;

async function readFiles() {
  // These run concurrently!
  const [file1, file2, file3] = await Promise.all([
    fs.readFile('file1.txt', 'utf8'),
    fs.readFile('file2.txt', 'utf8'),
    fs.readFile('file3.txt', 'utf8')
  ]);

  return { file1, file2, file3 };
}
```

### Q2: What are Streams in Node.js?

**Answer:**

**Streams**: Handle data in chunks instead of all at once

**Types:**

1. **Readable**: Read data (fs.createReadStream, http request)
2. **Writable**: Write data (fs.createWriteStream, http response)
3. **Duplex**: Both read and write (TCP socket)
4. **Transform**: Modify data while reading/writing (zlib, crypto)

**Benefits:**

- Memory efficient (process large files)
- Time efficient (start processing before all data arrives)
- Composable (pipe streams together)

```javascript
const fs = require('fs');
const zlib = require('zlib');

// Bad: Loads entire file into memory
fs.readFile('large-file.txt', (err, data) => {
  // 1GB file = 1GB in memory!
});

// Good: Streams data in chunks
const readStream = fs.createReadStream('large-file.txt');
const writeStream = fs.createWriteStream('output.txt.gz');
const gzip = zlib.createGzip();

// Pipe: read -> compress -> write
readStream
  .pipe(gzip)
  .pipe(writeStream)
  .on('finish', () => console.log('Done'));

// Modern approach with pipeline
const { pipeline } = require('stream').promises;

async function compressFile() {
  await pipeline(
    fs.createReadStream('input.txt'),
    zlib.createGzip(),
    fs.createWriteStream('output.txt.gz')
  );
}
```

---

## 2. Express.js & Middleware

### Q3: How does Express middleware work?

**Answer:**

**Middleware**: Functions that have access to request, response, and next()

**Order matters!** Middleware executes in sequence.

```javascript
const express = require('express');
const app = express();

// 1. Application-level middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Pass to next middleware
});

// 2. Built-in middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// 3. Third-party middleware
const cors = require('cors');
app.use(cors());

// 4. Router-level middleware
const router = express.Router();

router.use('/admin', (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});

// 5. Error-handling middleware (4 parameters!)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Custom middleware example
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Usage
app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});
```

### Q4: How do you handle errors in Express?

**Answer:**

**Error handling strategies:**

```javascript
// 1. Synchronous error handling
app.get('/user/:id', (req, res, next) => {
  try {
    const user = getUserById(req.params.id);
    if (!user) {
      throw new Error('User not found'); // Caught by try/catch
    }
    res.json(user);
  } catch (error) {
    next(error); // Pass to error middleware
  }
});

// 2. Async error handling - use wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/async-user/:id', asyncHandler(async (req, res) => {
  const user = await getUserByIdAsync(req.params.id);
  if (!user) {
    throw new Error('User not found'); // Caught by asyncHandler
  }
  res.json(user);
}));

// 3. Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json(user);
}));

// 4. Error handling middleware
app.use((err, req, res, next) => {
  // Log error
  console.error(err);

  // Operational error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Programming or unknown error
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong'
  });
});

// 5. Unhandled rejection/exception handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});
```

---

## 3. Authentication & Authorization

### Q5: Explain JWT authentication

**Answer:**

**JWT (JSON Web Token)**: Stateless authentication

**Structure:**

- Header (algorithm, type)
- Payload (claims/data)
- Signature (verification)

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Sign up
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user
  const user = await User.create({
    email,
    password: hashedPassword
  });

  res.status(201).json({ message: 'User created' });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token });
});

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// Protected route
app.get('/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Refresh token pattern
app.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  // Verify refresh token
  const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  // Generate new access token
  const accessToken = jwt.sign(
    { userId: user.userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  res.json({ accessToken });
});
```

**JWT vs Sessions:**

| JWT                          | Sessions               |
| ---------------------------- | ---------------------- |
| Stateless                    | Stateful               |
| Scalable (no server storage) | Requires session store |
| Cannot revoke easily         | Easy to revoke         |
| Larger payload               | Smaller cookie         |
| Good for microservices       | Good for monoliths     |

### Q6: How do you implement role-based authorization?

**Answer:**

```javascript
// Role-based middleware
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}

// Usage
app.delete('/users/:id',
  authenticateToken,
  authorize('admin'),
  async (req, res) => {
    await User.deleteById(req.params.id);
    res.json({ message: 'User deleted' });
  }
);

// Permission-based authorization
const permissions = {
  'user:read': ['admin', 'user', 'guest'],
  'user:write': ['admin'],
  'user:delete': ['admin'],
  'post:create': ['admin', 'user']
};

function can(permission) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!permissions[permission]?.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Usage
app.post('/posts', authenticateToken, can('post:create'), createPost);
app.delete('/users/:id', authenticateToken, can('user:delete'), deleteUser);
```

---

## 4. Streams and Buffers (Deep Dive)

### Q7: Explain Streams in detail with all types

**Answer:**

**Stream Types:**

```javascript
const { Readable, Writable, Duplex, Transform } = require('stream');
const fs = require('fs');

// 1. READABLE STREAM
class CustomReadable extends Readable {
  constructor(data) {
    super();
    this.data = data;
    this.index = 0;
  }

  _read() {
    if (this.index < this.data.length) {
      this.push(this.data[this.index]);
      this.index++;
    } else {
      this.push(null); // Signal end of stream
    }
  }
}

const readable = new CustomReadable(['chunk1', 'chunk2', 'chunk3']);

readable.on('data', (chunk) => {
  console.log('Received:', chunk.toString());
});

readable.on('end', () => {
  console.log('Stream ended');
});

// 2. WRITABLE STREAM
class CustomWritable extends Writable {
  _write(chunk, encoding, callback) {
    console.log('Writing:', chunk.toString());
    callback(); // Signal write complete
  }
}

const writable = new CustomWritable();
writable.write('Hello');
writable.write('World');
writable.end();

// 3. DUPLEX STREAM (both readable and writable)
const { Duplex } = require('stream');
const net = require('net');

// TCP socket is duplex
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    socket.write(`Echo: ${data}`);
  });
});

// 4. TRANSFORM STREAM (modify data)
class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    const upperChunk = chunk.toString().toUpperCase();
    this.push(upperChunk);
    callback();
  }
}

const transform = new UpperCaseTransform();

// Use transform stream
process.stdin
  .pipe(transform)
  .pipe(process.stdout);

// Practical: File compression
const zlib = require('zlib');

fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('output.txt.gz'))
  .on('finish', () => console.log('Compression complete'));
```

**Stream Events:**

```javascript
const stream = fs.createReadStream('file.txt');

stream.on('data', (chunk) => {
  // Data available
  console.log(`Received ${chunk.length} bytes`);
});

stream.on('end', () => {
  // No more data
  console.log('Stream ended');
});

stream.on('error', (err) => {
  // Error occurred
  console.error('Stream error:', err);
});

stream.on('close', () => {
  // Stream closed
  console.log('Stream closed');
});

stream.on('pause', () => {
  // Stream paused
});

stream.on('resume', () => {
  // Stream resumed
});
```

**Stream Modes:**

```javascript
// Flowing mode (data events)
stream.on('data', (chunk) => {
  // Automatically flows
});

// Paused mode (manual read)
stream.on('readable', () => {
  let chunk;
  while ((chunk = stream.read()) !== null) {
    console.log(chunk.toString());
  }
});

// Backpressure handling
const writable = fs.createWriteStream('output.txt');
const readable = fs.createReadStream('input.txt');

readable.on('data', (chunk) => {
  const canContinue = writable.write(chunk);

  if (!canContinue) {
    // Writable buffer full, pause reading
    readable.pause();
  }
});

writable.on('drain', () => {
  // Writable buffer emptied, resume reading
  readable.resume();
});
```

### Q8: What are Buffers and when to use them?

**Answer:**

**Buffer**: Binary data storage in Node.js (like array of bytes)

```javascript
// Create buffers
const buf1 = Buffer.from('Hello'); // From string
const buf2 = Buffer.from([72, 101, 108, 108, 111]); // From array
const buf3 = Buffer.alloc(10); // Allocate 10 bytes (filled with 0)
const buf4 = Buffer.allocUnsafe(10); // Faster but may contain old data

// Read/Write
const buf = Buffer.alloc(10);
buf.write('Hello');
console.log(buf.toString()); // 'Hello'
console.log(buf.toString('hex')); // Hexadecimal
console.log(buf.toString('base64')); // Base64

// Buffer operations
const buf5 = Buffer.from('Hello');
const buf6 = Buffer.from(' World');
const combined = Buffer.concat([buf5, buf6]);
console.log(combined.toString()); // 'Hello World'

// Slice (creates view, not copy)
const buf7 = Buffer.from('Hello World');
const slice = buf7.slice(0, 5);
console.log(slice.toString()); // 'Hello'

// Copy
const buf8 = Buffer.alloc(5);
buf7.copy(buf8, 0, 0, 5);

// Compare
const buf9 = Buffer.from('abc');
const buf10 = Buffer.from('abcd');
console.log(buf9.compare(buf10)); // -1 (buf9 < buf10)

// Use cases
// 1. File I/O
const fs = require('fs');
const buffer = fs.readFileSync('image.png');
console.log(buffer); // <Buffer 89 50 4e 47 ...>

// 2. Network I/O
const net = require('net');
const server = net.createServer((socket) => {
  socket.on('data', (buffer) => {
    console.log('Received:', buffer.length, 'bytes');
  });
});

// 3. Cryptography
const crypto = require('crypto');
const hash = crypto.createHash('sha256');
hash.update(Buffer.from('password'));
const hashed = hash.digest(); // Returns Buffer

// 4. Binary protocol parsing
function parseProtocol(buffer) {
  const type = buffer.readUInt8(0);
  const length = buffer.readUInt16BE(1);
  const data = buffer.slice(3, 3 + length);
  return { type, length, data };
}
```

---

## 5. Child Processes and Worker Threads

### Q9: How do Child Processes work?

**Answer:**

**Child Processes**: Run separate Node.js processes

```javascript
const { spawn, exec, execFile, fork } = require('child_process');

// 1. SPAWN - Stream-based, good for large output
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`Output: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`Error: ${data}`);
});

ls.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});

// 2. EXEC - Buffer-based, good for small output
exec('ls -lh /usr', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  console.log(`Output: ${stdout}`);
});

// 3. EXECFILE - Execute file directly (safer)
execFile('node', ['--version'], (error, stdout, stderr) => {
  console.log(`Node version: ${stdout}`);
});

// 4. FORK - Create Node.js child process with IPC
// parent.js
const child = fork('./child.js');

child.on('message', (msg) => {
  console.log('Message from child:', msg);
});

child.send({ hello: 'child' });

// child.js
process.on('message', (msg) => {
  console.log('Message from parent:', msg);
  process.send({ hello: 'parent' });
});
```

**Use Cases:**

```javascript
// CPU-intensive task in child process
// parent.js
const { fork } = require('child_process');

function fibonacci(n) {
  const child = fork('./fib-worker.js');

  return new Promise((resolve, reject) => {
    child.on('message', (result) => {
      resolve(result);
      child.kill();
    });

    child.on('error', reject);

    child.send({ n });
  });
}

fibonacci(40).then(result => {
  console.log('Fibonacci:', result);
});

// fib-worker.js
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

process.on('message', ({ n }) => {
  const result = fib(n);
  process.send(result);
});
```

### Q10: What are Worker Threads and when to use them?

**Answer:**

**Worker Threads**: True parallel processing within same Node.js process

```javascript
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // Main thread
  const worker = new Worker(__filename, {
    workerData: { num: 10 }
  });

  worker.on('message', (result) => {
    console.log('Result from worker:', result);
  });

  worker.on('error', (err) => {
    console.error('Worker error:', err);
  });

  worker.on('exit', (code) => {
    console.log(`Worker exited with code ${code}`);
  });
} else {
  // Worker thread
  const { num } = workerData;

  function fibonacci(n) {
    if (n < 2) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }

  const result = fibonacci(num);
  parentPort.postMessage(result);
}
```

**Worker Pool Pattern:**

```javascript
const { Worker } = require('worker_threads');

class WorkerPool {
  constructor(workerScript, poolSize = 4) {
    this.workerScript = workerScript;
    this.poolSize = poolSize;
    this.workers = [];
    this.queue = [];

    for (let i = 0; i < poolSize; i++) {
      this.workers.push({ worker: null, available: true });
    }
  }

  async runTask(data) {
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject };

      const availableWorker = this.workers.find(w => w.available);

      if (availableWorker) {
        this.executeTask(availableWorker, task);
      } else {
        this.queue.push(task);
      }
    });
  }

  executeTask(workerSlot, task) {
    workerSlot.available = false;

    const worker = new Worker(this.workerScript, {
      workerData: task.data
    });

    worker.on('message', (result) => {
      task.resolve(result);
      worker.terminate();
      workerSlot.available = true;

      // Process next task in queue
      if (this.queue.length > 0) {
        const nextTask = this.queue.shift();
        this.executeTask(workerSlot, nextTask);
      }
    });

    worker.on('error', (err) => {
      task.reject(err);
      worker.terminate();
      workerSlot.available = true;
    });
  }
}

// Usage
const pool = new WorkerPool('./worker.js', 4);

async function processData() {
  const results = await Promise.all([
    pool.runTask({ num: 40 }),
    pool.runTask({ num: 41 }),
    pool.runTask({ num: 42 }),
    pool.runTask({ num: 43 })
  ]);

  console.log('Results:', results);
}
```

**Child Process vs Worker Threads:**

| Feature       | Child Process        | Worker Threads         |
| ------------- | -------------------- | ---------------------- |
| Memory        | Separate memory      | Shared memory          |
| Startup       | Slower               | Faster                 |
| Communication | IPC (slower)         | Shared memory (faster) |
| Use case      | Heavy isolated tasks | CPU-intensive tasks    |
| Overhead      | Higher               | Lower                  |

---

## 6. NPM and YARN

### Q11: Explain NPM commands and package.json

**Answer:**

**Common NPM commands:**

```bash
# Initialize project
npm init
npm init -y  # Skip questions

# Install dependencies
npm install express
npm install --save express  # Same as above (default)
npm install --save-dev jest  # Dev dependency
npm install -g typescript  # Global install

# Install from package.json
npm install
npm ci  # Clean install (faster, for CI/CD)

# Update packages
npm update
npm update express
npm outdated  # Check for updates

# Remove packages
npm uninstall express
npm uninstall --save-dev jest

# Scripts
npm run dev
npm run build
npm test  # npm run test
npm start  # npm run start

# List packages
npm list
npm list --depth=0  # Top-level only
npm list -g  # Global packages

# Package info
npm view express
npm view express versions  # All versions

# Audit security
npm audit
npm audit fix
npm audit fix --force

# Cache management
npm cache clean --force
```

**package.json structure:**

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "My application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint ."
  },
  "keywords": ["api", "backend"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "~7.0.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "nodemon": "^2.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

**Version syntax:**

```
^4.18.0  → 4.x.x (>=4.18.0 <5.0.0) - caret
~4.18.0  → 4.18.x (>=4.18.0 <4.19.0) - tilde
4.18.0   → Exact version
*        → Latest version
>=4.18.0 → Greater than or equal
```

**package-lock.json:**

- Locks exact versions of all dependencies
- Ensures consistent installs across environments
- Should be committed to git

### Q12: NPM vs YARN differences

**Answer:**

**YARN commands:**

```bash
# Install
yarn
yarn add express
yarn add --dev jest
yarn global add typescript

# Remove
yarn remove express

# Update
yarn upgrade
yarn upgrade express

# Scripts
yarn dev
yarn build
yarn test

# Info
yarn list
yarn info express

# Lock file
yarn.lock  # Similar to package-lock.json

# Workspaces (monorepo)
yarn workspaces run build
```

**Key differences:**

| Feature       | NPM               | YARN              |
| ------------- | ----------------- | ----------------- |
| Lock file     | package-lock.json | yarn.lock         |
| Install speed | Slower            | Faster (parallel) |
| Offline mode  | Limited           | Full support      |
| Workspaces    | Yes (v7+)         | Yes (better)      |
| Security      | npm audit         | yarn audit        |
| Cache         | npm cache         | yarn cache        |

**Modern: pnpm (alternative)**

```bash
pnpm install  # Saves disk space with hard links
pnpm add express
pnpm run dev
```

---

## 7. NestJS Framework

### Q13: What is NestJS and its architecture?

**Answer:**

**NestJS**: Progressive Node.js framework (like Angular for backend)

**Key features:**

- TypeScript by default
- Modular architecture
- Dependency injection
- Decorators
- Built-in testing
- GraphQL support

**Architecture:**

```typescript
// 1. MODULE - Organize application
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [],  // Import other modules
  controllers: [UsersController],  // HTTP handlers
  providers: [UsersService],  // Services, repositories
  exports: [UsersService]  // Export for other modules
})
export class UsersModule {}

// 2. CONTROLLER - Handle HTTP requests
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}

// 3. SERVICE - Business logic
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [];

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    return this.users.find(user => user.id === id);
  }

  create(user: CreateUserDto) {
    this.users.push(user);
    return user;
  }
}

// 4. DTO - Data Transfer Object
export class CreateUserDto {
  name: string;
  email: string;
  age: number;
}

// 5. MAIN - Bootstrap application
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

**Dependency Injection:**

```typescript
// Injectable service
@Injectable()
export class DatabaseService {
  connect() {
    console.log('Connected to database');
  }
}

// Inject into another service
@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async getUsers() {
    this.db.connect();
    // ...
  }
}
```

**Middleware:**

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
  }
}

// Apply in module
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
```

**Guards (Authorization):**

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  validateRequest(request: any): boolean {
    // Check JWT token, etc.
    return !!request.headers.authorization;
  }
}

// Use in controller
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  // All routes protected
}
```

**Pipes (Validation):**

```typescript
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}

// Use in controller
@Post()
create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

---

## 8. Databases: SQL vs NoSQL

### Q7: Explain the differences between SQL and NoSQL databases

**Answer:**

### SQL (Relational Databases)

**Examples**: PostgreSQL, MySQL, SQL Server, Oracle

**Characteristics:**

- **Schema-based**: Fixed structure, must be defined upfront
- **ACID compliance**: Atomicity, Consistency, Isolation, Durability
- **Relationships**: Foreign keys, JOINs between tables
- **Vertical scaling**: Scale up (bigger server)
- **Structured data**: Rows and columns

**When to use:**

- Complex queries with multiple JOINs
- Transactions are critical (banking, e-commerce)
- Data integrity is paramount
- Structured, relational data
- Reporting and analytics

```typescript
// PostgreSQL with Prisma example
// schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  posts     Post[]   // One-to-many relationship
  profile   Profile? // One-to-one relationship
  createdAt DateTime @default(now())
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  tags      Tag[]    // Many-to-many relationship
  createdAt DateTime @default(now())
}

model Tag {
  id    String @id @default(uuid())
  name  String @unique
  posts Post[]
}

// Complex JOIN query
const postsWithAuthors = await prisma.post.findMany({
  include: {
    author: {
      select: { name: true, email: true }
    },
    tags: true
  },
  where: {
    createdAt: {
      gte: new Date('2024-01-01')
    },
    author: {
      email: {
        endsWith: '@company.com'
      }
    }
  }
});
```

### NoSQL (Non-Relational Databases)

**Types:**

1. **Document**: MongoDB, CouchDB
2. **Key-Value**: Redis, DynamoDB
3. **Column-Family**: Cassandra, HBase
4. **Graph**: Neo4j, ArangoDB

**Characteristics:**

- **Schema-less**: Flexible structure, can change on the fly
- **BASE compliance**: Basically Available, Soft state, Eventual consistency
- **No relationships**: Denormalized data, embed instead of JOIN
- **Horizontal scaling**: Scale out (more servers)
- **Unstructured/semi-structured data**: JSON documents, key-value pairs

**When to use:**

- Rapid development (changing requirements)
- Massive scale (millions of users)
- Real-time data (social feeds, IoT)
- Flexible schema (different data shapes)
- High write throughput

```typescript
// MongoDB example
interface UserDocument {
  _id: ObjectId;
  email: string;
  name: string;
  profile: {
    bio: string;
    avatar: string;
    socialLinks: string[];
  };
  posts: Array<{  // Embedded documents (denormalized)
    title: string;
    content: string;
    tags: string[];
    createdAt: Date;
  }>;
  createdAt: Date;
}

// MongoDB query
const users = await db.collection('users').aggregate([
  {
    $match: {
      'posts.tags': { $in: ['javascript', 'typescript'] }
    }
  },
  {
    $unwind: '$posts'
  },
  {
    $group: {
      _id: '$_id',
      name: { $first: '$name' },
      postCount: { $sum: 1 }
    }
  }
]);

// Redis for caching
await redis.set(`user:${userId}`, JSON.stringify(user), 'EX', 3600); // 1 hour TTL
const cachedUser = await redis.get(`user:${userId}`);
```

### Comparison Table

| Feature            | SQL                   | NoSQL                          |
| ------------------ | --------------------- | ------------------------------ |
| **Schema**         | Fixed, predefined     | Flexible, dynamic              |
| **Scaling**        | Vertical (scale up)   | Horizontal (scale out)         |
| **Relationships**  | JOINs, foreign keys   | Embedded docs, denormalization |
| **Transactions**   | Full ACID support     | Limited (eventual consistency) |
| **Query Language** | SQL (standardized)    | Varies by database             |
| **Data Structure** | Tables, rows, columns | Documents, key-value, graphs   |
| **Use Cases**      | Banking, ERP, CRM     | Social media, IoT, real-time   |
| **Consistency**    | Strong consistency    | Eventual consistency           |

### Hybrid Approach (Polyglot Persistence)

**Real-world example:**

```typescript
// Use PostgreSQL for user data and transactions
const user = await prisma.user.create({
  data: { email, password: hashedPassword }
});

// Use MongoDB for user activity logs (flexible schema)
await activityLog.insertOne({
  userId: user.id,
  action: 'signup',
  metadata: {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    referrer: req.headers.referer
  },
  timestamp: new Date()
});

// Use Redis for session storage and caching
await redis.setex(`session:${sessionId}`, 3600, JSON.stringify({
  userId: user.id,
  role: user.role
}));

// Use Elasticsearch for full-text search
await elasticClient.index({
  index: 'users',
  id: user.id,
  body: {
    name: user.name,
    email: user.email,
    bio: user.profile?.bio
  }
});
```

---

### Q8: How would you optimize database queries?

**Answer:**

**SQL Optimization:**

```typescript
// ❌ BAD: N+1 query problem
const users = await db.query('SELECT * FROM users');
for (const user of users) {
  // Executes 1 query per user!
  user.posts = await db.query('SELECT * FROM posts WHERE author_id = ?', [user.id]);
}

// ✅ GOOD: Single query with JOIN
const usersWithPosts = await db.query(`
  SELECT
    u.*,
    p.id as post_id,
    p.title as post_title,
    p.content as post_content
  FROM users u
  LEFT JOIN posts p ON p.author_id = u.id
`);

// ✅ GOOD: Use indexes
// Create index on frequently queried columns
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_users_email ON users(email); // Unique index

// ✅ GOOD: Pagination with cursor-based approach
const posts = await db.query(`
  SELECT * FROM posts
  WHERE created_at < ?
  ORDER BY created_at DESC
  LIMIT 20
`, [lastPostCreatedAt]);

// ✅ GOOD: Use EXPLAIN to analyze queries
EXPLAIN ANALYZE
SELECT * FROM posts
WHERE author_id = '123'
AND created_at > '2024-01-01';
```

**NoSQL Optimization (MongoDB):**

```typescript
// ✅ GOOD: Create indexes
await db.collection('posts').createIndex({ authorId: 1 });
await db.collection('posts').createIndex({ createdAt: -1 });
await db.collection('posts').createIndex({ tags: 1 }); // Array index

// ✅ GOOD: Compound index for multiple fields
await db.collection('posts').createIndex({
  authorId: 1,
  createdAt: -1
});

// ✅ GOOD: Use projection to limit returned fields
const posts = await db.collection('posts').find(
  { authorId: userId },
  { projection: { title: 1, createdAt: 1, _id: 0 } }
);

// ✅ GOOD: Aggregation pipeline for complex queries
const stats = await db.collection('posts').aggregate([
  { $match: { createdAt: { $gte: startDate } } },
  { $group: {
      _id: '$authorId',
      count: { $sum: 1 },
      avgLikes: { $avg: '$likes' }
    }
  },
  { $sort: { count: -1 } },
  { $limit: 10 }
]);

// ✅ GOOD: Use explain() to analyze queries
const explain = await db.collection('posts')
  .find({ authorId: userId })
  .explain('executionStats');
```

**Caching Strategy:**

```typescript
class PostRepository {
  constructor(
    private db: Database,
    private cache: Redis
  ) {}

  async findById(id: string): Promise<Post | null> {
    // Try cache first
    const cacheKey = `post:${id}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Cache miss - query database
    const post = await this.db.query('SELECT * FROM posts WHERE id = ?', [id]);

    if (post) {
      // Store in cache for 1 hour
      await this.cache.setex(cacheKey, 3600, JSON.stringify(post));
    }

    return post;
  }

  async update(id: string, data: Partial<Post>): Promise<Post> {
    const post = await this.db.query(
      'UPDATE posts SET title = ?, content = ? WHERE id = ? RETURNING *',
      [data.title, data.content, id]
    );

    // Invalidate cache
    await this.cache.del(`post:${id}`);

    return post;
  }
}
```

---

## 5. Database Patterns

### Q7: Explain Repository pattern

**Answer:**

**Repository Pattern**: Abstraction layer between business logic and data access

```typescript
// Entity
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// Repository interface
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

// Implementation with Prisma
class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    return this.prisma.user.create({ data: userData });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}

// Service layer uses repository
class UserService {
  constructor(private userRepository: IUserRepository) {}

  async createUser(email: string, name: string): Promise<User> {
    // Business logic
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error('User already exists');
    }

    return this.userRepository.create({ email, name });
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

// Usage in controller
const userRepository = new PrismaUserRepository(prisma);
const userService = new UserService(userRepository);

app.post('/users', async (req, res) => {
  const user = await userService.createUser(req.body.email, req.body.name);
  res.json(user);
});
```

**Benefits:**

- Separation of concerns
- Easier testing (mock repository)
- Can swap database implementations
- Centralized data access logic

---

## 5. Caching Strategies

### Q8: What caching strategies would you use?

**Answer:**

**1. In-Memory Caching (Node Cache)**

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

app.get('/users/:id', async (req, res) => {
  const cached = cache.get(`user:${req.params.id}`);
  if (cached) {
    return res.json(cached);
  }

  const user = await User.findById(req.params.id);
  cache.set(`user:${req.params.id}`, user);
  res.json(user);
});
```

**2. Redis Caching**

```javascript
const redis = require('redis');
const client = redis.createClient();

async function getCachedData(key, fetchFunction) {
  // Try cache first
  const cached = await client.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch from database
  const data = await fetchFunction();

  // Store in cache
  await client.setEx(key, 3600, JSON.stringify(data)); // 1 hour

  return data;
}

app.get('/products', async (req, res) => {
  const products = await getCachedData(
    'products:all',
    () => Product.findAll()
  );
  res.json(products);
});
```

**3. Cache Invalidation**

```javascript
// Invalidate on update
app.put('/users/:id', async (req, res) => {
  const user = await User.update(req.params.id, req.body);

  // Invalidate cache
  cache.del(`user:${req.params.id}`);
  await client.del(`user:${req.params.id}`);

  res.json(user);
});

// Pattern-based invalidation
async function invalidatePattern(pattern) {
  const keys = await client.keys(pattern);
  if (keys.length > 0) {
    await client.del(keys);
  }
}

// Invalidate all user caches
await invalidatePattern('user:*');
```

**4. Cache-Aside (Lazy Loading)**

- Application checks cache first
- On miss, loads from DB and updates cache

**5. Write-Through**

- Write to cache and DB simultaneously
- Ensures cache consistency

**6. Write-Behind**

- Write to cache immediately
- Async write to DB
- Better performance, risk of data loss

---

## 6. Testing

### Q9: How do you test Node.js applications?

**Answer:**

**Test Pyramid:**

1. Unit tests (70%)
2. Integration tests (20%)
3. E2E tests (10%)

```javascript
// Unit test with Jest
// userService.test.ts
import { UserService } from './userService';

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      // ... other methods
    } as any;

    userService = new UserService(mockRepository);
  });

  describe('createUser', () => {
    it('should create a user when email is unique', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        createdAt: new Date()
      });

      const user = await userService.createUser('test@test.com', 'Test User');

      expect(user.email).toBe('test@test.com');
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw error when email already exists', async () => {
      mockRepository.findByEmail.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        name: 'Existing User',
        createdAt: new Date()
      });

      await expect(
        userService.createUser('test@test.com', 'Test User')
      ).rejects.toThrow('User already exists');
    });
  });
});

// Integration test with Supertest
// app.test.ts
import request from 'supertest';
import app from './app';

describe('User API', () => {
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          email: 'test@test.com',
          name: 'Test User'
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('test@test.com');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          email: 'invalid-email',
          name: 'Test User'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by id', async () => {
      const response = await request(app)
        .get('/users/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', '1');
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/users/999')
        .expect(404);
    });
  });
});
```

---

## 🎯 Quick Fire Node.js Questions

1. **What is the difference between `require` and `import`?**
   - `require`: CommonJS, synchronous
   - `import`: ES modules, can be async, static analysis

2. **What is `process.nextTick()` vs `setImmediate()`?**
   - `process.nextTick()`: Executes before I/O events
   - `setImmediate()`: Executes after I/O events

3. **How do you handle file uploads?**
   - Use `multer` middleware for multipart/form-data

4. **What is clustering in Node.js?**
   - Spawn multiple processes to utilize all CPU cores

5. **How do you secure a Node.js API?**
   - HTTPS, helmet, rate limiting, input validation, CORS, JWT

6. **What is the purpose of `package-lock.json`?**
   - Lock exact dependency versions for consistent installs

7. **What is middleware in Express?**
   - Functions with access to req, res, next

8. **How do you handle CORS?**
   - Use `cors` middleware or manually set headers

9. **What are environment variables?**
   - Configuration values stored outside code (use dotenv)

10. **What is the difference between `==` and `===`?**
    - `==`: Type coercion, `===`: Strict equality

---

## 📝 Practice Tips

1. **Build a REST API from scratch**
2. **Implement authentication patterns**
3. **Practice error handling**
4. **Write tests for your code**
5. **Explain architectural decisions**

---

## ⭐ SOLID Principles in Node.js/Backend Context

### S - Single Responsibility Principle

**Each class/module should have ONE reason to change**

```typescript
// ❌ BAD: UserService does too many things
class UserService {
  async createUser(data) {
    // validate
    if (!data.email) throw new Error('Invalid');
    // send email
    await emailService.send(data.email, 'Welcome');
    // save to DB
    await db.users.create(data);
    // log
    console.log('User created');
  }
}

// ✅ GOOD: Separate responsibilities
class UserValidator {
  validate(data: UserData): void {
    if (!data.email) throw new ValidationError('Email required');
    if (!this.isValidEmail(data.email)) throw new ValidationError('Invalid email');
  }
}

class UserRepository {
  async create(user: User): Promise<User> {
    return await this.db.users.create(user);
  }
}

class EmailNotificationService {
  async sendWelcomeEmail(email: string): Promise<void> {
    await this.emailClient.send(email, 'Welcome to our platform!');
  }
}

class UserService {
  constructor(
    private validator: UserValidator,
    private repository: UserRepository,
    private emailService: EmailNotificationService,
    private logger: Logger
  ) {}

  async createUser(data: UserData): Promise<User> {
    this.validator.validate(data);
    const user = await this.repository.create(data);
    await this.emailService.sendWelcomeEmail(user.email);
    this.logger.info('User created', { userId: user.id });
    return user;
  }
}
```

### O - Open/Closed Principle

**Open for extension, closed for modification**

```typescript
// ✅ GOOD: Strategy pattern for payment methods
interface PaymentStrategy {
  processPayment(amount: number): Promise<PaymentResult>;
}

class CreditCardPayment implements PaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    // Process credit card
    return { success: true, transactionId: 'CC-123' };
  }
}

class PayPalPayment implements PaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    // Process PayPal
    return { success: true, transactionId: 'PP-456' };
  }
}

class CryptoPayment implements PaymentStrategy {
  async processPayment(amount: number): Promise<PaymentResult> {
    // Process crypto
    return { success: true, transactionId: 'BTC-789' };
  }
}

// PaymentProcessor is closed for modification
// but open for extension (add new payment methods)
class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}

  async process(amount: number): Promise<PaymentResult> {
    return await this.strategy.processPayment(amount);
  }
}

// Usage
const processor = new PaymentProcessor(new CryptoPayment());
await processor.process(100);
```

### L - Liskov Substitution Principle

**Subtypes must be substitutable for their base types**

```typescript
// ✅ GOOD: Proper inheritance
abstract class DatabaseConnection {
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract query(sql: string): Promise<any>;
}

class PostgresConnection extends DatabaseConnection {
  async connect(): Promise<void> {
    // Connect to Postgres
  }
  async disconnect(): Promise<void> {
    // Disconnect
  }
  async query(sql: string): Promise<any> {
    // Execute query
    return this.pool.query(sql);
  }
}

class MongoConnection extends DatabaseConnection {
  async connect(): Promise<void> {
    // Connect to MongoDB
  }
  async disconnect(): Promise<void> {
    // Disconnect
  }
  async query(sql: string): Promise<any> {
    // MongoDB uses find/aggregate, not SQL, but we adapt
    const mongoQuery = this.translateSqlToMongo(sql);
    return this.db.collection.find(mongoQuery);
  }
}

// Any DatabaseConnection subclass works here
async function runMigration(db: DatabaseConnection) {
  await db.connect();
  await db.query('CREATE TABLE users...');
  await db.disconnect();
}
```

### I - Interface Segregation Principle

**Don't force clients to depend on methods they don't use**

```typescript
// ❌ BAD: Fat interface
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

class Robot implements Worker {
  work() { /* robots work */ }
  eat() { /* robots don't eat! */ throw new Error(); }
  sleep() { /* robots don't sleep! */ throw new Error(); }
}

// ✅ GOOD: Segregated interfaces
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

class Human implements Workable, Eatable, Sleepable {
  work() { console.log('Human working'); }
  eat() { console.log('Human eating'); }
  sleep() { console.log('Human sleeping'); }
}

class Robot implements Workable {
  work() { console.log('Robot working 24/7'); }
  // No eat() or sleep() - perfect!
}

// Real example: Express middleware
interface RequestLogger {
  logRequest(req: Request): void;
}

interface ResponseLogger {
  logResponse(res: Response): void;
}

// Some middleware only needs to log requests
class SimpleLogger implements RequestLogger {
  logRequest(req: Request) {
    console.log(`${req.method} ${req.url}`);
  }
}

// Advanced logger does both
class FullLogger implements RequestLogger, ResponseLogger {
  logRequest(req: Request) { /* ... */ }
  logResponse(res: Response) { /* ... */ }
}
```

### D - Dependency Inversion Principle

**Depend on abstractions, not concretions**

```typescript
// ❌ BAD: High-level depends on low-level
class MySQLDatabase {
  query(sql: string) { /* ... */ }
}

class UserService {
  private db = new MySQLDatabase(); // Tight coupling!

  async getUser(id: string) {
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// ✅ GOOD: Depend on abstraction
interface Database {
  query(sql: string): Promise<any>;
}

class MySQLDatabase implements Database {
  async query(sql: string) {
    return this.mysqlClient.query(sql);
  }
}

class PostgresDatabase implements Database {
  async query(sql: string) {
    return this.pgPool.query(sql);
  }
}

// UserService depends on abstraction (Database interface)
class UserService {
  constructor(private db: Database) {} // Dependency injection!

  async getUser(id: string) {
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// Easy to swap databases
const service1 = new UserService(new MySQLDatabase());
const service2 = new UserService(new PostgresDatabase());
```

---

## 🎯 Quick Fire Questions - SOLID

**Q: What's the main benefit of SRP?**
A: Easier maintenance - each class has one reason to change. If email logic changes, you only touch EmailService, not UserService.

**Q: Give a real example of Open/Closed**
A: Middleware in Express! You can add new middleware without modifying the core Express framework.

**Q: Why is Liskov Substitution important?**
A: Ensures polymorphism works correctly. If you expect a `Bird` and get a `Penguin`, but penguins can't fly, your `bird.fly()` call breaks.

**Q: What's wrong with fat interfaces?**
A: Classes are forced to implement methods they don't need, leading to empty implementations or thrown errors.

**Q: How do you achieve Dependency Inversion in Node.js?**
A: Use dependency injection - pass dependencies through constructor/parameters instead of creating them inside the class.

**Q: Which SOLID principle does Repository pattern follow?**
A: SRP (separates data access) and DIP (depends on repository interface, not concrete database).

---

## 📝 Practice Speaking These in English

Practice explaining SOLID with these phrases:

- "The Single Responsibility Principle states that..."
- "A class should have only one reason to change, meaning..."
- "For example, in my last project, I separated..."
- "This follows the Open/Closed Principle because..."
- "By using dependency injection, we achieve..."
- "The benefit of this approach is..."

---

Next up: Next.js! 🚀
