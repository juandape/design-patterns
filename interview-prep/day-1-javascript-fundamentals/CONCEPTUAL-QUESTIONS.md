# Day 1: JavaScript Fundamentals - Conceptual Questions

## 🎯 Core JavaScript Concepts for Senior Level

---

## 1. Closures & Scope

### Q1: What is a closure and why would you use it?

**Answer:**
A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.

**Use cases:**

- Data privacy / encapsulation
- Factory functions
- Partial application / currying
- Event handlers with private state
- Module pattern

**Example:**

```javascript
function createCounter() {
  let count = 0; // private variable

  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.getValue()); // 1
// count is not accessible directly
```

### Q2: Explain the difference between `var`, `let`, and `const`

**Answer:**

- **var**: Function-scoped, hoisted, can be redeclared
- **let**: Block-scoped, hoisted but in TDZ, cannot be redeclared
- **const**: Block-scoped, must be initialized, reference cannot be reassigned

**Key points:**

- Temporal Dead Zone (TDZ) for let/const (period of time that you cannot access the variable before initialization)
- `const` for objects means the reference is constant, not the value
- Always prefer `const` > `let` > never `var`

---

## 2. Event Loop & Asynchronous JavaScript

### Q3: Explain the JavaScript Event Loop

**Answer:**
The event loop is how JavaScript handles asynchronous operations despite being single-threaded.

**Components:**

1. **Call Stack**: Executes synchronous code
2. **Web APIs**: Handles async operations (setTimeout, fetch, etc.)
3. **Callback Queue (Task Queue)**: Holds callbacks from Web APIs
4. **Microtask Queue**: Holds promises, mutation observers
5. **Event Loop**: Moves tasks from queues to call stack

**Order of execution:**

1. Synchronous code (call stack)
2. Microtasks (promises)
3. Macrotasks (setTimeout, setInterval)

**Example:**

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');

// Output: 1, 4, 3, 2
// Why? Microtasks (promises) execute before macrotasks (setTimeout)
```

### Q4: What's the difference between microtasks and macrotasks?

**Answer:**
The difference is the microtasks are high-priority async jobs that must run asap, and the macrotasks are bigger async operations that ares schedule to run later

**Microtasks:**

- Promises (.then, .catch, .finally)
- queueMicrotask()
- MutationObserver
- Process.nextTick (Node.js)
- Execute after current script, before rendering

**Macrotasks:**

- setTimeout / setInterval
- setImmediate (Node.js)
- I/O operations
- UI rendering
- Execute one per event loop cycle

**Key difference:** All microtasks execute before the next macrotask.

---

## 3. Promises & Async/Await

### Q5: What are Promises and what are their states?

**Answer:**
Promises are objects representing the eventual completion or failure of an asynchronous operation.

**Promise states:**

1. **Pending**: Initial state
2. **Fulfilled**: Operation completed successfully
3. **Rejected**: Operation failed

**Key characteristics:**

- Immutable once settled
- Can only settle once
- Always async (even if resolved immediately)

**Example:**

```javascript
const promise = new Promise((resolve, reject) => {
  // async operation
  if (success) {
    resolve(value);
  } else {
    reject(error);
  }
});

promise
  .then(result => {/* handle success */})
  .catch(error => {/* handle error */})
  .finally(() => {/* cleanup */});
```

### Q6: How does async/await work under the hood?

**Answer:**
`async/await` is syntactic sugar over Promises.

**How it works:**

- `async` function always returns a Promise
- `await` pauses execution until Promise resolves
- Creates generator-like behavior using Promises
- Errors can be caught with try/catch

**Example:**

```javascript
// This async/await:
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Is equivalent to:
function fetchData() {
  return fetch('/api/data')
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.error(error));
}
```

### Q7: How would you handle multiple async operations efficiently?

**Answer:**

```javascript
// Sequential (slow - waits for each)
async function sequential() {
  const result1 = await fetchData1(); // 2s
  const result2 = await fetchData2(); // 2s
  return [result1, result2]; // Total: 4s
}

// Parallel (fast - runs simultaneously)
async function parallel() {
  const [result1, result2] = await Promise.all([
    fetchData1(), // 2s
    fetchData2()  // 2s
  ]); // Total: 2s
  return [result1, result2];
}

// Promise.allSettled (doesn't fail if one rejects)
async function allSettled() {
  const results = await Promise.allSettled([
    fetchData1(),
    fetchData2()
  ]);
  // Returns: [{status: 'fulfilled', value: ...}, {status: 'rejected', reason: ...}]
}

// Promise.race (returns first to settle)
async function race() {
  const fastest = await Promise.race([
    fetchData1(),
    fetchData2()
  ]);
  return fastest;
}
```

---

## 4. Prototypal Inheritance

### Q8: Explain JavaScript's prototypal inheritance

**Answer:**
JS uses prototypal inheritance, meaning objects inherit directly from other objects, not from classes

**Key concepts:**

- Every object has a prototype (except Object.prototype)
- Prototype chain for property lookup
- `__proto__` vs `prototype`
- Constructor functions vs classes

**Example:**

```javascript
// Constructor function
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(`${this.name} makes a sound`);
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  console.log(`${this.name} barks`);
};

const dog = new Dog('Rex', 'Labrador');
dog.speak(); // 'Rex makes a sound'
dog.bark();  // 'Rex barks'
```

### Q9: Class syntax vs Constructor functions - what's the difference?

**Answer:**

**Classes are syntactic sugar but with differences:**

```javascript
// Constructor function
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function() {
  console.log(`Hello, I'm ${this.name}`);
};

// Class syntax
class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
}
```

**Key differences:**

- Classes must be called with `new` (functions can be called normally)
- Class methods are non-enumerable
- Classes are in strict mode by default
- Classes have better support for inheritance with `extends`
- No hoisting for classes (TDZ)

---

## 5. The `this` Keyword

### Q10: Explain how `this` works in JavaScript

**Answer:**

**`this` depends on how a function is called:**

1. **Global context**: `window` (browser) or `global` (Node.js)
2. **Object method**: The object
3. **Constructor**: The new instance
4. **Arrow function**: Lexical `this` (from enclosing scope)
5. **Explicit binding**: `call`, `apply`, `bind`

**Examples:**

```javascript
// 1. Global
function globalFunc() {
  console.log(this); // window/global
}

// 2. Object method
const obj = {
  name: 'Object',
  greet() {
    console.log(this.name); // 'Object'
  }
};

// 3. Constructor
function Person(name) {
  this.name = name; // this = new instance
}

// 4. Arrow function
const obj2 = {
  name: 'Object',
  greet: () => {
    console.log(this.name); // undefined (lexical this from global)
  },
  greetNested() {
    const arrow = () => console.log(this.name); // 'Object'
    arrow();
  }
};

// 5. Explicit binding
function greet() {
  console.log(`Hello, ${this.name}`);
}
const person = { name: 'John' };
greet.call(person);  // 'Hello, John'
greet.apply(person); // 'Hello, John'
const boundGreet = greet.bind(person);
boundGreet();        // 'Hello, John'
```

---

## 6. ES6+ Features

### Q11: Destructuring - what can you destructure and how?

**Answer:**

```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// Object destructuring
const { name, age, ...others } = { name: 'John', age: 30, city: 'NY', country: 'USA' };
// name = 'John', age = 30, others = { city: 'NY', country: 'USA' }

// Nested destructuring
const user = { name: 'John', address: { city: 'NY', zip: '10001' } };
const { name, address: { city, zip } } = user;

// Default values
const { name = 'Anonymous', age = 0 } = {};

// Renaming
const { name: userName, age: userAge } = { name: 'John', age: 30 };

// Function parameters
function greet({ name, age = 0 }) {
  console.log(`${name} is ${age} years old`);
}
```

### Q12: Spread vs Rest operators

**Answer:**

**Rest (gather)** - collects items into an array:

```javascript
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4); // 10

const [first, ...remaining] = [1, 2, 3, 4];
```

**Spread (scatter)** - expands items from an array/object:

```javascript
// Array spread
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4]

// Object spread
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 3, c: 4 }

// Function arguments
const numbers = [1, 2, 3];
Math.max(...numbers); // 3
```

---

## 7. Memory Management & Performance

### Q13: What are memory leaks and how do you prevent them?

**Answer:**

**Common causes:**

1. Global variables
2. Forgotten timers/intervals
3. Event listeners not removed
4. Closures holding references
5. Detached DOM nodes

**Prevention:**

```javascript
// Bad - memory leak
function createLeak() {
  const huge = new Array(1000000);
  setInterval(() => {
    console.log(huge[0]); // holds reference forever
  }, 1000);
}

// Good - cleanup
function noLeak() {
  const huge = new Array(1000000);
  const interval = setInterval(() => {
    console.log(huge[0]);
  }, 1000);

  // Cleanup after 10 seconds
  setTimeout(() => {
    clearInterval(interval);
  }, 10000);
}

// Event listeners
class Component {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
    document.addEventListener('click', this.handleClick);
  }

  handleClick() {
    console.log('Clicked');
  }

  destroy() {
    // Always cleanup!
    document.removeEventListener('click', this.handleClick);
  }
}
```

---

## 8. Advanced Concepts

### Q14: What is currying and partial application?

**Answer:**

**Currying**: Transform f(a, b, c) into f(a)(b)(c)

```javascript
// Manual curry
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...moreArgs) {
        return curried.apply(this, args.concat(moreArgs));
      };
    }
  };
}

// Usage
function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);
curriedSum(1)(2)(3); // 6
curriedSum(1, 2)(3); // 6
curriedSum(1)(2, 3); // 6
```

**Partial Application**: Fix some arguments

```javascript
function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

// Usage
function greet(greeting, name) {
  return `${greeting}, ${name}!`;
}

const sayHello = partial(greet, 'Hello');
sayHello('John'); // 'Hello, John!'
```

### Q15: Debounce vs Throttle - when to use each?

**Answer:**

**Debounce**: Wait for quiet period before executing

- Use for: search input, window resize, form validation
- Executes after activity stops

**Throttle**: Execute at most once per time period

- Use for: scroll events, mouse movement, button clicks
- Executes at regular intervals during activity

```javascript
// Debounce
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle
function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

---

## 🎯 Quick Fire Questions (Be Ready to Answer)

1. **What's the difference between `==` and `===`?**
   - `==` does type coercion, `===` doesn't

2. **What is hoisting?**
   - Moving declarations to top of scope during compilation

3. **What's the difference between `null` and `undefined`?**
   - `undefined`: variable declared but not assigned
   - `null`: intentional absence of value

4. **What are higher-order functions?**
   - Functions that take functions as arguments or return functions

5. **What is the module pattern?**
   - Design pattern using closures for encapsulation

6. **What's the difference between `.map()` and `.forEach()`?**
   - `.map()` returns new array, `.forEach()` returns undefined

7. **What is event delegation?**
   - Handling events on parent instead of multiple children

8. **What's the difference between deep and shallow copy?**
   - Shallow: copies first level only
   - Deep: copies all nested levels

9. **What is memoization?**
   - Caching function results based on inputs

10. **What are symbols in JavaScript?**
    - Unique, immutable primitive values used as object keys

---

## 9. Data Types - Set, Map, WeakSet, WeakMap

### Q16: Explain Set and Map data structures

**Answer:**

**Set** - Collection of unique values:

```javascript
const set = new Set([1, 2, 3, 3, 4]);
console.log(set); // Set {1, 2, 3, 4}

// Methods
set.add(5);
set.has(3); // true
set.delete(2);
set.size; // 3
set.clear();

// Iteration
for (const value of set) {
  console.log(value);
}

// Use case: Remove duplicates
const arr = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(arr)]; // [1, 2, 3, 4]
```

**Map** - Key-value pairs with any type as key:

```javascript
const map = new Map();

// Any type as key (including objects!)
const keyObj = { id: 1 };
const keyFunc = function() {};

map.set('string', 'value');
map.set(42, 'number key');
map.set(keyObj, 'object key');
map.set(keyFunc, 'function key');

map.get('string'); // 'value'
map.has(42); // true
map.delete('string');
map.size; // 3

// Iteration
for (const [key, value] of map) {
  console.log(key, value);
}

// Convert to/from object
const obj = Object.fromEntries(map);
const mapFromObj = new Map(Object.entries(obj));
```

### Q17: What are WeakSet and WeakMap? When to use them?

**Answer:**

**WeakSet** - Set that holds weak references to objects only:

```javascript
let obj1 = { name: 'John' };
let obj2 = { name: 'Jane' };

const weakSet = new WeakSet([obj1, obj2]);

weakSet.has(obj1); // true
weakSet.delete(obj1);

// When obj is garbage collected, it's automatically removed from WeakSet
obj2 = null; // obj2 can now be garbage collected
```

**Characteristics:**

- Only objects as values (no primitives)
- No iteration (no .size, no .keys(), no .forEach())
- Objects can be garbage collected
- Use for: Tracking objects without preventing garbage collection

**WeakMap** - Map with weak references to keys:

```javascript
const weakMap = new WeakMap();

let user = { name: 'John' };
weakMap.set(user, 'some metadata');

weakMap.get(user); // 'some metadata'
weakMap.has(user); // true

// When user is garbage collected, entry is automatically removed
user = null;
```

**Use cases:**

```javascript
// Private data for objects
const privateData = new WeakMap();

class User {
  constructor(name) {
    privateData.set(this, { password: 'secret' });
    this.name = name;
  }

  checkPassword(pwd) {
    return privateData.get(this).password === pwd;
  }
}

// Cache that doesn't prevent garbage collection
const cache = new WeakMap();

function process(obj) {
  if (!cache.has(obj)) {
    const result = expensiveOperation(obj);
    cache.set(obj, result);
  }
  return cache.get(obj);
}
```

**Set/Map vs WeakSet/WeakMap:**

| Feature            | Set/Map             | WeakSet/WeakMap            |
| ------------------ | ------------------- | -------------------------- |
| Key types          | Any                 | Objects only               |
| Iteration          | ✅                  | ❌                         |
| Size property      | ✅                  | ❌                         |
| Garbage collection | Prevents            | Allows                     |
| Use case           | General collections | Memory-sensitive, metadata |

---

## 10. Object Property Descriptors

### Q18: What are property descriptors and property attributes?

**Answer:**

**Property attributes:**

- **value**: The value of the property
- **writable**: Can the value be changed?
- **enumerable**: Shows up in for...in loops?
- **configurable**: Can descriptor be changed/deleted?

```javascript
const obj = { name: 'John' };

// Get property descriptor
const descriptor = Object.getOwnPropertyDescriptor(obj, 'name');
console.log(descriptor);
// {
//   value: 'John',
//   writable: true,
//   enumerable: true,
//   configurable: true
// }

// Define property with specific attributes
Object.defineProperty(obj, 'age', {
  value: 30,
  writable: false,     // Cannot modify
  enumerable: false,   // Won't show in for...in
  configurable: false  // Cannot delete or reconfigure
});

obj.age = 40; // Silently fails (throws in strict mode)
console.log(obj.age); // 30

delete obj.age; // Fails
console.log(obj.age); // 30

for (let key in obj) {
  console.log(key); // Only 'name' (age is non-enumerable)
}
```

### Q19: Explain getters and setters

**Answer:**

**Getters/Setters** - Accessor properties for controlled access:

```javascript
const user = {
  firstName: 'John',
  lastName: 'Doe',

  // Getter - called when accessing property
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  // Setter - called when setting property
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(' ');
  }
};

console.log(user.fullName); // 'John Doe' (calls getter)
user.fullName = 'Jane Smith'; // Calls setter
console.log(user.firstName); // 'Jane'
console.log(user.lastName);  // 'Smith'
```

**With Object.defineProperty:**

```javascript
const person = {
  _age: 0 // Convention: _ prefix for private
};

Object.defineProperty(person, 'age', {
  get() {
    return this._age;
  },
  set(value) {
    if (value < 0) {
      throw new Error('Age cannot be negative');
    }
    this._age = value;
  },
  enumerable: true,
  configurable: true
});

person.age = 25; // OK
person.age = -5; // Error: Age cannot be negative
```

**Real-world use case:**

```javascript
class Temperature {
  constructor(celsius) {
    this._celsius = celsius;
  }

  get celsius() {
    return this._celsius;
  }

  set celsius(value) {
    this._celsius = value;
  }

  get fahrenheit() {
    return this._celsius * 9/5 + 32;
  }

  set fahrenheit(value) {
    this._celsius = (value - 32) * 5/9;
  }
}

const temp = new Temperature(25);
console.log(temp.celsius);    // 25
console.log(temp.fahrenheit); // 77

temp.fahrenheit = 86;
console.log(temp.celsius);    // 30
```

---

## 11. Regular Expressions (RegExp)

### Q20: Explain RegExp patterns and flags

**Answer:**

**Creating RegExp:**

```javascript
// Literal notation
const regex1 = /pattern/flags;

// Constructor
const regex2 = new RegExp('pattern', 'flags');
```

**Common flags:**

- `g` - Global (find all matches)
- `i` - Case insensitive
- `m` - Multiline
- `s` - Dotall (. matches newlines)
- `u` - Unicode
- `y` - Sticky

**String methods:**

```javascript
const text = 'Hello World, hello world!';

// match() - returns matches
text.match(/hello/gi); // ['Hello', 'hello']

// matchAll() - returns iterator with details
const matches = text.matchAll(/hello/gi);
for (const match of matches) {
  console.log(match.index, match[0]);
}

// test() - returns boolean
/hello/i.test(text); // true

// replace() - replace matches
text.replace(/hello/gi, 'Hi'); // 'Hi World, Hi world!'

// search() - returns index of first match
text.search(/world/i); // 6
```

**Common patterns:**

```javascript
// Character classes
/[abc]/     // Any of a, b, or c
/[^abc]/    // NOT a, b, or c
/[a-z]/     // Any lowercase letter
/[0-9]/     // Any digit
/\d/        // Digit (same as [0-9])
/\D/        // Non-digit
/\w/        // Word character [a-zA-Z0-9_]
/\W/        // Non-word character
/\s/        // Whitespace
/\S/        // Non-whitespace

// Quantifiers
/a*/        // 0 or more 'a'
/a+/        // 1 or more 'a'
/a?/        // 0 or 1 'a'
/a{3}/      // Exactly 3 'a'
/a{2,5}/    // 2 to 5 'a'
/a{2,}/     // 2 or more 'a'

// Anchors
/^start/    // Start of string
/end$/      // End of string
/\b/        // Word boundary

// Groups
/(abc)/     // Capturing group
/(?:abc)/   // Non-capturing group
/a|b/       // OR
```

**Practical examples:**

```javascript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
emailRegex.test('user@example.com'); // true

// Phone number
const phoneRegex = /^\+?[\d\s-()]+$/;
phoneRegex.test('+1 (555) 123-4567'); // true

// Extract URLs
const urlRegex = /https?:\/\/[^\s]+/g;
const text = 'Visit https://example.com and http://test.com';
text.match(urlRegex); // ['https://example.com', 'http://test.com']

// Validate password (8+ chars, 1 uppercase, 1 lowercase, 1 number)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
passwordRegex.test('Password1'); // true

// Replace with groups
const name = 'Doe, John';
name.replace(/(\w+), (\w+)/, '$2 $1'); // 'John Doe'
```

**Greedy vs Lazy:**

```javascript
const html = '<div>First</div><div>Second</div>';

// Greedy (default) - matches as much as possible
html.match(/<div>.*<\/div>/)[0];
// '<div>First</div><div>Second</div>' (entire string)

// Lazy - matches as little as possible
html.match(/<div>.*?<\/div>/)[0];
// '<div>First</div>' (first match only)
```

---

## 12. Iterators and Generators

### Q21: What are iterators and how do they work?

**Answer:**

**Iterator** - Object with `next()` method that returns `{value, done}`:

```javascript
// Custom iterator
const range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    return {
      current: this.from,
      last: this.to,

      next() {
        if (this.current <= this.last) {
          return { value: this.current++, done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
};

// Use with for...of
for (let num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}

// Manual iteration
const iterator = range[Symbol.iterator]();
console.log(iterator.next()); // {value: 1, done: false}
console.log(iterator.next()); // {value: 2, done: false}
```

**Built-in iterables:**

- Arrays, Strings, Maps, Sets, TypedArrays
- DOM collections (NodeList)

```javascript
const arr = [1, 2, 3];
const iterator = arr[Symbol.iterator]();

console.log(iterator.next()); // {value: 1, done: false}
console.log(iterator.next()); // {value: 2, done: false}
console.log(iterator.next()); // {value: 3, done: false}
console.log(iterator.next()); // {value: undefined, done: true}
```

### Q22: Explain generators and the yield keyword

**Answer:**

**Generator** - Function that can pause/resume execution using `yield`:

```javascript
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGenerator();

console.log(gen.next()); // {value: 1, done: false}
console.log(gen.next()); // {value: 2, done: false}
console.log(gen.next()); // {value: 3, done: false}
console.log(gen.next()); // {value: undefined, done: true}

// Use with for...of
for (let num of numberGenerator()) {
  console.log(num); // 1, 2, 3
}
```

**Generator with parameters:**

```javascript
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

for (let num of range(1, 5)) {
  console.log(num); // 1, 2, 3, 4, 5
}
```

**Passing values to generators:**

```javascript
function* twoWayGenerator() {
  const a = yield 'First yield';
  console.log('Received:', a);

  const b = yield 'Second yield';
  console.log('Received:', b);

  return 'Done';
}

const gen = twoWayGenerator();

console.log(gen.next());        // {value: 'First yield', done: false}
console.log(gen.next('Hello')); // Logs: 'Received: Hello'
                                // {value: 'Second yield', done: false}
console.log(gen.next('World')); // Logs: 'Received: World'
                                // {value: 'Done', done: true}
```

**Practical use cases:**

```javascript
// Infinite sequence
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();
console.log(fib.next().value); // 0
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
console.log(fib.next().value); // 3

// ID generator
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const generateId = idGenerator();
console.log(generateId.next().value); // 1
console.log(generateId.next().value); // 2

// Async operations
function* fetchUsers() {
  const response = yield fetch('/api/users');
  const users = yield response.json();
  return users;
}

// yield* for delegating to another generator
function* gen1() {
  yield 1;
  yield 2;
}

function* gen2() {
  yield* gen1();
  yield 3;
}

console.log([...gen2()]); // [1, 2, 3]
```

---

## 13. Error Handling

### Q23: Explain error handling in JavaScript

**Answer:**

**Try-Catch-Finally:**

```javascript
try {
  // Code that might throw error
  const data = JSON.parse(invalidJSON);
} catch (error) {
  // Handle error
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
} finally {
  // Always executes (cleanup)
  console.log('Cleanup');
}
```

**Custom Errors:**

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
  }
}

// Usage
function validateUser(user) {
  if (!user.email) {
    throw new ValidationError('Email is required', 'email');
  }
  if (!user.email.includes('@')) {
    throw new ValidationError('Invalid email format', 'email');
  }
}

try {
  validateUser({ name: 'John' });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Validation error in ${error.field}: ${error.message}`);
  } else {
    throw error; // Re-throw unknown errors
  }
}
```

**Error Types:**

```javascript
// ReferenceError
console.log(undefinedVariable); // ReferenceError

// TypeError
null.toString(); // TypeError

// SyntaxError
eval('const x ='); // SyntaxError

// RangeError
new Array(-1); // RangeError

// URIError
decodeURIComponent('%'); // URIError
```

**Async Error Handling:**

```javascript
// Promise error handling
fetch('/api/data')
  .then(res => res.json())
  .catch(error => console.error('Fetch error:', error))
  .finally(() => console.log('Request complete'));

// Async/await error handling
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new NetworkError('Failed to fetch', response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof NetworkError) {
      console.error(`Network error ${error.statusCode}: ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error; // Re-throw for caller to handle
  }
}

// Global error handlers
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
```

---

## 14. Modules (CommonJS vs ES6)

### Q24: Explain module systems in JavaScript

**Answer:**

**CommonJS (Node.js):**

```javascript
// math.js - Export
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// OR export individual functions
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;

// app.js - Import
const math = require('./math');
console.log(math.add(2, 3)); // 5

// Destructure import
const { add, subtract } = require('./math');
console.log(add(2, 3)); // 5
```

**ES6 Modules (ESM):**

```javascript
// math.js - Named exports
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// OR export object
export { add, subtract };

// Default export
export default class Calculator {
  add(a, b) { return a + b; }
}

// app.js - Import
import { add, subtract } from './math.js';
import Calculator from './math.js';

// Import all as namespace
import * as math from './math.js';
console.log(math.add(2, 3));

// Rename imports
import { add as sum } from './math.js';

// Side-effect import
import './polyfills.js';
```

**Differences:**

| Feature         | CommonJS                   | ES6 Modules         |
| --------------- | -------------------------- | ------------------- |
| Syntax          | `require`/`module.exports` | `import`/`export`   |
| Loading         | Synchronous                | Asynchronous        |
| When loaded     | Runtime                    | Compile time        |
| Tree shaking    | No                         | Yes                 |
| Top-level await | No                         | Yes (with flag)     |
| This value      | `module.exports`           | `undefined`         |
| Dynamic imports | `require()` anywhere       | `import()` function |
| Browser support | No (needs bundler)         | Yes (modern)        |

**Dynamic Imports:**

```javascript
// ES6 dynamic import
async function loadModule() {
  const module = await import('./math.js');
  console.log(module.add(2, 3));
}

// Conditional loading
if (condition) {
  import('./heavy-module.js').then(module => {
    module.init();
  });
}

// CommonJS dynamic require
const moduleName = getUserChoice();
const module = require(`./${moduleName}`);
```

---

## 15. Strict Mode

### Q25: What is strict mode and why use it?

**Answer:**

**Strict Mode**: Opt-in to restricted JavaScript variant

```javascript
'use strict';

// Entire script in strict mode
```

**What Strict Mode Does:**

```javascript
'use strict';

// 1. Prevents accidental globals
x = 10; // ReferenceError (without strict: creates global)

// 2. Prevents duplicate parameter names
function sum(a, a, c) { // SyntaxError
  return a + a + c;
}

// 3. Makes assignments to non-writable properties throw
const obj = {};
Object.defineProperty(obj, 'x', { value: 42, writable: false });
obj.x = 9; // TypeError

// 4. Prevents deleting undeletable properties
delete Object.prototype; // TypeError

// 5. Requires all property names in object literals to be unique
const obj2 = { p: 1, p: 2 }; // SyntaxError (in old browsers)

// 6. Forbids octal syntax
const num = 010; // SyntaxError

// 7. Forbids with statement
with (obj) { } // SyntaxError

// 8. eval doesn't create variables in surrounding scope
eval('var x = 10');
console.log(x); // ReferenceError

// 9. 'this' is undefined in functions (not global object)
function test() {
  console.log(this); // undefined (without strict: window/global)
}
test();

// 10. Reserved words for future use
const let = 1; // SyntaxError
const static = 2; // SyntaxError
```

**Function-level strict mode:**

```javascript
function strictFunction() {
  'use strict';
  // Only this function is in strict mode
  x = 10; // Error
}

function normalFunction() {
  x = 10; // OK, creates global (bad practice!)
}
```

---

## 16. Type Coercion & Equality

### Q26: Explain type coercion and == vs ===

**Answer:**

**Type Coercion**: Automatic type conversion

```javascript
// Implicit coercion
console.log('5' + 3);      // '53' (number to string)
console.log('5' - 3);      // 2 (string to number)
console.log('5' * '2');    // 10 (both to number)
console.log(true + 1);     // 2 (boolean to number)
console.log(false + 1);    // 1
console.log('5' + null);   // '5null'
console.log('5' + undefined); // '5undefined'

// Truthy/Falsy
if ('0') {
  console.log('Truthy'); // Executes (non-empty string is truthy)
}

// Falsy values: false, 0, '', null, undefined, NaN
// Everything else is truthy!
```

**== vs ===:**

```javascript
// == (loose equality) - performs type coercion
console.log(5 == '5');     // true (string converted to number)
console.log(null == undefined); // true
console.log(0 == false);   // true
console.log('' == false);  // true
console.log([1] == 1);     // true

// === (strict equality) - no type coercion
console.log(5 === '5');    // false
console.log(null === undefined); // false
console.log(0 === false);  // false

// Special cases
console.log(NaN == NaN);   // false (use Number.isNaN())
console.log(NaN === NaN);  // false
console.log(Object.is(NaN, NaN)); // true

// Objects compare by reference
console.log({} == {});     // false (different objects)
console.log({} === {});    // false
const obj = {};
console.log(obj === obj);  // true (same reference)
```

**Explicit Coercion:**

```javascript
// To Number
Number('42');      // 42
+'42';             // 42
parseInt('42px');  // 42
parseFloat('42.5px'); // 42.5

// To String
String(42);        // '42'
42 + '';           // '42'
42.toString();     // '42'

// To Boolean
Boolean(1);        // true
!!1;               // true
Boolean('');       // false
!!'text';          // true
```

---

## 17. Array Methods (Complete)

### Q27: Explain array methods in depth

**Answer:**

**Iteration Methods:**

```javascript
const arr = [1, 2, 3, 4, 5];

// forEach - Execute function for each element
arr.forEach((item, index, array) => {
  console.log(item, index);
});

// map - Create new array with transformed elements
const doubled = arr.map(x => x * 2); // [2, 4, 6, 8, 10]

// filter - Create new array with elements that pass test
const evens = arr.filter(x => x % 2 === 0); // [2, 4]

// reduce - Reduce array to single value
const sum = arr.reduce((acc, curr) => acc + curr, 0); // 15

// reduceRight - Same as reduce but right-to-left
const result = [1, 2, 3].reduceRight((acc, curr) => acc - curr); // 0

// every - Check if ALL elements pass test
const allPositive = arr.every(x => x > 0); // true

// some - Check if ANY element passes test
const hasEven = arr.some(x => x % 2 === 0); // true

// find - Return first element that passes test
const firstEven = arr.find(x => x % 2 === 0); // 2

// findIndex - Return index of first element that passes test
const firstEvenIndex = arr.findIndex(x => x % 2 === 0); // 1

// findLast - Return last element that passes test (ES2023)
const lastEven = arr.findLast(x => x % 2 === 0); // 4

// findLastIndex - Return index of last element (ES2023)
const lastEvenIndex = arr.findLastIndex(x => x % 2 === 0); // 3
```

**Modification Methods:**

```javascript
const arr = [1, 2, 3];

// push - Add to end (mutates)
arr.push(4, 5); // [1, 2, 3, 4, 5]

// pop - Remove from end (mutates)
const last = arr.pop(); // 5, arr = [1, 2, 3, 4]

// unshift - Add to beginning (mutates)
arr.unshift(0); // [0, 1, 2, 3, 4]

// shift - Remove from beginning (mutates)
const first = arr.shift(); // 0, arr = [1, 2, 3, 4]

// splice - Add/remove elements at index (mutates)
arr.splice(1, 2, 'a', 'b'); // [1, 'a', 'b', 4]

// slice - Extract portion (non-mutating)
const portion = arr.slice(1, 3); // ['a', 'b']

// concat - Merge arrays (non-mutating)
const merged = [1, 2].concat([3, 4], [5]); // [1, 2, 3, 4, 5]

// reverse - Reverse array (mutates)
[1, 2, 3].reverse(); // [3, 2, 1]

// sort - Sort array (mutates)
[3, 1, 2].sort(); // [1, 2, 3]
[3, 1, 11, 2].sort((a, b) => a - b); // [1, 2, 3, 11]

// fill - Fill with value (mutates)
new Array(3).fill(0); // [0, 0, 0]

// copyWithin - Copy elements within array (mutates)
[1, 2, 3, 4, 5].copyWithin(0, 3); // [4, 5, 3, 4, 5]
```

**Search Methods:**

```javascript
const arr = [1, 2, 3, 2, 1];

// indexOf - First index of element
arr.indexOf(2); // 1

// lastIndexOf - Last index of element
arr.lastIndexOf(2); // 3

// includes - Check if element exists
arr.includes(2); // true
```

**Modern Array Methods:**

```javascript
// flat - Flatten nested arrays
[1, [2, [3, [4]]]].flat(); // [1, 2, [3, [4]]]
[1, [2, [3, [4]]]].flat(2); // [1, 2, 3, [4]]
[1, [2, [3, [4]]]].flat(Infinity); // [1, 2, 3, 4]

// flatMap - Map then flat(1)
[1, 2, 3].flatMap(x => [x, x * 2]); // [1, 2, 2, 4, 3, 6]

// from - Create array from iterable
Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']
Array.from({ length: 3 }, (_, i) => i); // [0, 1, 2]

// of - Create array from arguments
Array.of(1, 2, 3); // [1, 2, 3]

// isArray - Check if array
Array.isArray([1, 2]); // true
Array.isArray('text'); // false

// at - Access element (supports negative index)
[1, 2, 3].at(-1); // 3
[1, 2, 3].at(1); // 2

// toSorted - Sort without mutation (ES2023)
const arr2 = [3, 1, 2];
const sorted = arr2.toSorted(); // [1, 2, 3], arr2 unchanged

// toReversed - Reverse without mutation (ES2023)
const reversed = arr2.toReversed(); // [2, 1, 3], arr2 unchanged

// toSpliced - Splice without mutation (ES2023)
const spliced = arr2.toSpliced(1, 1, 'a'); // [3, 'a', 2], arr2 unchanged

// with - Replace element without mutation (ES2023)
const replaced = arr2.with(1, 'x'); // [3, 'x', 2], arr2 unchanged
```

---

## 18. Object Methods (Complete)

### Q28: Explain object methods in depth

**Answer:**

**Object.keys/values/entries:**

```javascript
const obj = { name: 'John', age: 30, city: 'NYC' };

// Object.keys - Array of keys
Object.keys(obj); // ['name', 'age', 'city']

// Object.values - Array of values
Object.values(obj); // ['John', 30, 'NYC']

// Object.entries - Array of [key, value] pairs
Object.entries(obj); // [['name', 'John'], ['age', 30], ['city', 'NYC']]

// Convert back to object
const entries = Object.entries(obj);
const newObj = Object.fromEntries(entries); // { name: 'John', age: 30, city: 'NYC' }
```

**Object.assign:**

```javascript
// Shallow copy
const source = { a: 1, b: 2 };
const copy = Object.assign({}, source); // { a: 1, b: 2 }

// Merge objects (later overwrites earlier)
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const merged = Object.assign({}, obj1, obj2); // { a: 1, b: 3, c: 4 }

// Modern alternative: spread
const merged2 = { ...obj1, ...obj2 }; // { a: 1, b: 3, c: 4 }
```

**Object.freeze/seal:**

```javascript
const obj = { name: 'John', age: 30 };

// Object.freeze - No modifications allowed
Object.freeze(obj);
obj.name = 'Jane'; // Silently fails (error in strict mode)
obj.city = 'NYC'; // Can't add
delete obj.age; // Can't delete
console.log(obj); // { name: 'John', age: 30 }

// Check if frozen
Object.isFrozen(obj); // true

// Object.seal - Can modify existing, can't add/delete
const obj2 = { name: 'John', age: 30 };
Object.seal(obj2);
obj2.name = 'Jane'; // OK
obj2.city = 'NYC'; // Can't add
delete obj2.age; // Can't delete
console.log(obj2); // { name: 'Jane', age: 30 }

// Check if sealed
Object.isSealed(obj2); // true

// Object.preventExtensions - Can modify/delete, can't add
const obj3 = { name: 'John' };
Object.preventExtensions(obj3);
obj3.name = 'Jane'; // OK
obj3.age = 30; // Can't add
delete obj3.name; // Can delete
```

**Object.create:**

```javascript
// Create object with specific prototype
const proto = {
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};

const obj = Object.create(proto);
obj.name = 'John';
obj.greet(); // 'Hello, John'

// Create object with null prototype (no inherited properties)
const noProto = Object.create(null);
noProto.toString; // undefined (no inherited methods)
```

**Object.getOwnPropertyDescriptor(s):**

```javascript
const obj = { name: 'John' };

// Get single property descriptor
const descriptor = Object.getOwnPropertyDescriptor(obj, 'name');
// { value: 'John', writable: true, enumerable: true, configurable: true }

// Get all property descriptors
const descriptors = Object.getOwnPropertyDescriptors(obj);
```

**Object.getPrototypeOf/setPrototypeOf:**

```javascript
const obj = {};
const proto = { greet() { console.log('Hello'); } };

// Set prototype
Object.setPrototypeOf(obj, proto);

// Get prototype
Object.getPrototypeOf(obj) === proto; // true

// Better: Use Object.create instead of setPrototypeOf
const obj2 = Object.create(proto);
```

**Object.is:**

```javascript
// Similar to === but handles edge cases
Object.is(NaN, NaN); // true (NaN === NaN is false)
Object.is(+0, -0); // false (+0 === -0 is true)
Object.is(5, 5); // true
Object.is(5, '5'); // false
```

**Object.hasOwn (ES2022):**

```javascript
const obj = { name: 'John' };

// Better alternative to hasOwnProperty
Object.hasOwn(obj, 'name'); // true
Object.hasOwn(obj, 'toString'); // false (inherited)

// Old way (still works)
obj.hasOwnProperty('name'); // true
```

---

## 19. Classes (Deep Dive)

### Q29: Explain JavaScript classes in depth

**Answer:**

**Class Basics:**

```javascript
class Person {
  // Public field (ES2022)
  name = 'Unknown';

  // Private field (ES2022)
  #age = 0;

  // Static field
  static species = 'Homo sapiens';

  // Constructor
  constructor(name, age) {
    this.name = name;
    this.#age = age;
  }

  // Method
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }

  // Getter
  get age() {
    return this.#age;
  }

  // Setter
  set age(value) {
    if (value < 0) throw new Error('Age must be positive');
    this.#age = value;
  }

  // Private method
  #validateAge(age) {
    return age >= 0 && age <= 150;
  }

  // Static method
  static create(name, age) {
    return new Person(name, age);
  }

  // Static block (ES2022)
  static {
    console.log('Class initialized');
  }
}

const person = new Person('John', 30);
person.greet(); // 'Hello, I'm John'
console.log(person.age); // 30 (via getter)
person.age = 31; // Via setter
// person.#age; // SyntaxError: Private field
```

**Inheritance:**

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Must call super first!
    this.breed = breed;
  }

  speak() {
    super.speak(); // Call parent method
    console.log(`${this.name} barks`);
  }
}

const dog = new Dog('Rex', 'Labrador');
dog.speak();
// 'Rex makes a sound'
// 'Rex barks'
```

**Class vs Constructor Function:**

```javascript
// Constructor function (old way)
function PersonOld(name) {
  this.name = name;
}
PersonOld.prototype.greet = function() {
  console.log(`Hello, I'm ${this.name}`);
};

// Class (new way) - syntactic sugar
class PersonNew {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
}

// Key differences:
// 1. Classes must be called with 'new'
PersonNew(); // TypeError
PersonOld(); // Works but creates global (bad!)

// 2. Class methods are non-enumerable
for (let key in new PersonOld('John')) {
  console.log(key); // 'name', 'greet'
}
for (let key in new PersonNew('John')) {
  console.log(key); // 'name' only
}

// 3. Classes are in strict mode by default
// 4. Classes are not hoisted
```

---

## 20. Proxy and Reflect

### Q30: Explain Proxy and Reflect APIs

**Answer:**

**Proxy**: Intercept and customize operations

```javascript
const target = {
  name: 'John',
  age: 30
};

const handler = {
  // Intercept property access
  get(target, prop) {
    console.log(`Getting ${prop}`);
    return target[prop];
  },

  // Intercept property assignment
  set(target, prop, value) {
    console.log(`Setting ${prop} to ${value}`);
    if (prop === 'age' && typeof value !== 'number') {
      throw new TypeError('Age must be a number');
    }
    target[prop] = value;
    return true; // Indicate success
  },

  // Intercept 'in' operator
  has(target, prop) {
    console.log(`Checking ${prop}`);
    return prop in target;
  },

  // Intercept delete
  deleteProperty(target, prop) {
    console.log(`Deleting ${prop}`);
    delete target[prop];
    return true;
  },

  // Intercept function call
  apply(target, thisArg, args) {
    console.log('Function called');
    return target.apply(thisArg, args);
  }
};

const proxy = new Proxy(target, handler);

proxy.name; // 'Getting name' -> 'John'
proxy.age = 31; // 'Setting age to 31'
'name' in proxy; // 'Checking name' -> true
delete proxy.age; // 'Deleting age'
```

**Reflect**: Companion API to Proxy

```javascript
const obj = { name: 'John', age: 30 };

// Reflect methods mirror Proxy traps
Reflect.get(obj, 'name'); // 'John'
Reflect.set(obj, 'age', 31); // true
Reflect.has(obj, 'name'); // true
Reflect.deleteProperty(obj, 'age'); // true

// Useful in Proxy handlers
const handler2 = {
  get(target, prop, receiver) {
    console.log(`Getting ${prop}`);
    return Reflect.get(target, prop, receiver);
  },

  set(target, prop, value, receiver) {
    console.log(`Setting ${prop}`);
    return Reflect.set(target, prop, value, receiver);
  }
};
```

**Practical Use Cases:**

```javascript
// Validation proxy
function createValidatedObject(obj, validators) {
  return new Proxy(obj, {
    set(target, prop, value) {
      if (prop in validators) {
        if (!validators[prop](value)) {
          throw new Error(`Invalid value for ${prop}`);
        }
      }
      target[prop] = value;
      return true;
    }
  });
}

const user = createValidatedObject({}, {
  age: (value) => typeof value === 'number' && value >= 0 && value <= 150,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
});

user.age = 30; // OK
user.age = -5; // Error
user.email = 'john@example.com'; // OK

// Negative array indexes
function createNegativeIndexArray(arr) {
  return new Proxy(arr, {
    get(target, prop) {
      const index = Number(prop);
      if (index < 0) {
        prop = target.length + index;
      }
      return Reflect.get(target, prop);
    }
  });
}

const arr = createNegativeIndexArray([1, 2, 3, 4, 5]);
arr[-1]; // 5
arr[-2]; // 4
```

---

## 21. Modern JavaScript Features

### Q31: Explain Nullish Coalescing, Optional Chaining, and other modern features

**Answer:**

**Nullish Coalescing (??):**

```javascript
// Returns right side if left is null/undefined
const value1 = null ?? 'default'; // 'default'
const value2 = undefined ?? 'default'; // 'default'
const value3 = 0 ?? 'default'; // 0 (not null/undefined)
const value4 = '' ?? 'default'; // '' (not null/undefined)
const value5 = false ?? 'default'; // false (not null/undefined)

// vs || operator
const value6 = 0 || 'default'; // 'default' (0 is falsy)
const value7 = '' || 'default'; // 'default' ('' is falsy)

// Use case
const config = {
  timeout: 0,
  retries: null
};

const timeout = config.timeout ?? 3000; // 0 (not null/undefined)
const retries = config.retries ?? 3; // 3 (null)
```

**Optional Chaining (?.):**

```javascript
const user = {
  name: 'John',
  address: {
    city: 'NYC'
    // No 'zip' property
  }
};

// Safe property access
const zip = user.address?.zip; // undefined (no error)
const country = user.address?.country?.code; // undefined

// Safe method call
const result = user.getName?.(); // undefined (method doesn't exist)

// Safe array access
const firstItem = user.items?.[0]; // undefined

// Combining with nullish coalescing
const city = user.address?.city ?? 'Unknown'; // 'NYC'
const zip2 = user.address?.zip ?? '00000'; // '00000'

// Old way (verbose)
const zipOld = user && user.address && user.address.zip;
```

**Template Literals:**

```javascript
const name = 'John';
const age = 30;

// String interpolation
const greeting = `Hello, ${name}!`; // 'Hello, John!'

// Multi-line strings
const multiline = `
  Line 1
  Line 2
  Line 3
`;

// Expression evaluation
const message = `You are ${age >= 18 ? 'an adult' : 'a minor'}`;

// Tagged templates
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? `<mark>${values[i]}</mark>` : '');
  }, '');
}

const highlighted = highlight`Hello ${name}, you are ${age} years old`;
// 'Hello <mark>John</mark>, you are <mark>30</mark> years old'
```

**BigInt:**

```javascript
// For integers larger than Number.MAX_SAFE_INTEGER
const big1 = 9007199254740991n; // 'n' suffix
const big2 = BigInt('9007199254740991');

// Operations
const sum = big1 + 1n; // 9007199254740992n
const product = big1 * 2n;

// Can't mix with regular numbers
big1 + 1; // TypeError
big1 + BigInt(1); // OK

// Comparison works
big1 > 1000n; // true
big1 === 9007199254740991n; // true

// Use cases: timestamps, IDs, cryptography
const timestamp = BigInt(Date.now()) * 1000000n; // Nanosecond precision
```

**Numeric Separators:**

```javascript
// Improve readability
const billion = 1_000_000_000;
const bytes = 0xFF_FF_FF_FF;
const price = 19_99.99;

console.log(billion); // 1000000000
```

**Logical Assignment Operators:**

```javascript
// ||= - Assign if falsy
let x = 0;
x ||= 10; // x = 10 (0 is falsy)

// &&= - Assign if truthy
let y = 5;
y &&= 10; // y = 10 (5 is truthy)

// ??= - Assign if null/undefined
let z = null;
z ??= 10; // z = 10 (null)

// Useful for object properties
const config = { timeout: 0 };
config.timeout ??= 3000; // timeout stays 0
config.retries ??= 3; // retries = 3 (undefined)
```

---

## 22. IIFE (Immediately Invoked Function Expression)

### Q32: Explain IIFE pattern and its use cases

**Answer:**

**IIFE Syntax:**

```javascript
// Function expression wrapped in parentheses and immediately invoked
(function() {
  console.log('IIFE executed');
})();

// Alternative syntax
(function() {
  console.log('Also IIFE');
}());

// Arrow function IIFE
(() => {
  console.log('Arrow IIFE');
})();

// With parameters
(function(name) {
  console.log(`Hello, ${name}`);
})('John');

// Named IIFE (for recursion or stack traces)
(function fibonacci(n) {
  return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
})(10);
```

**Use Cases:**

```javascript
// 1. Create private scope (before ES6 modules)
const counter = (function() {
  let count = 0; // Private variable

  return {
    increment() { return ++count; },
    decrement() { return --count; },
    getCount() { return count; }
  };
})();

counter.increment(); // 1
counter.increment(); // 2
// counter.count; // undefined (private)

// 2. Avoid polluting global scope
(function() {
  var helper = function() { /* ... */ };
  var data = [1, 2, 3];
  // Variables only exist in this scope
})();
// console.log(helper); // ReferenceError

// 3. Module pattern (pre-ES6)
const calculator = (function() {
  // Private
  const add = (a, b) => a + b;
  const subtract = (a, b) => a - b;

  // Public API
  return {
    add,
    subtract
  };
})();

calculator.add(2, 3); // 5

// 4. Initialization code
(function init() {
  const config = loadConfig();
  setupEventListeners();
  initializeApp(config);
})();

// 5. Capture loop variable (before let/const)
for (var i = 0; i < 5; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}
// Prints: 0, 1, 2, 3, 4

// Modern alternative with let
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100);
}
```

---

## 23. Recursion and Optimization

### Q33: Explain recursion and tail call optimization

**Answer:**

**Recursion Basics:**

```javascript
// Base case + recursive case
function factorial(n) {
  // Base case
  if (n <= 1) return 1;

  // Recursive case
  return n * factorial(n - 1);
}

factorial(5); // 120
// Call stack: 5 * 4 * 3 * 2 * 1

// Fibonacci
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

fibonacci(7); // 13
// Very inefficient: O(2^n)
```

**Common Recursion Patterns:**

```javascript
// Array sum
function sum(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sum(arr.slice(1));
}

// Tree traversal
function traverse(node) {
  if (!node) return;
  console.log(node.value);
  node.children?.forEach(child => traverse(child));
}

// Flatten nested array
function flatten(arr) {
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

flatten([1, [2, [3, [4]]]]); // [1, 2, 3, 4]
```

**Tail Call Optimization (TCO):**

```javascript
// NOT tail recursive (operation after recursive call)
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // Multiplication AFTER call
}

// Tail recursive (recursive call is last operation)
function factorialTail(n, acc = 1) {
  if (n <= 1) return acc;
  return factorialTail(n - 1, n * acc); // No operation after call
}

factorialTail(5); // 120
// Can be optimized to iteration by compiler

// Fibonacci with TCO
function fibonacciTail(n, a = 0, b = 1) {
  if (n === 0) return a;
  return fibonacciTail(n - 1, b, a + b);
}

fibonacciTail(7); // 13
```

**Memoization (Optimization Technique):**

```javascript
// Cache results to avoid recalculation
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Memoized fibonacci
const fibonacciMemo = memoize(function(n) {
  if (n <= 1) return n;
  return fibonacciMemo(n - 1) + fibonacciMemo(n - 2);
});

fibonacciMemo(50); // Fast! O(n) instead of O(2^n)

// Manual memoization
function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}
```

**When to Use Recursion:**

```javascript
// Good use cases:
// 1. Tree/graph traversal
// 2. Divide and conquer algorithms
// 3. Backtracking problems
// 4. Mathematical sequences
// 5. Nested data structures

// When to avoid:
// 1. Simple iteration is clearer
// 2. Stack overflow risk (deep recursion)
// 3. Performance critical code (unless TCO)

// Example: Deep object clone
function deepClone(obj, seen = new WeakMap()) {
  // Handle primitives
  if (obj === null || typeof obj !== 'object') return obj;

  // Handle circular references
  if (seen.has(obj)) return seen.get(obj);

  // Handle arrays
  if (Array.isArray(obj)) {
    const arr = [];
    seen.set(obj, arr);
    obj.forEach((item, i) => {
      arr[i] = deepClone(item, seen);
    });
    return arr;
  }

  // Handle objects
  const cloned = {};
  seen.set(obj, cloned);
  Object.keys(obj).forEach(key => {
    cloned[key] = deepClone(obj[key], seen);
  });
  return cloned;
}
```

---

## 24. Temporal Dead Zone (TDZ)

### Q34: Explain the Temporal Dead Zone

**Answer:**

**TDZ Definition**: Period between entering scope and variable declaration

```javascript
// let/const have TDZ
{
  // TDZ starts
  console.log(x); // ReferenceError: Cannot access 'x' before initialization

  let x = 10; // TDZ ends
  console.log(x); // 10
}

// var doesn't have TDZ (hoisted with undefined)
{
  console.log(y); // undefined (not ReferenceError)
  var y = 10;
  console.log(y); // 10
}
```

**TDZ Examples:**

```javascript
// Function parameters
function test(a = b, b = 2) {
  // Error: 'b' in TDZ when 'a' is initialized
  return a + b;
}

test(); // ReferenceError

// Correct order
function testCorrect(b = 2, a = b) {
  return a + b; // OK
}

testCorrect(); // 4

// Class TDZ
const instance = new MyClass(); // ReferenceError

class MyClass {
  constructor() {
    this.name = 'Test';
  }
}

// typeof in TDZ
console.log(typeof undeclaredVar); // 'undefined' (no error)
console.log(typeof x); // ReferenceError (x in TDZ)
let x = 10;

// Function hoisting vs TDZ
greet(); // OK - function declarations are fully hoisted

function greet() {
  console.log('Hello');
}

greet2(); // ReferenceError - in TDZ

const greet2 = function() {
  console.log('Hello');
};
```

**Why TDZ Exists:**

```javascript
// Prevents using variables before initialization
let x = x + 1; // ReferenceError (x in TDZ on right side)

// Catches errors early
if (true) {
  // This would be confusing without TDZ
  console.log(value); // ReferenceError
  let value = 10;
}

// const requires initialization
const a; // SyntaxError: Missing initializer
a = 10;

const b = 10; // OK
```

---

## 25. Memory Leaks (Detailed)

### Q35: Explain common memory leak patterns and prevention

**Answer:**

**1. Global Variables:**

```javascript
// Memory leak - creates global
function createLeak() {
  leak = 'I am global!'; // No var/let/const
}

createLeak();
console.log(window.leak); // Accessible globally

// Fix: Use strict mode + proper declaration
'use strict';
function noLeak() {
  let notLeak = 'I am local';
}
```

**2. Forgotten Timers:**

```javascript
// Memory leak
const data = new Array(1000000).fill('data');

setInterval(() => {
  console.log(data); // References data forever
}, 1000);

// Fix: Clear when done
const data2 = new Array(1000000).fill('data');
const intervalId = setInterval(() => {
  console.log(data2);
}, 1000);

// Clear when component unmounts or condition met
clearInterval(intervalId);

// React example
useEffect(() => {
  const id = setInterval(() => {
    // ...
  }, 1000);

  return () => clearInterval(id); // Cleanup
}, []);
```

**3. Event Listeners:**

```javascript
// Memory leak
const element = document.getElementById('button');
const handler = () => console.log('Clicked');

element.addEventListener('click', handler);
// Element removed but listener persists
document.body.removeChild(element); // Leak!

// Fix: Remove listeners before removing elements
element.removeEventListener('click', handler);
document.body.removeChild(element);

// Or use AbortController (modern)
const controller = new AbortController();

element.addEventListener('click', handler, {
  signal: controller.signal
});

// Remove all listeners at once
controller.abort();
```

**4. Closures Holding References:**

```javascript
// Memory leak
function createClosure() {
  const largeData = new Array(1000000).fill('data');

  return function() {
    // Even if not using largeData, it's kept in memory
    console.log('Hello');
  };
}

const fn = createClosure(); // largeData stays in memory

// Fix: Don't capture unnecessary variables
function createClosureFixed() {
  const largeData = new Array(1000000).fill('data');
  const needed = largeData[0]; // Extract only what's needed

  return function() {
    console.log(needed); // Only 'needed' kept in memory
  };
}
```

**5. Detached DOM Nodes:**

```javascript
// Memory leak
let elements = [];

function createElement() {
  const div = document.createElement('div');
  div.id = 'temp';
  document.body.appendChild(div);
  elements.push(div); // Reference kept

  document.body.removeChild(div); // Removed from DOM but still in array
}

// Fix: Clear references
function createElementFixed() {
  const div = document.createElement('div');
  document.body.appendChild(div);

  // Use WeakSet/WeakMap or clear reference
  document.body.removeChild(div);
  // div = null; // Clear reference
}
```

**6. Circular References (rare in modern JS):**

```javascript
// Potential leak in old browsers
function createCircular() {
  const obj1 = {};
  const obj2 = {};

  obj1.ref = obj2;
  obj2.ref = obj1; // Circular

  return 'done';
}

// Modern JS garbage collectors handle this fine
// But be careful with DOM + JS circular refs in old browsers

// Fix: Break circles when done
obj1.ref = null;
obj2.ref = null;
```

**7. Cache Without Limits:**

```javascript
// Memory leak - cache grows forever
const cache = {};

function getCachedData(key) {
  if (!cache[key]) {
    cache[key] = expensiveOperation(key);
  }
  return cache[key];
}

// Fix: Use Map with size limit
class LRUCache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;

    // Move to end (most recent)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, value);

    // Remove oldest if over limit
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

// Or use WeakMap for automatic cleanup
const weakCache = new WeakMap();
weakCache.set(obj, data); // Automatically removed when obj is GC'd
```

**Detection Tools:**

```javascript
// Chrome DevTools:
// 1. Memory tab → Take heap snapshot
// 2. Memory tab → Record allocation timeline
// 3. Performance tab → Check memory graph

// Manual detection
const before = process.memoryUsage().heapUsed;

// Run suspicious code
for (let i = 0; i < 1000; i++) {
  potentiallyLeakyFunction();
}

const after = process.memoryUsage().heapUsed;
console.log(`Memory increase: ${(after - before) / 1024 / 1024} MB`);

// Force garbage collection (Node.js with --expose-gc flag)
if (global.gc) {
  global.gc();
  console.log('GC forced');
}
```

---

## 📝 Practice Tips

1. **Explain in English**: Practice articulating these concepts clearly
2. **Use examples**: Always provide code examples when explaining
3. **Think of use cases**: Know when to apply each concept
4. **Know trade-offs**: Understand pros and cons of each approach
5. **Stay current**: Mention modern alternatives when discussing older patterns
6. **Practice common patterns**: Error handling, modules, array methods are frequently asked
7. **Understand why**: Don't just memorize - understand the reasoning behind each feature
8. **Real-world scenarios**: Think about production use cases (memory leaks, optimization)
9. **Performance**: Know Big O complexity of array methods and algorithms
10. **Modern vs Legacy**: Understand evolution (var→let/const, function→arrow, IIFE→modules)

Good luck! 🚀
