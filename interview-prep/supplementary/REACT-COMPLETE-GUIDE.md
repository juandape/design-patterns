# React Complete Guide - EPAM Interview Prep

> **Target**: Senior Full Stack Developer Position
> **Focus**: Production-level React knowledge for EPAM technical interviews

---

## Table of Contents

1. [Core Hooks](#core-hooks)
2. [Advanced Hooks](#advanced-hooks)
3. [Performance Optimization](#performance-optimization)
4. [State Management (Redux/Zustand)](#state-management)
5. [Context API](#context-api)
6. [Error Boundaries](#error-boundaries)
7. [Suspense & Concurrent Features](#suspense-concurrent)
8. [Server Components vs Client](#server-vs-client)
9. [React Internals](#react-internals)
10. [Testing](#testing)

---

## Core Hooks

### useState

**Purpose**: Manage component state

```typescript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ name: 'John', age: 30 });

  // Direct value
  const increment = () => setCount(count + 1);

  // Functional update (when new state depends on old)
  const incrementSafe = () => setCount(prev => prev + 1);

  // Object state - merge manually
  const updateUser = () => {
    setUser(prev => ({ ...prev, age: prev.age + 1 }));
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={incrementSafe}>Increment Safe</button>
    </div>
  );
}
```

**Lazy Initialization**:

```typescript
// Expensive calculation only runs once
function Component() {
  const [state, setState] = useState(() => {
    const initialState = expensiveCalculation();
    return initialState;
  });
}
```

---

### useEffect

**Purpose**: Side effects (data fetching, subscriptions, DOM manipulation)

```typescript
import { useEffect, useState } from 'react';

function DataFetcher({ userId }: { userId: string }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        const json = await response.json();

        if (!cancelled) {
          setData(json);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    // Cleanup function
    return () => {
      cancelled = true;
    };
  }, [userId]); // Re-run when userId changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```

**Subscription Example**:

```typescript
useEffect(() => {
  const subscription = dataSource.subscribe(data => {
    setData(data);
  });

  // Cleanup: unsubscribe when component unmounts
  return () => subscription.unsubscribe();
}, []);
```

**Dependency Array Rules**:

```typescript
// No dependencies - runs after every render
useEffect(() => {
  console.log('Every render');
});

// Empty array - runs once on mount
useEffect(() => {
  console.log('Mount only');
}, []);

// With dependencies - runs when deps change
useEffect(() => {
  console.log('userId or filter changed');
}, [userId, filter]);
```

---

### useContext

**Purpose**: Consume context values

```typescript
import { createContext, useContext, useState } from 'react';

// Create context
const ThemeContext = createContext<{ theme: string; toggleTheme: () => void }>({
  theme: 'light',
  toggleTheme: () => {},
});

// Provider component
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Consumer component
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      style={{ background: theme === 'light' ? '#fff' : '#000' }}
    >
      Toggle Theme
    </button>
  );
}

// Usage
function App() {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  );
}
```

---

### useReducer

**Purpose**: Complex state logic (alternative to useState)

```typescript
import { useReducer } from 'react';

// State type
type State = {
  count: number;
  error: string | null;
  loading: boolean;
};

// Action types
type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'RESET':
      return { ...state, count: 0 };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, {
    count: 0,
    error: null,
    loading: false,
  });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}
```

**When to use useReducer vs useState**:

- useState: Simple state (single value, boolean flags)
- useReducer: Complex state logic, multiple sub-values, next state depends on previous

---

### useRef

**Purpose**: Persist values across renders without causing re-render

```typescript
import { useRef, useEffect } from 'react';

function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const renderCount = useRef(0);

  useEffect(() => {
    // Auto-focus input on mount
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Track render count (doesn't cause re-render)
    renderCount.current += 1;
  });

  return (
    <div>
      <input ref={inputRef} type="text" />
      <p>Render count: {renderCount.current}</p>
    </div>
  );
}

// Store previous value
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Usage
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}, Previous: {prevCount}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
```

---

## Advanced Hooks

### useMemo

**Purpose**: Memoize expensive calculations

```typescript
import { useMemo, useState } from 'react';

function ExpensiveComponent({ items }: { items: number[] }) {
  const [filter, setFilter] = useState('');

  // Only recalculates when items or filter changes
  const filteredItems = useMemo(() => {
    console.log('Filtering...');
    return items.filter(item => item.toString().includes(filter));
  }, [items, filter]);

  const total = useMemo(() => {
    console.log('Calculating total...');
    return filteredItems.reduce((sum, item) => sum + item, 0);
  }, [filteredItems]);

  return (
    <div>
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter"
      />
      <p>Total: {total}</p>
      <ul>
        {filteredItems.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

**When NOT to use useMemo**:

```typescript
// ❌ Don't memoize simple calculations
const doubled = useMemo(() => count * 2, [count]); // Overkill

// ✅ Just calculate
const doubled = count * 2;

// ✅ Use for expensive operations
const sorted = useMemo(() => {
  return largeArray.sort((a, b) => complexComparison(a, b));
}, [largeArray]);
```

---

### useCallback

**Purpose**: Memoize functions to prevent re-creation

```typescript
import { useCallback, memo } from 'react';

// Child component (memoized)
const ChildButton = memo(({ onClick, label }: {
  onClick: () => void;
  label: string;
}) => {
  console.log(`Rendering ${label}`);
  return <button onClick={onClick}>{label}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);

  // ❌ New function on every render - ChildButton re-renders
  const handleClick = () => {
    setCount(c => c + 1);
  };

  // ✅ Same function reference - ChildButton doesn't re-render
  const handleClickMemo = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <ChildButton onClick={handleClickMemo} label="Increment" />
      <button onClick={() => setOther(o => o + 1)}>
        Other ({other})
      </button>
    </div>
  );
}
```

**useCallback with dependencies**:

```typescript
function Search({ apiEndpoint }: { apiEndpoint: string }) {
  const [query, setQuery] = useState('');

  const search = useCallback(async () => {
    const response = await fetch(`${apiEndpoint}?q=${query}`);
    return response.json();
  }, [apiEndpoint, query]); // Recreated when these change

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={search}>Search</button>
    </div>
  );
}
```

---

### useLayoutEffect

**Purpose**: Synchronous DOM mutations before paint

```typescript
import { useLayoutEffect, useRef, useState } from 'react';

function Tooltip() {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    // Measure DOM before browser paints
    const rect = tooltipRef.current?.getBoundingClientRect();
    if (rect) {
      setHeight(rect.height);
    }
  }, []);

  return (
    <div ref={tooltipRef} style={{ top: height }}>
      Tooltip content
    </div>
  );
}
```

**useEffect vs useLayoutEffect**:

- `useEffect`: Asynchronous, runs after paint (most cases)
- `useLayoutEffect`: Synchronous, runs before paint (DOM measurements, prevent flicker)

---

### useImperativeHandle

**Purpose**: Customize ref value exposed to parent

```typescript
import { useImperativeHandle, forwardRef, useRef } from 'react';

// Child component
const FancyInput = forwardRef<
  { focus: () => void; clear: () => void },
  { defaultValue?: string }
>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
    clear() {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
  }));

  return <input ref={inputRef} defaultValue={props.defaultValue} />;
});

// Parent component
function Form() {
  const inputRef = useRef<{ focus: () => void; clear: () => void }>(null);

  const handleSubmit = () => {
    inputRef.current?.clear();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <FancyInput ref={inputRef} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### useTransition (React 18+)

**Purpose**: Mark state updates as non-urgent

```typescript
import { useState, useTransition } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Urgent: update input immediately
    setQuery(e.target.value);

    // Non-urgent: update results (can be interrupted)
    startTransition(() => {
      const filteredResults = filterResults(e.target.value);
      setResults(filteredResults);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <p>Loading...</p>}
      <ul>
        {results.map(result => (
          <li key={result}>{result}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

### useDeferredValue (React 18+)

**Purpose**: Defer updating part of UI

```typescript
import { useState, useDeferredValue, memo } from 'react';

function SearchResults({ query }: { query: string }) {
  // Expensive rendering
  const items = useMemo(() => {
    return searchItems(query); // Expensive
  }, [query]);

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {/* Renders with deferredQuery (can lag behind query) */}
      <SearchResults query={deferredQuery} />
    </div>
  );
}
```

---

## Performance Optimization

### React.memo

**Purpose**: Prevent re-renders if props haven't changed

```typescript
import { memo } from 'react';

// Without memo - re-renders on every parent render
function ExpensiveComponent({ data }: { data: string }) {
  console.log('Rendering ExpensiveComponent');
  return <div>{data}</div>;
}

// With memo - only re-renders if props change
const MemoizedComponent = memo(function ExpensiveComponent({
  data
}: {
  data: string;
}) {
  console.log('Rendering MemoizedComponent');
  return <div>{data}</div>;
});

// Custom comparison
const CustomMemoComponent = memo(
  ({ user }: { user: User }) => {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    return prevProps.user.id === nextProps.user.id;
  }
);
```

---

### Code Splitting

**Purpose**: Split code into smaller bundles, load on demand

```typescript
import { lazy, Suspense } from 'react';

// Lazy load component
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}

// Route-based code splitting
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

---

### Virtualization

**Purpose**: Render only visible items in large lists

```typescript
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }: { items: string[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>Item {items[index]}</div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

// Without virtualization: renders 10,000 items (slow!)
// With virtualization: renders ~12 visible items (fast!)
```

---

## State Management

### Redux Toolkit

```typescript
// store.ts
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment(state) {
      state.value += 1; // Immer allows mutations
    },
    decrement(state) {
      state.value -= 1;
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// Store
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Component
import { useSelector, useDispatch } from 'react-redux';

function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
}
```

**Async with Redux Thunk**:

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk(
  'user/fetch',
  async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
```

---

### Zustand (Lightweight Alternative)

```typescript
import create from 'zustand';

// Store
const useStore = create<{
  count: number;
  increment: () => void;
  decrement: () => void;
}>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// Component
function Counter() {
  const { count, increment, decrement } = useStore();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

// Persist to localStorage
import { persist } from 'zustand/middleware';

const usePersistedStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: 'user-storage' }
  )
);
```

---

## Error Boundaries

**Purpose**: Catch JavaScript errors in component tree

```typescript
import React, { Component, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div>
          <h2>Something went wrong</h2>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.toString()}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary fallback={<div>Error loading app</div>}>
      <MyApp />
    </ErrorBoundary>
  );
}
```

**Note**: Error boundaries don't catch:

- Event handlers (use try-catch)
- Async code (setTimeout, promises)
- Server-side rendering
- Errors in error boundary itself

---

## Suspense & Concurrent Features

### Suspense for Data Fetching

```typescript
import { Suspense } from 'react';

// Resource (simplified - use library like React Query in production)
function fetchUser(userId: string) {
  let status = 'pending';
  let result: any;

  const promise = fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(data => {
      status = 'success';
      result = data;
    })
    .catch(error => {
      status = 'error';
      result = error;
    });

  return {
    read() {
      if (status === 'pending') throw promise;
      if (status === 'error') throw result;
      return result;
    },
  };
}

function User({ resource }: { resource: ReturnType<typeof fetchUser> }) {
  const user = resource.read(); // Suspends if not ready
  return <div>{user.name}</div>;
}

function App() {
  const resource = fetchUser('123');

  return (
    <Suspense fallback={<div>Loading user...</div>}>
      <User resource={resource} />
    </Suspense>
  );
}
```

---

## React Internals

### Virtual DOM

**Concept**: In-memory representation of real DOM

```typescript
// JSX
<div className="container">
  <h1>Hello</h1>
</div>

// Becomes React.createElement calls
React.createElement(
  'div',
  { className: 'container' },
  React.createElement('h1', null, 'Hello')
);

// Creates Virtual DOM object
{
  type: 'div',
  props: {
    className: 'container',
    children: {
      type: 'h1',
      props: {
        children: 'Hello'
      }
    }
  }
}
```

**Reconciliation**: Process of diffing Virtual DOM and updating real DOM efficiently

---

### Fiber Architecture

**What is Fiber?**: Internal algorithm for reconciliation (React 16+)

**Key Features**:

1. **Incremental rendering**: Split work into chunks
2. **Pause/resume work**: Don't block main thread
3. **Priority**: Urgent vs non-urgent updates
4. **Concurrent rendering**: Multiple state versions

```typescript
// Example: Priority updates
function App() {
  const [urgent, setUrgent] = useState('');
  const [nonUrgent, setNonUrgent] = useState('');

  const handleChange = (e) => {
    // Urgent update (input)
    setUrgent(e.target.value);

    // Non-urgent update (search results)
    startTransition(() => {
      setNonUrgent(e.target.value);
    });
  };

  return (
    <div>
      <input value={urgent} onChange={handleChange} />
      <SearchResults query={nonUrgent} />
    </div>
  );
}
```

---

## Testing

### Jest + React Testing Library

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Counter from './Counter';

describe('Counter', () => {
  test('renders initial count', () => {
    render(<Counter />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  test('increments count', () => {
    render(<Counter />);
    const button = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(button);
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  test('fetches and displays user', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ name: 'John' }),
      })
    ) as jest.Mock;

    render(<UserProfile userId="123" />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });
});
```

---

## Interview Questions

### Q1: Explain the difference between useEffect and useLayoutEffect

**Answer**:

- `useEffect`: Runs asynchronously after paint (most use cases)
- `useLayoutEffect`: Runs synchronously before paint (DOM measurements, prevent flicker)

Use `useLayoutEffect` when you need to read layout and synchronously re-render to prevent visual inconsistencies.

---

### Q2: When should you use useCallback vs useMemo?

**Answer**:

- `useCallback`: Memoize functions (prevent re-creation)
- `useMemo`: Memoize values (expensive calculations)

```typescript
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

---

### Q3: How does React Fiber improve performance?

**Answer**: Fiber enables:

1. Incremental rendering (split work)
2. Pause/resume/abort work
3. Assign priority to different updates
4. Concurrent rendering (multiple versions)

This prevents blocking the main thread on long renders.

---

### Q4: Explain React Context performance issues and solutions

**Answer**:
Problem: All consumers re-render when context value changes.

Solutions:

1. Split contexts
2. Memoize context value
3. Use separate contexts for data and actions
4. Consider state management libraries (Redux, Zustand)

---

## Practice Tips

1. **Build projects**: Todo app, search with debounce, infinite scroll
2. **Understand internals**: Virtual DOM, Fiber, reconciliation
3. **Performance**: Know when to use memo, useMemo, useCallback
4. **Hooks rules**: Explain why hooks can't be conditional
5. **State management**: Compare Redux vs Context vs Zustand
6. **Testing**: Write tests with React Testing Library
7. **Modern features**: Suspense, Transitions, Server Components
8. **TypeScript**: Type props, hooks, context properly

Good luck! 🚀
