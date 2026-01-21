# Day 2: TypeScript Advanced Concepts

## 🎯 Senior-Level TypeScript Interview Questions

---

## 1. Type System Fundamentals

### Q1: What are the benefits of using TypeScript?

**Answer:**

**Key benefits:**

1. **Type safety**: Catch errors at compile time
2. **Better IDE support**: Autocomplete, refactoring, navigation
3. **Self-documentation**: Types serve as documentation
4. **Easier refactoring**: Changes propagate through type system
5. **Better team collaboration**: Clear interfaces and contracts
6. **Modern JavaScript features**: Can use latest ES features

**Trade-offs:**

- Build step required
- Learning curve
- More verbose code
- Can be over-engineered if not careful

### Q2: Difference between `type` and `interface`?

**Answer:**

**Interfaces:**

- Can be extended and merged
- Better for object shapes
- Can be implemented by classes
- Better error messages
- Cannot represent unions/intersections directly

**Types:**

- More flexible (unions, intersections, primitives, tuples)
- Cannot be extended (but can be intersected)
- Cannot be declared multiple times (no merging)
- Better for complex type computations

```typescript
// Interface - declaration merging
interface User {
  name: string;
}
interface User {
  age: number;
}
// Results in: { name: string; age: number }

// Type - cannot merge
type User = {
  name: string;
};
// type User = { age: number }; // ERROR!

// Type - can do unions
type ID = string | number;

// Type - complex computations
type ReadOnly<T> = {
  readonly [K in keyof T]: T[K];
};

// Interface - extending
interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}

// Type - intersection
type Animal = {
  name: string;
};
type Dog = Animal & {
  breed: string;
};
```

**When to use:**

- **Interface**: Public API, object shapes, class contracts
- **Type**: Unions, tuples, complex transformations

---

## 2. Advanced Types

### Q3: What are Union and Intersection types?

**Answer:**

**Union Types** (OR - `|`):

```typescript
type Status = 'pending' | 'success' | 'error';
type ID = string | number;

function processId(id: ID) {
  // Type narrowing needed
  if (typeof id === 'string') {
    return id.toUpperCase();
  }
  return id.toFixed(2);
}
```

**Intersection Types** (AND - `&`):

```typescript
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: string;
  department: string;
};

type Staff = Person & Employee;
// Staff has ALL properties from both types

const staff: Staff = {
  name: 'John',
  age: 30,
  employeeId: 'E001',
  department: 'Engineering'
};
```

### Q4: Explain Type Guards and Type Narrowing

**Answer:**

**Type Guards**: Runtime checks that narrow types

```typescript
// typeof guard
function padLeft(value: string | number, padding: string | number) {
  if (typeof padding === 'number') {
    return ' '.repeat(padding) + value;
  }
  return padding + value;
}

// instanceof guard
class Cat {
  meow() {}
}
class Dog {
  bark() {}
}

function makeSound(animal: Cat | Dog) {
  if (animal instanceof Cat) {
    animal.meow(); // TypeScript knows it's a Cat
  } else {
    animal.bark(); // TypeScript knows it's a Dog
  }
}

// Custom type guard
interface Fish {
  swim: () => void;
}
interface Bird {
  fly: () => void;
}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim(); // TypeScript knows it's Fish
  } else {
    pet.fly(); // TypeScript knows it's Bird
  }
}

// Discriminated unions
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; sideLength: number }
  | { kind: 'rectangle'; width: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.sideLength ** 2;
    case 'rectangle':
      return shape.width * shape.height;
  }
}
```

### Q5: What are Conditional Types?

**Answer:**

Conditional types select types based on conditions: `T extends U ? X : Y`

```typescript
// Basic conditional type
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Practical example: Extract return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getString(): string {
  return 'hello';
}
type StringType = ReturnType<typeof getString>; // string

// Remove null/undefined
type NonNullable<T> = T extends null | undefined ? never : T;

type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>; // string

// Flatten array
type Flatten<T> = T extends Array<infer U> ? U : T;

type NumberArray = Flatten<number[]>;  // number
type JustString = Flatten<string>;     // string
```

---

## 3. Generics

### Q6: Explain Generics and when to use them

**Answer:**

**Generics**: Create reusable, type-safe components

```typescript
// Without generics - not type-safe
function identityAny(arg: any): any {
  return arg;
}

// With generics - type-safe
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);      // num is number
const str = identity<string>('hello'); // str is string
const auto = identity(true);           // TypeScript infers boolean

// Generic interfaces
interface Repository<T> {
  getById(id: string): Promise<T>;
  getAll(): Promise<T[]>;
  create(item: T): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

interface User {
  id: string;
  name: string;
  email: string;
}

class UserRepository implements Repository<User> {
  async getById(id: string): Promise<User> {
    // Implementation
  }
  // ... other methods
}

// Generic classes
class DataStore<T> {
  private data: T[] = [];

  add(item: T): void {
    this.data.push(item);
  }

  get(index: number): T | undefined {
    return this.data[index];
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.data.filter(predicate);
  }
}

const numberStore = new DataStore<number>();
numberStore.add(1);
numberStore.add(2);
```

### Q7: What are Generic Constraints?

**Answer:**

**Constraints**: Restrict generic types using `extends`

```typescript
// Constraint: must have length property
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length); // OK, we know it has length
}

logLength('hello');     // OK: string has length
logLength([1, 2, 3]);   // OK: array has length
logLength({ length: 5 }); // OK: object has length
// logLength(42);        // ERROR: number doesn't have length

// Using keyof constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: 'John', age: 30 };
const name = getProperty(person, 'name');  // OK
// const invalid = getProperty(person, 'email'); // ERROR

// Multiple constraints
interface Nameable {
  name: string;
}

interface Ageable {
  age: number;
}

function printInfo<T extends Nameable & Ageable>(obj: T): void {
  console.log(`${obj.name} is ${obj.age} years old`);
}

// Constructor constraint
function create<T>(constructor: new () => T): T {
  return new constructor();
}

class MyClass {
  constructor() {}
}

const instance = create(MyClass); // Works!
```

---

## 4. Utility Types

### Q8: Explain common utility types and when to use them

**Answer:**

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  role: 'admin' | 'user';
}

// Partial<T> - all properties optional
type PartialUser = Partial<User>;
// Use for: update operations
function updateUser(id: string, updates: Partial<User>) {
  // Can update any subset of properties
}

// Required<T> - all properties required
type RequiredUser = Required<Partial<User>>;

// Readonly<T> - all properties readonly
type ReadonlyUser = Readonly<User>;
const user: ReadonlyUser = { /* ... */ };
// user.name = 'New'; // ERROR

// Pick<T, K> - select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: string; name: string }

// Omit<T, K> - exclude specific properties
type UserWithoutId = Omit<User, 'id'>;
// { name: string; email: string; age: number; role: 'admin' | 'user' }

// Record<K, T> - create object type with keys K and values T
type UserRoles = Record<string, User>;
const users: UserRoles = {
  'user1': { /* User object */ },
  'user2': { /* User object */ }
};

// Exclude<T, U> - exclude types from union
type Role = 'admin' | 'user' | 'guest';
type ActiveRole = Exclude<Role, 'guest'>; // 'admin' | 'user'

// Extract<T, U> - extract types from union
type StringOrNumber = Extract<string | number | boolean, string | number>;
// string | number

// NonNullable<T> - exclude null and undefined
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>; // string

// ReturnType<T> - extract return type of function
function getUser(): User { /* ... */ }
type UserType = ReturnType<typeof getUser>; // User

// Parameters<T> - extract parameter types as tuple
function createUser(name: string, age: number): User { /* ... */ }
type CreateUserParams = Parameters<typeof createUser>; // [string, number]

// Awaited<T> - unwrap Promise type
type AsyncUser = Awaited<Promise<User>>; // User
```

---

## 5. Advanced Patterns

### Q9: What are Mapped Types?

**Answer:**

**Mapped Types**: Transform properties of a type

```typescript
// Basic mapped type
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Make all properties optional
type Partial<T> = {
  [K in keyof T]?: T[K];
};

// Make all properties nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

interface User {
  name: string;
  age: number;
}

type NullableUser = Nullable<User>;
// { name: string | null; age: number | null }

// Advanced: Getters
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// {
//   getName: () => string;
//   getAge: () => number;
// }

// Filter properties by type
type FilterByType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K];
};

interface Mixed {
  name: string;
  age: number;
  active: boolean;
  count: number;
}

type OnlyNumbers = FilterByType<Mixed, number>;
// { age: number; count: number }
```

### Q10: What are Template Literal Types?

**Answer:**

**Template Literal Types**: Create string types using template literals

```typescript
// Basic template literal type
type World = 'world';
type Greeting = `hello ${World}`; // 'hello world'

// With unions
type Color = 'red' | 'green' | 'blue';
type Shade = 'light' | 'dark';
type ColorShade = `${Shade}-${Color}`;
// 'light-red' | 'light-green' | 'light-blue' |
// 'dark-red' | 'dark-green' | 'dark-blue'

// Event handlers
type EventName = 'click' | 'focus' | 'blur';
type EventHandler = `on${Capitalize<EventName>}`;
// 'onClick' | 'onFocus' | 'onBlur'

// CSS properties
type CSSProperty = 'color' | 'background-color' | 'font-size';
type CSSInJS = {
  [K in CSSProperty as CamelCase<K>]: string;
};

// Practical example: typed event system
type AllowedEvents = 'user:created' | 'user:updated' | 'user:deleted';

interface EventMap {
  'user:created': { id: string; name: string };
  'user:updated': { id: string; changes: Partial<User> };
  'user:deleted': { id: string };
}

class EventEmitter {
  on<E extends AllowedEvents>(
    event: E,
    handler: (data: EventMap[E]) => void
  ): void {
    // Type-safe event handling
  }

  emit<E extends AllowedEvents>(event: E, data: EventMap[E]): void {
    // Type-safe event emission
  }
}

const emitter = new EventEmitter();

emitter.on('user:created', (data) => {
  console.log(data.id, data.name); // Fully typed!
});

emitter.emit('user:created', { id: '1', name: 'John' }); // OK
// emitter.emit('user:created', { invalid: true }); // ERROR
```

---

## 6. Type Inference

### Q11: How does TypeScript infer types?

**Answer:**

**Type Inference**: TypeScript automatically determines types

```typescript
// Variable inference
let str = 'hello'; // inferred as string
let num = 42;      // inferred as number
let bool = true;   // inferred as boolean

// Literal types with const
const literal = 'hello'; // inferred as 'hello' (literal type)

// Function return type inference
function add(a: number, b: number) {
  return a + b; // return type inferred as number
}

// Array inference
const numbers = [1, 2, 3]; // number[]
const mixed = [1, 'two', true]; // (string | number | boolean)[]

// Object inference
const person = {
  name: 'John',
  age: 30
}; // { name: string; age: number }

// Contextual typing
const names = ['John', 'Jane', 'Bob'];
names.forEach((name) => {
  // 'name' is inferred as string
  console.log(name.toUpperCase());
});

// Generic inference
function identity<T>(arg: T): T {
  return arg;
}

const result = identity('hello'); // T inferred as string

// Best common type
const arr = [1, 2, null]; // (number | null)[]

// Return type inference with async
async function fetchUser() {
  return { id: '1', name: 'John' };
}
// Return type inferred as Promise<{ id: string; name: string }>
```

---

## 7. Decorators

### Q12: What are Decorators and how do they work?

**Answer:**

**Decorators**: Meta-programming feature to modify classes and members

```typescript
// Enable in tsconfig.json: "experimentalDecorators": true

// Class decorator
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class BugReport {
  type = 'report';
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}

// Method decorator
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };

  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}

// Property decorator
function readonly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false
  });
}

class Person {
  @readonly
  name: string = 'John';
}

// Decorator factory (with parameters)
function validate(min: number, max: number) {
  return function(target: any, propertyKey: string) {
    let value: number;

    Object.defineProperty(target, propertyKey, {
      get() {
        return value;
      },
      set(newValue: number) {
        if (newValue < min || newValue > max) {
          throw new Error(`${propertyKey} must be between ${min} and ${max}`);
        }
        value = newValue;
      }
    });
  };
}

class Product {
  @validate(0, 100)
  discount: number = 0;
}
```

---

## 8. Type Safety Patterns

### Q13: How do you handle API responses type-safely?

**Answer:**

```typescript
// Define API response types
interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

// Type-safe fetch wrapper
async function fetchApi<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      data,
      status: response.status
    };
  } catch (error) {
    return {
      data: null as any,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    };
  }
}

// Usage
async function getUser(id: string): Promise<User | null> {
  const response = await fetchApi<User>(`/api/users/${id}`);

  if (response.error) {
    console.error(response.error);
    return null;
  }

  return response.data;
}

// Zod for runtime validation
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email()
});

type User = z.infer<typeof UserSchema>;

async function getUserSafe(id: string): Promise<User | null> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();

  // Runtime validation
  const result = UserSchema.safeParse(data);

  if (!result.success) {
    console.error(result.error);
    return null;
  }

  return result.data; // Fully typed and validated!
}
```

---

## 🎯 Quick Fire TypeScript Questions

1. **What is `unknown` vs `any`?**
   - `any`: Disables type checking
   - `unknown`: Type-safe, requires type checking before use

2. **What is `never` type?**
   - Type that never occurs (unreachable code, exhaustive checks)

3. **What is a tuple in TypeScript?**
   - Fixed-length array with known types: `[string, number]`

4. **What is `enum` and when to use it?**
   - Named constants, but prefer union types for better type safety

5. **What is type assertion?**
   - `value as Type` - telling compiler you know better

6. **What is `satisfies` keyword?**
   - Validates type without widening: `const x = {...} satisfies Type`

7. **What are index signatures?**
   - `{ [key: string]: Type }` - dynamic property names

8. **What is `infer` keyword?**
   - Extract types within conditional types

9. **What is namespace?**
   - Organize code (prefer ES modules)

10. **What is triple-slash directive?**
    - `/// <reference types="..." />` - legacy type references

---

## 📝 Practice Tips

1. **Build type-safe utilities**: Create your own utility types
2. **Read DefinitelyTyped**: Learn from well-typed libraries
3. **Use strict mode**: Enable all strict flags
4. **Practice generic patterns**: Repository, factory, builder patterns
5. **Learn error messages**: TypeScript errors are informative

---

## 9. Advanced Type Features

### Q14: Explain the `infer` keyword in depth

**Answer:**

**`infer`**: Extract types within conditional types

```typescript
// Extract return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser(): { id: string; name: string } {
  return { id: '1', name: 'John' };
}

type User = ReturnType<typeof getUser>;
// { id: string; name: string }

// Extract array element type
type ArrayElement<T> = T extends (infer U)[] ? U : never;

type Numbers = ArrayElement<number[]>; // number
type Strings = ArrayElement<string[]>; // string

// Extract Promise type
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type AsyncUser = UnwrapPromise<Promise<User>>; // User
type SyncNumber = UnwrapPromise<number>; // number

// Extract function parameters
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

function createUser(name: string, age: number, email: string): User {
  return { id: '1', name, email } as User;
}

type CreateUserParams = Parameters<typeof createUser>;
// [name: string, age: number, email: string]

// Extract first parameter
type FirstParameter<T> = T extends (first: infer F, ...rest: any[]) => any
  ? F
  : never;

type FirstParam = FirstParameter<typeof createUser>; // string

// Extract object value type
type ValueOf<T> = T extends Record<any, infer V> ? V : never;

type Obj = { name: string; age: number; active: boolean };
type Values = ValueOf<Obj>; // string | number | boolean

// Recursive infer (flatten nested arrays)
type DeepFlatten<T> = T extends (infer U)[]
  ? DeepFlatten<U>
  : T;

type Nested = number[][][];
type Flat = DeepFlatten<Nested>; // number

// Infer with template literals
type ExtractRouteParams<T> =
  T extends `${infer _Start}/:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<`/${Rest}`>
    : T extends `${infer _Start}/:${infer Param}`
    ? Param
    : never;

type Route = '/users/:userId/posts/:postId';
type Params = ExtractRouteParams<Route>; // 'userId' | 'postId'
```

### Q15: Advanced Type Guards with `in`, `typeof`, `instanceof`

**Answer:**

**Type Guards**: Runtime checks that TypeScript understands

```typescript
// 1. 'in' operator type guard
interface Car {
  drive: () => void;
  wheels: 4;
}

interface Boat {
  sail: () => void;
  anchors: number;
}

function move(vehicle: Car | Boat) {
  if ('drive' in vehicle) {
    vehicle.drive(); // TypeScript knows it's Car
    console.log(vehicle.wheels); // OK
  } else {
    vehicle.sail(); // TypeScript knows it's Boat
    console.log(vehicle.anchors); // OK
  }
}

// 2. 'typeof' type guard
function format(value: string | number | boolean) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  } else if (typeof value === 'number') {
    return value.toFixed(2);
  } else {
    return value ? 'Yes' : 'No';
  }
}

// 3. 'instanceof' type guard
class NetworkError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ValidationError extends Error {
  field: string;
  constructor(message: string, field: string) {
    super(message);
    this.field = field;
  }
}

function handleError(error: Error) {
  if (error instanceof NetworkError) {
    console.log(`Network error ${error.statusCode}: ${error.message}`);
  } else if (error instanceof ValidationError) {
    console.log(`Validation error in ${error.field}: ${error.message}`);
  } else {
    console.log(`Unknown error: ${error.message}`);
  }
}

// 4. Custom type guard with 'is'
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

function isFish(animal: Fish | Bird): animal is Fish {
  return (animal as Fish).swim !== undefined;
}

function move(animal: Fish | Bird) {
  if (isFish(animal)) {
    animal.swim(); // Correctly typed as Fish
  } else {
    animal.fly(); // Correctly typed as Bird
  }
}

// 5. Assertion function (TypeScript 3.7+)
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Value must be a string');
  }
}

function processValue(value: unknown) {
  assertIsString(value);
  // TypeScript now knows value is string
  console.log(value.toUpperCase());
}

// 6. Discriminated union with type guard
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function handleResponse<T>(response: ApiResponse<T>) {
  if (response.success) {
    console.log(response.data); // TypeScript knows data exists
  } else {
    console.error(response.error); // TypeScript knows error exists
  }
}

// 7. Array type guard
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

function processArray(data: unknown) {
  if (isStringArray(data)) {
    data.forEach(str => console.log(str.toUpperCase())); // Fully typed!
  }
}
```

### Q16: Conditional Types and Type Mapping

**Answer:**

**Conditional Types**: `T extends U ? X : Y`

```typescript
// 1. Basic conditional type
type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>; // 'yes'
type B = IsString<number>; // 'no'

// 2. Exclude null/undefined
type NonNullable<T> = T extends null | undefined ? never : T;

type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>; // string

// 3. Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;

type StringOrNumber = string | number;
type Arrays = ToArray<StringOrNumber>;
// string[] | number[] (distributed over union)

// 4. Remove specific type from union
type Exclude<T, U> = T extends U ? never : T;

type AllTypes = 'a' | 'b' | 'c';
type WithoutB = Exclude<AllTypes, 'b'>; // 'a' | 'c'

// 5. Extract specific type from union
type Extract<T, U> = T extends U ? T : never;

type Mixed = string | number | boolean;
type OnlyStrings = Extract<Mixed, string>; // string

// 6. Conditional type with infer
type FunctionReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getData(): { id: number; name: string } {
  return { id: 1, name: 'John' };
}

type Data = FunctionReturnType<typeof getData>;
// { id: number; name: string }

// 7. Complex example: Type-safe event emitter
type EventMap = {
  'user:login': { userId: string; timestamp: number };
  'user:logout': { userId: string };
  'data:update': { data: any };
};

type EventNames = keyof EventMap;

type EventCallback<E extends EventNames> = (data: EventMap[E]) => void;

class TypedEventEmitter {
  private listeners: {
    [E in EventNames]?: EventCallback<E>[];
  } = {};

  on<E extends EventNames>(event: E, callback: EventCallback<E>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback as any);
  }

  emit<E extends EventNames>(event: E, data: EventMap[E]) {
    const callbacks = this.listeners[event];
    if (callbacks) {
      callbacks.forEach(cb => cb(data as any));
    }
  }
}

const emitter = new TypedEventEmitter();

// Fully type-safe!
emitter.on('user:login', (data) => {
  console.log(data.userId, data.timestamp); // ✅
});

emitter.emit('user:login', { userId: '123', timestamp: Date.now() }); // ✅
// emitter.emit('user:login', { invalid: true }); // ❌ Type error
```

### Q17: Mapped Types Advanced

**Answer:**

**Mapped Types**: Transform object properties

```typescript
// 1. Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 2. Make all properties required
type Required<T> = {
  [P in keyof T]-?: T[P]; // -? removes optionality
};

// 3. Make all properties readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 4. Remove readonly from all properties
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]; // -readonly removes readonly
};

// 5. Pick specific properties
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// 6. Omit specific properties
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// 7. Rename keys with template literals
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// {
//   getName: () => string;
//   getAge: () => number;
// }

// 8. Filter properties by value type
type FilterByType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K];
};

interface Mixed {
  name: string;
  age: number;
  active: boolean;
  count: number;
}

type OnlyNumbers = FilterByType<Mixed, number>;
// { age: number; count: number }

// 9. Make specific keys optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

type ProductInput = PartialBy<Product, 'id' | 'description'>;
// { name: string; price: number; id?: string; description?: string }

// 10. Deep readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

interface NestedData {
  user: {
    name: string;
    address: {
      city: string;
      zip: string;
    };
  };
}

type ReadonlyData = DeepReadonly<NestedData>;
// All levels are readonly!

// 11. Proxify (add getters/setters)
type Proxify<T> = {
  [P in keyof T]: {
    get: () => T[P];
    set: (value: T[P]) => void;
  };
};

type ProxifiedUser = Proxify<User>;
// {
//   name: { get: () => string; set: (value: string) => void };
//   age: { get: () => number; set: (value: number) => void };
// }
```

---

## 🎯 Advanced Interview Questions

**Be ready to explain:**

1. **"Difference between `unknown` and `any`?"**
   - `any` disables type checking; `unknown` is type-safe and requires type narrowing

2. **"When to use `type` vs `interface`?"**
   - Interface: object shapes, class contracts, declaration merging
   - Type: unions, intersections, complex transformations

3. **"How does `infer` work?"**
   - Extracts types within conditional types, used in utility types like ReturnType, Parameters

4. **"What are assertion functions?"**
   - Functions that throw if condition fails, TypeScript narrows type after call

5. **"How to create a type-safe event system?"**
   - Use mapped types + generics + keyof constraints

6. **"Explain discriminated unions"**
   - Union types with common property (discriminant) for type narrowing

7. **"What are template literal types used for?"**
   - Creating string literal types from patterns, route params, event names

8. **"How to make a type deeply readonly?"**
   - Recursive mapped type checking if property is object

9. **"What's the difference between `Partial<T>` and `Required<T>`?"**
   - Partial makes all optional; Required removes optionality

10. **"How to filter object properties by type?"**
    - Mapped type with conditional type in key remapping

Next: Practice coding exercises! 🚀
