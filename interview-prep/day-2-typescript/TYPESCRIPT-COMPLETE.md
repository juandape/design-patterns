# TypeScript Complete Guide - EPAM Interview Prep

> **Cobertura 100%** de todos los temas de la lista del recruiter

---

## 📋 Table of Contents

1. [TypeScript Basics](#typescript-basics)
2. [Configuration](#configuration)
3. [Classes and OOP](#classes-and-oop)
4. [Types](#types)
5. [Advanced Types](#advanced-types)

---

## TypeScript Basics

### TS Module System, Resolution

```typescript
// ES6 module syntax
// math.ts
export const add = (a: number, b: number): number => a + b;
export const subtract = (a: number, b: number): number => a - b;

// Default export
export default class Calculator {
  add(a: number, b: number) {
    return a + b;
  }
}

// app.ts
import { add, subtract } from './math';
import Calculator from './math';

// Module resolution strategies:
// Classic - for AMD, System, ES2015
// Node - mimics Node.js module resolution

// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node", // or "classic"
    "module": "commonjs", // or "es2015", "esnext", etc.
    "esModuleInterop": true, // allows default imports from CommonJS
    "baseUrl": "./src",
    "paths": {
      "@models/*": ["models/*"],
      "@utils/*": ["utils/*"]
    }
  }
}

// Usage with paths
import { User } from '@models/user';
import { formatDate } from '@utils/date';

// Triple-slash directives
/// <reference path="./types.d.ts" />
/// <reference types="node" />
```

### Describing Variables

```typescript
// Type annotations
let name: string = 'John';
let age: number = 30;
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// Type inference
let inferredString = 'hello'; // type: string
let inferredNumber = 42; // type: number

// Arrays
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ['a', 'b', 'c'];

// Tuples
let tuple: [string, number] = ['John', 30];

// Any (avoid)
let anything: any = 'string';
anything = 123;
anything = true;

// Unknown (safer than any)
let unknown: unknown = 'string';
if (typeof unknown === 'string') {
  console.log(unknown.toUpperCase()); // type guard needed
}

// Never
function throwError(): never {
  throw new Error('Error');
}

// Void
function logMessage(message: string): void {
  console.log(message);
}
```

### Read-only Properties, etc.

```typescript
// Readonly
interface User {
  readonly id: number;
  name: string;
}

const user: User = { id: 1, name: 'John' };
// user.id = 2; // Error: Cannot assign to 'id'

// Readonly array
const numbers: ReadonlyArray<number> = [1, 2, 3];
// numbers.push(4); // Error

// Readonly modifier in class
class Person {
  readonly birthDate: Date;

  constructor(birthDate: Date) {
    this.birthDate = birthDate;
  }
}

// Optional properties
interface Config {
  host: string;
  port?: number; // optional
}

const config: Config = { host: 'localhost' }; // OK

// Index signatures
interface StringMap {
  [key: string]: string;
}

const map: StringMap = {
  name: 'John',
  email: 'john@example.com'
};
```

### infer

```typescript
// infer - extract type from another type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function add(a: number, b: number): number {
  return a + b;
}

type AddReturn = ReturnType<typeof add>; // number

// Extract array element type
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>; // string
type Num = Flatten<number>; // number

// Extract Promise value
type Awaited<T> = T extends Promise<infer U> ? U : T;

type StringPromise = Awaited<Promise<string>>; // string

// Extract function parameters
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

type AddParams = Parameters<typeof add>; // [number, number]

// Practical example
type GetProperty<T, K> = K extends keyof T ? T[K] : never;

interface User {
  name: string;
  age: number;
}

type UserName = GetProperty<User, 'name'>; // string
```

### Decorators Understanding

```typescript
// Enable decorators in tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}

// Class decorator
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Person {
  name: string;
}

// Method decorator
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args);
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

class User {
  @readonly
  id: number = 1;
}

// Parameter decorator
function required(target: any, propertyKey: string, parameterIndex: number) {
  console.log(`Parameter ${parameterIndex} in ${propertyKey} is required`);
}

class Service {
  greet(@required name: string) {
    return `Hello, ${name}`;
  }
}

// Decorator factory
function validate(regex: RegExp) {
  return function(target: any, propertyKey: string) {
    let value: string;

    const getter = () => value;
    const setter = (newValue: string) => {
      if (!regex.test(newValue)) {
        throw new Error(`Invalid value for ${propertyKey}`);
      }
      value = newValue;
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter
    });
  };
}

class User {
  @validate(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i)
  email: string;
}
```

---

## Configuration

### Build using tsc, tsconfig

```json
// tsconfig.json - TypeScript configuration
{
  "compilerOptions": {
    // Language and Environment
    "target": "ES2020",                    // ECMAScript target
    "lib": ["ES2020", "DOM"],              // Include type definitions
    "jsx": "react",                        // JSX support

    // Modules
    "module": "commonjs",                  // Module system
    "moduleResolution": "node",            // How to resolve modules
    "baseUrl": "./src",                    // Base directory
    "paths": {                             // Path mapping
      "@/*": ["./*"]
    },
    "rootDir": "./src",                    // Root of source files
    "outDir": "./dist",                    // Output directory

    // Emit
    "declaration": true,                   // Generate .d.ts files
    "declarationMap": true,                // Source map for .d.ts
    "sourceMap": true,                     // Generate .map files
    "removeComments": true,                // Remove comments
    "noEmit": false,                       // Don't emit files
    "importHelpers": true,                 // Import helpers from tslib

    // Interop Constraints
    "esModuleInterop": true,               // Enable default imports
    "allowSyntheticDefaultImports": true,  // Allow default imports
    "forceConsistentCasingInFileNames": true,

    // Type Checking
    "strict": true,                        // Enable all strict checks
    "noImplicitAny": true,                 // Disallow implicit any
    "strictNullChecks": true,              // Null checks
    "strictFunctionTypes": true,           // Function type checks
    "strictBindCallApply": true,           // Strict bind/call/apply
    "strictPropertyInitialization": true,  // Class property init
    "noImplicitThis": true,                // Disallow implicit this
    "alwaysStrict": true,                  // Use strict mode

    // Additional Checks
    "noUnusedLocals": true,                // Error on unused locals
    "noUnusedParameters": true,            // Error on unused params
    "noImplicitReturns": true,             // All paths must return
    "noFallthroughCasesInSwitch": true,    // No fallthrough in switch

    // Advanced
    "skipLibCheck": true,                  // Skip type checking of .d.ts
    "resolveJsonModule": true,             // Import JSON files
    "experimentalDecorators": true,        // Enable decorators
    "emitDecoratorMetadata": true          // Emit decorator metadata
  },

  "include": ["src/**/*"],                 // Files to include
  "exclude": ["node_modules", "dist"],     // Files to exclude

  "extends": "./tsconfig.base.json"        // Extend another config
}
```

```bash
# Build commands
tsc                          # Compile using tsconfig.json
tsc --project tsconfig.json  # Specify config file
tsc --watch                  # Watch mode
tsc --noEmit                 # Type check only
tsc --build                  # Build project references

# Compile specific files
tsc file.ts                  # Compile single file
tsc file1.ts file2.ts        # Compile multiple files

# Override options
tsc --target ES2015         # Override target
tsc --outDir ./build        # Override output directory
```

---

## Classes and OOP

### Classes

```typescript
class Person {
  // Properties
  name: string;
  age: number;

  // Constructor
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  // Method
  greet(): string {
    return `Hello, I'm ${this.name}`;
  }
}

const person = new Person('John', 30);

// Shorthand with parameter properties
class User {
  constructor(
    public name: string,
    private age: number,
    readonly id: number
  ) {}
}

// Equivalent to:
class User {
  public name: string;
  private age: number;
  readonly id: number;

  constructor(name: string, age: number, id: number) {
    this.name = name;
    this.age = age;
    this.id = id;
  }
}
```

### Interfaces

```typescript
// Interface - contract for object shape
interface User {
  name: string;
  age: number;
  email?: string; // optional
}

const user: User = {
  name: 'John',
  age: 30
};

// Interface for functions
interface MathOperation {
  (a: number, b: number): number;
}

const add: MathOperation = (a, b) => a + b;

// Interface with methods
interface Repository<T> {
  find(id: number): T | undefined;
  save(item: T): void;
  delete(id: number): void;
}

// Extending interfaces
interface Admin extends User {
  role: string;
  permissions: string[];
}

// Implementing interface
class UserRepository implements Repository<User> {
  private users: User[] = [];

  find(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  save(user: User): void {
    this.users.push(user);
  }

  delete(id: number): void {
    this.users = this.users.filter(u => u.id !== id);
  }
}

// Interface vs Type
interface IUser {
  name: string;
}

type TUser = {
  name: string;
};

// Interfaces can be extended multiple times (declaration merging)
interface Window {
  customProperty: string;
}

interface Window {
  anotherProperty: number;
}

// Window now has both properties
```

### Inheritance

```typescript
class Animal {
  constructor(public name: string) {}

  makeSound(): void {
    console.log('Some sound');
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name); // Call parent constructor
  }

  // Override method
  makeSound(): void {
    console.log('Woof!');
  }

  // New method
  fetch(): void {
    console.log(`${this.name} is fetching`);
  }
}

const dog = new Dog('Rex', 'Labrador');
dog.makeSound(); // 'Woof!'
dog.fetch(); // 'Rex is fetching'

// Multiple interface implementation
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

class Duck extends Animal implements Flyable, Swimmable {
  fly(): void {
    console.log('Flying');
  }

  swim(): void {
    console.log('Swimming');
  }
}
```

### Abstract Classes

```typescript
// Abstract class - cannot be instantiated
abstract class Shape {
  constructor(public color: string) {}

  // Abstract method - must be implemented by subclass
  abstract area(): number;
  abstract perimeter(): number;

  // Concrete method
  describe(): string {
    return `A ${this.color} shape with area ${this.area()}`;
  }
}

// Cannot instantiate
// const shape = new Shape('red'); // Error

class Circle extends Shape {
  constructor(color: string, public radius: number) {
    super(color);
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

const circle = new Circle('red', 5);
console.log(circle.describe()); // 'A red shape with area 78.54'
```

### Generic Classes

```typescript
// Generic class
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  getAll(): T[] {
    return this.items;
  }
}

const numberContainer = new Container<number>();
numberContainer.add(1);
numberContainer.add(2);

const stringContainer = new Container<string>();
stringContainer.add('a');
stringContainer.add('b');

// Generic with constraints
class Repository<T extends { id: number }> {
  private items: Map<number, T> = new Map();

  save(item: T): void {
    this.items.set(item.id, item);
  }

  find(id: number): T | undefined {
    return this.items.get(id);
  }
}

interface User {
  id: number;
  name: string;
}

const userRepo = new Repository<User>();
userRepo.save({ id: 1, name: 'John' });

// Multiple type parameters
class Pair<K, V> {
  constructor(public key: K, public value: V) {}
}

const pair = new Pair<string, number>('age', 30);
```

### Access Modifiers

```typescript
class BankAccount {
  // Public (default) - accessible everywhere
  public accountNumber: string;

  // Private - only accessible within class
  private balance: number;

  // Protected - accessible in class and subclasses
  protected owner: string;

  constructor(accountNumber: string, owner: string) {
    this.accountNumber = accountNumber;
    this.owner = owner;
    this.balance = 0;
  }

  deposit(amount: number): void {
    this.balance += amount; // OK: private access within class
  }

  getBalance(): number {
    return this.balance;
  }
}

class SavingsAccount extends BankAccount {
  addInterest(rate: number): void {
    // this.balance += 100; // Error: private
    console.log(this.owner); // OK: protected
  }
}

const account = new BankAccount('123', 'John');
account.accountNumber; // OK: public
// account.balance; // Error: private
// account.owner; // Error: protected

// Private fields (ES2022 syntax)
class Modern {
  #privateField = 'private';

  getPrivate() {
    return this.#privateField;
  }
}
```

---

## Types

### Primitives

```typescript
// String
let str: string = 'hello';
let template: string = `Hello ${str}`;

// Number
let num: number = 42;
let hex: number = 0xFF;
let binary: number = 0b1010;
let octal: number = 0o744;

// Boolean
let bool: boolean = true;

// Null and undefined
let n: null = null;
let u: undefined = undefined;

// Symbol
let sym: symbol = Symbol('description');

// BigInt
let big: bigint = 100n;

// Literal types
let literalString: 'hello' = 'hello';
let literalNumber: 42 = 42;
let literalBoolean: true = true;
```

### Unions

```typescript
// Union - value can be one of several types
let value: string | number;
value = 'hello';
value = 42;

// Union with literal types
type Status = 'pending' | 'approved' | 'rejected';
let status: Status = 'pending';

// Function with union parameter
function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

// Array of union
let mixed: (string | number)[] = ['hello', 42, 'world'];

// Union with null
let nullable: string | null = null;
nullable = 'hello';
```

### Functions

```typescript
// Function type
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;

// Function declaration
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Optional parameters
function log(message: string, userId?: number): void {
  console.log(message, userId);
}

// Default parameters
function power(base: number, exponent: number = 2): number {
  return base ** exponent;
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

// Overloads
function combine(a: string, b: string): string;
function combine(a: number, b: number): number;
function combine(a: any, b: any): any {
  return a + b;
}

combine('hello', 'world'); // string
combine(1, 2); // number

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Void return
function logMessage(message: string): void {
  console.log(message);
}

// Never return (never completes)
function throwError(message: string): never {
  throw new Error(message);
}
```

### Custom Types

```typescript
// Type alias
type User = {
  id: number;
  name: string;
  email: string;
};

// Type with union
type ID = string | number;

// Type with intersection
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type UserWithTimestamp = User & Timestamped;

// Function type
type Predicate<T> = (item: T) => boolean;

const isEven: Predicate<number> = (n) => n % 2 === 0;

// Index signature
type Dictionary = {
  [key: string]: string;
};

// Tuple type
type Point = [number, number];
type RGBColor = [number, number, number];

// Enum
enum Direction {
  Up,
  Down,
  Left,
  Right
}

enum Status {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED'
}
```

### Generic

```typescript
// Generic function
function identity<T>(value: T): T {
  return value;
}

identity<number>(42);
identity('hello'); // type inferred

// Generic with constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'John', age: 30 };
getProperty(user, 'name'); // string
getProperty(user, 'age'); // number

// Generic interface
interface Result<T> {
  data: T;
  error: string | null;
}

const result: Result<User> = {
  data: { id: 1, name: 'John', email: 'john@example.com' },
  error: null
};

// Generic type alias
type Response<T> = {
  status: number;
  data: T;
};

// Multiple type parameters
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

// Default type parameter
function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value);
}
```

### Partial

```typescript
// Partial - makes all properties optional
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
// Equivalent to:
// {
//   id?: number;
//   name?: string;
//   email?: string;
// }

function updateUser(id: number, updates: Partial<User>): void {
  // Can update any subset of properties
}

updateUser(1, { name: 'Jane' });
updateUser(1, { email: 'jane@example.com' });

// Implementation
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};
```

### Omit

```typescript
// Omit - create type by removing properties
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Omit<User, 'password'>;
// { id: number; name: string; email: string; }

type UserWithoutId = Omit<User, 'id' | 'password'>;
// { name: string; email: string; }

// Implementation
type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Related: Pick - select properties
type UserCredentials = Pick<User, 'email' | 'password'>;
// { email: string; password: string; }
```

### ReturnType

```typescript
// ReturnType - extract function return type
function createUser() {
  return {
    id: 1,
    name: 'John',
    email: 'john@example.com'
  };
}

type User = ReturnType<typeof createUser>;
// { id: number; name: string; email: string; }

// With generic function
function wrapValue<T>(value: T) {
  return { value, timestamp: Date.now() };
}

type Wrapped = ReturnType<typeof wrapValue<string>>;
// { value: string; timestamp: number; }

// Implementation
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Related utility types
type Params = Parameters<typeof createUser>; // []
type ConstructorParams = ConstructorParameters<typeof Date>; // [value?: string | number | Date]
type Instance = InstanceType<typeof Date>; // Date
```

---

## Advanced Types

### Guards

```typescript
// Type guards - narrow types
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function process(value: string | number) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // string
  } else {
    console.log(value.toFixed(2)); // number
  }
}

// typeof guard
function format(value: string | number) {
  if (typeof value === 'string') {
    return value.trim();
  }
  return value.toFixed(2);
}

// instanceof guard
class Dog {}
class Cat {}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    console.log('Woof');
  } else {
    console.log('Meow');
  }
}

// in operator guard
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}

// Discriminated unions
type Success = { status: 'success'; data: string };
type Error = { status: 'error'; error: string };
type Result = Success | Error;

function handle(result: Result) {
  if (result.status === 'success') {
    console.log(result.data); // Success type
  } else {
    console.log(result.error); // Error type
  }
}
```

### Conditions (Conditional Types)

```typescript
// Conditional types - T extends U ? X : Y
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// Extract non-nullable
type NonNullable<T> = T extends null | undefined ? never : T;

type C = NonNullable<string | null>; // string

// Flatten array type
type Flatten<T> = T extends Array<infer U> ? U : T;

type D = Flatten<number[]>; // number
type E = Flatten<string>; // string

// Conditional type with unions (distributes)
type ToArray<T> = T extends any ? T[] : never;

type F = ToArray<string | number>; // string[] | number[]

// Practical example: Extract function types
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

interface User {
  name: string;
  age: number;
  greet(): void;
  getId(): number;
}

type UserFunctions = FunctionPropertyNames<User>; // 'greet' | 'getId'
```

### Mappings (Mapped Types)

```typescript
// Mapped types - transform properties
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// { readonly name: string; readonly age: number; }

// Optional
type Optional<T> = {
  [P in keyof T]?: T[P];
};

// Nullable
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

// Remove readonly
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// Remove optional
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Change value type
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number; }

// Filter properties
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

interface Mixed {
  name: string;
  age: number;
  active: boolean;
  count: number;
}

type NumberProperties = PickByType<Mixed, number>;
// { age: number; count: number; }

// Record - create object type
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

type PageInfo = Record<'home' | 'about' | 'contact', { title: string }>;
// {
//   home: { title: string };
//   about: { title: string };
//   contact: { title: string };
// }
```

---

## Practice Tips

1. **Module System**: Understand ES6 modules, path mapping, and module resolution
2. **Configuration**: Memorize key tsconfig options (strict, target, module, moduleResolution)
3. **Decorators**: Know class, method, property, and parameter decorators
4. **Classes**: Master access modifiers, abstract classes, generics
5. **Interfaces**: Understand interface vs type, extending, implementing
6. **Types**: Practice union, intersection, literal types
7. **Generics**: Use constraints, default types, multiple type parameters
8. **Utility Types**: Memorize Partial, Omit, Pick, ReturnType, Record
9. **Type Guards**: Write custom type guards, use typeof/instanceof
10. **Mapped Types**: Create custom utility types with mapped types

Good luck! 🚀
