# Day 4: Next.js Full Stack - Conceptual Questions

## 🎯 Senior Next.js Developer Concepts

---

## 1. Next.js Architecture

### Q1: Explain App Router vs Pages Router

**Answer:**

**Pages Router (Legacy):**

- File-based routing in `/pages`
- `getServerSideProps`, `getStaticProps`, `getStaticPaths`
- All components are Client Components by default
- API routes in `/pages/api`

**App Router (Modern - Next.js 13+):**

- File-based routing in `/app`
- Server Components by default
- React Server Components (RSC)
- Streaming and Suspense support
- Route handlers instead of API routes
- Layouts and templates
- Better performance and bundle size

```typescript
// Pages Router
// pages/users/[id].tsx
export async function getServerSideProps({ params }) {
  const user = await fetchUser(params.id);
  return { props: { user } };
}

export default function UserPage({ user }) {
  return <div>{user.name}</div>;
}

// App Router
// app/users/[id]/page.tsx
async function UserPage({ params }: { params: { id: string } }) {
  const user = await fetchUser(params.id);
  return <div>{user.name}</div>;
}

export default UserPage;
```

**When to use which:**

- **App Router**: New projects, better performance, modern features
- **Pages Router**: Legacy projects, simpler mental model

### Q2: What are Server Components vs Client Components?

**Answer:**

**Server Components (default in App Router):**

- Render on server only
- No JavaScript sent to client
- Can access backend resources directly
- Cannot use hooks, event handlers, browser APIs
- Better performance and SEO

**Client Components (`'use client'` directive):**

- Render on both server (SSR) and client (hydration)
- Interactive with hooks and event handlers
- Can use browser APIs
- Larger bundle size

```typescript
// Server Component (default)
// app/users/page.tsx
import { db } from '@/lib/db';

async function UsersPage() {
  // Direct database access!
  const users = await db.user.findMany();

  return (
    <div>
      <h1>Users</h1>
      <UsersList users={users} />
    </div>
  );
}

// Client Component
// components/UsersList.tsx
'use client';

import { useState } from 'react';

export function UsersList({ users }) {
  const [filter, setFilter] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter users..."
      />
      <ul>
        {filtered.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Best practices:**

- Use Server Components by default
- Use Client Components only when needed:
  - State (useState, useReducer)
  - Effects (useEffect)
  - Event handlers
  - Browser APIs
  - Custom hooks

---

## 2. Data Fetching

### Q3: Explain different data fetching strategies in Next.js

**Answer:**

**1. Server-Side Rendering (SSR)** - Fetch on every request

```typescript
// App Router - Server Component (default)
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetch(
    `https://api.example.com/products/${params.id}`,
    { cache: 'no-store' } // Disable caching for dynamic data
  ).then(res => res.json());

  return <ProductDetails product={product} />;
}

// Pages Router
export async function getServerSideProps({ params }) {
  const product = await fetchProduct(params.id);
  return { props: { product } };
}
```

**2. Static Site Generation (SSG)** - Fetch at build time

```typescript
// App Router
async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetch(
    `https://api.example.com/posts/${params.slug}`,
    { cache: 'force-cache' } // Cache forever (default)
  ).then(res => res.json());

  return <article>{post.content}</article>;
}

// Generate static paths
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts')
    .then(res => res.json());

  return posts.map(post => ({ slug: post.slug }));
}

// Pages Router
export async function getStaticProps({ params }) {
  const post = await fetchPost(params.slug);
  return { props: { post } };
}

export async function getStaticPaths() {
  const posts = await fetchAllPosts();
  return {
    paths: posts.map(p => ({ params: { slug: p.slug } })),
    fallback: false
  };
}
```

**3. Incremental Static Regeneration (ISR)** - Revalidate after time

```typescript
// App Router
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetch(
    `https://api.example.com/products/${params.id}`,
    { next: { revalidate: 60 } } // Revalidate every 60 seconds
  ).then(res => res.json());

  return <ProductDetails product={product} />;
}

// Pages Router
export async function getStaticProps({ params }) {
  const product = await fetchProduct(params.id);
  return {
    props: { product },
    revalidate: 60 // Revalidate every 60 seconds
  };
}
```

**4. Client-Side Fetching** - Fetch on client

```typescript
'use client';

import { useEffect, useState } from 'react';

export function ClientDataComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}

// Better: use SWR or React Query
import useSWR from 'swr';

export function ClientDataComponent() {
  const { data, error, isLoading } = useSWR('/api/data', fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

**Comparison:**

| Strategy | When to Use                       | Performance | SEO       |
| -------- | --------------------------------- | ----------- | --------- |
| SSR      | Dynamic data per request          | Slower      | Excellent |
| SSG      | Static content                    | Fastest     | Excellent |
| ISR      | Mostly static, occasional updates | Fast        | Excellent |
| CSR      | Private data, no SEO needed       | Good        | Poor      |

### Q4: What is caching in Next.js and how do you control it?

**Answer:**

**Next.js caching layers:**

1. **Request Memoization** (automatic)

```typescript
// Same request deduplicated automatically
async function Page() {
  const data1 = await fetch('https://api.example.com/data');
  const data2 = await fetch('https://api.example.com/data');
  // Only makes ONE request!
}
```

2. **Data Cache** (persistent)

```typescript
// Cache forever (default)
fetch('https://api.example.com/data', {
  cache: 'force-cache'
});

// Never cache
fetch('https://api.example.com/data', {
  cache: 'no-store'
});

// Time-based revalidation
fetch('https://api.example.com/data', {
  next: { revalidate: 3600 } // 1 hour
});

// Tag-based revalidation
fetch('https://api.example.com/products', {
  next: { tags: ['products'] }
});

// Revalidate by tag
import { revalidateTag } from 'next/cache';
revalidateTag('products');
```

3. **Full Route Cache** (automatic for static routes)

4. **Router Cache** (client-side, automatic)

**Opting out of caching:**

```typescript
// Route segment config
export const dynamic = 'force-dynamic'; // SSR
export const revalidate = 0; // No cache
export const fetchCache = 'force-no-store'; // No fetch cache
```

---

## 3. Routing & Navigation

### Q5: How does routing work in Next.js App Router?

**Answer:**

**File-system based routing:**

```
app/
  page.tsx                    -> /
  about/page.tsx              -> /about
  blog/
    page.tsx                  -> /blog
    [slug]/
      page.tsx                -> /blog/:slug
  dashboard/
    layout.tsx                -> Shared layout
    page.tsx                  -> /dashboard
    settings/page.tsx         -> /dashboard/settings
  (marketing)/                -> Route group (no URL segment)
    page.tsx                  -> /
  api/
    users/route.ts            -> /api/users
```

**Special files:**

- `page.tsx`: Page component
- `layout.tsx`: Shared layout (preserves state)
- `template.tsx`: Re-renders on navigation
- `loading.tsx`: Loading UI (automatic Suspense)
- `error.tsx`: Error boundary
- `not-found.tsx`: 404 page
- `route.ts`: API route handler

**Dynamic routes:**

```typescript
// app/blog/[slug]/page.tsx
interface Props {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function BlogPost({ params, searchParams }: Props) {
  return <div>Post: {params.slug}</div>;
}

// Catch-all: app/docs/[...slug]/page.tsx
// Matches: /docs/a, /docs/a/b, /docs/a/b/c
params: { slug: ['a', 'b', 'c'] }

// Optional catch-all: app/docs/[[...slug]]/page.tsx
// Matches: /docs, /docs/a, /docs/a/b
```

**Navigation:**

```typescript
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export function NavigationExample() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Link component (preferred)
  <Link href="/about">About</Link>

  // Programmatic navigation
  router.push('/dashboard');
  router.replace('/login');
  router.back();
  router.forward();
  router.refresh(); // Re-fetch data

  // Prefetching (automatic with Link)
  router.prefetch('/dashboard');
}
```

---

## 4. API Routes & Server Actions

### Q6: How do Route Handlers work in App Router?

**Answer:**

**Route Handlers** (replacement for Pages API routes)

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/users
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  const users = await db.user.findMany({
    where: query ? { name: { contains: query } } : undefined
  });

  return NextResponse.json(users);
}

// POST /api/users
export async function POST(request: NextRequest) {
  const body = await request.json();

  const user = await db.user.create({
    data: body
  });

  return NextResponse.json(user, { status: 201 });
}

// app/api/users/[id]/route.ts
interface Context {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Context) {
  const user = await db.user.findUnique({
    where: { id: params.id }
  });

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}

export async function PUT(request: NextRequest, { params }: Context) {
  const body = await request.json();

  const user = await db.user.update({
    where: { id: params.id },
    data: body
  });

  return NextResponse.json(user);
}

export async function DELETE(request: NextRequest, { params }: Context) {
  await db.user.delete({
    where: { id: params.id }
  });

  return new NextResponse(null, { status: 204 });
}
```

### Q7: What are Server Actions?

**Answer:**

**Server Actions**: Call server-side code directly from client

```typescript
// Server Action (in Server Component or separate file)
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;

  // Validate
  if (!name || !email) {
    return { error: 'Name and email required' };
  }

  // Create user
  const user = await db.user.create({
    data: { name, email }
  });

  // Revalidate cache
  revalidatePath('/users');

  // Redirect
  redirect(`/users/${user.id}`);
}

export async function updateUser(id: string, formData: FormData) {
  const name = formData.get('name') as string;

  await db.user.update({
    where: { id },
    data: { name }
  });

  revalidatePath(`/users/${id}`);
  return { success: true };
}

// Client Component using Server Action
'use client';

import { createUser } from '@/app/actions';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create User'}
    </button>
  );
}

export function CreateUserForm() {
  return (
    <form action={createUser}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <SubmitButton />
    </form>
  );
}

// Progressive enhancement with useFormState
import { useFormState } from 'react-dom';

export function CreateUserFormEnhanced() {
  const [state, formAction] = useFormState(createUser, null);

  return (
    <form action={formAction}>
      {state?.error && <div className="error">{state.error}</div>}
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <SubmitButton />
    </form>
  );
}
```

**Benefits of Server Actions:**

- No API routes needed
- Type-safe end-to-end
- Progressive enhancement (works without JS)
- Automatic revalidation

---

## 5. Performance Optimization

### Q8: How do you optimize Next.js applications?

**Answer:**

**1. Image Optimization**

```typescript
import Image from 'next/image';

// Automatic optimization
<Image
  src="/profile.jpg"
  alt="Profile"
  width={500}
  height={500}
  priority // Load immediately for LCP
  placeholder="blur" // Show blur while loading
  blurDataURL="data:..." // Custom blur
/>

// Remote images
<Image
  src="https://example.com/image.jpg"
  alt="Remote"
  width={500}
  height={500}
  loader={({ src, width }) => `${src}?w=${width}`}
/>

// Configure in next.config.js
module.exports = {
  images: {
    domains: ['example.com'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  }
};
```

**2. Code Splitting & Lazy Loading**

```typescript
import dynamic from 'next/dynamic';

// Lazy load component
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false // Disable SSR for client-only components
});

// Lazy load with named export
const Chart = dynamic(() => import('./Chart').then(mod => mod.Chart));

// Manual code splitting
function Page() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Show Chart</button>
      {showChart && <Chart />}
    </div>
  );
}
```

**3. Streaming & Suspense**

```typescript
import { Suspense } from 'react';

// Loading UI for async component
export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading users...</div>}>
        <Users />
      </Suspense>
      <Suspense fallback={<div>Loading posts...</div>}>
        <Posts />
      </Suspense>
    </div>
  );
}

async function Users() {
  const users = await fetchUsers(); // This streams!
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

async function Posts() {
  const posts = await fetchPosts(); // This streams too!
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

**4. Font Optimization**

```typescript
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono'
});

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**5. Metadata & SEO**

```typescript
// Static metadata
export const metadata = {
  title: 'My App',
  description: 'App description',
  openGraph: {
    title: 'My App',
    description: 'App description',
    images: ['/og-image.jpg']
  }
};

// Dynamic metadata
export async function generateMetadata({ params }) {
  const post = await fetchPost(params.id);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [post.image]
    }
  };
}
```

---

## 🎯 Quick Fire Next.js Questions

1. **What is the difference between `getServerSideProps` and `getStaticProps`?**
   - SSR: Every request; SSG: Build time

2. **How do you handle authentication in Next.js?**
   - Middleware, Server Components, NextAuth.js

3. **What is middleware in Next.js?**
   - Runs before request completion, modify request/response

4. **How do you deploy Next.js?**
   - Vercel (easiest), AWS, Docker, Netlify

5. **What is the purpose of `next.config.js`?**
   - Configure Next.js behavior and features

6. **How do you handle environment variables?**
   - `.env.local`, `NEXT_PUBLIC_` prefix for client

7. **What is Partial Pre-rendering?**
   - Mix static and dynamic content (experimental)

8. **How do you optimize Core Web Vitals?**
   - Image optimization, code splitting, streaming

9. **What is the purpose of `_app.tsx`?**
   - Global layout, state, providers (Pages Router)

10. **How do you handle redirects?**
    - `next.config.js`, middleware, or `redirect()` function

---

## 📝 Practice Tips

1. **Build a full-stack app** with CRUD operations
2. **Implement authentication** with NextAuth.js
3. **Optimize performance** (check Lighthouse scores)
4. **Practice explaining** App Router vs Pages Router
5. **Understand when** to use Server vs Client Components

---

## ⭐ Design Patterns - Most Common in Interviews

### Creational Patterns

#### 1. Singleton Pattern

**When**: Need exactly one instance (database connection, config)

```typescript
// ✅ Database connection singleton
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: any;

  private constructor() {
    this.pool = createPool({
      host: process.env.DB_HOST,
      // config...
    });
  }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async query(sql: string) {
    return this.pool.query(sql);
  }
}

// Usage
const db = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance(); // Same instance!
```

**Interview talking points:**

- "Ensures single instance across application"
- "Useful for shared resources like DB connections"
- "In Next.js, careful with server/client boundaries"

#### 2. Factory Pattern

**When**: Object creation logic is complex or needs to be centralized

```typescript
// ✅ API Client Factory
interface APIClient {
  get(url: string): Promise<any>;
  post(url: string, data: any): Promise<any>;
}

class RESTClient implements APIClient {
  async get(url: string) {
    return fetch(url).then(r => r.json());
  }
  async post(url: string, data: any) {
    return fetch(url, { method: 'POST', body: JSON.stringify(data) });
  }
}

class GraphQLClient implements APIClient {
  async get(query: string) {
    return this.query(query);
  }
  async post(mutation: string, variables: any) {
    return this.mutate(mutation, variables);
  }
  private query(q: string) { /* GraphQL logic */ }
  private mutate(m: string, v: any) { /* GraphQL logic */ }
}

// Factory
class APIClientFactory {
  static create(type: 'rest' | 'graphql'): APIClient {
    switch(type) {
      case 'rest':
        return new RESTClient();
      case 'graphql':
        return new GraphQLClient();
      default:
        throw new Error(`Unknown client type: ${type}`);
    }
  }
}

// Usage in Next.js
const client = APIClientFactory.create(process.env.API_TYPE);
```

**Interview talking points:**

- "Encapsulates object creation logic"
- "Easy to add new client types without changing consumer code"
- "Follows Open/Closed Principle"

#### 3. Builder Pattern

**When**: Object construction has many optional parameters

```typescript
// ✅ Query Builder for database queries
class QueryBuilder {
  private query: string = '';
  private params: any[] = [];

  select(columns: string[]): this {
    this.query = `SELECT ${columns.join(', ')}`;
    return this;
  }

  from(table: string): this {
    this.query += ` FROM ${table}`;
    return this;
  }

  where(condition: string, value: any): this {
    this.query += ` WHERE ${condition}`;
    this.params.push(value);
    return this;
  }

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.query += ` ORDER BY ${column} ${direction}`;
    return this;
  }

  limit(count: number): this {
    this.query += ` LIMIT ${count}`;
    return this;
  }

  build() {
    return { sql: this.query, params: this.params };
  }
}

// Usage
const query = new QueryBuilder()
  .select(['id', 'name', 'email'])
  .from('users')
  .where('age > ?', 18)
  .orderBy('created_at', 'DESC')
  .limit(10)
  .build();
```

### Structural Patterns

#### 4. Adapter Pattern

**When**: Need to make incompatible interfaces work together

```typescript
// ✅ Payment gateway adapter
interface PaymentGateway {
  processPayment(amount: number, currency: string): Promise<PaymentResult>;
}

// External Stripe API (different interface)
class StripeAPI {
  async charge(cents: number, cur: string) {
    return { id: 'ch_123', status: 'succeeded' };
  }
}

// Adapter to make Stripe compatible with our interface
class StripeAdapter implements PaymentGateway {
  constructor(private stripe: StripeAPI) {}

  async processPayment(amount: number, currency: string): Promise<PaymentResult> {
    const cents = Math.round(amount * 100); // Convert to cents
    const result = await this.stripe.charge(cents, currency);

    return {
      transactionId: result.id,
      success: result.status === 'succeeded',
      amount,
      currency
    };
  }
}

// Usage in Next.js API route
const stripe = new StripeAPI();
const gateway: PaymentGateway = new StripeAdapter(stripe);
await gateway.processPayment(99.99, 'USD');
```

#### 5. Decorator Pattern

**When**: Add functionality to objects dynamically

```typescript
// ✅ Logging decorator for API calls
interface APIService {
  fetchData(endpoint: string): Promise<any>;
}

class BasicAPIService implements APIService {
  async fetchData(endpoint: string) {
    const res = await fetch(endpoint);
    return res.json();
  }
}

// Decorators add functionality
class LoggingDecorator implements APIService {
  constructor(private service: APIService) {}

  async fetchData(endpoint: string) {
    console.log(`[API] Fetching: ${endpoint}`);
    const startTime = Date.now();
    const data = await this.service.fetchData(endpoint);
    console.log(`[API] Completed in ${Date.now() - startTime}ms`);
    return data;
  }
}

class CachingDecorator implements APIService {
  private cache = new Map<string, any>();

  constructor(private service: APIService) {}

  async fetchData(endpoint: string) {
    if (this.cache.has(endpoint)) {
      console.log('[Cache] Hit');
      return this.cache.get(endpoint);
    }
    const data = await this.service.fetchData(endpoint);
    this.cache.set(endpoint, data);
    return data;
  }
}

// Compose decorators
let service: APIService = new BasicAPIService();
service = new LoggingDecorator(service);
service = new CachingDecorator(service);

await service.fetchData('/api/users'); // Logged + Cached
```

### Behavioral Patterns

#### 6. Observer Pattern

**When**: One-to-many dependency (event systems, state management)

```typescript
// ✅ Event emitter / Pub-Sub
interface Observer {
  update(data: any): void;
}

class EventEmitter {
  private observers: Map<string, Observer[]> = new Map();

  subscribe(event: string, observer: Observer) {
    if (!this.observers.has(event)) {
      this.observers.set(event, []);
    }
    this.observers.get(event)!.push(observer);
  }

  unsubscribe(event: string, observer: Observer) {
    const observers = this.observers.get(event);
    if (observers) {
      const index = observers.indexOf(observer);
      if (index > -1) observers.splice(index, 1);
    }
  }

  emit(event: string, data: any) {
    const observers = this.observers.get(event);
    if (observers) {
      observers.forEach(observer => observer.update(data));
    }
  }
}

// Usage with React state
class UserActivityObserver implements Observer {
  update(data: any) {
    console.log('User activity:', data);
    // Update analytics, logs, etc.
  }
}

const emitter = new EventEmitter();
emitter.subscribe('user:login', new UserActivityObserver());
emitter.emit('user:login', { userId: 123 });
```

#### 7. Strategy Pattern

**When**: Algorithm selection at runtime

```typescript
// ✅ Sorting strategy
interface SortStrategy<T> {
  sort(data: T[]): T[];
}

class QuickSort<T> implements SortStrategy<T> {
  sort(data: T[]): T[] {
    // Quick sort implementation
    return data.sort();
  }
}

class MergeSort<T> implements SortStrategy<T> {
  sort(data: T[]): T[] {
    // Merge sort implementation
    return data;
  }
}

class DataSorter<T> {
  constructor(private strategy: SortStrategy<T>) {}

  setStrategy(strategy: SortStrategy<T>) {
    this.strategy = strategy;
  }

  sort(data: T[]): T[] {
    return this.strategy.sort(data);
  }
}

// Usage
const sorter = new DataSorter(new QuickSort());
const sorted = sorter.sort([3, 1, 4, 1, 5, 9]);

// Switch strategy for large datasets
if (data.length > 10000) {
  sorter.setStrategy(new MergeSort());
}
```

#### 8. Command Pattern

**When**: Encapsulate requests as objects (undo/redo, task queues)

```typescript
// ✅ Command pattern for user actions
interface Command {
  execute(): void;
  undo(): void;
}

class CreateUserCommand implements Command {
  constructor(
    private userService: UserService,
    private userData: UserData
  ) {}

  execute() {
    this.userService.create(this.userData);
  }

  undo() {
    this.userService.delete(this.userData.id);
  }
}

class UpdateUserCommand implements Command {
  private previousData: UserData;

  constructor(
    private userService: UserService,
    private userId: string,
    private newData: UserData
  ) {}

  execute() {
    this.previousData = this.userService.get(this.userId);
    this.userService.update(this.userId, this.newData);
  }

  undo() {
    this.userService.update(this.userId, this.previousData);
  }
}

// Command manager with undo/redo
class CommandManager {
  private history: Command[] = [];
  private currentIndex = -1;

  execute(command: Command) {
    command.execute();
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(command);
    this.currentIndex++;
  }

  undo() {
    if (this.currentIndex >= 0) {
      this.history[this.currentIndex].undo();
      this.currentIndex--;
    }
  }

  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      this.history[this.currentIndex].execute();
    }
  }
}
```

### React-Specific Patterns

#### 9. Compound Components Pattern

**When**: Components work together as a unit

```typescript
// ✅ Dropdown compound component
interface DropdownContext {
  isOpen: boolean;
  toggle: () => void;
}

const DropdownContext = createContext<DropdownContext | null>(null);

function Dropdown({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <DropdownContext.Provider value={{ isOpen, toggle }}>
      <div className="dropdown">{children}</div>
    </DropdownContext.Provider>
  );
}

function DropdownTrigger({ children }: { children: React.ReactNode }) {
  const context = useContext(DropdownContext);
  return <button onClick={context?.toggle}>{children}</button>;
}

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const context = useContext(DropdownContext);
  if (!context?.isOpen) return null;
  return <div className="menu">{children}</div>;
}

// Attach as static properties
Dropdown.Trigger = DropdownTrigger;
Dropdown.Menu = DropdownMenu;

// Usage
<Dropdown>
  <Dropdown.Trigger>Open Menu</Dropdown.Trigger>
  <Dropdown.Menu>
    <div>Item 1</div>
    <div>Item 2</div>
  </Dropdown.Menu>
</Dropdown>
```

---

## 🎯 Quick Fire - Design Patterns

**Q: When would you use Singleton?**
A: Database connections, configuration objects, logging services - anything that should have exactly one instance.

**Q: Factory vs Builder?**
A: Factory decides WHICH object to create. Builder handles HOW to construct complex objects step-by-step.

**Q: Real example of Adapter pattern?**
A: Integrating third-party APIs (Stripe, SendGrid) with your application's interface.

**Q: Why use Observer pattern?**
A: Decouples publishers from subscribers. Perfect for event systems, state management (Redux uses this!).

**Q: Strategy pattern use case?**
A: Payment processing - swap between Stripe, PayPal, crypto at runtime without changing core logic.

**Q: What's wrong with overusing patterns?**
A: Over-engineering! "Don't use a sledgehammer to crack a nut." Use patterns when they solve real problems.

---

## 📝 Interview Phrases for Design Patterns

Practice saying:

- "I would use the Factory pattern here because..."
- "In my previous project, I implemented the Repository pattern to..."
- "The Observer pattern helps us achieve loose coupling by..."
- "This is a good use case for Singleton because we need..."
- "I prefer Strategy pattern over if/else chains when..."
- "The trade-off with this pattern is... but the benefit is..."

---

You're almost ready! 🚀
