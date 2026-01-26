# Databases - Quick Guide for EPAM Interview

## 📚 1-Hour Study Guide - SQL & NoSQL

---

## 🎯 SQL (Relational Databases)

### What is SQL?

**Analogy:** An organized library with catalog cards.

- Books = Rows
- Shelves = Tables
- Cards = Relationships between books

---

## 1. SELECT - Reading Data

```sql
-- Basic: Read everything
SELECT * FROM users;

-- Specific: Only certain columns
SELECT name, email FROM users;

-- With filter (WHERE)
SELECT * FROM users WHERE age > 18;

-- Ordering (ORDER BY)
SELECT * FROM users ORDER BY age DESC;

-- Limiting results
SELECT * FROM users LIMIT 10;

-- Multiple conditions
SELECT * FROM users
WHERE age > 18 AND country = 'Mexico'
ORDER BY name;
```

**Analogy:** Like searching on Google with filters.

---

## 2. PK and FK (Primary Key & Foreign Key)

### Primary Key (PK)

**Analogy:** Your ID card - Uniquely identifies ONE person.

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,           -- ✅ PK: Unique, not null
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE     -- Unique but can be null
);

-- Cannot have two users with same id
```

### Foreign Key (FK)

**Analogy:** Your employee number that links you to your company.

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT,                          -- ✅ FK
  product VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- user_id MUST exist in users table
-- Maintains referential integrity
```

**Summary:**

- **PK** = Unique identifier in YOUR table
- **FK** = Reference to PK of ANOTHER table

---

## 3. JOINs - Combining Tables

**Analogy:** Putting puzzle pieces together.

```sql
-- Sample data:
-- users:            orders:
-- id | name         id | user_id | product
-- 1  | John         1  | 1       | Laptop
-- 2  | Ana          2  | 1       | Mouse
-- 3  | Peter        3  | 2       | Keyboard
```

### INNER JOIN (Only matches)

```sql
SELECT u.name, o.product
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- Result:
-- name  | product
-- John  | Laptop
-- John  | Mouse
-- Ana   | Keyboard
-- (Peter doesn't appear - no orders)
```

**Analogy:** Only students who submitted homework.

### LEFT JOIN (All from left side)

```sql
SELECT u.name, o.product
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- Result:
-- name  | product
-- John  | Laptop
-- John  | Mouse
-- Ana   | Keyboard
-- Peter | NULL       ✅ Appears even without orders
```

**Analogy:** ALL students, even those who didn't submit homework.

### RIGHT JOIN (All from right side)

```sql
SELECT u.name, o.product
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;

-- Same as LEFT but reversed
```

### FULL OUTER JOIN (All from both sides)

```sql
SELECT u.name, o.product
FROM users u
FULL OUTER JOIN orders o ON u.id = o.user_id;

-- All users + All orders
-- Even if they don't match
```

**Memory trick:**

- **INNER** = Only those that MATCH (intersection ∩)
- **LEFT** = ALL from left + matches
- **RIGHT** = ALL from right + matches
- **FULL** = ALL from both sides

---

## 4. Data Normalization

**Goal:** Eliminate redundancy (data duplication).

**Analogy:** Don't repeat your address on every order, save it once.

### ❌ WITHOUT Normalization (bad)

```sql
-- Table: orders
id | customer_name | customer_email   | product  | price
1  | John         | john@email.com   | Laptop   | 1000
2  | John         | john@email.com   | Mouse    | 20
3  | Ana          | ana@email.com    | Keyboard | 50

-- ❌ Problems:
-- - John's data duplicated
-- - If John changes email, must update multiple rows
-- - Wasted space
```

### ✅ WITH Normalization (good)

```sql
-- Table: customers
id | name | email
1  | John | john@email.com
2  | Ana  | ana@email.com

-- Table: orders
id | customer_id | product  | price
1  | 1          | Laptop   | 1000
2  | 1          | Mouse    | 20
3  | 2          | Keyboard | 50

-- ✅ Benefits:
-- - Customer data in ONE place only
-- - Change email = update ONE row
-- - Space savings
```

**Simple rule:** If the same information repeats, you probably need another table.

---

## 5. DML - Data Manipulation

```sql
-- INSERT - Create
INSERT INTO users (name, email, age)
VALUES ('John', 'john@email.com', 30);

INSERT INTO users (name, email)
VALUES ('Ana', 'ana@email.com'),
       ('Peter', 'peter@email.com');  -- Multiple rows

-- UPDATE - Modify
UPDATE users
SET age = 31
WHERE id = 1;

UPDATE users
SET country = 'Mexico'
WHERE age > 18;

-- DELETE - Remove
DELETE FROM users WHERE id = 1;

DELETE FROM users WHERE age < 18;

-- TRUNCATE - Remove ALL (faster than DELETE)
TRUNCATE TABLE users;

-- MERGE - Insert or update (UPSERT)
MERGE INTO users AS target
USING (VALUES (1, 'John', 'john@new.com')) AS source (id, name, email)
ON target.id = source.id
WHEN MATCHED THEN
  UPDATE SET email = source.email
WHEN NOT MATCHED THEN
  INSERT (id, name, email) VALUES (source.id, source.name, source.email);
```

**Summary:**

- **INSERT** = Add new records
- **UPDATE** = Modify existing records
- **DELETE** = Remove specific records
- **TRUNCATE** = Remove all (fast)
- **MERGE** = Insert or update (upsert)

---

## 6. DDL - Data Definition

```sql
-- CREATE - Create table
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ALTER - Modify existing table
ALTER TABLE products ADD COLUMN category VARCHAR(50);
ALTER TABLE products DROP COLUMN stock;
ALTER TABLE products MODIFY COLUMN price DECIMAL(12, 2);
ALTER TABLE products RENAME TO items;

-- DROP - Delete table
DROP TABLE products;

-- DROP DATABASE - Delete entire database
DROP DATABASE my_store;
```

**Summary:**

- **CREATE** = Create structure
- **ALTER** = Modify structure
- **DROP** = Delete structure

---

## 7. Transactions & ACID

### Transaction

**Analogy:** Bank transfer - ALL or NOTHING.

```sql
START TRANSACTION;

-- 1. Subtract money from account A
UPDATE accounts SET balance = balance - 100 WHERE id = 1;

-- 2. Add money to account B
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- ✅ If everything's OK
COMMIT;

-- ❌ If something fails
ROLLBACK;
```

**Without transactions:** If step 2 fails, account A lost money without B receiving it.

### ACID

**A**tomicity

- All or nothing
- If one part fails, EVERYTHING is undone

**C**onsistency

- Data always valid
- Rules not broken (FK, PK, etc.)

**I**solation

- Transactions don't affect each other
- Transaction A doesn't see incomplete changes from Transaction B

**D**urability

- Once confirmed (COMMIT), data persists
- Even if server crashes

**Memory trick:** **A**llan **C**omes **I**n **D**aily

---

## 8. Relationship Types

### 1-to-1 (One to One)

**Analogy:** One person - One passport

```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE passports (
  id INT PRIMARY KEY,
  number VARCHAR(20),
  user_id INT UNIQUE,  -- ✅ UNIQUE ensures 1-to-1
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- One user has ONE passport
-- One passport belongs to ONE user
```

### 1-to-Many (One to Many)

**Analogy:** One customer - Many orders

```sql
CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT,
  product VARCHAR(100),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- One customer can have MANY orders
-- One order belongs to ONE customer
```

### Many-to-Many (Many to Many)

**Analogy:** Students - Courses (one student in many courses, one course with many students)

```sql
CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE courses (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

-- ✅ Junction/pivot table
CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  enrollment_date DATE,
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- One student → Many courses
-- One course → Many students
```

---

## 9. Subqueries

### Returns ONE value

```sql
-- Find users older than average
SELECT * FROM users
WHERE age > (SELECT AVG(age) FROM users);

-- Subquery returns: 28.5 (single value)
```

### Returns MULTIPLE rows

```sql
-- Users who have placed orders
SELECT * FROM users
WHERE id IN (SELECT DISTINCT user_id FROM orders);

-- Subquery returns: [1, 2, 5] (multiple values)
```

### Returns MULTIPLE columns

```sql
-- Products with max price per category
SELECT p.*
FROM products p
WHERE (category, price) IN (
  SELECT category, MAX(price)
  FROM products
  GROUP BY category
);

-- Subquery returns: [('Electronics', 1000), ('Clothing', 50)]
```

**Analogy:** A question inside another question.

---

## 10. ORM/ODM

**ORM** (Object-Relational Mapping) = Translate objects to SQL

**Analogy:** Automatic translator between JavaScript and SQL.

```javascript
// ❌ Manual SQL
const result = await db.query(
  'SELECT * FROM users WHERE age > ?',
  [18]
);

// ✅ ORM (Sequelize, TypeORM, Prisma)
const users = await User.findAll({
  where: { age: { gt: 18 } }
});

// ✅ Advantages:
// - No manual SQL writing
// - Type-safe (TypeScript)
// - Prevents SQL injection
// - Database abstraction

// ❌ Disadvantages:
// - Complex queries are difficult
// - Performance overhead
// - Less control
```

---

## 🔥 NoSQL (MongoDB)

### What is NoSQL?

**Analogy:** Document drawer vs. File cabinet.

**SQL = Organized file cabinet** (tables, rows, columns)
**NoSQL = Flexible drawer** (JSON documents)

---

## 1. Create Collection

```javascript
// ✅ Implicit (created when first document inserted)
db.users.insertOne({ name: "John", age: 30 });

// ✅ Explicit
db.createCollection("users");

// ✅ With validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      required: ["name", "email"],
      properties: {
        name: { bsonType: "string" },
        age: { bsonType: "int", minimum: 0 }
      }
    }
  }
});
```

---

## 2. CRUD in MongoDB

### Insert (Create)

```javascript
// One
db.users.insertOne({
  name: "John",
  email: "john@email.com",
  age: 30,
  tags: ["developer", "javascript"]
});

// Many
db.users.insertMany([
  { name: "Ana", age: 28 },
  { name: "Peter", age: 35 }
]);
```

### Find (Read)

```javascript
// All
db.users.find();

// With filter
db.users.find({ age: { $gt: 25 } });  // Greater than 25

// Find one
db.users.findOne({ email: "john@email.com" });

// Projection (only certain fields)
db.users.find(
  { age: { $gt: 25 } },
  { name: 1, email: 1, _id: 0 }  // 1=include, 0=exclude
);

// Pagination
db.users.find()
  .skip(20)   // Skip 20
  .limit(10)  // Take 10
  .sort({ age: -1 });  // Sort by age descending
```

### Update (Modify)

```javascript
// Update one
db.users.updateOne(
  { email: "john@email.com" },
  { $set: { age: 31 } }
);

// Update many
db.users.updateMany(
  { age: { $lt: 18 } },
  { $set: { isMinor: true } }
);

// Upsert (update or insert)
db.users.updateOne(
  { email: "new@email.com" },
  { $set: { name: "New User", age: 25 } },
  { upsert: true }  // If doesn't exist, create it
);
```

### Delete (Remove)

```javascript
// Delete one
db.users.deleteOne({ email: "john@email.com" });

// Delete many
db.users.deleteMany({ age: { $lt: 18 } });

// Delete all
db.users.deleteMany({});
```

---

## 3. Comparison Operators

```javascript
// Greater than
db.users.find({ age: { $gt: 25 } });

// Greater or equal
db.users.find({ age: { $gte: 25 } });

// Less than
db.users.find({ age: { $lt: 30 } });

// Less or equal
db.users.find({ age: { $lte: 30 } });

// Not equal
db.users.find({ status: { $ne: "inactive" } });

// In array
db.users.find({ age: { $in: [25, 30, 35] } });

// Not in array
db.users.find({ age: { $nin: [25, 30, 35] } });

// Exists
db.users.find({ phone: { $exists: true } });

// Array contains
db.users.find({ tags: "developer" });

// AND (implicit)
db.users.find({ age: { $gt: 25 }, country: "Mexico" });

// OR
db.users.find({
  $or: [
    { age: { $lt: 18 } },
    { age: { $gt: 65 } }
  ]
});
```

**Trick:** `$gt` = Greater Than, `$lt` = Less Than

---

## 4. Indexes

**Analogy:** Book index - Find topics quickly.

```javascript
// ✅ WITHOUT index: MongoDB scans ALL documents
db.users.find({ email: "john@email.com" });  // Slow with millions

// ✅ WITH index: Direct access
db.users.createIndex({ email: 1 });  // 1=ascending, -1=descending
db.users.find({ email: "john@email.com" });  // Fast ⚡

// Compound index (multiple fields)
db.users.createIndex({ country: 1, age: -1 });

// Unique index (no duplicates)
db.users.createIndex({ email: 1 }, { unique: true });

// View indexes
db.users.getIndexes();

// Drop index
db.users.dropIndex("email_1");
```

**When to use:**

- ✅ Fields frequently used in queries
- ✅ Fields in `sort()`
- ❌ Small collections (< 1000 docs)

---

## 5. Normalization vs Embedding

### Embedding - Denormalized

**Analogy:** Keep everything in one backpack.

```javascript
// ✅ EVERYTHING in one document
{
  _id: 1,
  name: "John",
  email: "john@email.com",
  address: {  // Embedded
    street: "Main St",
    city: "NYC"
  },
  orders: [  // Embedded array
    { product: "Laptop", price: 1000 },
    { product: "Mouse", price: 20 }
  ]
}

// ✅ Advantage: Single query
db.users.findOne({ _id: 1 });  // Gets EVERYTHING

// ❌ Disadvantage: Duplication if shared
```

**Use when:**

- Data always accessed together
- 1-to-1 or 1-to-few relationship
- Data doesn't change frequently

### References - Normalized

**Analogy:** Save note with item location.

```javascript
// users collection
{
  _id: 1,
  name: "John",
  email: "john@email.com"
}

// orders collection
{
  _id: 101,
  user_id: 1,  // Reference
  product: "Laptop",
  price: 1000
}

// ❌ Need JOIN ($lookup)
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user"
    }
  }
]);

// ✅ Advantage: No duplication
// ❌ Disadvantage: Requires JOIN (slower)
```

**Use when:**

- Data accessed separately
- Many-to-many relationship
- Data changes frequently

---

## 6. $lookup (JOIN in MongoDB)

```javascript
// Orders with user information
db.orders.aggregate([
  {
    $lookup: {
      from: "users",           // Collection to join
      localField: "user_id",   // Field in orders
      foreignField: "_id",     // Field in users
      as: "userInfo"          // Result name
    }
  }
]);

// Result:
{
  _id: 101,
  user_id: 1,
  product: "Laptop",
  userInfo: [  // Array with user
    { _id: 1, name: "John", email: "john@email.com" }
  ]
}

// Flatten array ($unwind)
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" }  // Convert array to object
]);
```

---

## 7. Aggregation (Group and Calculate)

**Analogy:** Excel spreadsheet with SUM, AVG, COUNT formulas.

```javascript
// Count users by country
db.users.aggregate([
  {
    $group: {
      _id: "$country",              // Group by
      total: { $sum: 1 },           // Count
      avgAge: { $avg: "$age" },
      maxAge: { $max: "$age" },
      minAge: { $min: "$age" }
    }
  }
]);

// Result:
[
  { _id: "Mexico", total: 150, avgAge: 28.5, maxAge: 65, minAge: 18 },
  { _id: "USA", total: 200, avgAge: 32.1, maxAge: 70, minAge: 20 }
]

// Complete pipeline
db.orders.aggregate([
  { $match: { status: "completed" } },      // 1. Filter
  { $group: {                               // 2. Group
      _id: "$product",
      totalSales: { $sum: "$quantity" }
    }
  },
  { $sort: { totalSales: -1 } },            // 3. Sort
  { $limit: 10 }                            // 4. Top 10
]);
```

---

## 8. Sharding (Partitioning Data)

**Analogy:** Divide library into multiple buildings.

**Why?** When data is too large for one server.

```javascript
// Enable sharding
sh.enableSharding("myDB");

// Shard collection by user_id
sh.shardCollection("myDB.users", { user_id: 1 });

// MongoDB automatically distributes:
// Server 1: users with user_id 1-1000
// Server 2: users with user_id 1001-2000
// Server 3: users with user_id 2001-3000
```

---

## 9. Replication (Backup Copies)

**Analogy:** Backup copies of your thesis on 3 USB drives.

```
Primary (Writes) ──┐
                   ├──► Data replicated
Secondary (Reads) ─┤
Secondary (Reads) ─┘
```

**Benefits:**

- ✅ If Primary fails, Secondary becomes Primary
- ✅ High availability
- ✅ Read from Secondaries (scale reads)

---

## 10. Backup/Restore

```bash
# Complete backup
mongodump --db myDB --out /backup/

# Restore
mongorestore --db myDB /backup/myDB/

# Compressed backup
mongodump --db myDB --archive=/backup/myDB.gz --gzip

# Compressed restore
mongorestore --archive=/backup/myDB.gz --gzip
```

---

## 11. Redis (Cache)

**Analogy:** Post-it notes vs. searching in file cabinet.

```javascript
// Without cache (slow)
async function getUser(id) {
  return await db.users.findOne({ _id: id });
  // DB query every time
}

// With Redis cache (fast)
async function getUser(id) {
  // 1. Check cache
  let user = await redis.get(`user:${id}`);
  if (user) return JSON.parse(user);  // ⚡ Fast

  // 2. Not in cache, query DB
  user = await db.users.findOne({ _id: id });

  // 3. Save to cache (1 hour)
  await redis.setEx(`user:${id}`, 3600, JSON.stringify(user));

  return user;
}

// Invalidate cache on update
async function updateUser(id, data) {
  await db.users.updateOne({ _id: id }, { $set: data });
  await redis.del(`user:${id}`);  // Delete cache
}
```

**Use when:**

- Data read frequently
- Data doesn't change much
- Expensive queries

---

## 12. ElasticSearch (Search)

**Analogy:** Google vs. searching in Word files.

**MongoDB text search = basic**
**ElasticSearch = advanced (relevance, typos, synonyms)**

```javascript
// Simple search in MongoDB
db.articles.find({ $text: { $search: "javascript" } });

// Advanced search in ElasticSearch
await esClient.search({
  index: 'articles',
  query: {
    multi_match: {
      query: "javascrip",  // ✅ Finds "javascript" (typo)
      fields: ['title^2', 'content'],  // Boost title
      fuzziness: "AUTO"  // Tolerate errors
    }
  }
});
```

---

## 📊 SQL vs NoSQL - Quick Comparison

| Aspect            | SQL                             | NoSQL (MongoDB)              |
| ----------------- | ------------------------------- | ---------------------------- |
| **Structure**     | Tables (rows/columns)           | Documents (JSON)             |
| **Schema**        | Fixed (predefined)              | Flexible (dynamic)           |
| **Relationships** | Native JOINs                    | Embedding or $lookup         |
| **Scalability**   | Vertical (more powerful server) | Horizontal (more servers)    |
| **ACID**          | ✅ Yes (always)                 | ⚠️ Limited (in transactions) |
| **Best for**      | Structured data, transactions   | Variable data, speed         |
| **Examples**      | PostgreSQL, MySQL               | MongoDB, DynamoDB            |

---

## 🎯 Interview Tips

### Common Questions

**1. When to use SQL vs NoSQL?**

- **SQL:** Finance, inventory, structured data
- **NoSQL:** Social media, catalogs, logs

**2. What is a JOIN?**

- Combine data from multiple tables using related keys

**3. What is ACID?**

- **A**tomicity, **C**onsistency, **I**solation, **D**urability
- Transaction guarantees

**4. Embedding vs References in MongoDB?**

- **Embedding:** Data together, fast access
- **References:** Normalized, less duplication

**5. Why use indexes?**

- Fast search, like book index

**6. What is sharding?**

- Split data across multiple servers

**7. What is Redis for?**

- In-memory cache for ultra-fast access

---

## ⏰ Study Plan (1 hour)

**Minutes 1-20:** Basic SQL

- SELECT, WHERE, ORDER BY
- PK, FK
- JOINs (visualize diagrams)
- INSERT, UPDATE, DELETE

**Minutes 21-40:** Advanced SQL + MongoDB

- ACID, Transactions
- Normalization
- MongoDB CRUD
- Operators ($gt, $in, etc.)

**Minutes 41-60:** Advanced concepts

- Indexes
- Aggregation
- Sharding, Replication
- Redis, ElasticSearch

---

## 🚀 Quick Mental Exercises

1. **Visualize:** How would you JOIN `users` and `orders`?
2. **Think:** When would you use embedding vs references?
3. **Remember:** ACID = **A**llan **C**omes **I**n **D**aily
4. **Compare:** SQL JOINs vs MongoDB $lookup

---

## ✅ Final Checklist

Before the interview, make sure you can explain:

- [ ] Difference between PK and FK
- [ ] Types of JOINs (INNER, LEFT, RIGHT, FULL)
- [ ] What is normalization (with example)
- [ ] What is ACID
- [ ] CRUD in MongoDB
- [ ] Embedding vs References
- [ ] What indexes are for
- [ ] Difference between Sharding and Replication
- [ ] When to use Redis

---

**Good luck with your EPAM interview! 🎉**

_Remember: It's better to understand concepts than memorize syntax._

---

## 💬 Interview Phrases in English

**Useful phrases to sound professional:**

- "In my experience, I would use..."
- "The main difference between... and... is..."
- "I've worked with... in production environments"
- "From a performance perspective..."
- "The trade-off here is..."
- "In this scenario, I would choose... because..."
- "Let me walk you through my approach..."
- "One consideration is..."
- "This relates to..."
- "To ensure data integrity..."

**When you don't know:**

- "I'm not entirely familiar with that, but based on my understanding..."
- "Could you clarify what you mean by...?"
- "That's a great question. Let me think about it..."
- "I haven't worked with that specifically, but I know similar concepts..."

**Confidence builders:**

- "Absolutely, let me explain..."
- "Great question! So..."
- "To answer that, I'd first consider..."
- "There are a few approaches to this..."
