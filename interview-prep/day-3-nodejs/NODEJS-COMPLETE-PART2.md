# Node.js Complete Guide - Part 2

> Continuación de NODEJS-COMPLETE-PART1.md

---

## Testing (Continuación)

### Test Coverage

```javascript
// Jest configuration - jest.config.js
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/index.js'
  ]
};

// Run tests with coverage
// npm test -- --coverage
```

### Mocking

```javascript
// Mock entire module
jest.mock('./userService');
const userService = require('./userService');

userService.getUser.mockResolvedValue({ id: 1, name: 'John' });

// Mock specific function
const originalModule = jest.requireActual('./userService');
jest.mock('./userService', () => ({
  ...originalModule,
  getUser: jest.fn()
}));

// Mock implementation
const mockFn = jest.fn((x) => x + 1);
mockFn(1); // 2

// Mock return values
mockFn.mockReturnValue(42);
mockFn.mockReturnValueOnce(1).mockReturnValueOnce(2);

// Mock async functions
mockFn.mockResolvedValue('success');
mockFn.mockRejectedValue(new Error('failed'));

// Spy on object method
const obj = { method: () => 'original' };
const spy = jest.spyOn(obj, 'method');
spy.mockReturnValue('mocked');

// Restore original
spy.mockRestore();
```

### Test Doubles (Stubs, Spies, Mocks)

```javascript
// Stub - provides canned answers
const stub = jest.fn().mockReturnValue('fixed response');

// Spy - records calls and arguments
const spy = jest.fn();
myFunction(spy);
expect(spy).toHaveBeenCalledWith('expected arg');

// Mock - pre-programmed with expectations
const mock = jest.fn()
  .mockReturnValueOnce('first call')
  .mockReturnValueOnce('second call');

// Sinon.js example (alternative to Jest)
const sinon = require('sinon');

// Stub
const stub = sinon.stub(obj, 'method').returns('value');

// Spy
const spy = sinon.spy(obj, 'method');
obj.method('arg');
expect(spy.calledWith('arg')).toBe(true);

// Mock
const mock = sinon.mock(obj);
mock.expects('method').once().withArgs('arg').returns('value');
obj.method('arg');
mock.verify();
```

---

## Diagnostic and Debugging

### Memory Leaks

```javascript
// Common causes of memory leaks

// 1. Global variables
global.cache = {}; // Never cleared
global.cache[key] = largeObject; // Leak!

// Fix: Use proper scoping or WeakMap
const cache = new WeakMap();

// 2. Event listeners not removed
const EventEmitter = require('events');
const emitter = new EventEmitter();

function handler() { /* ... */ }
emitter.on('event', handler);
// Should remove: emitter.off('event', handler);

// 3. Timers not cleared
const timer = setInterval(() => {
  // Heavy operation
}, 1000);
// Should clear: clearInterval(timer);

// 4. Closures holding references
function createHeavyProcessor() {
  const largeData = new Array(1000000);

  return function process() {
    // largeData is kept in memory
    return largeData.length;
  };
}

// 5. Detached DOM nodes (in browser/jsdom)
let detached = document.createElement('div');
detached.innerHTML = '<p>Big content</p>';
// Should set to null: detached = null;

// Detecting memory leaks
// 1. Check heap usage
console.log(process.memoryUsage());
// {
//   rss: 25600000,        // Resident Set Size
//   heapTotal: 7372800,   // Total heap
//   heapUsed: 4883072,    // Used heap
//   external: 8272        // C++ objects
// }

// 2. Monitor over time
setInterval(() => {
  const { heapUsed } = process.memoryUsage();
  console.log(`Heap used: ${heapUsed / 1024 / 1024} MB`);
}, 1000);

// 3. Heap snapshot
const v8 = require('v8');
const fs = require('fs');

function takeHeapSnapshot() {
  const filename = `heap-${Date.now()}.heapsnapshot`;
  const heapSnapshot = v8.writeHeapSnapshot(filename);
  console.log(`Heap snapshot written to ${heapSnapshot}`);
}

// 4. Use Chrome DevTools
// node --inspect app.js
// Open chrome://inspect
```

### Performance Profiling

```javascript
// 1. Using console.time/timeEnd
console.time('operation');
// ... expensive operation
console.timeEnd('operation');
// operation: 123.456ms

// 2. Using performance hooks
const { performance, PerformanceObserver } = require('perf_hooks');

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});
obs.observe({ entryTypes: ['measure'] });

performance.mark('start');
// ... operation
performance.mark('end');
performance.measure('operation', 'start', 'end');

// 3. CPU profiling
// node --prof app.js
// Creates isolate-*.log file
// Process with: node --prof-process isolate-*.log

// 4. V8 profiler
const profiler = require('v8-profiler-next');

profiler.startProfiling('CPU profile');
// ... code to profile
const profile = profiler.stopProfiling();

profile.export((error, result) => {
  fs.writeFileSync('profile.cpuprofile', result);
  profile.delete();
});

// Open in Chrome DevTools

// 5. Clinic.js
// npm install -g clinic
// clinic doctor -- node app.js
// clinic flame -- node app.js
// clinic bubbleprof -- node app.js
```

### Node.js Inspect

```javascript
// Debugging with inspect

// 1. Start with inspect
// node inspect app.js
// or
// node --inspect app.js
// or (break on first line)
// node --inspect-brk app.js

// 2. Chrome DevTools
// Open chrome://inspect
// Click "Open dedicated DevTools for Node"

// 3. VS Code debugging
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/app.js"
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Attach",
      "port": 9229
    }
  ]
}

// 4. Debugger statement
function problematicFunction() {
  debugger; // Execution will pause here
  // ... rest of code
}

// 5. Inspector API
const inspector = require('inspector');

inspector.open(9229, 'localhost');
inspector.url(); // ws://localhost:9229/...

// 6. Remote debugging
// node --inspect=0.0.0.0:9229 app.js
// SSH tunnel: ssh -L 9221:localhost:9229 user@remote.server
```

### Logging Levels

```javascript
// Log levels (common convention)
// ERROR: 0 - System is unusable
// WARN: 1 - Warning conditions
// INFO: 2 - Informational messages
// HTTP: 3 - HTTP requests
// VERBOSE: 4 - Verbose information
// DEBUG: 5 - Debug messages
// SILLY: 6 - Very detailed debug

// Winston logger with levels
const winston = require('winston');

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Usage
logger.error('Critical error', { error: err.stack });
logger.warn('Warning message');
logger.info('Info message');
logger.http('HTTP request', { method: 'GET', url: '/api/users' });
logger.verbose('Verbose info');
logger.debug('Debug details');
logger.silly('Very detailed info');

// Pino logger (faster alternative)
const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

logger.error({ err }, 'Error occurred');
logger.warn('Warning');
logger.info({ user: 'john' }, 'User logged in');
logger.debug('Debug info');
logger.trace('Trace info');
```

---

## CLI

### Process

```javascript
// Process information
console.log(process.pid);           // Process ID
console.log(process.ppid);          // Parent process ID
console.log(process.platform);      // 'linux', 'darwin', 'win32'
console.log(process.arch);          // 'x64', 'arm', etc.
console.log(process.version);       // Node.js version
console.log(process.versions);      // Node/V8/dependencies versions

// Current directory
console.log(process.cwd());

// Change directory
process.chdir('/path/to/directory');

// Environment variables
console.log(process.env.NODE_ENV);
console.log(process.env.PORT);

// Set env var
process.env.MY_VAR = 'value';

// Resource usage
console.log(process.cpuUsage());
// { user: 38579, system: 6986 } (in microseconds)

console.log(process.memoryUsage());
// {
//   rss: 25600000,
//   heapTotal: 7372800,
//   heapUsed: 4883072,
//   external: 8272,
//   arrayBuffers: 9382
// }

// Uptime
console.log(process.uptime()); // seconds

// Exit
process.exit(0); // success
process.exit(1); // error

// Exit codes
process.exitCode = 1; // Set exit code (doesn't exit immediately)
```

### Arguments

```javascript
// Command line arguments
// node app.js arg1 arg2 --flag value

console.log(process.argv);
// [
//   '/usr/local/bin/node',
//   '/path/to/app.js',
//   'arg1',
//   'arg2',
//   '--flag',
//   'value'
// ]

// Parse arguments manually
const args = process.argv.slice(2);
console.log(args); // ['arg1', 'arg2', '--flag', 'value']

// Using yargs library
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('port', {
    alias: 'p',
    type: 'number',
    description: 'Port number',
    default: 3000
  })
  .option('host', {
    alias: 'h',
    type: 'string',
    description: 'Host name',
    default: 'localhost'
  })
  .command('start', 'Start the server', (yargs) => {
    return yargs.option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging'
    });
  })
  .help()
  .argv;

console.log(argv);
// node app.js start --port 8080 --verbose
// { _: ['start'], port: 8080, host: 'localhost', verbose: true }

// Using commander library
const { program } = require('commander');

program
  .version('1.0.0')
  .option('-p, --port <number>', 'Port number', '3000')
  .option('-h, --host <string>', 'Host name', 'localhost')
  .option('-v, --verbose', 'Verbose output');

program
  .command('start')
  .description('Start the server')
  .action((options) => {
    console.log('Starting server...');
  });

program.parse(process.argv);

const options = program.opts();
console.log(options);
```

### REPL

```javascript
// Start REPL
// node (without file)

// REPL commands
.help      // Show help
.break     // Exit multiline expression
.clear     // Reset context
.exit      // Exit REPL
.save      // Save session to file
.load      // Load file into session
.editor    // Enter editor mode

// Custom REPL
const repl = require('repl');

const myRepl = repl.start({
  prompt: 'my-app> ',
  useColors: true
});

// Add custom commands
myRepl.defineCommand('hello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  }
});

// Add context
myRepl.context.myFunction = () => 'Hello from context';

// Usage:
// my-app> .hello John
// Hello, John!
// my-app> myFunction()
// 'Hello from context'
```

### Streams (stdin, stdout, stderr)

```javascript
// stdin - input stream
process.stdin.on('data', (data) => {
  console.log(`You typed: ${data}`);
});

process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    process.stdout.write(`Data: ${chunk}`);
  }
});

// stdout - output stream
process.stdout.write('Hello\n');
console.log('World'); // Uses stdout

// stderr - error stream
process.stderr.write('Error message\n');
console.error('Error'); // Uses stderr

// Pipe example
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('What is your name? ', (answer) => {
  console.log(`Hello, ${answer}!`);
  rl.close();
});

// Interactive CLI
async function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

(async () => {
  const name = await askQuestion('Name: ');
  const age = await askQuestion('Age: ');
  console.log(`${name} is ${age} years old`);
})();

// Redirect streams
// node app.js < input.txt > output.txt 2> error.txt
```

---

## Advanced Topics

### Cluster

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Worker died
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Restart worker
  });

  // Communication with workers
  Object.values(cluster.workers).forEach(worker => {
    worker.send({ msg: 'Hello from master' });
  });

} else {
  // Workers share TCP connection
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Process ${process.pid} handled request\n`);
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);

  // Receive messages from master
  process.on('message', (msg) => {
    console.log(`Worker ${process.pid} received:`, msg);
  });
}

// Round-robin load balancing (default on all platforms except Windows)
cluster.schedulingPolicy = cluster.SCHED_RR;
```

### Child Process

```javascript
const { spawn, exec, execFile, fork } = require('child_process');

// 1. spawn - stream-based, for long-running processes
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

// 2. exec - buffer-based, for short commands
exec('ls -lh /usr', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});

// 3. execFile - like exec but directly executes file
execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) throw error;
  console.log(stdout);
});

// 4. fork - special case for Node.js processes
// parent.js
const child = fork('child.js');

child.on('message', (msg) => {
  console.log('Message from child:', msg);
});

child.send({ hello: 'world' });

// child.js
process.on('message', (msg) => {
  console.log('Message from parent:', msg);
});

process.send({ foo: 'bar' });

// Spawn with options
const child = spawn('find', ['.', '-type', 'f'], {
  cwd: '/tmp',
  env: { ...process.env, CUSTOM: 'value' },
  stdio: 'inherit' // Use parent's stdio
});
```

### Worker Threads

```javascript
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  // Main thread
  const worker = new Worker(__filename, {
    workerData: { num: 5 }
  });

  worker.on('message', (result) => {
    console.log('Result from worker:', result);
  });

  worker.on('error', (error) => {
    console.error('Worker error:', error);
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
  });

  // Send message to worker
  worker.postMessage('start');

} else {
  // Worker thread
  const { num } = workerData;

  parentPort.on('message', (msg) => {
    if (msg === 'start') {
      // Heavy computation
      const result = fibonacci(num);
      parentPort.postMessage(result);
    }
  });

  function fibonacci(n) {
    if (n < 2) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
}

// Worker pool pattern
class WorkerPool {
  constructor(workerPath, numWorkers) {
    this.workers = [];
    this.freeWorkers = [];

    for (let i = 0; i < numWorkers; i++) {
      const worker = new Worker(workerPath);
      this.workers.push(worker);
      this.freeWorkers.push(worker);
    }
  }

  async runTask(data) {
    let worker = this.freeWorkers.pop();

    if (!worker) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.runTask(data);
    }

    return new Promise((resolve, reject) => {
      worker.once('message', (result) => {
        this.freeWorkers.push(worker);
        resolve(result);
      });

      worker.once('error', reject);
      worker.postMessage(data);
    });
  }
}
```

### N-API

```javascript
// N-API - Native addons API for C/C++
// Provides stable ABI across Node.js versions

// hello.cc (C++ addon)
#include <node_api.h>

napi_value Method(napi_env env, napi_callback_info info) {
  napi_value greeting;
  napi_status status;

  status = napi_create_string_utf8(env, "Hello from C++!", NAPI_AUTO_LENGTH, &greeting);
  if (status != napi_ok) return nullptr;

  return greeting;
}

napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_value fn;

  status = napi_create_function(env, nullptr, 0, Method, nullptr, &fn);
  if (status != napi_ok) return nullptr;

  status = napi_set_named_property(env, exports, "hello", fn);
  if (status != napi_ok) return nullptr;

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)

// binding.gyp
{
  "targets": [
    {
      "target_name": "hello",
      "sources": [ "hello.cc" ]
    }
  ]
}

// Build and use
// npm install node-gyp -g
// node-gyp configure build

// index.js
const addon = require('./build/Release/hello');
console.log(addon.hello()); // "Hello from C++!"
```

---

## JS Under the Hood

### Event Loop

```javascript
// Event Loop Phases (in order):
// 1. timers - setTimeout, setInterval callbacks
// 2. pending callbacks - I/O callbacks deferred to next iteration
// 3. idle, prepare - internal use
// 4. poll - retrieve new I/O events
// 5. check - setImmediate callbacks
// 6. close callbacks - socket.on('close')

// Between each phase: process.nextTick and Promise callbacks

console.log('1 - sync');

setTimeout(() => console.log('2 - setTimeout'), 0);

setImmediate(() => console.log('3 - setImmediate'));

process.nextTick(() => console.log('4 - nextTick'));

Promise.resolve().then(() => console.log('5 - Promise'));

console.log('6 - sync');

// Output:
// 1 - sync
// 6 - sync
// 4 - nextTick
// 5 - Promise
// 2 - setTimeout (or 3 - setImmediate, order may vary)
// 3 - setImmediate (or 2 - setTimeout)

// I/O example
const fs = require('fs');

fs.readFile(__filename, () => {
  console.log('readFile');

  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
  process.nextTick(() => console.log('nextTick'));
});

// Output (inside I/O callback):
// nextTick
// immediate
// timeout
```

### Microtask and Macrotask Queue

```javascript
// Microtasks: Promise callbacks, process.nextTick
// Macrotasks: setTimeout, setInterval, setImmediate, I/O

// Microtasks run before next macrotask
console.log('start');

setTimeout(() => {
  console.log('timeout 1');
  Promise.resolve().then(() => console.log('promise in timeout'));
}, 0);

Promise.resolve()
  .then(() => {
    console.log('promise 1');
    setTimeout(() => console.log('timeout in promise'), 0);
  })
  .then(() => console.log('promise 2'));

console.log('end');

// Output:
// start
// end
// promise 1
// promise 2
// timeout 1
// promise in timeout
// timeout in promise

// nextTick has higher priority than Promises
process.nextTick(() => console.log('nextTick 1'));
Promise.resolve().then(() => console.log('promise 1'));
process.nextTick(() => console.log('nextTick 2'));
Promise.resolve().then(() => console.log('promise 2'));

// Output:
// nextTick 1
// nextTick 2
// promise 1
// promise 2
```

### Blocking vs Non-blocking Code

```javascript
// Blocking (bad for servers)
const fs = require('fs');

console.log('Before');
const data = fs.readFileSync('file.txt', 'utf8'); // BLOCKS
console.log(data);
console.log('After');

// Non-blocking (good for servers)
console.log('Before');
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
console.log('After');
// Output: Before, After, [file contents]

// Blocking example - bad!
function findUserSync(id) {
  const data = fs.readFileSync('users.json', 'utf8');
  const users = JSON.parse(data);
  return users.find(u => u.id === id);
}

// Non-blocking example - good!
async function findUser(id) {
  const data = await fs.promises.readFile('users.json', 'utf8');
  const users = JSON.parse(data);
  return users.find(u => u.id === id);
}

// CPU-intensive blocking (use worker threads)
function fibonacci(n) {
  if (n < 2) return n;
  return fibonacci(n - 1) + fibonacci(n - 2); // BLOCKS for large n
}

// Solution: worker threads or cluster
```

---

## Node.js Service Development

### Web Servers

```javascript
// Basic HTTP server
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(3000, 'localhost', () => {
  console.log('Server running at http://localhost:3000/');
});

// HTTPS server
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('Secure connection\n');
}).listen(443);

// Routing
const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === '/') {
    res.end('Home page');
  } else if (method === 'GET' && url === '/api/users') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify([{ id: 1, name: 'John' }]));
  } else if (method === 'POST' && url === '/api/users') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const user = JSON.parse(body);
      res.end(JSON.stringify({ id: 2, ...user }));
    });
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});
```

### REST API

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// In-memory database
let users = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' }
];

// GET all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// GET user by id
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// POST create user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT update user
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;

  res.json(user);
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Middleware

```javascript
const express = require('express');
const app = express();

// Built-in middleware
app.use(express.json());                    // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
app.use(express.static('public'));          // Serve static files

// Custom middleware
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next(); // Must call next()
}

app.use(logger);

// Middleware with parameters
function requireAuth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verify token
  req.user = { id: 1, name: 'John' };
  next();
}

app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ message: 'Protected resource', user: req.user });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// Route-specific middleware
app.get('/admin',
  requireAuth,
  requireAdmin,
  (req, res) => {
    res.json({ message: 'Admin panel' });
  }
);

// Third-party middleware
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

app.use(cors());              // Enable CORS
app.use(helmet());            // Security headers
app.use(morgan('combined'));  // Request logging
```

---

## Frameworks

### Express

```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Route parameters
app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id });
});

// Query parameters
app.get('/search', (req, res) => {
  const { q, limit } = req.query;
  res.json({ query: q, limit: limit || 10 });
});

// Router
const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  res.json({ message: 'List users' });
});

userRouter.post('/', (req, res) => {
  res.json({ message: 'Create user', data: req.body });
});

app.use('/api/users', userRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(3000);
```

### Koa

```javascript
const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

// Middleware (async/await based)
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(bodyParser());

// Routes
router.get('/', async (ctx) => {
  ctx.body = 'Hello World';
});

router.get('/users/:id', async (ctx) => {
  ctx.body = { id: ctx.params.id };
});

router.post('/users', async (ctx) => {
  const user = ctx.request.body;
  ctx.status = 201;
  ctx.body = { id: 1, ...user };
});

app.use(router.routes());
app.use(router.allowedMethods());

// Error handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

app.listen(3000);
```

### NestJS

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
})
export class AppModule {}

// users/users.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}

// users/users.service.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private users = [];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find(u => u.id === id);
  }

  create(createUserDto: CreateUserDto) {
    const user = { id: this.users.length + 1, ...createUserDto };
    this.users.push(user);
    return user;
  }
}

// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

### Hapi

```javascript
const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  // Routes
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return 'Hello World';
    }
  });

  server.route({
    method: 'GET',
    path: '/users/{id}',
    handler: (request, h) => {
      const id = request.params.id;
      return { id };
    }
  });

  server.route({
    method: 'POST',
    path: '/users',
    handler: (request, h) => {
      const user = request.payload;
      return h.response({ id: 1, ...user }).code(201);
    }
  });

  // Validation
  const Joi = require('joi');

  server.route({
    method: 'POST',
    path: '/users',
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
          email: Joi.string().email().required()
        })
      }
    },
    handler: (request, h) => {
      return request.payload;
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
```

---

## Infrastructure and Clouds

### Serverless

```javascript
// AWS Lambda handler
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const body = JSON.parse(event.body);

  // Process request
  const result = await processData(body);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result)
  };
};

// Serverless Framework - serverless.yml
service: my-service

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1

functions:
  hello:
    handler: handler.hello
    events:
      - http:
          path: hello
          method: get

  createUser:
    handler: users.create
    events:
      - http:
          path: users
          method: post

// Deploy: serverless deploy
```

### Containers (Docker)

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Run application
CMD ["node", "server.js"]

# Build: docker build -t my-app .
# Run: docker run -p 3000:3000 my-app
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      - db
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:14
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydb
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:

# Run: docker-compose up
```

### CI/CD

```yaml
# .github/workflows/ci.yml (GitHub Actions)
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: Run linter
      run: npm run lint

    - name: Build
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to production
      run: |
        # Deploy commands
        echo "Deploying to production"
```

```yaml
# .gitlab-ci.yml (GitLab CI)
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test
    - npm run lint

build:
  stage: build
  image: node:18
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  script:
    - echo "Deploying to production"
  only:
    - main
```

---

## 🎯 Resumen Final

### Topics Cubiertos (100%)

✅ **Modules**: CommonJS, ES6, module load system, global scope, require, import
✅ **Package Managers**: NPM, YARN, CLI, package.json, versioning, shrinkwrap
✅ **Errors**: Handling, Error class, custom errors, handling layer, logging, async errors
✅ **File System**: OS differences, sync/async use cases
✅ **Promises**: Node.js promises, async/await
✅ **APIs**: File System API, Stream API, Timer API, Path API
✅ **Testing**: Unit, Integration, E2E, coverage, mocking, test doubles
✅ **Diagnostic**: Memory leaks, profiling, inspect, logging levels
✅ **CLI**: Process, arguments, REPL, streams (stdin/stdout/stderr)
✅ **Advanced**: Cluster, child process, worker threads, N-API
✅ **JS Under Hood**: Event loop, microtask/macrotask, blocking vs non-blocking
✅ **Service Development**: Web servers, REST API, middleware
✅ **Frameworks**: Express, Koa, NestJS, Hapi
✅ **Infrastructure**: Serverless, containers, CI/CD

---

**Total**: ~3500 líneas de contenido completo siguiendo EXACTAMENTE la estructura de la lista del recruiter.
