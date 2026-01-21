# HTTP & Web Communication Protocols - EPAM Interview Prep

> **Target**: Senior Full Stack Developer Position
> **Focus**: HTTP/HTTPS, HTTP/2, HTTP/3, TCP/UDP, WebSockets, REST vs RPC vs GraphQL

---

## Table of Contents

1. [HTTP Fundamentals](#http-fundamentals)
2. [HTTPS](#https)
3. [HTTP/2](#http2)
4. [HTTP/3](#http3)
5. [TCP vs UDP](#tcp-vs-udp)
6. [WebSockets vs Polling](#websockets-vs-polling)
7. [RESTful API](#restful-api)
8. [REST vs RPC vs GraphQL](#rest-vs-rpc-vs-graphql)

---

## HTTP Fundamentals

### HTTP Request/Response

```
HTTP Request:
┌─────────────────────────────────────┐
│ GET /api/users HTTP/1.1             │ ← Request line
│ Host: api.example.com               │
│ User-Agent: Mozilla/5.0             │ ← Headers
│ Accept: application/json            │
│ Authorization: Bearer token123      │
│                                     │
│ { "page": 1 }                       │ ← Body (optional)
└─────────────────────────────────────┘

HTTP Response:
┌─────────────────────────────────────┐
│ HTTP/1.1 200 OK                     │ ← Status line
│ Content-Type: application/json      │
│ Content-Length: 134                 │ ← Headers
│ Cache-Control: max-age=3600         │
│                                     │
│ { "users": [...] }                  │ ← Body
└─────────────────────────────────────┘
```

---

### HTTP Methods

```javascript
// GET - Retrieve resource (safe, idempotent)
fetch('https://api.example.com/users')
  .then(res => res.json());

// POST - Create resource (not idempotent)
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John' })
});

// PUT - Replace resource (idempotent)
fetch('https://api.example.com/users/123', {
  method: 'PUT',
  body: JSON.stringify({ name: 'John', age: 30 })
});

// PATCH - Partial update (not necessarily idempotent)
fetch('https://api.example.com/users/123', {
  method: 'PATCH',
  body: JSON.stringify({ age: 31 })
});

// DELETE - Remove resource (idempotent)
fetch('https://api.example.com/users/123', {
  method: 'DELETE'
});

// HEAD - Like GET but no body (get metadata)
fetch('https://api.example.com/users', { method: 'HEAD' });

// OPTIONS - Get allowed methods (CORS preflight)
fetch('https://api.example.com/users', { method: 'OPTIONS' });
```

**Idempotency:**

- Idempotent: Multiple identical requests have same effect as single request
- GET, PUT, DELETE, HEAD, OPTIONS are idempotent
- POST, PATCH are NOT idempotent

---

### HTTP Status Codes

```javascript
// 1xx Informational
100 Continue
101 Switching Protocols

// 2xx Success
200 OK                  // Request succeeded
201 Created             // Resource created
204 No Content          // Success, no body
206 Partial Content     // Range request

// 3xx Redirection
301 Moved Permanently   // Permanent redirect
302 Found               // Temporary redirect
304 Not Modified        // Use cached version
307 Temporary Redirect  // Preserve method
308 Permanent Redirect  // Preserve method

// 4xx Client Errors
400 Bad Request         // Invalid syntax
401 Unauthorized        // Authentication required
403 Forbidden           // No permission
404 Not Found           // Resource not found
405 Method Not Allowed  // Method not supported
409 Conflict            // Request conflicts with state
422 Unprocessable Entity // Validation error
429 Too Many Requests   // Rate limit exceeded

// 5xx Server Errors
500 Internal Server Error
502 Bad Gateway         // Invalid response from upstream
503 Service Unavailable // Temporarily unavailable
504 Gateway Timeout     // Upstream timeout

// Example: Handling status codes
async function fetchData(url) {
  const response = await fetch(url);

  if (response.ok) { // status 200-299
    return response.json();
  }

  switch (response.status) {
    case 401:
      // Redirect to login
      window.location.href = '/login';
      break;
    case 404:
      throw new Error('Resource not found');
    case 429:
      // Retry after rate limit
      const retryAfter = response.headers.get('Retry-After');
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return fetchData(url);
    case 500:
      throw new Error('Server error');
    default:
      throw new Error(`HTTP error: ${response.status}`);
  }
}
```

---

### HTTP Headers

```javascript
// Request Headers
const headers = {
  // Content negotiation
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',

  // Authentication
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',

  // Content type
  'Content-Type': 'application/json',

  // Custom headers
  'X-API-Key': 'abc123',
  'X-Request-ID': 'uuid-1234',

  // Caching
  'Cache-Control': 'no-cache',
  'If-None-Match': 'etag-value',
  'If-Modified-Since': 'Wed, 21 Oct 2015 07:28:00 GMT',

  // CORS
  'Origin': 'https://example.com',

  // Client info
  'User-Agent': 'Mozilla/5.0 ...',
  'Referer': 'https://example.com/page'
};

// Response Headers
/*
Content-Type: application/json
Content-Length: 1234
Content-Encoding: gzip

Cache-Control: max-age=3600, public
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Expires: Wed, 21 Oct 2025 07:28:00 GMT

Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type

Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict

Location: https://example.com/new-location

X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
*/
```

---

## HTTPS

### HTTP vs HTTPS

```
HTTP (Hypertext Transfer Protocol):
- Port 80
- Unencrypted
- Data sent in plain text
- Vulnerable to man-in-the-middle attacks
- No data integrity verification

HTTPS (HTTP Secure):
- Port 443
- Encrypted with TLS/SSL
- Data encrypted in transit
- Protected from eavesdropping
- Certificate-based authentication
- Data integrity verification
```

---

### TLS/SSL Handshake

```
Client                                  Server
  │                                       │
  │ ──── ClientHello ──────────────────> │
  │      (supported ciphers, TLS version) │
  │                                       │
  │ <─── ServerHello ────────────────── │
  │      (chosen cipher, certificate)     │
  │                                       │
  │ ──── Verify certificate ──────────> │
  │      (check CA, validity, domain)     │
  │                                       │
  │ <─── Key exchange ──────────────── │
  │      (generate session keys)          │
  │                                       │
  │ ──── Encrypted communication ────> │
  │ <─────────────────────────────────── │
```

**HTTPS Benefits:**

1. **Encryption**: Data encrypted in transit
2. **Authentication**: Verify server identity
3. **Data Integrity**: Detect tampering
4. **SEO**: Google ranking boost
5. **Trust**: Browser shows padlock icon
6. **Required**: For modern web features (Service Workers, HTTP/2, etc.)

---

### Implementing HTTPS (Node.js)

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

const server = https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('Secure connection!');
});

server.listen(443, () => {
  console.log('HTTPS server running on port 443');
});

// Express.js with HTTPS
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello HTTPS!');
});

https.createServer(options, app).listen(443);

// Redirect HTTP to HTTPS
const http = require('http');

http.createServer((req, res) => {
  res.writeHead(301, {
    'Location': `https://${req.headers.host}${req.url}`
  });
  res.end();
}).listen(80);
```

---

## HTTP/2

### HTTP/1.1 vs HTTP/2

```
HTTP/1.1 Problems:
- Head-of-line blocking (requests wait in queue)
- Multiple connections needed (6 per domain)
- No compression of headers
- No server push
- Text-based protocol

HTTP/2 Improvements:
- Binary protocol (faster parsing)
- Multiplexing (multiple requests on single connection)
- Header compression (HPACK)
- Server push
- Stream prioritization
- One TCP connection per origin
```

---

### HTTP/2 Features

**1. Multiplexing:**

```
HTTP/1.1: Sequential requests
┌─────────────────────────────────┐
│ Request 1 ──> Response 1        │
│               Request 2 ──> R2  │
│                         Request 3 │
└─────────────────────────────────┘
❌ Head-of-line blocking

HTTP/2: Concurrent requests
┌─────────────────────────────────┐
│ Request 1 ──────────────> R1    │
│ Request 2 ──────> R2            │
│ Request 3 ────────────────> R3  │
└─────────────────────────────────┘
✅ Multiplexed over single connection
```

**2. Server Push:**

```javascript
// Server can push resources before client requests

// Node.js HTTP/2 server with push
const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
});

server.on('stream', (stream, headers) => {
  if (headers[':path'] === '/') {
    // Push CSS before client requests it
    stream.pushStream({ ':path': '/style.css' }, (err, pushStream) => {
      if (!err) {
        pushStream.respondWithFile('style.css');
      }
    });

    // Respond to main request
    stream.respondWithFile('index.html');
  }
});

server.listen(443);
```

**3. Header Compression:**

```
HTTP/1.1: Repeated headers in every request
GET /api/users HTTP/1.1
Host: api.example.com
User-Agent: Mozilla/5.0 ...
Accept: application/json
... (500+ bytes of headers)

HTTP/2: HPACK compression
- Headers compressed using Huffman encoding
- Header table stores previously sent headers
- Only differences sent (saves bandwidth)
- 80-90% reduction in header size
```

---

### HTTP/2 in Practice

```javascript
// Enable HTTP/2 in Node.js
const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
});

server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200
  });

  stream.end('<h1>Hello HTTP/2!</h1>');
});

server.listen(8443);

// Client
const client = http2.connect('https://localhost:8443');

const req = client.request({ ':path': '/' });

req.on('response', (headers) => {
  console.log(headers[':status']);
});

req.setEncoding('utf8');
req.on('data', (chunk) => console.log(chunk));
req.on('end', () => client.close());
```

**HTTP/2 Best Practices:**

- No need for domain sharding (one connection is fine)
- No need to concatenate files (multiplexing handles it)
- No need for image sprites (can send many small files)
- Keep using CDN, compression, caching

---

## HTTP/3

### HTTP/2 vs HTTP/3

```
HTTP/2:
- Built on TCP
- TCP head-of-line blocking (packet loss blocks all streams)
- Slow connection establishment (TCP + TLS handshake)
- Not optimized for mobile networks

HTTP/3:
- Built on QUIC (UDP-based)
- No head-of-line blocking at transport layer
- Faster connection establishment (0-RTT)
- Better performance on lossy networks
- Connection migration (survive IP changes)
```

---

### QUIC Protocol

```
Traditional: TCP + TLS (2-3 RTT)
┌─────────────────────────────────┐
│ TCP SYN ──>                     │
│        <── SYN-ACK              │
│ ACK ──>                         │
│ ClientHello ──>                 │
│        <── ServerHello          │
│ Finished ──>                    │
│        <── Application Data     │
└─────────────────────────────────┘
3 round trips before data transfer

QUIC (0-RTT on reconnection)
┌─────────────────────────────────┐
│ ClientHello + App Data ──>      │
│        <── ServerHello + Data   │
└─────────────────────────────────┘
0 round trips on reconnection!
```

**QUIC Features:**

1. **0-RTT**: Reconnect without handshake (if previously connected)
2. **No head-of-line blocking**: Packet loss only affects one stream
3. **Connection migration**: Survive IP/port changes (mobile networks)
4. **Built-in encryption**: TLS 1.3 always
5. **Improved congestion control**: Per-stream flow control

---

### HTTP/3 Adoption

```javascript
// Check if browser supports HTTP/3
if ('h3' in navigator) {
  console.log('HTTP/3 supported');
}

// Node.js HTTP/3 (experimental)
// Requires Node.js with QUIC support

// Nginx HTTP/3 configuration
/*
server {
    listen 443 ssl http2;
    listen 443 quic reuseport;

    ssl_certificate cert.pem;
    ssl_certificate_key key.pem;

    # Enable HTTP/3
    add_header Alt-Svc 'h3=":443"; ma=86400';
}
*/
```

**When to use HTTP/3:**

- Mobile applications (connection migration)
- Video streaming (better with packet loss)
- Real-time applications
- High-latency networks

---

## TCP vs UDP

### Comparison

```
TCP (Transmission Control Protocol):
- Connection-oriented (handshake)
- Reliable (guaranteed delivery, retransmission)
- Ordered (packets arrive in order)
- Flow control (prevent overwhelming receiver)
- Congestion control
- Slower (overhead from reliability)
- Use cases: HTTP, HTTPS, Email, File transfer

UDP (User Datagram Protocol):
- Connectionless (no handshake)
- Unreliable (no delivery guarantee)
- Unordered (packets may arrive out of order)
- No flow/congestion control
- Faster (minimal overhead)
- Use cases: Video streaming, Gaming, DNS, VoIP
```

---

### TCP Example (Node.js)

```javascript
// TCP Server
const net = require('net');

const server = net.createServer((socket) => {
  console.log('Client connected');

  socket.on('data', (data) => {
    console.log('Received:', data.toString());
    socket.write('Echo: ' + data);
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

server.listen(8080, () => {
  console.log('TCP server listening on port 8080');
});

// TCP Client
const client = net.createConnection({ port: 8080 }, () => {
  console.log('Connected to server');
  client.write('Hello Server!');
});

client.on('data', (data) => {
  console.log('Received:', data.toString());
  client.end();
});
```

---

### UDP Example (Node.js)

```javascript
// UDP Server
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
  console.log(`Received: ${msg} from ${rinfo.address}:${rinfo.port}`);

  // Send response
  server.send('Echo: ' + msg, rinfo.port, rinfo.address);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`UDP server listening on ${address.address}:${address.port}`);
});

server.bind(8080);

// UDP Client
const client = dgram.createSocket('udp4');
const message = Buffer.from('Hello Server!');

client.send(message, 8080, 'localhost', (err) => {
  if (err) console.error(err);
  console.log('Message sent');
});

client.on('message', (msg) => {
  console.log('Received:', msg.toString());
  client.close();
});
```

---

## WebSockets vs Polling

### Polling

```javascript
// Short Polling (inefficient)
function shortPolling() {
  setInterval(async () => {
    const response = await fetch('/api/messages');
    const data = await response.json();
    updateUI(data);
  }, 5000); // Poll every 5 seconds
}
// ❌ Many unnecessary requests
// ❌ High latency (up to polling interval)
// ❌ Server load

// Long Polling (better)
async function longPolling() {
  while (true) {
    try {
      const response = await fetch('/api/messages', {
        headers: { 'Connection': 'keep-alive' }
      });

      const data = await response.json();
      updateUI(data);

      // Immediately reconnect
      longPolling();
      break;
    } catch (err) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}
// ✅ Lower latency
// ❌ Still many HTTP requests
// ❌ Complex server logic
```

---

### WebSockets

```javascript
// WebSocket Client
const ws = new WebSocket('ws://localhost:8080');

ws.addEventListener('open', () => {
  console.log('Connected');
  ws.send('Hello Server!');
});

ws.addEventListener('message', (event) => {
  console.log('Received:', event.data);
});

ws.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.addEventListener('close', () => {
  console.log('Disconnected');
  // Reconnect logic
  setTimeout(() => {
    connectWebSocket();
  }, 5000);
});

// Send data
ws.send(JSON.stringify({ type: 'chat', message: 'Hello!' }));

// Close connection
ws.close();

// WebSocket Server (Node.js)
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received:', message);

    // Echo to sender
    ws.send('Echo: ' + message);

    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Send periodic updates
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ timestamp: Date.now() }));
    }
  }, 1000);

  ws.on('close', () => clearInterval(interval));
});

// Example: Chat application
class ChatServer {
  constructor(port) {
    this.wss = new WebSocket.Server({ port });
    this.clients = new Map(); // userId -> WebSocket

    this.wss.on('connection', (ws) => {
      this.handleConnection(ws);
    });
  }

  handleConnection(ws) {
    let userId;

    ws.on('message', (data) => {
      const message = JSON.parse(data);

      switch (message.type) {
        case 'register':
          userId = message.userId;
          this.clients.set(userId, ws);
          break;

        case 'chat':
          this.broadcast({
            from: userId,
            message: message.text,
            timestamp: Date.now()
          });
          break;
      }
    });

    ws.on('close', () => {
      this.clients.delete(userId);
    });
  }

  broadcast(message) {
    const data = JSON.stringify(message);

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  sendToUser(userId, message) {
    const client = this.clients.get(userId);

    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
}

const chat = new ChatServer(8080);
```

**WebSockets vs Polling:**

```
Polling:
✅ Simple to implement
✅ Works with HTTP infrastructure
❌ High latency
❌ Unnecessary requests
❌ Server load

WebSockets:
✅ Real-time bidirectional
✅ Low latency
✅ Efficient (persistent connection)
✅ Less server load
❌ More complex
❌ May need fallback for firewalls
```

**Use cases:**

- WebSockets: Chat, real-time dashboards, live sports scores, collaborative editing, gaming
- Polling: Simple notifications, infrequent updates, when WebSockets blocked

---

## RESTful API

### REST Principles

```
1. Client-Server: Separation of concerns
2. Stateless: Each request contains all needed info
3. Cacheable: Responses marked as cacheable or not
4. Uniform Interface: Consistent resource identification
5. Layered System: Client doesn't know if connected to end server
6. Code on Demand (optional): Server can send executable code
```

---

### RESTful Resource Design

```javascript
// ✅ GOOD: RESTful URL design
GET    /api/users              // List users
GET    /api/users/123          // Get user 123
POST   /api/users              // Create user
PUT    /api/users/123          // Update user 123
PATCH  /api/users/123          // Partial update user 123
DELETE /api/users/123          // Delete user 123

GET    /api/users/123/posts    // Get posts by user 123
POST   /api/users/123/posts    // Create post for user 123
GET    /api/posts/456/comments // Get comments on post 456

// Query parameters for filtering, sorting, pagination
GET /api/users?role=admin&sort=name&page=2&limit=20

// ❌ BAD: Non-RESTful
GET  /api/getUsers
POST /api/createUser
POST /api/updateUser
POST /api/deleteUser
GET  /api/user?action=delete&id=123

// RESTful Express.js API
const express = require('express');
const app = express();

app.use(express.json());

// Users collection
app.get('/api/users', (req, res) => {
  const { page = 1, limit = 10, role } = req.query;

  // Filter, paginate
  const users = getUsers({ page, limit, role });

  res.json({
    data: users,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: getTotalUsers()
    }
  });
});

// Single user
app.get('/api/users/:id', (req, res) => {
  const user = getUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// Create user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }

  const user = createUser({ name, email });

  res.status(201)
    .location(`/api/users/${user.id}`)
    .json(user);
});

// Update user
app.put('/api/users/:id', (req, res) => {
  const user = updateUser(req.params.id, req.body);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// Partial update
app.patch('/api/users/:id', (req, res) => {
  const user = partialUpdateUser(req.params.id, req.body);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  const deleted = deleteUser(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(204).send();
});
```

---

### REST Best Practices

```javascript
// 1. Versioning
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);
// Or: Accept: application/vnd.api.v2+json

// 2. HATEOAS (Hypermedia)
app.get('/api/users/:id', (req, res) => {
  res.json({
    id: 123,
    name: 'John',
    _links: {
      self: '/api/users/123',
      posts: '/api/users/123/posts',
      avatar: '/api/users/123/avatar'
    }
  });
});

// 3. Content negotiation
app.get('/api/users/:id', (req, res) => {
  const user = getUserById(req.params.id);

  if (req.accepts('json')) {
    res.json(user);
  } else if (req.accepts('xml')) {
    res.type('xml').send(toXML(user));
  } else {
    res.status(406).send('Not Acceptable');
  }
});

// 4. Error handling
class APIError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

app.use((err, req, res, next) => {
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        details: err.details
      }
    });
  }

  res.status(500).json({
    error: { message: 'Internal server error' }
  });
});

// 5. Rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

// 6. Caching
app.get('/api/users/:id', (req, res) => {
  const user = getUserById(req.params.id);

  res.set({
    'Cache-Control': 'public, max-age=3600',
    'ETag': generateETag(user)
  });

  // Check If-None-Match
  if (req.get('If-None-Match') === generateETag(user)) {
    return res.status(304).end();
  }

  res.json(user);
});
```

---

## REST vs RPC vs GraphQL

### Comparison

```
REST:
- Resource-oriented
- HTTP methods (GET, POST, PUT, DELETE)
- Multiple endpoints
- Over-fetching/under-fetching
- Cacheable
- Stateless
- Well-established

RPC (Remote Procedure Call):
- Action-oriented (call functions remotely)
- Usually POST for all operations
- Single endpoint
- Can be more efficient
- JSON-RPC, gRPC, XML-RPC
- Tight coupling

GraphQL:
- Query language
- Single endpoint (/graphql)
- Client specifies exact data needed
- No over-fetching
- Real-time with subscriptions
- Introspection (self-documenting)
- More complex server
```

---

### REST Example

```javascript
// Multiple requests needed
GET /api/users/123
GET /api/users/123/posts
GET /api/posts/456/comments

// Response includes unneeded fields (over-fetching)
{
  "id": 123,
  "name": "John",
  "email": "john@example.com",
  "bio": "...",
  "createdAt": "...",
  "updatedAt": "...",
  "avatar": "...",
  // ... many more fields
}
```

---

### JSON-RPC Example

```javascript
// JSON-RPC Request
POST /rpc
{
  "jsonrpc": "2.0",
  "method": "getUser",
  "params": { "id": 123 },
  "id": 1
}

// JSON-RPC Response
{
  "jsonrpc": "2.0",
  "result": {
    "id": 123,
    "name": "John"
  },
  "id": 1
}

// JSON-RPC Server
app.post('/rpc', (req, res) => {
  const { method, params, id } = req.body;

  const handlers = {
    getUser: (params) => getUserById(params.id),
    createUser: (params) => createUser(params),
    updateUser: (params) => updateUser(params.id, params.data)
  };

  if (!handlers[method]) {
    return res.json({
      jsonrpc: '2.0',
      error: { code: -32601, message: 'Method not found' },
      id
    });
  }

  try {
    const result = handlers[method](params);
    res.json({ jsonrpc: '2.0', result, id });
  } catch (error) {
    res.json({
      jsonrpc: '2.0',
      error: { code: -32603, message: error.message },
      id
    });
  }
});
```

---

### GraphQL Example

```graphql
# GraphQL Schema
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
}

type Query {
  user(id: ID!): User
  users: [User!]!
}

type Mutation {
  createUser(name: String!, email: String!): User!
  updateUser(id: ID!, name: String, email: String): User!
}

# GraphQL Query (single request)
query {
  user(id: "123") {
    name
    posts {
      title
      comments {
        text
      }
    }
  }
}

# Response (exact fields requested)
{
  "data": {
    "user": {
      "name": "John",
      "posts": [
        {
          "title": "Post 1",
          "comments": [
            { "text": "Comment 1" }
          ]
        }
      ]
    }
  }
}
```

```javascript
// GraphQL Server (Apollo Server)
const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
  }
`;

const resolvers = {
  Query: {
    user: (_, { id }) => getUserById(id),
    users: () => getAllUsers()
  },

  Mutation: {
    createUser: (_, { name, email }) => createUser({ name, email })
  },

  User: {
    posts: (user) => getPostsByUserId(user.id)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`GraphQL server ready at ${url}`);
});
```

---

### When to Use What?

```
Use REST when:
✅ Simple CRUD operations
✅ Caching important
✅ Public API (widely understood)
✅ Stateless operations
✅ Resource-oriented domain

Use RPC when:
✅ Action-oriented operations
✅ Internal microservices
✅ High performance needed (gRPC)
✅ Specific actions don't map to resources
✅ Real-time streaming (gRPC)

Use GraphQL when:
✅ Complex data requirements
✅ Multiple clients with different needs
✅ Reducing network requests
✅ Real-time updates (subscriptions)
✅ Introspection/tooling important
```

---

## Interview Tips

**Q: HTTP vs HTTPS?**
A: HTTP is unencrypted (port 80), HTTPS is encrypted with TLS/SSL (port 443). HTTPS provides encryption, authentication, and data integrity.

**Q: What's new in HTTP/2?**
A: Binary protocol, multiplexing (multiple requests on one connection), header compression (HPACK), server push, stream prioritization.

**Q: HTTP/2 vs HTTP/3?**
A: HTTP/2 uses TCP, HTTP/3 uses QUIC (UDP-based). HTTP/3 has no head-of-line blocking, 0-RTT reconnection, and connection migration.

**Q: TCP vs UDP?**
A: TCP is reliable, ordered, connection-oriented (HTTP, Email). UDP is fast, connectionless, unreliable (Streaming, Gaming, DNS).

**Q: WebSockets vs Polling?**
A: WebSockets are persistent bidirectional connections (low latency, efficient). Polling makes repeated HTTP requests (simpler but inefficient).

**Q: REST vs GraphQL?**
A: REST has multiple endpoints, fixed responses (may over-fetch). GraphQL has single endpoint, client specifies exact data needed (no over-fetching).

Good luck! 🚀
