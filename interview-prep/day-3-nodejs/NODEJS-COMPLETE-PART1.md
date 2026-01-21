# Node.js Complete Guide - EPAM Interview Prep

> **Cobertura 100%** de todos los temas de la lista del recruiter

---

## 📋 Table of Contents

1. [Modules](#modules)
2. [Package Managers](#package-managers)
3. [Errors](#errors)
4. [File System](#file-system)
5. [Promises](#promises)
6. [APIs](#apis)
7. [Testing](#testing)
8. [Diagnostic and Debugging](#diagnostic-and-debugging)
9. [CLI](#cli)
10. [Advanced Topics](#advanced-topics)
11. [JS Under the Hood](#js-under-the-hood)
12. [Node.js Service Development](#nodejs-service-development)
13. [Frameworks](#frameworks)
14. [Infrastructure and Clouds](#infrastructure-and-clouds)

---

## Modules

### Standard Syntax (CommonJS)

```javascript
// math.js - Export
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;

// or
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// or export single value
module.exports = class Calculator {
  add(a, b) { return a + b; }
};

// app.js - Import
const math = require('./math');
math.add(2, 3); // 5

// Destructuring
const { add, subtract } = require('./math');
add(2, 3); // 5
```

### ES6 Syntax

```javascript
// math.mjs or math.js (with "type": "module" in package.json)
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// Default export
export default class Calculator {
  add(a, b) { return a + b; }
}

// app.mjs
import { add, subtract } from './math.mjs';
import Calculator from './math.mjs';

// Import all
import * as math from './math.mjs';
math.add(2, 3);

// Dynamic import
const math = await import('./math.mjs');
// or
import('./math.mjs').then(math => {
  math.add(2, 3);
});
```

### Module Load System

```javascript
// How Node.js loads modules:
// 1. Core modules (fs, http, path) - loaded first
// 2. File modules (./math.js)
// 3. Folder modules (./myModule -> ./myModule/index.js)
// 4. node_modules (lodash -> ./node_modules/lodash)

// Resolution order:
require('lodash')
// 1. core module?
// 2. ./node_modules/lodash
// 3. ../node_modules/lodash
// 4. ../../node_modules/lodash
// ... up to root

// Module wrapper
(function(exports, require, module, __filename, __dirname) {
  // Your module code
});

// Module caching
const mod1 = require('./module');
const mod2 = require('./module'); // cached, same instance
console.log(mod1 === mod2); // true

// Clear cache (for testing)
delete require.cache[require.resolve('./module')];
```

### Global Scope

```javascript
// Global variables (avoid)
global.myVar = 'value'; // accessible everywhere

// Better: Use module.exports
module.exports.config = { /* ... */ };

// Check if running as main module
if (require.main === module) {
  console.log('Running as main script');
}

// __filename and __dirname
console.log(__filename); // /path/to/file.js
console.log(__dirname);  // /path/to

// With ES modules
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### require

```javascript
// Basic require
const fs = require('fs');
const path = require('path');

// Require JSON
const config = require('./config.json');

// Require folder (loads index.js)
const myModule = require('./myModule'); // ./myModule/index.js

// Conditional require
if (condition) {
  const module = require('./optional-module');
}

// require.resolve - get module path
const modulePath = require.resolve('lodash');

// require.cache - module cache
console.log(require.cache);
```

### JS Modules

```javascript
// package.json
{
  "type": "module" // Enable ES modules
}

// Now .js files use ES module syntax
import fs from 'fs';
import { readFile } from 'fs/promises';

// For CommonJS in ES module project, use .cjs extension
// config.cjs
module.exports = { /* ... */ };

// Import CommonJS in ES module
import config from './config.cjs';

// Top-level await (ES modules only)
const data = await fetch('https://api.example.com/data');
```

### import Weight

```javascript
// Import size optimization
// Named imports (tree-shakeable)
import { map, filter } from 'lodash-es'; // Only imports map and filter

// Default import (imports everything)
import _ from 'lodash'; // Imports entire library

// Dynamic imports (lazy loading)
button.addEventListener('click', async () => {
  const module = await import('./heavy-module.js');
  module.doSomething();
});

// Conditional imports
const module = process.env.NODE_ENV === 'development'
  ? await import('./dev-tools.js')
  : await import('./prod-tools.js');
```

---

## Package Managers

### NPM

```bash
# Initialize project
npm init
npm init -y # skip questions

# Install packages
npm install express              # production dependency
npm install --save-dev jest      # dev dependency
npm install -g typescript        # global
npm install express@4.18.0       # specific version

# Uninstall
npm uninstall express

# Update
npm update                       # update all
npm update express               # update specific

# List installed
npm list                         # all
npm list --depth=0               # top level only
npm list -g                      # global

# Run scripts
npm run build
npm run test
npm start                        # alias for npm run start
npm test                         # alias for npm run test
```

### CLI Commands

```bash
# Information
npm view express                 # package info
npm view express version         # specific field
npm outdated                     # show outdated packages
npm doctor                       # check environment

# Search
npm search react

# Publishing
npm login
npm publish
npm unpublish package@version

# Cache
npm cache clean --force

# Audit
npm audit                        # check vulnerabilities
npm audit fix                    # fix vulnerabilities

# Link (local development)
npm link                         # in package directory
npm link package-name            # in project using package

# Configuration
npm config list
npm config set key value
npm config get key
```

### package-lock

```json
// package-lock.json - locks exact versions
{
  "name": "my-project",
  "version": "1.0.0",
  "lockfileVersion": 2,
  "requires": true,
  "packages": {
    "": {
      "dependencies": {
        "express": "^4.18.0"
      }
    },
    "node_modules/express": {
      "version": "4.18.2", // Exact version installed
      "resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",
      "integrity": "sha512-..."
    }
  }
}

// Purpose:
// - Ensures consistent installs across environments
// - Locks exact dependency versions
// - Improves install speed (knows exact versions)
// - Should be committed to git
```

### Package Structure

```json
// package.json
{
  "name": "my-package",
  "version": "1.0.0",
  "description": "My awesome package",
  "main": "index.js",              // Entry point (CommonJS)
  "module": "index.mjs",           // Entry point (ES modules)
  "types": "index.d.ts",           // TypeScript types
  "bin": {                         // CLI commands
    "my-cli": "./bin/cli.js"
  },
  "scripts": {                     // NPM scripts
    "start": "node index.js",
    "test": "jest",
    "build": "tsc"
  },
  "keywords": ["node", "express"],
  "author": "John Doe <john@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/user/repo.git"
  },
  "bugs": {
    "url": "https://github.com/user/repo/issues"
  },
  "homepage": "https://github.com/user/repo#readme",
  "dependencies": {                // Production deps
    "express": "^4.18.0"
  },
  "devDependencies": {            // Development deps
    "jest": "^29.0.0"
  },
  "peerDependencies": {           // Required by consuming project
    "react": "^18.0.0"
  },
  "engines": {                    // Node version requirement
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  },
  "files": [                      // Files to include when publishing
    "index.js",
    "lib/",
    "README.md"
  ]
}
```

### NPM Scripts

```json
{
  "scripts": {
    // Lifecycle scripts
    "preinstall": "echo Before install",
    "postinstall": "echo After install",
    "prepare": "husky install",      // Before pack/publish

    // Custom scripts
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "format": "prettier --write .",

    // Run multiple scripts
    "prebuild": "npm run lint",      // Runs before build
    "build:prod": "NODE_ENV=production npm run build",

    // Run in parallel (with npm-run-all)
    "dev:all": "npm-run-all --parallel dev:server dev:client"
  }
}
```

```bash
# Run scripts
npm run build
npm start                         # alias for npm run start

# Pass arguments
npm run test -- --watch           # passes --watch to jest

# Environment variables
PORT=3000 npm start              # Unix
# or in scripts:
"start": "PORT=3000 node server.js"

# Cross-platform env vars (with cross-env)
"start": "cross-env PORT=3000 node server.js"
```

### Semantic Versioning

```
Version format: MAJOR.MINOR.PATCH

Examples:
1.0.0 - Initial release
1.0.1 - Patch (bug fix)
1.1.0 - Minor (new feature, backwards compatible)
2.0.0 - Major (breaking change)

Version ranges in package.json:
^1.2.3  - Compatible with 1.2.3 (>=1.2.3 <2.0.0)
~1.2.3  - Approximately 1.2.3 (>=1.2.3 <1.3.0)
1.2.3   - Exact version
>=1.2.3 - Greater than or equal
1.2.x   - Any patch version
1.x     - Any minor/patch version
*       - Any version (avoid)

Pre-release versions:
1.0.0-alpha.1
1.0.0-beta.2
1.0.0-rc.1
```

```bash
# Bump version
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# Pre-release
npm version prepatch  # 1.0.0 -> 1.0.1-0
npm version preminor  # 1.0.0 -> 1.1.0-0
npm version premajor  # 1.0.0 -> 2.0.0-0
```

### Shrinkwrap

```bash
# npm-shrinkwrap.json (like package-lock.json but published)
npm shrinkwrap

# Creates npm-shrinkwrap.json from package-lock.json
# Used when publishing packages to lock dependencies
# Takes precedence over package-lock.json

# Difference:
# package-lock.json - NOT published, for end applications
# npm-shrinkwrap.json - Published with package, for libraries
```

### YARN

```bash
# Initialize
yarn init
yarn init -y

# Install
yarn add express                 # production
yarn add --dev jest              # dev dependency
yarn global add typescript       # global

# Remove
yarn remove express

# Update
yarn upgrade                     # update all
yarn upgrade express             # update specific

# Install all dependencies
yarn install
yarn                            # same as yarn install

# Run scripts
yarn start
yarn test
yarn build

# List
yarn list
yarn list --depth=0

# Why (explain why package installed)
yarn why lodash

# Audit
yarn audit
yarn audit --fix

# Cache
yarn cache clean

# Workspaces (monorepo)
# package.json
{
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}

# Yarn vs NPM:
# - Yarn has workspaces (monorepo support)
# - Yarn is deterministic by default
# - Yarn has offline mode
# - Yarn 2+ (Berry) has Plug'n'Play (no node_modules)
```

---

## Errors

### Handling

```javascript
// Try-catch
try {
  const result = riskyOperation();
} catch (error) {
  console.error('Error:', error.message);
} finally {
  cleanup(); // Always executes
}

// Async error handling
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error; // Re-throw if needed
  }
}

// Promise error handling
fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // Application termination recommended
  process.exit(1);
});

// Uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1); // Exit after logging
});
```

### Error Class

```javascript
// Built-in Error
const error = new Error('Something went wrong');
console.log(error.message); // 'Something went wrong'
console.log(error.stack);   // Stack trace

// Error types
new Error('Generic error');
new TypeError('Wrong type');
new RangeError('Out of range');
new ReferenceError('Variable not defined');
new SyntaxError('Invalid syntax');

// System errors (Node.js)
const fs = require('fs');

fs.readFile('nonexistent.txt', (err, data) => {
  if (err) {
    console.log(err.code);    // 'ENOENT'
    console.log(err.errno);   // Error number
    console.log(err.path);    // File path
    console.log(err.syscall); // System call that failed
  }
});

// Common error codes:
// ENOENT - File/directory not found
// EACCES - Permission denied
// EADDRINUSE - Address already in use
// ECONNREFUSED - Connection refused
```

### Custom Errors

```javascript
// Custom error class
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.statusCode = 400;
    Error.captureStackTrace(this, this.constructor);
  }
}

class DatabaseError extends Error {
  constructor(message, query) {
    super(message);
    this.name = 'DatabaseError';
    this.query = query;
    this.statusCode = 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Usage
function validateUser(user) {
  if (!user.email) {
    throw new ValidationError('Email is required', 'email');
  }
}

try {
  validateUser({});
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Validation failed on ${error.field}: ${error.message}`);
  }
}
```

### Handling Layer

```javascript
// Express error handling middleware
const express = require('express');
const app = express();

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Routes
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json(user);
  } catch (error) {
    next(error); // Pass to error handler
  }
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  // Log error
  console.error(err.stack);

  // Send response
  res.status(err.statusCode || 500).json({
    error: {
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // Gracefully shutdown
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
```

### Error Logging

```javascript
// Winston logger
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Usage
logger.error('Error occurred', { error: err.message, stack: err.stack });
logger.warn('Warning');
logger.info('Info');
logger.debug('Debug');

// Pino logger (faster)
const pino = require('pino');
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

logger.error({ err }, 'Error occurred');
```

### Async Error Events

```javascript
// EventEmitter error events
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// Always handle 'error' events
myEmitter.on('error', (err) => {
  console.error('Error:', err.message);
});

myEmitter.emit('error', new Error('Something went wrong'));

// Stream error handling
const fs = require('fs');

const readStream = fs.createReadStream('file.txt');

readStream.on('error', (err) => {
  console.error('Stream error:', err);
});

readStream.on('data', (chunk) => {
  console.log(chunk);
});
```

---

## File System

### Difference Between OS

```javascript
// Path separators
// Windows: C:\Users\John\file.txt
// Unix: /home/john/file.txt

const path = require('path');

// Cross-platform path joining
const filePath = path.join('users', 'john', 'file.txt');
// Windows: users\john\file.txt
// Unix: users/john/file.txt

// Platform detection
console.log(process.platform);
// 'win32', 'darwin' (macOS), 'linux', 'freebsd', etc.

// Line endings
// Windows: \r\n (CRLF)
// Unix: \n (LF)
const os = require('os');
console.log(os.EOL); // Platform-specific line ending

// Home directory
os.homedir();
// Windows: C:\Users\John
// Unix: /home/john

// Temporary directory
os.tmpdir();
// Windows: C:\Users\John\AppData\Local\Temp
// Unix: /tmp
```

### Sync/Async Use Cases

```javascript
const fs = require('fs');

// Synchronous (blocking) - use in CLI tools, build scripts
try {
  const data = fs.readFileSync('file.txt', 'utf8');
  console.log(data);
} catch (error) {
  console.error(error);
}

// Asynchronous (non-blocking) - use in servers
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});

// Promise-based (modern, preferred)
const fs = require('fs').promises;
// or
const { readFile } = require('fs/promises');

async function readData() {
  try {
    const data = await readFile('file.txt', 'utf8');
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// When to use sync:
// - CLI tools
// - Build/deployment scripts
// - Application startup (loading config)
// - When blocking is intentional

// When to use async:
// - Web servers (don't block event loop)
// - Any I/O in production
// - Multiple file operations
```

---

## Promises

### Promises in Node.js

```javascript
// fs with promises
const fs = require('fs').promises;

fs.readFile('file.txt', 'utf8')
  .then(data => console.log(data))
  .catch(error => console.error(error));

// util.promisify - convert callback to promise
const util = require('util');
const fs = require('fs');

const readFilePromise = util.promisify(fs.readFile);

readFilePromise('file.txt', 'utf8')
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Promisify custom function
function myCallback(arg, callback) {
  setTimeout(() => {
    callback(null, `Result: ${arg}`);
  }, 1000);
}

const myPromise = util.promisify(myCallback);

myPromise('test').then(result => console.log(result));
```

### Async/Await

```javascript
// Async/await (preferred)
const fs = require('fs').promises;

async function processFiles() {
  try {
    // Sequential
    const file1 = await fs.readFile('file1.txt', 'utf8');
    const file2 = await fs.readFile('file2.txt', 'utf8');

    // Parallel
    const [data1, data2] = await Promise.all([
      fs.readFile('file1.txt', 'utf8'),
      fs.readFile('file2.txt', 'utf8')
    ]);

    return { data1, data2 };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Top-level await (ES modules only)
// main.mjs
const data = await fs.readFile('config.json', 'utf8');
console.log(data);
```

---

## APIs

### File System API

```javascript
const fs = require('fs');
const path = require('path');

// Read file
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Write file
fs.writeFile('file.txt', 'content', (err) => {
  if (err) throw err;
});

// Append file
fs.appendFile('file.txt', 'more content', (err) => {
  if (err) throw err;
});

// Delete file
fs.unlink('file.txt', (err) => {
  if (err) throw err;
});

// Check if file exists
fs.access('file.txt', fs.constants.F_OK, (err) => {
  console.log(err ? 'does not exist' : 'exists');
});

// Get file stats
fs.stat('file.txt', (err, stats) => {
  if (err) throw err;
  console.log(stats.isFile());
  console.log(stats.isDirectory());
  console.log(stats.size);
  console.log(stats.mtime); // modified time
});

// Read directory
fs.readdir('./folder', (err, files) => {
  if (err) throw err;
  console.log(files); // array of file names
});

// Create directory
fs.mkdir('./newFolder', { recursive: true }, (err) => {
  if (err) throw err;
});

// Remove directory
fs.rmdir('./folder', (err) => {
  if (err) throw err;
});

// Watch file changes
fs.watch('file.txt', (eventType, filename) => {
  console.log(`${filename} ${eventType}`);
});
```

### Stream API

```javascript
const fs = require('fs');

// Readable stream
const readStream = fs.createReadStream('large-file.txt', {
  encoding: 'utf8',
  highWaterMark: 16 * 1024 // 16KB chunks
});

readStream.on('data', (chunk) => {
  console.log('Received chunk:', chunk.length);
});

readStream.on('end', () => {
  console.log('Finished reading');
});

readStream.on('error', (err) => {
  console.error('Error:', err);
});

// Writable stream
const writeStream = fs.createWriteStream('output.txt');

writeStream.write('Hello\n');
writeStream.write('World\n');
writeStream.end(); // Close stream

// Pipe streams
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream.pipe(writeStream);

// Transform stream
const { Transform } = require('stream');

const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

fs.createReadStream('input.txt')
  .pipe(upperCaseTransform)
  .pipe(fs.createWriteStream('output.txt'));

// Stream utilities
const { pipeline } = require('stream');

pipeline(
  fs.createReadStream('input.txt'),
  upperCaseTransform,
  fs.createWriteStream('output.txt'),
  (err) => {
    if (err) {
      console.error('Pipeline failed:', err);
    } else {
      console.log('Pipeline succeeded');
    }
  }
);
```

### Timer API

```javascript
// setTimeout - execute once after delay
const timeoutId = setTimeout(() => {
  console.log('Executed after 1 second');
}, 1000);

// Clear timeout
clearTimeout(timeoutId);

// setInterval - execute repeatedly
const intervalId = setInterval(() => {
  console.log('Executed every 1 second');
}, 1000);

// Clear interval
clearInterval(intervalId);

// setImmediate - execute after I/O events
setImmediate(() => {
  console.log('Executed immediately after I/O');
});

// process.nextTick - execute before I/O
process.nextTick(() => {
  console.log('Executed before I/O');
});

// Order of execution:
// 1. Synchronous code
// 2. process.nextTick
// 3. Promises (microtasks)
// 4. setImmediate
// 5. setTimeout/setInterval

// Example
console.log('1');
setTimeout(() => console.log('2'), 0);
setImmediate(() => console.log('3'));
process.nextTick(() => console.log('4'));
Promise.resolve().then(() => console.log('5'));
console.log('6');
// Output: 1, 6, 4, 5, 2, 3 (or 2, 3 may swap)
```

### Path API

```javascript
const path = require('path');

// Join paths
path.join('/users', 'john', 'file.txt');
// /users/john/file.txt

// Resolve to absolute path
path.resolve('folder', 'file.txt');
// /current/directory/folder/file.txt

path.resolve('/foo', '/bar', 'file.txt');
// /bar/file.txt (absolute paths reset)

// Parse path
path.parse('/home/user/file.txt');
// {
//   root: '/',
//   dir: '/home/user',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }

// Format path
path.format({
  dir: '/home/user',
  base: 'file.txt'
});
// /home/user/file.txt

// Get directory name
path.dirname('/home/user/file.txt');
// /home/user

// Get filename
path.basename('/home/user/file.txt');
// file.txt

path.basename('/home/user/file.txt', '.txt');
// file (without extension)

// Get extension
path.extname('file.txt');
// .txt

// Normalize path
path.normalize('/users/john/../jane/./file.txt');
// /users/jane/file.txt

// Check if absolute
path.isAbsolute('/home/user');
// true

// Relative path
path.relative('/home/user', '/home/user/file.txt');
// file.txt

// Platform-specific separator
path.sep     // / on Unix, \ on Windows
path.delimiter // : on Unix, ; on Windows
```

---

## Testing

### Unit Testing

```javascript
// Jest - unit testing framework
// sum.js
function sum(a, b) {
  return a + b;
}
module.exports = sum;

// sum.test.js
const sum = require('./sum');

describe('sum function', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

  test('adds negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3);
  });
});

// Matchers
expect(value).toBe(3);                  // ===
expect(value).toEqual({ a: 1 });        // deep equality
expect(value).not.toBe(4);              // negation
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeGreaterThan(3);
expect(value).toMatch(/pattern/);
expect(array).toContain('item');
expect(() => fn()).toThrow();

// Mocking
const mockFn = jest.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue('async result');

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg');
expect(mockFn).toHaveBeenCalledTimes(2);

// Mock modules
jest.mock('./database');
const db = require('./database');
db.query.mockResolvedValue([{ id: 1, name: 'John' }]);
```

### Integration Testing

```javascript
// Test API with supertest
const request = require('supertest');
const app = require('./app');

describe('API Integration Tests', () => {
  test('GET /users returns users', async () => {
    const response = await request(app)
      .get('/users')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty('name');
  });

  test('POST /users creates user', async () => {
    const newUser = { name: 'John', email: 'john@example.com' };

    const response = await request(app)
      .post('/users')
      .send(newUser)
      .expect(201);

    expect(response.body).toMatchObject(newUser);
  });
});

// Database integration test
describe('Database Integration', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  beforeEach(async () => {
    await db.clear();
  });

  test('saves user to database', async () => {
    const user = await saveUser({ name: 'John' });
    const found = await findUser(user.id);
    expect(found.name).toBe('John');
  });
});
```

### E2E Tests

```javascript
// Playwright/Puppeteer E2E tests
const { chromium } = require('playwright');

describe('E2E Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('user can login', async () => {
    await page.goto('http://localhost:3000/login');

    await page.fill('#email', 'john@example.com');
    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');

    await page.waitForSelector('.dashboard');

    const url = page.url();
    expect(url).toContain('/dashboard');
  });
});
```

---

_(Continúa en el siguiente mensaje debido al límite de caracteres)_
