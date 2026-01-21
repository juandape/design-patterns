# JavaScript Complete Guide - EPAM Interview Prep

> **Cobertura 100%** de todos los temas de la lista del recruiter

---

## 📋 Table of Contents

1. [Arrays](#arrays)
2. [Data Types](#data-types)
3. [Objects](#objects)
4. [Functions](#functions)
5. [Errors](#errors)
6. [Promises](#promises)
7. [Classes and OOP](#classes-and-oop)
8. [RegExp](#regexp)
9. [Iterators and Generators](#iterators-and-generators)
10. [JS Under the Hood](#js-under-the-hood)

---

## Arrays

### Built-in Methods

#### pop, push, shift, unshift

```javascript
const arr = [1, 2, 3];

// push - add to end
arr.push(4); // [1, 2, 3, 4], returns 4 (new length)

// pop - remove from end
arr.pop(); // [1, 2, 3], returns 4 (removed element)

// unshift - add to beginning
arr.unshift(0); // [0, 1, 2, 3], returns 4 (new length)

// shift - remove from beginning
arr.shift(); // [1, 2, 3], returns 0 (removed element)
```

#### slice, splice, concat

```javascript
const arr = [1, 2, 3, 4, 5];

// slice - extract portion (doesn't modify original)
arr.slice(1, 3); // [2, 3]
arr.slice(-2); // [4, 5]

// splice - add/remove elements (modifies original)
arr.splice(2, 1); // removes 1 element at index 2, returns [3]
arr.splice(2, 0, 3, 3.5); // inserts 3, 3.5 at index 2
// arr is now [1, 2, 3, 3.5, 4, 5]

// concat - merge arrays
const arr2 = [6, 7];
arr.concat(arr2); // [1, 2, 3, 3.5, 4, 5, 6, 7]
```

#### JSON.parse, JSON.stringify

```javascript
const obj = { name: 'John', age: 30 };

// stringify - object to JSON string
const json = JSON.stringify(obj); // '{"name":"John","age":30}'

// stringify with formatting
JSON.stringify(obj, null, 2); // pretty print

// parse - JSON string to object
JSON.parse(json); // { name: 'John', age: 30 }

// Note: functions, undefined, symbols are omitted
JSON.stringify({ fn: () => {}, val: undefined }); // '{}'
```

### Array Operations

#### sort, filter, find, map

```javascript
const numbers = [3, 1, 4, 1, 5];

// sort - sort array (mutates original)
numbers.sort((a, b) => a - b); // [1, 1, 3, 4, 5]

// filter - create new array with elements that pass test
const even = numbers.filter(n => n % 2 === 0); // [4]

// find - return first element that passes test
const found = numbers.find(n => n > 3); // 4

// map - create new array with transformed elements
const doubled = numbers.map(n => n * 2); // [2, 2, 6, 8, 10]
```

#### reduce

```javascript
const numbers = [1, 2, 3, 4, 5];

// reduce - reduce array to single value
const sum = numbers.reduce((acc, curr) => acc + curr, 0); // 15

// Examples
const max = numbers.reduce((max, curr) => curr > max ? curr : max);
const grouped = ['a', 'b', 'a'].reduce((acc, item) => {
  acc[item] = (acc[item] || 0) + 1;
  return acc;
}, {}); // { a: 2, b: 1 }
```

### Loops

#### for, while vs do while

```javascript
// for loop
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}

// while - condition checked before execution
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}

// do while - executes at least once (condition checked after)
let j = 0;
do {
  console.log(j);
  j++;
} while (j < 5);

// Difference: do-while always runs at least once
let k = 10;
while (k < 5) { } // never executes
do { console.log('runs once'); } while (k < 5); // runs once
```

#### for of

```javascript
const arr = [10, 20, 30];

// for of - iterate over values
for (const value of arr) {
  console.log(value); // 10, 20, 30
}

// Works with strings, Map, Set, NodeList, etc.
for (const char of 'hello') {
  console.log(char); // h, e, l, l, o
}
```

#### some, every

```javascript
const numbers = [1, 2, 3, 4, 5];

// some - returns true if at least one element passes test
const hasEven = numbers.some(n => n % 2 === 0); // true

// every - returns true if all elements pass test
const allPositive = numbers.every(n => n > 0); // true
const allEven = numbers.every(n => n % 2 === 0); // false
```

---

## Data Types

### NULL vs undefined

```javascript
// undefined - variable declared but not assigned
let x;
console.log(x); // undefined

// null - intentional absence of value
let y = null;
console.log(y); // null

// Differences
typeof undefined; // 'undefined'
typeof null; // 'object' (historical bug)

undefined == null; // true (loose equality)
undefined === null; // false (strict equality)

// Use cases
function getUser(id) {
  if (!id) return undefined; // missing parameter
  const user = database.find(id);
  return user || null; // user not found
}
```

### Symbol

```javascript
// Symbol - unique and immutable primitive
const sym1 = Symbol('description');
const sym2 = Symbol('description');
console.log(sym1 === sym2); // false (always unique)

// Use cases
// 1. Private properties
const _private = Symbol('private');
const obj = {
  [_private]: 'secret',
  public: 'visible'
};

// 2. Avoid property name collisions
const ID = Symbol('id');
const user = {
  [ID]: 123,
  name: 'John'
};

// Well-known symbols
Symbol.iterator; // used by for...of
Symbol.toStringTag; // used by Object.prototype.toString
```

### Set

```javascript
// Set - collection of unique values
const set = new Set([1, 2, 3, 3, 3]);
console.log(set); // Set(3) {1, 2, 3}

// Methods
set.add(4); // add element
set.has(2); // true
set.delete(1); // remove element
set.size; // 3
set.clear(); // remove all

// Use cases
// Remove duplicates
const unique = [...new Set([1, 1, 2, 3, 3])]; // [1, 2, 3]

// Check membership (faster than array.includes for large datasets)
const validIds = new Set([1, 5, 10]);
validIds.has(5); // true
```

### Map

```javascript
// Map - key-value pairs (any type as key)
const map = new Map();

map.set('name', 'John');
map.set(1, 'number key');
map.set({}, 'object key');

map.get('name'); // 'John'
map.has('name'); // true
map.delete('name');
map.size; // 2
map.clear();

// Iterate
map.forEach((value, key) => console.log(key, value));

for (const [key, value] of map) {
  console.log(key, value);
}

// vs Object
const obj = {}; // keys are always strings/symbols
const map2 = new Map(); // keys can be any type
```

### WeakSet

```javascript
// WeakSet - Set with weak references (only objects)
const weakSet = new WeakSet();

let obj = { data: 'value' };
weakSet.add(obj);

// Garbage collected when no other references exist
obj = null; // object will be garbage collected

// Use case: track objects without preventing garbage collection
const visitedNodes = new WeakSet();
function traverse(node) {
  if (visitedNodes.has(node)) return;
  visitedNodes.add(node);
  // process node
}
```

### WeakMap

```javascript
// WeakMap - Map with weak references (only object keys)
const weakMap = new WeakMap();

let key = { id: 1 };
weakMap.set(key, 'metadata');

// Garbage collected when key has no other references
key = null; // entry will be garbage collected

// Use case: store private data
const privateData = new WeakMap();

class User {
  constructor(name) {
    privateData.set(this, { name });
  }

  getName() {
    return privateData.get(this).name;
  }
}
```

---

## Objects

### Creation

```javascript
// Object literal
const obj1 = { name: 'John', age: 30 };

// Constructor
const obj2 = new Object();
obj2.name = 'John';

// Object.create
const proto = { greet() { return 'Hello'; } };
const obj3 = Object.create(proto);
obj3.name = 'John';

// Class
class Person {
  constructor(name) {
    this.name = name;
  }
}
const obj4 = new Person('John');
```

### Built-in Methods: assign, keys, values

```javascript
const obj = { a: 1, b: 2 };

// Object.assign - merge objects
const merged = Object.assign({}, obj, { c: 3 }); // { a: 1, b: 2, c: 3 }

// Object.keys - get array of keys
Object.keys(obj); // ['a', 'b']

// Object.values - get array of values
Object.values(obj); // [1, 2]
```

### Built-in Methods: hasOwnProperty, entries

```javascript
const obj = { a: 1, b: 2 };

// hasOwnProperty - check if property exists (not inherited)
obj.hasOwnProperty('a'); // true
obj.hasOwnProperty('toString'); // false (inherited)

// Object.hasOwn - safer alternative (ES2022)
Object.hasOwn(obj, 'a'); // true

// Object.entries - get array of [key, value] pairs
Object.entries(obj); // [['a', 1], ['b', 2]]

// Convert back
Object.fromEntries([['a', 1], ['b', 2]]); // { a: 1, b: 2 }
```

### Loops: for in, for of

```javascript
const obj = { a: 1, b: 2, c: 3 };

// for in - iterate over keys (including inherited enumerable)
for (const key in obj) {
  console.log(key, obj[key]); // a 1, b 2, c 3
}

// for of with Object.entries
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}

// for of with Object.keys
for (const key of Object.keys(obj)) {
  console.log(key);
}

// for of with Object.values
for (const value of Object.values(obj)) {
  console.log(value);
}
```

### Operations: copy, deep copy

```javascript
const original = { a: 1, b: { c: 2 } };

// Shallow copy - top level only
const copy1 = { ...original };
const copy2 = Object.assign({}, original);

copy1.a = 10; // doesn't affect original
copy1.b.c = 20; // DOES affect original (nested reference)

// Deep copy
// Method 1: JSON (loses functions, dates, undefined, symbols)
const deep1 = JSON.parse(JSON.stringify(original));

// Method 2: structuredClone (ES2022)
const deep2 = structuredClone(original);

// Method 3: Manual recursion
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}
```

### Enumerable, Configurable, Writable Property Attributes

```javascript
const obj = {};

// Define property with attributes
Object.defineProperty(obj, 'name', {
  value: 'John',
  writable: true,      // can change value
  enumerable: true,    // shows in for...in, Object.keys
  configurable: true   // can delete or modify descriptor
});

// Examples
Object.defineProperty(obj, 'readonly', {
  value: 'constant',
  writable: false      // cannot change
});
obj.readonly = 'new'; // silently fails (strict mode throws)

Object.defineProperty(obj, 'hidden', {
  value: 'secret',
  enumerable: false    // hidden from iteration
});
Object.keys(obj); // won't include 'hidden'

// Get descriptor
Object.getOwnPropertyDescriptor(obj, 'name');
// { value: 'John', writable: true, enumerable: true, configurable: true }
```

### Optional Chaining

```javascript
const user = {
  name: 'John',
  address: {
    city: 'NYC'
  }
};

// Without optional chaining (unsafe)
// const zip = user.address.zip.code; // TypeError!

// With optional chaining
const zip = user.address?.zip?.code; // undefined (safe)

// Works with functions
const result = user.getName?.(); // undefined if getName doesn't exist

// Works with arrays
const first = user.tags?.[0]; // undefined if tags doesn't exist
```

### Property Descriptors

```javascript
const obj = { name: 'John' };

// Get descriptor
const descriptor = Object.getOwnPropertyDescriptor(obj, 'name');
// { value: 'John', writable: true, enumerable: true, configurable: true }

// Define multiple properties
Object.defineProperties(obj, {
  age: {
    value: 30,
    writable: false
  },
  email: {
    get() { return this._email; },
    set(value) { this._email = value.toLowerCase(); },
    enumerable: true,
    configurable: true
  }
});
```

### Getters/Setters

```javascript
const user = {
  firstName: 'John',
  lastName: 'Doe',

  // Getter
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  // Setter
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(' ');
  }
};

console.log(user.fullName); // 'John Doe'
user.fullName = 'Jane Smith';
console.log(user.firstName); // 'Jane'

// With Object.defineProperty
Object.defineProperty(user, 'age', {
  get() { return this._age; },
  set(value) {
    if (value < 0) throw new Error('Invalid age');
    this._age = value;
  }
});
```

---

## Functions

### Context, this

```javascript
// Global context
console.log(this); // window (browser) or global (Node.js)

// Object method
const obj = {
  name: 'John',
  greet() {
    console.log(this.name); // 'John'
  }
};

// Arrow functions - inherit this from parent scope
const obj2 = {
  name: 'Jane',
  greet: () => {
    console.log(this.name); // undefined (arrow functions don't have own this)
  }
};

// Constructor function
function Person(name) {
  this.name = name; // this refers to new instance
}
const person = new Person('John');
```

### Call, Bind, Apply

```javascript
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const user = { name: 'John' };

// call - invoke immediately with this and arguments
greet.call(user, 'Hello', '!'); // 'Hello, John!'

// apply - invoke immediately with this and array of arguments
greet.apply(user, ['Hello', '!']); // 'Hello, John!'

// bind - return new function with bound this (doesn't invoke)
const boundGreet = greet.bind(user);
boundGreet('Hello', '!'); // 'Hello, John!'

// Partial application with bind
const sayHello = greet.bind(user, 'Hello');
sayHello('!'); // 'Hello, John!'
```

### Closures

```javascript
// Closure - function that remembers variables from its creation scope
function outer() {
  let count = 0;

  function inner() {
    count++;
    return count;
  }

  return inner;
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2
// count is preserved in closure

// Use case: Private variables
function createBankAccount(initialBalance) {
  let balance = initialBalance; // private

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) throw new Error('Insufficient funds');
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
}
```

### Global Scope

```javascript
// Global scope - accessible everywhere
var globalVar = 'global';
let globalLet = 'also global';

function test() {
  console.log(globalVar); // accessible
}

// Avoid polluting global scope
// Bad
name = 'John'; // creates global variable

// Good - use modules or IIFE
(function() {
  const name = 'John'; // scoped to IIFE
})();
```

### Callbacks

```javascript
// Callback - function passed as argument
function processData(data, callback) {
  const result = data * 2;
  callback(result);
}

processData(5, (result) => {
  console.log(result); // 10
});

// Async callback
function fetchData(callback) {
  setTimeout(() => {
    callback({ data: 'value' });
  }, 1000);
}

fetchData((data) => {
  console.log(data);
});
```

### Recursion

```javascript
// Recursion - function calls itself
function factorial(n) {
  if (n <= 1) return 1; // base case
  return n * factorial(n - 1); // recursive case
}

factorial(5); // 120

// Fibonacci
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Flatten array
function flatten(arr) {
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}
flatten([1, [2, [3, 4]]]); // [1, 2, 3, 4]
```

### Parameters Passing by Value and by Reference

```javascript
// Primitives - passed by value
function changeValue(x) {
  x = 10;
}
let num = 5;
changeValue(num);
console.log(num); // 5 (unchanged)

// Objects - passed by reference
function changeObject(obj) {
  obj.name = 'Jane';
}
const user = { name: 'John' };
changeObject(user);
console.log(user.name); // 'Jane' (changed!)

// Reassigning doesn't affect original
function replaceObject(obj) {
  obj = { name: 'Bob' }; // creates new reference
}
replaceObject(user);
console.log(user.name); // 'Jane' (unchanged)
```

### Chaining

```javascript
// Method chaining - return this
class Calculator {
  constructor(value = 0) {
    this.value = value;
  }

  add(n) {
    this.value += n;
    return this; // enable chaining
  }

  multiply(n) {
    this.value *= n;
    return this;
  }

  getValue() {
    return this.value;
  }
}

const result = new Calculator(5)
  .add(3)
  .multiply(2)
  .add(1)
  .getValue(); // 17
```

### Currying

```javascript
// Currying - transform f(a, b, c) to f(a)(b)(c)
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...nextArgs) => curried(...args, ...nextArgs);
  };
}

function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
curriedAdd(1)(2)(3); // 6
curriedAdd(1, 2)(3); // 6
curriedAdd(1)(2, 3); // 6

// Practical example
const multiply = (a) => (b) => a * b;
const double = multiply(2);
const triple = multiply(3);

double(5); // 10
triple(5); // 15
```

### Arguments Binding

```javascript
// bind - permanently bind this
const user = {
  name: 'John',
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};

const greet = user.greet;
greet(); // undefined (lost context)

const boundGreet = user.greet.bind(user);
boundGreet(); // 'Hello, John'

// Partial application
function sum(a, b, c) {
  return a + b + c;
}

const add5 = sum.bind(null, 5);
add5(10, 15); // 30 (5 + 10 + 15)
```

### Memoization

```javascript
// Memoization - cache function results
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log('From cache');
      return cache.get(key);
    }

    console.log('Computing...');
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const fibonacci = memoize(function(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

fibonacci(40); // Fast with memoization
```

---

## Errors

### Handling

```javascript
// try-catch-finally
try {
  // Code that might throw
  const result = riskyOperation();
} catch (error) {
  // Handle error
  console.error(error.message);
} finally {
  // Always executes
  cleanup();
}

// Async error handling
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error; // re-throw if needed
  }
}
```

### Throws

```javascript
// Throw error
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

try {
  divide(10, 0);
} catch (error) {
  console.log(error.message); // 'Division by zero'
}

// Different error types
throw new TypeError('Wrong type');
throw new RangeError('Out of range');
throw new ReferenceError('Variable not defined');
```

### Custom Errors

```javascript
// Custom error class
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

function validateUser(user) {
  if (!user.email) {
    throw new ValidationError('Email is required', 'email');
  }
  if (user.age < 18) {
    throw new ValidationError('Must be 18+', 'age');
  }
}

try {
  validateUser({ age: 15 });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Validation failed on ${error.field}: ${error.message}`);
  }
}
```

---

## Promises

### Chaining

```javascript
// Promise chaining
fetch('/api/user')
  .then(response => response.json())
  .then(user => fetch(`/api/posts/${user.id}`))
  .then(response => response.json())
  .then(posts => console.log(posts))
  .catch(error => console.error(error));

// Return value becomes next then's input
Promise.resolve(5)
  .then(x => x * 2)
  .then(x => x + 1)
  .then(x => console.log(x)); // 11
```

### Callback Hell

```javascript
// Callback hell (pyramid of doom)
getData(function(a) {
  getMoreData(a, function(b) {
    getEvenMoreData(b, function(c) {
      getEvenEvenMoreData(c, function(d) {
        console.log(d);
      });
    });
  });
});

// Solution: Promises
getData()
  .then(a => getMoreData(a))
  .then(b => getEvenMoreData(b))
  .then(c => getEvenEvenMoreData(c))
  .then(d => console.log(d));

// Better: async/await
async function process() {
  const a = await getData();
  const b = await getMoreData(a);
  const c = await getEvenMoreData(b);
  const d = await getEvenEvenMoreData(c);
  console.log(d);
}
```

### Error Handling

```javascript
// catch for errors
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Multiple catches
promise
  .then(step1)
  .catch(error => console.log('Step 1 failed'))
  .then(step2)
  .catch(error => console.log('Step 2 failed'));

// finally - always executes
fetch('/api/data')
  .then(data => processData(data))
  .catch(error => handleError(error))
  .finally(() => hideLoader());
```

### Async/Await

```javascript
// async - function returns promise
async function fetchUser() {
  return { name: 'John' }; // wrapped in Promise.resolve
}

// await - wait for promise
async function getUser() {
  const user = await fetchUser();
  console.log(user);
}

// Error handling
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Multiple awaits (sequential)
async function sequential() {
  const user = await fetchUser(); // waits
  const posts = await fetchPosts(); // waits
}

// Parallel
async function parallel() {
  const [user, posts] = await Promise.all([
    fetchUser(),
    fetchPosts()
  ]);
}
```

### Loops and Promises

```javascript
const urls = ['/api/1', '/api/2', '/api/3'];

// Sequential - one at a time
async function sequential() {
  for (const url of urls) {
    const data = await fetch(url);
    console.log(data);
  }
}

// Parallel - all at once
async function parallel() {
  const promises = urls.map(url => fetch(url));
  const results = await Promise.all(promises);
  console.log(results);
}

// forEach doesn't work with await!
urls.forEach(async (url) => {
  await fetch(url); // Won't wait!
});
```

### Promise.all()

```javascript
// Promise.all - wait for all, fails if any fails
const promises = [
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
];

Promise.all(promises)
  .then(([users, posts, comments]) => {
    console.log('All succeeded', users, posts, comments);
  })
  .catch(error => {
    console.log('One failed', error); // fails fast
  });

// With async/await
async function fetchAll() {
  const [users, posts, comments] = await Promise.all([
    fetch('/api/users'),
    fetch('/api/posts'),
    fetch('/api/comments')
  ]);
}
```

### Promise.allSettled()

```javascript
// Promise.allSettled - wait for all, never fails
const promises = [
  Promise.resolve('success'),
  Promise.reject('error'),
  Promise.resolve('another success')
];

Promise.allSettled(promises).then(results => {
  console.log(results);
  /*
  [
    { status: 'fulfilled', value: 'success' },
    { status: 'rejected', reason: 'error' },
    { status: 'fulfilled', value: 'another success' }
  ]
  */
});

// Use case: fetch from multiple sources, some may fail
const results = await Promise.allSettled([
  fetch('/api/primary'),
  fetch('/api/backup')
]);

const successful = results
  .filter(r => r.status === 'fulfilled')
  .map(r => r.value);
```

### Promise.any()

```javascript
// Promise.any - resolves with first successful, fails if all fail
const promises = [
  fetch('/api/slow-server'),
  fetch('/api/fast-server'),
  fetch('/api/backup-server')
];

Promise.any(promises)
  .then(result => {
    console.log('First successful:', result);
  })
  .catch(error => {
    console.log('All failed:', error);
  });

// Use case: race between servers, use fastest
const data = await Promise.any([
  fetch('/api/server1'),
  fetch('/api/server2')
]);
```

### Promise.race()

```javascript
// Promise.race - resolves/rejects with first settled
const promises = [
  new Promise(resolve => setTimeout(() => resolve('slow'), 1000)),
  new Promise(resolve => setTimeout(() => resolve('fast'), 100))
];

Promise.race(promises).then(result => {
  console.log(result); // 'fast'
});

// Use case: timeout
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject('Timeout'), 5000)
);

Promise.race([fetch('/api/data'), timeout])
  .then(data => console.log(data))
  .catch(error => console.log(error)); // 'Timeout' if > 5s
```

### How to Make Promise from Callback (Wrapping)

```javascript
// Promisify - convert callback to promise
function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  };
}

// Example: fs.readFile
const fs = require('fs');

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
}

// Usage
readFile('file.txt')
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Node.js util.promisify
const util = require('util');
const readFilePromise = util.promisify(fs.readFile);
```

---

## Classes and OOP

### OOP

```javascript
// Object-Oriented Programming principles
// 1. Encapsulation - bundle data and methods - hide internal details and expose only necessary data
// 2. Abstraction - hide complexity - show it doing something, not how it works
// 3. Inheritance - reuse code - create new classes based on existing ones
// 4. Polymorphism - different forms - same interface, different implementations

class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class PaymentService { //abstraction
  pay(amount) {
    // No matters how payment is made
    console.log(`Paying ${amount}`);
  }
}

class Dog extends Animal { //heritance
  speak() {
    console.log("Barks");
  }
}

const animals = [new Animal(), new Dog()]; //polymorphism

animals.forEach(animal => animal.speak());

```

### Classes

```javascript
// ES6 Class syntax
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

const person = new Person('John', 30);
person.greet(); // 'Hello, I'm John'
```

### Prototype

```javascript
// Prototype - object from which other objects inherit
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

const person = new Person('John');
person.greet(); // inherited from prototype

// Check prototype
Object.getPrototypeOf(person) === Person.prototype; // true
person.__proto__ === Person.prototype; // true (deprecated)
```

### Constructor

```javascript
// Constructor function (pre-ES6)
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

const person = new Person('John', 30);

// What 'new' does:
// 1. Creates empty object
// 2. Sets prototype
// 3. Binds this to new object
// 4. Returns the object (unless constructor returns object)
```

### Inheritance

```javascript
// ES6 Classes
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // call parent constructor
    this.breed = breed;
  }

  speak() {
    return `${this.name} barks`;
  }
}

const dog = new Dog('Rex', 'Labrador');
dog.speak(); // 'Rex barks'

// Prototype chain
dog instanceof Dog; // true
dog instanceof Animal; // true
```

### set/get

```javascript
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // Getter
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // Setter
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(' ');
  }
}

const person = new Person('John', 'Doe');
console.log(person.fullName); // 'John Doe'
person.fullName = 'Jane Smith'; // uses setter
console.log(person.firstName); // 'Jane'
```

### Public, Static, Private Methods

```javascript
class BankAccount {
  // Public field
  accountNumber = '123456';

  // Private field (ES2022)
  #balance = 0;

  // Static field
  static bankName = 'MyBank';

  constructor(owner) {
    this.owner = owner;
  }

  // Public method
  deposit(amount) {
    this.#balance += amount;
  }

  // Private method
  #validateAmount(amount) {
    return amount > 0;
  }

  // Static method
  static createAccount(owner) {
    return new BankAccount(owner);
  }

  // Getter for private field
  get balance() {
    return this.#balance;
  }
}

const account = new BankAccount('John');
account.deposit(100);
console.log(account.balance); // 100
// account.#balance; // SyntaxError: private field

BankAccount.createAccount('Jane'); // static method
```

### Prototypal Inheritance

```javascript
// Prototype chain
const animal = {
  speak() {
    return `${this.name} makes a sound`;
  }
};

const dog = Object.create(animal);
dog.name = 'Rex';
dog.bark = function() {
  return `${this.name} barks`;
};

dog.speak(); // inherited from animal
dog.bark(); // own method

// Prototype chain: dog -> animal -> Object.prototype -> null
```

### Super Keyword

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // call parent constructor
    this.breed = breed;
  }

  speak() {
    const parentSpeak = super.speak(); // call parent method
    return `${parentSpeak} and barks`;
  }
}

const dog = new Dog('Rex', 'Labrador');
console.log(dog.speak()); // 'Rex makes a sound and barks'
```

### Static Keyword

```javascript
class MathHelper {
  static PI = 3.14159;

  static add(a, b) {
    return a + b;
  }

  static multiply(a, b) {
    return a * b;
  }
}

// Call without instantiation
MathHelper.add(5, 3); // 8
MathHelper.PI; // 3.14159

// Cannot call on instance
const math = new MathHelper();
// math.add(5, 3); // TypeError
```

### Abstract Classes

```javascript
// JavaScript doesn't have abstract classes natively
// Simulate with error throwing
class AbstractShape {
  constructor() {
    if (new.target === AbstractShape) {
      throw new Error('Cannot instantiate abstract class');
    }
  }

  area() {
    throw new Error('Must implement area()');
  }
}

class Circle extends AbstractShape {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius ** 2;
  }
}

// new AbstractShape(); // Error
const circle = new Circle(5); // OK
```

### Generic Classes

```javascript
// JavaScript doesn't have generics (use TypeScript)
// Simulate with flexible implementation
class Container {
  constructor() {
    this.items = [];
  }

  add(item) {
    this.items.push(item);
    return this;
  }

  get(index) {
    return this.items[index];
  }
}

const numberContainer = new Container();
numberContainer.add(1).add(2);

const stringContainer = new Container();
stringContainer.add('a').add('b');
```

### Access Modifiers

```javascript
// Public (default)
class Person {
  name = 'John'; // public

  greet() { // public
    return `Hello, ${this.name}`;
  }
}

// Private (# prefix - ES2022)
class BankAccount {
  #balance = 0; // private

  #log(message) { // private method
    console.log(message);
  }

  deposit(amount) {
    this.#log(`Depositing ${amount}`);
    this.#balance += amount;
  }
}

// Protected - not native in JS, use convention (_prefix)
class Animal {
  constructor() {
    this._species = 'Unknown'; // convention: protected
  }
}
```

### Singleton Pattern

```javascript
// Singleton - ensure only one instance
class Singleton {
  static #instance = null;

  constructor() {
    if (Singleton.#instance) {
      return Singleton.#instance;
    }

    this.data = 'I am singleton';
    Singleton.#instance = this;
  }

  static getInstance() {
    if (!Singleton.#instance) {
      Singleton.#instance = new Singleton();
    }
    return Singleton.#instance;
  }
}

const s1 = new Singleton();
const s2 = new Singleton();
console.log(s1 === s2); // true (same instance)

// Alternative: Object literal
const singleton = {
  data: 'I am singleton',
  method() { }
};
```

### instanceof Operator

```javascript
class Animal {}
class Dog extends Animal {}

const dog = new Dog();

console.log(dog instanceof Dog); // true
console.log(dog instanceof Animal); // true
console.log(dog instanceof Object); // true

// Check constructor
console.log(dog.constructor === Dog); // true

// With primitives
console.log('string' instanceof String); // false
console.log(new String('string') instanceof String); // true

// Custom instanceof
function myInstanceOf(obj, constructor) {
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

---

## RegExp

### String Methods and Flags: match, matchAll, test

```javascript
const text = 'The quick brown fox jumps';

// match - find matches
text.match(/quick/); // ['quick']
text.match(/quick/g); // global flag: ['quick']

// matchAll - iterator for all matches (requires g flag)
const regex = /\b\w{5}\b/g; // 5-letter words
const matches = [...text.matchAll(regex)];
matches.forEach(match => console.log(match[0])); // quick, brown, jumps

// test - returns boolean
/quick/.test(text); // true
/slow/.test(text); // false

// search - returns index
text.search(/brown/); // 10

// Flags
// g - global (find all)
// i - case-insensitive
// m - multiline
// s - dotAll (. matches newlines)
// u - unicode
// y - sticky
```

### Replacements

```javascript
const text = 'Hello World';

// replace - replace first match
text.replace('World', 'JavaScript'); // 'Hello JavaScript'

// replace with regex
text.replace(/world/i, 'JavaScript'); // case-insensitive

// replaceAll - replace all matches
'aaa'.replaceAll('a', 'b'); // 'bbb'

// With function
const result = 'hello world'.replace(/\w+/g, (match) => {
  return match.charAt(0).toUpperCase() + match.slice(1);
}); // 'Hello World'

// Capture groups
const date = '2024-01-20';
date.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1'); // '20/01/2024'
```

### Ranges

```javascript
// Character ranges
/[a-z]/.test('hello'); // true (lowercase letters)
/[A-Z]/.test('HELLO'); // true (uppercase letters)
/[0-9]/.test('123'); // true (digits)
/[a-zA-Z]/.test('Hello'); // true (all letters)

// Negated ranges
/[^0-9]/.test('abc'); // true (not a digit)

// Multiple ranges
/[a-z0-9]/.test('hello123'); // true

// Shorthand character classes
/\d/.test('5'); // true (digit, same as [0-9])
/\D/.test('a'); // true (non-digit, same as [^0-9])
/\w/.test('a'); // true (word char: [a-zA-Z0-9_])
/\W/.test('!'); // true (non-word char)
/\s/.test(' '); // true (whitespace)
/\S/.test('a'); // true (non-whitespace)
```

### Grouping

```javascript
// Capturing groups - ()
const date = '2024-01-20';
const match = date.match(/(\d{4})-(\d{2})-(\d{2})/);
console.log(match[1]); // '2024'
console.log(match[2]); // '01'
console.log(match[3]); // '20'

// Non-capturing groups - (?:)
/(?:https?):\/\/(.+)/.exec('https://example.com');
// match[1] is 'example.com' (group 1)

// Named groups - (?<name>)
const result = '2024-01-20'.match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);
console.log(result.groups.year); // '2024'
console.log(result.groups.month); // '01'

// Alternation - |
/cat|dog/.test('I have a cat'); // true
/(red|blue|green) car/.test('red car'); // true
```

### Greedy and Lazy Search

```javascript
const html = '<div>First</div><div>Second</div>';

// Greedy - matches as much as possible (default)
html.match(/<div>.*<\/div>/); // ['<div>First</div><div>Second</div>']

// Lazy - matches as little as possible (add ?)
html.match(/<div>.*?<\/div>/); // ['<div>First</div>']

// Examples
'123456'.match(/\d{2,4}/);  // ['1234'] greedy
'123456'.match(/\d{2,4}?/); // ['12'] lazy

// Quantifiers
/a+/.test('aaa');   // + greedy (1 or more)
/a+?/.test('aaa');  // +? lazy
/a*/.test('aaa');   // * greedy (0 or more)
/a*?/.test('aaa');  // *? lazy
/a{2,5}/.test('aaa'); // {n,m} greedy
/a{2,5}?/.test('aaa'); // {n,m}? lazy
```

---

## Iterators and Generators

### Iterators

```javascript
// Iterator - object with next() method
const iterator = {
  current: 0,
  last: 5,

  next() {
    if (this.current <= this.last) {
      return { value: this.current++, done: false };
    }
    return { done: true };
  }
};

console.log(iterator.next()); // { value: 0, done: false }
console.log(iterator.next()); // { value: 1, done: false }

// Iterable - object with [Symbol.iterator]
const iterable = {
  [Symbol.iterator]() {
    let current = 0;
    const last = 5;

    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };
  }
};

// Use with for...of
for (const value of iterable) {
  console.log(value); // 0, 1, 2, 3, 4, 5
}
```

### yield

```javascript
// yield - pause generator and return value
function* simpleGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = simpleGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// yield with expression
function* generatorWithInput() {
  const input = yield 'Ready for input';
  yield `Received: ${input}`;
}

const gen2 = generatorWithInput();
console.log(gen2.next());      // { value: 'Ready for input', done: false }
console.log(gen2.next('Hello')); // { value: 'Received: Hello', done: false }

// yield* - delegate to another generator
function* generator1() {
  yield 1;
  yield 2;
}

function* generator2() {
  yield* generator1();
  yield 3;
}

[...generator2()]; // [1, 2, 3]
```

### Generators

```javascript
// Generator function - function*
function* numberGenerator() {
  let num = 0;
  while (true) {
    yield num++;
  }
}

const gen = numberGenerator();
gen.next().value; // 0
gen.next().value; // 1
gen.next().value; // 2

// Finite generator
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

[...range(1, 5)]; // [1, 2, 3, 4, 5]

// Generator with async
async function* asyncGenerator() {
  yield await fetch('/api/1');
  yield await fetch('/api/2');
  yield await fetch('/api/3');
}

// Use case: Infinite sequence
function* fibonacci() {
  let [prev, curr] = [0, 1];
  while (true) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

const fib = fibonacci();
fib.next().value; // 1
fib.next().value; // 1
fib.next().value; // 2
fib.next().value; // 3
fib.next().value; // 5
```

---

## JS Under the Hood

### Event Loop

```javascript
// Event Loop manages execution order
console.log('1'); // Synchronous

setTimeout(() => console.log('2'), 0); // Macrotask

Promise.resolve().then(() => console.log('3')); // Microtask

console.log('4'); // Synchronous

// Output: 1, 4, 3, 2

// How it works:
// 1. Execute all synchronous code (call stack)
// 2. Execute all microtasks (promises, queueMicrotask)
// 3. Execute one macrotask (setTimeout, setInterval, setImmediate)
// 4. Render (if needed)
// 5. Repeat from step 2
```

### Micro/Macro/Render/Idle/Event Queues

```javascript
// Microtask queue (high priority)
Promise.resolve().then(() => console.log('microtask 1'));
queueMicrotask(() => console.log('microtask 2'));

// Macrotask queue (lower priority)
setTimeout(() => console.log('macrotask 1'), 0);
setInterval(() => console.log('macrotask 2'), 100);
setImmediate(() => console.log('macrotask 3')); // Node.js

// Render queue (browser only)
requestAnimationFrame(() => console.log('render'));

// Idle queue (browser only)
requestIdleCallback(() => console.log('idle'));

// Event queue
button.addEventListener('click', () => console.log('event'));
```

### Queues Priority and Order

```javascript
// Priority order (high to low):
// 1. Synchronous code (call stack)
// 2. Microtasks (Promise, queueMicrotask, MutationObserver)
// 3. Render (requestAnimationFrame)
// 4. Macrotasks (setTimeout, setInterval, I/O, setImmediate)
// 5. Idle (requestIdleCallback)

console.log('1 - sync');

setTimeout(() => console.log('2 - macro'), 0);

Promise.resolve().then(() => {
  console.log('3 - micro');
  setTimeout(() => console.log('4 - macro'), 0);
});

queueMicrotask(() => console.log('5 - micro'));

console.log('6 - sync');

// Output: 1, 6, 3, 5, 2, 4
```

### Module System: require, JS modules, import

```javascript
// CommonJS (Node.js) - synchronous
// math.js
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// or
exports.add = (a, b) => a + b;

// app.js
const math = require('./math');
math.add(2, 3); // 5

// ES6 Modules - asynchronous
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// or
export default {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// app.js
import { add, subtract } from './math.js';
import math from './math.js'; // default import

// Dynamic import (ES2020)
const module = await import('./math.js');
// or
import('./math.js').then(module => {
  module.add(2, 3);
});

// Differences:
// CommonJS: require(), module.exports, synchronous
// ES6: import/export, asynchronous, static analysis
```

---

## Practice Tips

1. **Arrays**: Memorize common methods (map, filter, reduce, forEach, find, some, every)
2. **Data Types**: Understand null vs undefined, when to use Set/Map vs Array/Object
3. **Objects**: Master property descriptors, getters/setters, for...in vs for...of
4. **Functions**: Practice this binding, closures, currying, memoization
5. **Promises**: Know all Promise methods (all, allSettled, race, any)
6. **Classes**: Understand prototype chain, inheritance, private fields
7. **RegExp**: Practice common patterns (email, phone, URL validation)
8. **Event Loop**: Draw diagrams, predict execution order
9. **Modules**: Know differences between CommonJS and ES6 modules

Good luck! 🚀
