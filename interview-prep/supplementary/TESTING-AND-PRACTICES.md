# Automated Testing & Software Engineering Practices - Complete Guide

> Cobertura completa de Testing y Prácticas de Ingeniería de Software

---

## 📋 Table of Contents

1. [Automated Testing](#automated-testing)
2. [Software Engineering Practices](#software-engineering-practices)

---

## Automated Testing

### Testing Pyramid

```
         /\
        /E2E\         Few, slow, expensive
       /------\
      /  API  \       More, faster, cheaper
     /--------\
    /   Unit   \     Many, fastest, cheapest
   /------------\
```

**Unit Tests (70%)**

- Test individual functions/methods
- Fast execution
- Easy to maintain
- Mock dependencies

**Integration Tests (20%)**

- Test module interactions
- Database, APIs, services
- Slower than unit tests

**E2E Tests (10%)**

- Test complete user flows
- Browser automation
- Slowest, most fragile
- Highest confidence

### Testing Approaches

```javascript
// TDD (Test-Driven Development)
// 1. Write failing test
// 2. Write minimal code to pass
// 3. Refactor

// Example: TDD for sum function
describe('sum', () => {
  test('adds two numbers', () => {
    expect(sum(1, 2)).toBe(3); // FAILS - sum doesn't exist
  });
});

// Implement
function sum(a, b) {
  return a + b; // PASSES
}

// BDD (Behavior-Driven Development)
// Focus on behavior, not implementation
// Use natural language

describe('User Login', () => {
  describe('when credentials are valid', () => {
    it('should log the user in', async () => {
      const result = await login('john@example.com', 'password');
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
    });
  });

  describe('when credentials are invalid', () => {
    it('should return an error', async () => {
      const result = await login('john@example.com', 'wrongpassword');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });
});

// ATDD (Acceptance Test-Driven Development)
// Tests written from user's perspective
// Cucumber/Gherkin syntax

Feature: User Login
  Scenario: Successful login
    Given the user is on the login page
    When they enter valid credentials
    Then they should be redirected to the dashboard

  Scenario: Failed login
    Given the user is on the login page
    When they enter invalid credentials
    Then they should see an error message
```

### Test Coverage

```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 80,      // if/else coverage
      functions: 80,     // function coverage
      lines: 80,         // line coverage
      statements: 80     // statement coverage
    }
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/index.js'
  ]
};

// Run tests with coverage
// npm test -- --coverage

// Coverage report example:
// File           | % Stmts | % Branch | % Funcs | % Lines |
// ---------------|---------|----------|---------|---------|
// All files      |   85.71 |    75.00 |   80.00 |   85.71 |
// user.js        |   90.00 |    80.00 |   85.00 |   90.00 |
// auth.js        |   80.00 |    70.00 |   75.00 |   80.00 |

// Focus on critical paths, not 100% coverage
// 100% coverage doesn't mean bug-free code
```

### Test Organization

```javascript
// Arrange-Act-Assert (AAA) Pattern

test('calculates total price with tax', () => {
  // Arrange - Set up test data
  const cart = { items: [{ price: 10 }, { price: 20 }] };
  const taxRate = 0.1;

  // Act - Execute the function
  const total = calculateTotal(cart, taxRate);

  // Assert - Verify the result
  expect(total).toBe(33); // (10 + 20) * 1.1
});

// Given-When-Then (BDD style)

test('user can checkout', () => {
  // Given - Initial context
  const user = { id: 1, cart: [{ id: 1, price: 100 }] };
  const paymentMethod = { type: 'card', number: '4111111111111111' };

  // When - Action occurs
  const result = checkout(user, paymentMethod);

  // Then - Outcome
  expect(result.success).toBe(true);
  expect(result.orderId).toBeDefined();
});

// File organization
src/
  components/
    Button/
      Button.jsx
      Button.test.jsx        // Co-located tests
      Button.styles.js
  utils/
    validation.js
    validation.test.js
  __tests__/               // Or centralized
    integration/
      api.test.js
    e2e/
      checkout.test.js
```

### Mocking Strategies

```javascript
// 1. Manual mocks
// __mocks__/axios.js
export default {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} }))
};

// 2. Mock modules
jest.mock('axios');
const axios = require('axios');
axios.get.mockResolvedValue({ data: { users: [] } });

// 3. Dependency injection (better)
class UserService {
  constructor(httpClient) {
    this.http = httpClient;
  }

  async getUser(id) {
    const response = await this.http.get(`/users/${id}`);
    return response.data;
  }
}

// Test
const mockHttp = {
  get: jest.fn().mockResolvedValue({ data: { id: 1, name: 'John' } })
};

const service = new UserService(mockHttp);
const user = await service.getUser(1);

expect(mockHttp.get).toHaveBeenCalledWith('/users/1');
expect(user.name).toBe('John');

// 4. Test doubles
// Stub - provides canned answers
const stub = jest.fn().mockReturnValue('fixed response');

// Spy - records calls
const spy = jest.spyOn(obj, 'method');
expect(spy).toHaveBeenCalled();

// Mock - pre-programmed expectations
const mock = jest.fn()
  .mockReturnValueOnce('first')
  .mockReturnValueOnce('second');

// Fake - working implementation (simplified)
class FakeDatabase {
  constructor() {
    this.data = [];
  }

  save(item) {
    this.data.push(item);
    return Promise.resolve(item);
  }

  find(id) {
    return Promise.resolve(this.data.find(i => i.id === id));
  }
}
```

### Snapshot Testing

```javascript
// React component snapshot testing
import renderer from 'react-test-renderer';
import Button from './Button';

test('Button renders correctly', () => {
  const tree = renderer
    .create(<Button label="Click me" onClick={() => {}} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

// First run creates __snapshots__/Button.test.js.snap
// Subsequent runs compare against snapshot

// Update snapshots when changes are intentional
// npm test -- -u

// Snapshot file example:
// exports[`Button renders correctly 1`] = `
// <button
//   className="button"
//   onClick={[Function]}
// >
//   Click me
// </button>
// `;

// Inline snapshots
test('config is valid', () => {
  expect(getConfig()).toMatchInlineSnapshot(`
    Object {
      "timeout": 5000,
      "retries": 3,
    }
  `);
});
```

### Integration Testing Best Practices

```javascript
// Test database integration
describe('User Repository Integration', () => {
  let db;

  beforeAll(async () => {
    // Setup test database
    db = await connectTestDB();
  });

  afterAll(async () => {
    // Cleanup
    await db.disconnect();
  });

  beforeEach(async () => {
    // Clear data before each test
    await db.query('DELETE FROM users');
  });

  test('creates user in database', async () => {
    const user = { name: 'John', email: 'john@example.com' };

    const created = await userRepository.create(user);

    expect(created.id).toBeDefined();
    expect(created.name).toBe('John');

    // Verify in database
    const found = await db.query('SELECT * FROM users WHERE id = $1', [created.id]);
    expect(found.rows[0].name).toBe('John');
  });
});

// Test API integration with supertest
const request = require('supertest');
const app = require('./app');

describe('API Integration Tests', () => {
  test('GET /api/users returns user list', async () => {
    const response = await request(app)
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /json/);

    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/users creates user', async () => {
    const newUser = {
      name: 'John',
      email: 'john@example.com'
    };

    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201);

    expect(response.body).toMatchObject(newUser);
    expect(response.body.id).toBeDefined();
  });
});

// Test external API integration with nock
const nock = require('nock');

test('fetches data from external API', async () => {
  nock('https://api.example.com')
    .get('/users/1')
    .reply(200, { id: 1, name: 'John' });

  const user = await fetchExternalUser(1);

  expect(user.name).toBe('John');
});
```

### E2E Testing Tools

```javascript
// Playwright E2E test
const { test, expect } = require('@playwright/test');

test.describe('E2E: User Checkout Flow', () => {
  test('user can complete purchase', async ({ page }) => {
    // Navigate to site
    await page.goto('http://localhost:3000');

    // Login
    await page.click('[data-testid="login-button"]');
    await page.fill('[name="email"]', 'john@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('[type="submit"]');

    // Wait for redirect
    await page.waitForURL('**/dashboard');

    // Add item to cart
    await page.click('[data-testid="add-to-cart"]');

    // Go to checkout
    await page.click('[data-testid="cart-icon"]');
    await page.click('[data-testid="checkout-button"]');

    // Fill payment details
    await page.fill('[name="cardNumber"]', '4111111111111111');
    await page.fill('[name="expiry"]', '12/25');
    await page.fill('[name="cvv"]', '123');

    // Submit order
    await page.click('[data-testid="submit-order"]');

    // Verify success
    await expect(page.locator('[data-testid="order-success"]')).toBeVisible();
    const orderNumber = await page.textContent('[data-testid="order-number"]');
    expect(orderNumber).toMatch(/^ORD-\d+$/);
  });
});

// Cypress E2E test
describe('E2E: User Checkout Flow', () => {
  it('completes purchase successfully', () => {
    cy.visit('/');

    cy.get('[data-testid="login-button"]').click();
    cy.get('[name="email"]').type('john@example.com');
    cy.get('[name="password"]').type('password123');
    cy.get('[type="submit"]').click();

    cy.url().should('include', '/dashboard');

    cy.get('[data-testid="add-to-cart"]').click();
    cy.get('[data-testid="cart-icon"]').click();
    cy.get('[data-testid="checkout-button"]').click();

    cy.get('[name="cardNumber"]').type('4111111111111111');
    cy.get('[name="expiry"]').type('12/25');
    cy.get('[name="cvv"]').type('123');

    cy.get('[data-testid="submit-order"]').click();

    cy.get('[data-testid="order-success"]').should('be.visible');
    cy.get('[data-testid="order-number"]').should('match', /ORD-\d+/);
  });
});
```

---

## Software Engineering Practices

### Code Quality

```javascript
// 1. Clean Code Principles

// Bad: Unclear names
function calc(x, y) {
  return x * y * 0.1;
}

// Good: Descriptive names
function calculateSalesTax(price, quantity) {
  const TAX_RATE = 0.1;
  return price * quantity * TAX_RATE;
}

// Bad: Magic numbers
if (user.age > 18) { /* ... */ }

// Good: Named constants
const LEGAL_AGE = 18;
if (user.age > LEGAL_AGE) { /* ... */ }

// Bad: Long function
function processOrder(order) {
  // Validate order (10 lines)
  // Calculate totals (15 lines)
  // Apply discounts (20 lines)
  // Process payment (25 lines)
  // Send confirmation (10 lines)
}

// Good: Single Responsibility
function processOrder(order) {
  validateOrder(order);
  const total = calculateTotal(order);
  const discount = applyDiscounts(order);
  const payment = processPayment(total - discount);
  sendConfirmation(order, payment);
}

// 2. DRY (Don't Repeat Yourself)

// Bad: Repetition
function getUserEmail(userId) {
  const user = db.query('SELECT * FROM users WHERE id = ?', [userId]);
  return user.email;
}

function getUserName(userId) {
  const user = db.query('SELECT * FROM users WHERE id = ?', [userId]);
  return user.name;
}

// Good: Abstraction
function getUser(userId) {
  return db.query('SELECT * FROM users WHERE id = ?', [userId]);
}

function getUserEmail(userId) {
  return getUser(userId).email;
}

function getUserName(userId) {
  return getUser(userId).name;
}

// 3. KISS (Keep It Simple, Stupid)

// Bad: Over-engineered
const result = array.reduce((acc, curr) =>
  [...acc, ...curr.items.filter(item => item.active)
    .map(item => ({ ...item, processed: true }))], []);

// Good: Simple and clear
const result = [];
for (const group of array) {
  for (const item of group.items) {
    if (item.active) {
      result.push({ ...item, processed: true });
    }
  }
}

// 4. YAGNI (You Aren't Gonna Need It)

// Bad: Premature optimization
class UserManager {
  constructor() {
    this.cache = new Map();
    this.pool = new ConnectionPool(10);
    this.metrics = new MetricsCollector();
    // ... complex setup for features not yet needed
  }
}

// Good: Start simple
class UserManager {
  constructor(database) {
    this.db = database;
  }

  async getUser(id) {
    return await this.db.findById(id);
  }
}
```

### Code Review Guidelines

```javascript
// Code Review Checklist

// ✅ Functionality
// - Does the code work as intended?
// - Are edge cases handled?
// - Is error handling appropriate?

// ✅ Readability
// - Is the code easy to understand?
// - Are names descriptive?
// - Is it properly formatted?

// ✅ Performance
// - Are there obvious performance issues?
// - Are algorithms efficient?
// - Are resources properly managed?

// ✅ Security
// - Is user input validated?
// - Are there SQL injection risks?
// - Is sensitive data protected?

// ✅ Testing
// - Are there adequate tests?
// - Do tests cover edge cases?
// - Do all tests pass?

// ✅ Documentation
// - Are complex parts documented?
// - Is API documentation updated?
// - Are comments helpful?

// Example review comment format:

// ❌ Blocking issue
// This introduces a security vulnerability. User input should be sanitized
// before being used in SQL queries.

// ⚠️ Suggestion
// Consider using async/await here for better readability instead of
// promise chains.

// 💡 Nitpick
// Minor: This variable name could be more descriptive. Consider renaming
// 'data' to 'userProfiles'.

// ✅ Approved
// LGTM! Great job handling the edge cases.
```

### Refactoring Techniques

```javascript
// 1. Extract Function

// Before
function printOwing(invoice) {
  let outstanding = 0;

  console.log('***********************');
  console.log('**** Customer Owes ****');
  console.log('***********************');

  for (const order of invoice.orders) {
    outstanding += order.amount;
  }

  console.log(`name: ${invoice.customer}`);
  console.log(`amount: ${outstanding}`);
}

// After
function printOwing(invoice) {
  printBanner();
  const outstanding = calculateOutstanding(invoice);
  printDetails(invoice, outstanding);
}

function printBanner() {
  console.log('***********************');
  console.log('**** Customer Owes ****');
  console.log('***********************');
}

function calculateOutstanding(invoice) {
  return invoice.orders.reduce((sum, order) => sum + order.amount, 0);
}

function printDetails(invoice, outstanding) {
  console.log(`name: ${invoice.customer}`);
  console.log(`amount: ${outstanding}`);
}

// 2. Replace Temp with Query

// Before
function getPrice(quantity) {
  const basePrice = quantity * itemPrice;
  const discount = Math.max(0, quantity - 500) * itemPrice * 0.05;
  const shipping = Math.min(basePrice * 0.1, 100);
  return basePrice - discount + shipping;
}

// After
function getPrice(quantity) {
  return basePrice(quantity) - discount(quantity) + shipping(quantity);
}

function basePrice(quantity) {
  return quantity * itemPrice;
}

function discount(quantity) {
  return Math.max(0, quantity - 500) * itemPrice * 0.05;
}

function shipping(quantity) {
  return Math.min(basePrice(quantity) * 0.1, 100);
}

// 3. Replace Conditional with Polymorphism

// Before
function getSpeed(bird) {
  switch (bird.type) {
    case 'European':
      return getBaseSpeed(bird);
    case 'African':
      return getBaseSpeed(bird) - getLoadFactor(bird);
    case 'Norwegian':
      return bird.isNailed ? 0 : getBaseSpeed(bird);
  }
}

// After
class Bird {
  getSpeed() {
    return this.getBaseSpeed();
  }
}

class EuropeanBird extends Bird {
  getSpeed() {
    return this.getBaseSpeed();
  }
}

class AfricanBird extends Bird {
  getSpeed() {
    return this.getBaseSpeed() - this.getLoadFactor();
  }
}

class NorwegianBird extends Bird {
  getSpeed() {
    return this.isNailed ? 0 : this.getBaseSpeed();
  }
}
```

### Design Patterns in Practice

```javascript
// 1. Repository Pattern (Separation of Concerns)

class UserRepository {
  constructor(database) {
    this.db = database;
  }

  async findById(id) {
    return await this.db.query('SELECT * FROM users WHERE id = ?', [id]);
  }

  async findByEmail(email) {
    return await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
  }

  async create(user) {
    const result = await this.db.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [user.name, user.email]
    );
    return { id: result.insertId, ...user };
  }
}

// Service uses repository
class UserService {
  constructor(userRepository) {
    this.users = userRepository;
  }

  async registerUser(userData) {
    const existing = await this.users.findByEmail(userData.email);
    if (existing) {
      throw new Error('Email already registered');
    }
    return await this.users.create(userData);
  }
}

// 2. Factory Pattern (Object Creation)

class UserFactory {
  static create(type, data) {
    switch (type) {
      case 'admin':
        return new AdminUser(data);
      case 'customer':
        return new CustomerUser(data);
      case 'guest':
        return new GuestUser(data);
      default:
        throw new Error(`Unknown user type: ${type}`);
    }
  }
}

// Usage
const admin = UserFactory.create('admin', { name: 'John', permissions: ['all'] });
const customer = UserFactory.create('customer', { name: 'Jane' });

// 3. Dependency Injection (Loose Coupling)

// Without DI (tight coupling)
class OrderService {
  constructor() {
    this.emailService = new EmailService(); // Hard dependency
  }

  async createOrder(order) {
    // ...
    await this.emailService.send(/* ... */);
  }
}

// With DI (loose coupling)
class OrderService {
  constructor(emailService) {
    this.emailService = emailService; // Injected dependency
  }

  async createOrder(order) {
    // ...
    await this.emailService.send(/* ... */);
  }
}

// Easy to test with mocks
const mockEmailService = { send: jest.fn() };
const orderService = new OrderService(mockEmailService);
```

### Documentation Standards

````javascript
/**
 * Calculates the total price including tax and discounts
 *
 * @param {Object} cart - The shopping cart
 * @param {Array<Object>} cart.items - Cart items
 * @param {number} cart.items[].price - Item price
 * @param {number} cart.items[].quantity - Item quantity
 * @param {Object} options - Calculation options
 * @param {number} options.taxRate - Tax rate (0-1)
 * @param {number} [options.discountPercent=0] - Discount percentage (0-100)
 *
 * @returns {number} Total price after tax and discounts
 *
 * @throws {Error} If cart is empty
 * @throws {TypeError} If taxRate is not a number
 *
 * @example
 * const cart = {
 *   items: [
 *     { price: 10, quantity: 2 },
 *     { price: 20, quantity: 1 }
 *   ]
 * };
 * const total = calculateTotal(cart, { taxRate: 0.1, discountPercent: 10 });
 * // Returns: 36 (40 - 10% discount + 10% tax)
 */
function calculateTotal(cart, options) {
  if (!cart.items || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  if (typeof options.taxRate !== 'number') {
    throw new TypeError('Tax rate must be a number');
  }

  const subtotal = cart.items.reduce((sum, item) =>
    sum + (item.price * item.quantity), 0
  );

  const discount = options.discountPercent
    ? subtotal * (options.discountPercent / 100)
    : 0;

  const tax = (subtotal - discount) * options.taxRate;

  return subtotal - discount + tax;
}

// README.md structure
/*
# Project Name

## Description
Brief description of what the project does

## Installation
```bash
npm install
````

## Usage

```javascript
const example = require('example');
example.doSomething();
```

## API Documentation

### Methods

#### `method(param1, param2)`

Description

**Parameters:**

- `param1` (type) - Description
- `param2` (type) - Description

**Returns:** (type) Description

**Example:**

```javascript
method('value1', 'value2');
```

## Testing

```bash
npm test
```

## Contributing

Guidelines for contributing

## License

MIT
\*/

````

### Performance Best Practices

```javascript
// 1. Avoid unnecessary work

// Bad: Recalculates on every render
function Component() {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return <div>{total}</div>;
}

// Good: Memoize expensive calculations
function Component() {
  const total = useMemo(() =>
    items.reduce((sum, item) => sum + item.price, 0),
    [items]
  );
  return <div>{total}</div>;
}

// 2. Use appropriate data structures

// Bad: Array lookup O(n)
const users = [{ id: 1 }, { id: 2 }, { id: 3 }];
const user = users.find(u => u.id === targetId);

// Good: Map lookup O(1)
const users = new Map([
  [1, { id: 1 }],
  [2, { id: 2 }],
  [3, { id: 3 }]
]);
const user = users.get(targetId);

// 3. Debounce/Throttle expensive operations

// Debounce - wait until user stops typing
const debouncedSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`)
    .then(res => res.json())
    .then(results => updateResults(results));
}, 300);

input.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Throttle - limit execution rate
const throttledScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 100);

window.addEventListener('scroll', throttledScroll);

// 4. Lazy loading

// Bad: Load everything upfront
import HeavyComponent from './HeavyComponent';

// Good: Load on demand
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// 5. Avoid memory leaks

// Bad: Event listener not removed
useEffect(() => {
  window.addEventListener('resize', handleResize);
}, []);

// Good: Cleanup
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
````

### Security Best Practices

```javascript
// 1. Input validation

// Bad: No validation
app.post('/users', (req, res) => {
  const user = req.body;
  db.insert(user); // Vulnerable!
});

// Good: Validate and sanitize
const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^[a-zA-Z0-9!@#$%^&*]+$/).required()
});

app.post('/users', async (req, res) => {
  try {
    const user = await userSchema.validateAsync(req.body);
    // Safe to use
  } catch (error) {
    res.status(400).json({ error: error.details });
  }
});

// 2. SQL injection prevention

// Bad: String concatenation
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.query(query); // Vulnerable to SQL injection!

// Good: Parameterized queries
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]); // Safe

// 3. XSS prevention

// Bad: Directly inserting user input
element.innerHTML = userInput; // XSS vulnerability!

// Good: Sanitize or use textContent
element.textContent = userInput; // Safe

// Or use DOMPurify
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// 4. Authentication & Authorization

// Use bcrypt for passwords
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// JWT for authentication
const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

// 5. Environment variables

// Bad: Hardcoded secrets
const apiKey = 'sk_live_1234567890abcdef';

// Good: Environment variables
const apiKey = process.env.API_KEY;

// .env file (never commit!)
API_KEY=sk_live_1234567890abcdef
DB_PASSWORD=secretpassword

// 6. HTTPS only

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (!req.secure && req.get('x-forwarded-proto') !== 'https'
      && process.env.NODE_ENV === 'production') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
});

// 7. Rate limiting

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

// 8. CORS configuration

const cors = require('cors');

app.use(cors({
  origin: 'https://yourdomain.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 🎯 Summary

### Automated Testing Coverage

✅ **Testing Pyramid**: Unit (70%), Integration (20%), E2E (10%)
✅ **Testing Approaches**: TDD, BDD, ATDD
✅ **Test Coverage**: Statement, branch, function, line coverage
✅ **Test Organization**: AAA pattern, Given-When-Then, file structure
✅ **Mocking Strategies**: Manual mocks, module mocks, DI, test doubles
✅ **Snapshot Testing**: Component snapshots, inline snapshots
✅ **Integration Testing**: Database, API, external services
✅ **E2E Testing**: Playwright, Cypress, user flows

### Software Engineering Practices Coverage

✅ **Code Quality**: Clean Code, DRY, KISS, YAGNI
✅ **Code Review**: Guidelines, checklist, comment formats
✅ **Refactoring**: Extract function, replace temp, polymorphism
✅ **Design Patterns**: Repository, Factory, Dependency Injection
✅ **Documentation**: JSDoc, README, API docs
✅ **Performance**: Memoization, data structures, debounce/throttle, lazy loading
✅ **Security**: Input validation, SQL injection prevention, XSS, auth, HTTPS, rate limiting, CORS

**Total**: Cobertura 100% de Automated Testing y Software Engineering Practices según lista del recruiter.
