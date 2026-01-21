# SQL Database Guide - EPAM Interview Topics

## 🎯 SQL Fundamentals for Senior Level

---

## 1. SELECT Statement

### Basic SELECT syntax

```sql
-- Basic query
SELECT column1, column2 FROM table_name;

-- All columns
SELECT * FROM users;

-- With WHERE clause
SELECT name, email FROM users WHERE age > 25;

-- DISTINCT values
SELECT DISTINCT country FROM users;

-- Sorting
SELECT * FROM users ORDER BY created_at DESC;

-- Limiting results
SELECT * FROM users LIMIT 10 OFFSET 20; -- Pagination

-- Aliases
SELECT name AS user_name, email AS user_email FROM users;
```

---

## 2. Primary Keys (PK) and Foreign Keys (FK)

### Primary Key (PK)

**Uniquely identifies each row in a table:**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,  -- Auto-incrementing PK
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL
);

-- Composite primary key
CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  enrolled_at TIMESTAMP,
  PRIMARY KEY (student_id, course_id)
);
```

**Characteristics:**

- Must be unique
- Cannot be NULL
- Only one PK per table (but can be composite)
- Automatically creates an index

### Foreign Key (FK)

**References PK in another table (creates relationships):**

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  author_id INT,
  FOREIGN KEY (author_id) REFERENCES users(id)
    ON DELETE CASCADE  -- Delete posts when user is deleted
    ON UPDATE CASCADE  -- Update posts when user id changes
);

-- ON DELETE options:
-- CASCADE: Delete related rows
-- SET NULL: Set FK to NULL
-- RESTRICT: Prevent deletion if related rows exist
-- NO ACTION: Similar to RESTRICT
-- SET DEFAULT: Set FK to default value
```

---

## 3. JOINS

### INNER JOIN

**Returns rows that have matching values in both tables:**

```sql
SELECT users.name, posts.title
FROM users
INNER JOIN posts ON users.id = posts.author_id;

-- Only returns users who have posts
```

### LEFT JOIN (LEFT OUTER JOIN)

**Returns all rows from left table + matching rows from right table:**

```sql
SELECT users.name, posts.title
FROM users
LEFT JOIN posts ON users.id = posts.author_id;

-- Returns ALL users, even those without posts (posts columns will be NULL)
```

### RIGHT JOIN (RIGHT OUTER JOIN)

**Returns all rows from right table + matching rows from left table:**

```sql
SELECT users.name, posts.title
FROM users
RIGHT JOIN posts ON users.id = posts.author_id;

-- Returns ALL posts, even orphaned ones (user columns will be NULL)
```

### FULL OUTER JOIN

**Returns all rows from both tables:**

```sql
SELECT users.name, posts.title
FROM users
FULL OUTER JOIN posts ON users.id = posts.author_id;

-- Returns users without posts AND posts without users
```

### CROSS JOIN

**Cartesian product (every combination):**

```sql
SELECT users.name, colors.name
FROM users
CROSS JOIN colors;

-- If users has 5 rows and colors has 3 rows, result has 15 rows
```

### SELF JOIN

**Join table to itself:**

```sql
-- Find employees and their managers
SELECT
  e.name AS employee,
  m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

**Visual JOIN comparison:**

```
Table A         Table B

  INNER JOIN      LEFT JOIN       RIGHT JOIN     FULL OUTER JOIN
      ┌─┐           ┌─┐             ┌─┐              ┌─┐
      │A│           │A│             │A│              │A│
    ┌─┼─┼─┐       ┌─┼─┼─┐         ┌─┼─┼─┐          ┌─┼─┼─┐
    │ │█│B│       │█│█│B│         │ │█│█│          │█│█│█│
    └─┼─┼─┘       └─┼─┼─┘         └─┼─┼─┘          └─┼─┼─┘
      │B│           │B│             │B│              │B│
      └─┘           └─┘             └─┘              └─┘
  (overlap only) (all A + match)  (all B + match)   (all rows)
```

---

## 4. Data Normalization

### What is Normalization?

**Process of organizing data to reduce redundancy and improve data integrity.**

### Normal Forms:

**1NF (First Normal Form):**

- Each column contains atomic (indivisible) values
- Each row is unique
- No repeating groups

```sql
-- ❌ Violates 1NF
CREATE TABLE orders (
  id INT,
  customer VARCHAR(100),
  products VARCHAR(500)  -- 'Laptop, Mouse, Keyboard' (not atomic!)
);

-- ✅ 1NF compliant
CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer VARCHAR(100)
);

CREATE TABLE order_items (
  order_id INT,
  product VARCHAR(100),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

**2NF (Second Normal Form):**

- Must be in 1NF
- No partial dependencies (all non-key columns depend on entire PK)

```sql
-- ❌ Violates 2NF (student_name depends only on student_id, not on both)
CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  student_name VARCHAR(100),  -- Partial dependency!
  grade CHAR(1),
  PRIMARY KEY (student_id, course_id)
);

-- ✅ 2NF compliant
CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  grade CHAR(1),
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id)
);
```

**3NF (Third Normal Form):**

- Must be in 2NF
- No transitive dependencies (non-key columns depend only on PK)

```sql
-- ❌ Violates 3NF (department_location depends on department, not employee_id)
CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  department VARCHAR(100),
  department_location VARCHAR(100)  -- Transitive dependency!
);

-- ✅ 3NF compliant
CREATE TABLE departments (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  location VARCHAR(100)
);

CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

---

## 5. DML (Data Manipulation Language)

### INSERT

```sql
-- Insert single row
INSERT INTO users (name, email, age)
VALUES ('John Doe', 'john@example.com', 30);

-- Insert multiple rows
INSERT INTO users (name, email, age) VALUES
  ('Jane Smith', 'jane@example.com', 28),
  ('Bob Johnson', 'bob@example.com', 35);

-- Insert from SELECT
INSERT INTO archived_users
SELECT * FROM users WHERE last_login < '2020-01-01';
```

### UPDATE

```sql
-- Update single column
UPDATE users SET age = 31 WHERE id = 1;

-- Update multiple columns
UPDATE users
SET age = age + 1, updated_at = NOW()
WHERE id = 1;

-- Update with JOIN
UPDATE posts
SET author_name = users.name
FROM users
WHERE posts.author_id = users.id;
```

### DELETE

```sql
-- Delete specific rows
DELETE FROM users WHERE id = 1;

-- Delete with condition
DELETE FROM users WHERE last_login < '2020-01-01';

-- Delete all rows (keep table structure)
DELETE FROM temp_data;
```

### MERGE (UPSERT)

```sql
-- PostgreSQL: ON CONFLICT
INSERT INTO users (id, name, email)
VALUES (1, 'John Doe', 'john@example.com')
ON CONFLICT (id)
DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email;

-- MySQL: ON DUPLICATE KEY UPDATE
INSERT INTO users (id, name, email)
VALUES (1, 'John Doe', 'john@example.com')
ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email);
```

### TRUNCATE

```sql
-- Delete all rows (faster than DELETE, resets auto-increment)
TRUNCATE TABLE temp_data;

-- Cannot use WHERE clause
-- Faster than DELETE because it doesn't log individual row deletions
```

---

## 6. DDL (Data Definition Language)

### CREATE

```sql
-- Create table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INT CHECK (age >= 0),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_name_email ON users(name, email);  -- Composite index

-- Create view
CREATE VIEW active_users AS
SELECT * FROM users WHERE is_active = true;
```

### ALTER

```sql
-- Add column
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Modify column
ALTER TABLE users ALTER COLUMN age TYPE BIGINT;

-- Rename column
ALTER TABLE users RENAME COLUMN phone TO phone_number;

-- Drop column
ALTER TABLE users DROP COLUMN age;

-- Add constraint
ALTER TABLE posts ADD CONSTRAINT fk_author
  FOREIGN KEY (author_id) REFERENCES users(id);
```

### DROP

```sql
-- Drop table
DROP TABLE IF EXISTS temp_table;

-- Drop index
DROP INDEX idx_users_email;

-- Drop view
DROP VIEW active_users;

-- Drop database
DROP DATABASE IF EXISTS test_db;
```

---

## 7. Relationship Types

### 1-to-1 (One-to-One)

**One row in Table A relates to one row in Table B:**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE
);

CREATE TABLE user_profiles (
  user_id INT PRIMARY KEY,  -- PK is also FK
  bio TEXT,
  avatar_url VARCHAR(500),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Each user has exactly one profile
```

### 1-to-Many (One-to-Many)

**One row in Table A relates to many rows in Table B:**

```sql
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author_id INT,
  FOREIGN KEY (author_id) REFERENCES authors(id)
);

-- One author can have many books
```

### Many-to-Many

**Many rows in Table A relate to many rows in Table B (requires junction table):**

```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255)
);

-- Junction table
CREATE TABLE enrollments (
  student_id INT,
  course_id INT,
  enrolled_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Many students can enroll in many courses
```

---

## 8. Subqueries

### Subquery returning one row

```sql
-- Get user with highest age
SELECT name FROM users
WHERE age = (SELECT MAX(age) FROM users);

-- Scalar subquery in SELECT
SELECT
  name,
  age,
  (SELECT AVG(age) FROM users) AS avg_age
FROM users;
```

### Subquery returning many rows

```sql
-- Get users who have posted
SELECT name FROM users
WHERE id IN (SELECT DISTINCT author_id FROM posts);

-- Get users without posts
SELECT name FROM users
WHERE id NOT IN (SELECT author_id FROM posts WHERE author_id IS NOT NULL);

-- Using ANY
SELECT name FROM users
WHERE age > ANY (SELECT age FROM users WHERE country = 'USA');

-- Using ALL
SELECT name FROM users
WHERE age > ALL (SELECT age FROM users WHERE country = 'USA');
```

### Subquery returning many columns

```sql
-- Correlated subquery
SELECT u.name,
  (SELECT COUNT(*) FROM posts p WHERE p.author_id = u.id) AS post_count
FROM users u;

-- EXISTS
SELECT name FROM users u
WHERE EXISTS (
  SELECT 1 FROM posts p WHERE p.author_id = u.id
);
```

### Derived table (subquery in FROM)

```sql
SELECT avg_age_by_country.country, avg_age_by_country.avg_age
FROM (
  SELECT country, AVG(age) AS avg_age
  FROM users
  GROUP BY country
) AS avg_age_by_country
WHERE avg_age_by_country.avg_age > 30;
```

---

## 9. Transactions and ACID

### What is a Transaction?

**A sequence of operations performed as a single logical unit of work.**

### ACID Properties:

**A - Atomicity:** All or nothing (either all operations succeed or all fail)
**C - Consistency:** Database remains in valid state
**I - Isolation:** Concurrent transactions don't interfere
**D - Durability:** Committed changes persist even after system failure

### Transaction syntax:

```sql
-- Start transaction
BEGIN;  -- or START TRANSACTION;

-- Perform operations
INSERT INTO accounts (user_id, balance) VALUES (1, 1000);
UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE user_id = 2;

-- Commit if everything succeeds
COMMIT;

-- Or rollback if something fails
ROLLBACK;
```

### Example: Money transfer

```sql
BEGIN;

-- Deduct from sender
UPDATE accounts
SET balance = balance - 500
WHERE id = 1 AND balance >= 500;

-- Check if update succeeded
IF (SELECT balance FROM accounts WHERE id = 1) < 0 THEN
  ROLLBACK;
ELSE
  -- Add to receiver
  UPDATE accounts
  SET balance = balance + 500
  WHERE id = 2;

  COMMIT;
END IF;
```

### Isolation Levels:

```sql
-- Set isolation level
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;  -- Dirty reads possible
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;    -- Default in PostgreSQL
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;   -- Prevent non-repeatable reads
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;      -- Strictest, slowest
```

---

## 10. Advanced Queries

### GROUP BY and Aggregations

```sql
-- Count posts per author
SELECT author_id, COUNT(*) AS post_count
FROM posts
GROUP BY author_id;

-- Multiple aggregations
SELECT
  country,
  COUNT(*) AS user_count,
  AVG(age) AS avg_age,
  MIN(age) AS youngest,
  MAX(age) AS oldest
FROM users
GROUP BY country
HAVING COUNT(*) > 10;  -- Filter groups (WHERE filters rows)
```

### Window Functions

```sql
-- Row number
SELECT
  name,
  age,
  ROW_NUMBER() OVER (ORDER BY age DESC) AS rank
FROM users;

-- Rank with gaps
SELECT
  name,
  score,
  RANK() OVER (ORDER BY score DESC) AS rank
FROM players;

-- Running total
SELECT
  date,
  amount,
  SUM(amount) OVER (ORDER BY date) AS running_total
FROM transactions;

-- Partition by
SELECT
  category,
  product,
  price,
  AVG(price) OVER (PARTITION BY category) AS avg_category_price
FROM products;
```

### Common Table Expressions (CTEs)

```sql
-- WITH clause
WITH active_users AS (
  SELECT * FROM users WHERE is_active = true
),
recent_posts AS (
  SELECT * FROM posts WHERE created_at > NOW() - INTERVAL '7 days'
)
SELECT u.name, COUNT(p.id) AS recent_post_count
FROM active_users u
LEFT JOIN recent_posts p ON u.id = p.author_id
GROUP BY u.name;

-- Recursive CTE (organization hierarchy)
WITH RECURSIVE org_tree AS (
  -- Base case
  SELECT id, name, manager_id, 1 AS level
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive case
  SELECT e.id, e.name, e.manager_id, ot.level + 1
  FROM employees e
  JOIN org_tree ot ON e.manager_id = ot.id
)
SELECT * FROM org_tree ORDER BY level, name;
```

---

## 🎯 Interview Quick Tips

**Be ready to explain:**

- Difference between INNER JOIN and LEFT JOIN
- When to use indexes (pros/cons)
- ACID properties and why they matter
- Normalization vs denormalization trade-offs
- N+1 query problem and how to avoid it
- Difference between DELETE and TRUNCATE
- When to use transactions
- Subquery vs JOIN performance

**Practice these queries:**

- Find duplicate rows
- Second highest salary
- Delete duplicate rows keeping one
- Pivot table (rows to columns)
- Running totals
- Hierarchical data queries

Good luck! 🚀
