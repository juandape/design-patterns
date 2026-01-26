# Coding Exercises

## 🎯 How to Practice

1. **Set a timer** (30-45 minutes per problem)
2. **Talk out loud** in English while coding
3. **No googling** during the exercise
4. **Test your solution** with edge cases
5. **Explain time/space complexity**

---

## 📊 Difficulty Levels

- **Easy**: 15-20 minutes
- **Medium**: 30-40 minutes
- **Hard**: 45-60 minutes

---

## JavaScript Exercises

### Exercise 1: Debounce Function (Easy)

**Time: 20 minutes**

**Problem:**
Implement a debounce function that delays executing a function until after a specified delay has elapsed since the last time it was invoked.

**Example:**

```javascript
const debouncedLog = debounce((msg) => console.log(msg), 1000);

debouncedLog('Hello'); // Won't execute
debouncedLog('Hello'); // Won't execute
debouncedLog('Hello'); // Will execute after 1000ms
```

**Requirements:**

- Function should only execute after delay
- Each new call should reset the timer
- Should preserve `this` context
- Should handle arguments correctly

**Test cases:**

```javascript
// Test 1: Basic functionality
const debouncedFn = debounce((x) => console.log(x), 500);
debouncedFn(1);
debouncedFn(2);
debouncedFn(3); // Only logs 3 after 500ms

// Test 2: Rapid calls
const counter = { count: 0 };
const increment = debounce(function() { this.count++; }, 300);
increment.call(counter);
increment.call(counter);
increment.call(counter);
// counter.count should be 1 after 300ms

// Test 3: Multiple arguments
const multi = debounce((a, b, c) => console.log(a + b + c), 200);
multi(1, 2, 3); // Should log 6 after 200ms
```

**Your solution:**

```javascript
function debounce(fn, delay){
  let timeOutId
  return function(...args){
    clearTimeOut(timeoutId)
    timeOutId = setTimeOut(() => {
      fn.apply(this, args)
    }, delay)
  }
}
```

<details>
<summary>Solution</summary>

```javascript
function debounce(fn, delay) {
  let timeoutId;

  return function(...args) {
    // Clear previous timer
    clearTimeout(timeoutId);

    // Set new timer
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

**Complexity:**

- Time: O(1)
- Space: O(1)

**Explanation:**

- Store timeout ID in closure
- Clear previous timeout on each call
- Set new timeout with current arguments
- Use `apply` to preserve `this` context
</details>

---

### Exercise 2: Deep Clone Object (Medium)

**Time: 30 minutes**

**Problem:**
Implement a function that deep clones an object, handling circular references.

**Example:**

```javascript
const obj = { a: 1, b: { c: 2 } };
obj.self = obj; // Circular reference

const cloned = deepClone(obj);
console.log(cloned.b.c); // 2
console.log(cloned.self === cloned); // true
```

**Requirements:**

- Handle nested objects and arrays
- Handle circular references
- Handle primitive types
- Handle Date, RegExp, Map, Set

**Test cases:**

```javascript
// Test 1: Simple object
const simple = { a: 1, b: 'hello' };
const cloned1 = deepClone(simple);
console.log(cloned1); // { a: 1, b: 'hello' }
console.log(cloned1 !== simple); // true

// Test 2: Nested object
const nested = { a: { b: { c: [1, 2, 3] } } };
const cloned2 = deepClone(nested);
console.log(cloned2.a.b.c); // [1, 2, 3]
console.log(cloned2.a.b.c !== nested.a.b.c); // true

// Test 3: Circular reference
const circular = { a: 1 };
circular.self = circular;
const cloned3 = deepClone(circular);
console.log(cloned3.self === cloned3); // true

// Test 4: Special types
const special = {
  date: new Date(),
  regex: /test/gi,
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3])
};
const cloned4 = deepClone(special);
console.log(cloned4.date instanceof Date); // true
```

**Your solution:**

```javascript
function deepClone(obj, hash = new WeakMap()) {
  // Your code here
  if (obj === null || typeof obj !== 'object') return obj
  if (hash.has(obj)) return hash.get(obj)
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags)

}
```

<details>
<summary>Solution</summary>

```javascript
function deepClone(obj, hash = new WeakMap()) {
  // Handle primitives
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle Map
  if (obj instanceof Map) {
    const clonedMap = new Map();
    hash.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, hash), deepClone(value, hash));
    });
    return clonedMap;
  }

  // Handle Set
  if (obj instanceof Set) {
    const clonedSet = new Set();
    hash.set(obj, clonedSet);
    obj.forEach(value => {
      clonedSet.add(deepClone(value, hash));
    });
    return clonedSet;
  }

  // Handle Array
  if (Array.isArray(obj)) {
    const clonedArr = [];
    hash.set(obj, clonedArr);
    obj.forEach((item, index) => {
      clonedArr[index] = deepClone(item, hash);
    });
    return clonedArr;
  }

  // Handle Object
  const clonedObj = Object.create(Object.getPrototypeOf(obj));
  hash.set(obj, clonedObj);

  Object.keys(obj).forEach(key => {
    clonedObj[key] = deepClone(obj[key], hash);
  });

  return clonedObj;
}
```

**Complexity:**

- Time: O(n) where n is number of properties
- Space: O(n) for the hash map and recursion stack

**Key points:**

- WeakMap for circular reference tracking
- Check types before cloning
- Preserve prototypes
- Handle special object types
</details>

---

### Exercise 3: Promise.all Implementation (Medium)

**Time: 30 minutes**

**Problem:**
Implement your own version of `Promise.all`.

**Requirements:**

- Accept array of promises
- Resolve when all promises resolve
- Reject if any promise rejects
- Maintain order of results
- Handle non-promise values

**Test cases:**

```javascript
// Test 1: All resolve
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

myPromiseAll([p1, p2, p3]).then(console.log); // [1, 2, 3]

// Test 2: One rejects
const p4 = Promise.resolve(1);
const p5 = Promise.reject('Error');
const p6 = Promise.resolve(3);

myPromiseAll([p4, p5, p6]).catch(console.error); // 'Error'

// Test 3: Mix of promises and values
myPromiseAll([1, Promise.resolve(2), 3]).then(console.log); // [1, 2, 3]

// Test 4: Empty array
myPromiseAll([]).then(console.log); // []
```

**Your solution:**

```javascript
function myPromiseAll(promises) {
  // Your code here
}
```

<details>
<summary>Solution</summary>

```javascript
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    // Handle empty array
    if (promises.length === 0) {
      return resolve([]);
    }

    const results = [];
    let completedCount = 0;

    promises.forEach((promise, index) => {
      // Convert to promise in case it's not
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          completedCount++;

          // All promises resolved
          if (completedCount === promises.length) {
            resolve(results);
          }
        })
        .catch(error => {
          // Any rejection fails the whole operation
          reject(error);
        });
    });
  });
}
```

**Complexity:**

- Time: O(n) where n is number of promises
- Space: O(n) for results array

**Key points:**

- Track completion count
- Preserve order with index
- Handle non-promise values with Promise.resolve()
- Reject on first error
</details>

---

## TypeScript Exercises

### Exercise 4: Type-Safe Event Emitter (Medium)

**Time: 35 minutes**

**Problem:**
Create a type-safe event emitter in TypeScript.

**Requirements:**

- Type-safe event names
- Type-safe event data
- Support multiple listeners
- Remove listeners
- Emit events

**Example:**

```typescript
interface Events {
  'user:login': { userId: string; timestamp: number };
  'user:logout': { userId: string };
  'data:updated': { id: string; changes: Record<string, any> };
}

const emitter = new EventEmitter<Events>();

emitter.on('user:login', (data) => {
  console.log(data.userId); // Fully typed!
});

emitter.emit('user:login', {
  userId: '123',
  timestamp: Date.now()
});
```

**Your solution:**

```typescript
class EventEmitter<TEvents extends Record<string, any>> {
  // Your code here
}
```

<details>
<summary>Solution</summary>

```typescript
class EventEmitter<TEvents extends Record<string, any>> {
  private listeners: {
    [K in keyof TEvents]?: Array<(data: TEvents[K]) => void>;
  } = {};

  on<K extends keyof TEvents>(
    event: K,
    listener: (data: TEvents[K]) => void
  ): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event]!.push(listener);

    // Return unsubscribe function
    return () => this.off(event, listener);
  }

  off<K extends keyof TEvents>(
    event: K,
    listener: (data: TEvents[K]) => void
  ): void {
    const eventListeners = this.listeners[event];
    if (!eventListeners) return;

    const index = eventListeners.indexOf(listener);
    if (index > -1) {
      eventListeners.splice(index, 1);
    }
  }

  emit<K extends keyof TEvents>(event: K, data: TEvents[K]): void {
    const eventListeners = this.listeners[event];
    if (!eventListeners) return;

    eventListeners.forEach(listener => listener(data));
  }

  once<K extends keyof TEvents>(
    event: K,
    listener: (data: TEvents[K]) => void
  ): void {
    const onceWrapper = (data: TEvents[K]) => {
      listener(data);
      this.off(event, onceWrapper);
    };
    this.on(event, onceWrapper);
  }
}
```

**Key TypeScript features:**

- Mapped types for listeners object
- Generic constraints with `extends`
- keyof for event names
- Indexed access types for event data
- Type-safe return types
</details>

---

## Node.js Exercises

### Exercise 5: Rate Limiter Middleware (Medium)

**Time: 35 minutes**

**Problem:**
Implement a rate limiter middleware for Express.

**Requirements:**

- Limit requests per IP
- Configurable window and max requests
- Return 429 Too Many Requests
- Add headers with rate limit info
- Use in-memory store (bonus: Redis)

**Example:**

```javascript
const limiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10 // 10 requests per minute
});

app.use('/api', limiter);
```

**Your solution:**

```javascript
function createRateLimiter(options) {
  // Your code here
}
```

<details>
<summary>Solution</summary>

```javascript
function createRateLimiter(options = {}) {
  const {
    windowMs = 60 * 1000, // 1 minute
    max = 10, // 10 requests
    message = 'Too many requests, please try again later.',
    standardHeaders = true, // Return rate limit info in headers
    skipSuccessfulRequests = false
  } = options;

  // In-memory store
  const store = new Map();

  return function rateLimiter(req, res, next) {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    // Get or create record
    let record = store.get(key);

    if (!record) {
      record = {
        count: 0,
        resetTime: now + windowMs
      };
      store.set(key, record);
    }

    // Reset if window expired
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }

    // Increment count
    record.count++;

    // Set headers
    if (standardHeaders) {
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
      res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString());
    }

    // Check if limit exceeded
    if (record.count > max) {
      res.setHeader('Retry-After', Math.ceil((record.resetTime - now) / 1000));
      return res.status(429).json({ error: message });
    }

    next();
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key);
    }
  }
}, windowMs);
```

**Bonus: Redis implementation:**

```javascript
const redis = require('redis');
const client = redis.createClient();

async function createRedisRateLimiter(options = {}) {
  const { windowMs = 60000, max = 10 } = options;

  return async function rateLimiter(req, res, next) {
    const key = `rate-limit:${req.ip}`;

    const count = await client.incr(key);

    if (count === 1) {
      await client.expire(key, Math.ceil(windowMs / 1000));
    }

    const ttl = await client.ttl(key);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - count));
    res.setHeader('X-RateLimit-Reset', Date.now() + ttl * 1000);

    if (count > max) {
      res.setHeader('Retry-After', ttl);
      return res.status(429).json({ error: 'Too many requests' });
    }

    next();
  };
}
```

</details>

---

## Next.js Exercises

### Exercise 6: Infinite Scroll with Server Components (Hard)

**Time: 45 minutes**

**Problem:**
Implement infinite scroll using Next.js App Router with Server Components.

**Requirements:**

- Server Components for initial data
- Client Component for scroll detection
- Server Actions for loading more
- Loading states
- Type-safe with TypeScript

**Your solution:**

**app/posts/page.tsx:**

```typescript
// Your code here
```

**actions/posts.ts:**

```typescript
// Your code here
```

**components/InfinitePostsList.tsx:**

```typescript
// Your code here
```

<details>
<summary>Solution</summary>

```typescript
// app/posts/page.tsx
import { InfinitePostsList } from '@/components/InfinitePostsList';
import { getPosts } from '@/actions/posts';

export default async function PostsPage() {
  const initialPosts = await getPosts(1);

  return (
    <div>
      <h1>Posts</h1>
      <InfinitePostsList initialPosts={initialPosts} />
    </div>
  );
}

// actions/posts.ts
'use server';

interface Post {
  id: string;
  title: string;
  content: string;
}

const POSTS_PER_PAGE = 10;

export async function getPosts(page: number): Promise<Post[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));

  const start = (page - 1) * POSTS_PER_PAGE;
  const posts: Post[] = Array.from({ length: POSTS_PER_PAGE }, (_, i) => ({
    id: `${start + i + 1}`,
    title: `Post ${start + i + 1}`,
    content: `Content for post ${start + i + 1}`
  }));

  return posts;
}

// components/InfinitePostsList.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { getPosts } from '@/actions/posts';

interface Post {
  id: string;
  title: string;
  content: string;
}

interface Props {
  initialPosts: Post[];
}

export function InfinitePostsList({ initialPosts }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading]);

  async function loadMore() {
    setLoading(true);
    try {
      const newPosts = await getPosts(page + 1);

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <ul>
        {posts.map(post => (
          <li key={post.id} className="border p-4 mb-2">
            <h2 className="font-bold">{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div ref={observerRef} className="py-4 text-center">
          {loading ? 'Loading...' : 'Load more'}
        </div>
      )}

      {!hasMore && (
        <div className="py-4 text-center text-gray-500">
          No more posts
        </div>
      )}
    </div>
  );
}
```

**Key concepts:**

- Server Components for initial render
- Server Actions for data fetching
- Intersection Observer for scroll detection
- State management for pagination
- Loading and empty states
</details>

---

## 🎯 Practice Schedule

**Day 1-2:** Exercises 1-3 (JavaScript)
**Day 3:** Exercise 4 (TypeScript) + Exercise 5 (Node.js)
**Day 4:** Exercise 6 (Next.js)
**Day 5:** Random mix, timed practice

---

## 📝 Interview Simulation Tips

1. **Read the problem carefully** - Ask clarifying questions
2. **Talk through your approach** - Explain before coding
3. **Start with a simple solution** - Optimize later
4. **Write clean code** - Good names, formatting
5. **Test as you go** - Don't wait until the end
6. **Discuss edge cases** - Empty arrays, null, etc.
7. **Analyze complexity** - Time and space
8. **Ask for feedback** - "Is this what you're looking for?"

Good luck! 🚀
