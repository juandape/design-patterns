# MongoDB & NoSQL Guide - EPAM Interview Topics

## 🎯 MongoDB for Senior Level

---

## 1. Collections and Documents

### Create a Collection

```javascript
// Implicit creation (created when first document inserted)
db.users.insertOne({ name: "John", age: 30 });

// Explicit creation
db.createCollection("users");

// With options
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email"],
      properties: {
        name: { bsonType: "string" },
        email: { bsonType: "string" },
        age: { bsonType: "int", minimum: 0 }
      }
    }
  }
});
```

---

## 2. CRUD Operations

### Insert

```javascript
// Insert one document
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  tags: ["developer", "javascript"]
});

// Insert many documents
db.users.insertMany([
  { name: "Jane", email: "jane@example.com", age: 28 },
  { name: "Bob", email: "bob@example.com", age: 35 }
]);
```

### Find (Query)

```javascript
// Find all
db.users.find();

// Find with filter
db.users.find({ age: { $gt: 25 } });

// Find one
db.users.findOne({ email: "john@example.com" });

// Projection (select specific fields)
db.users.find(
  { age: { $gt: 25 } },
  { name: 1, email: 1, _id: 0 }  // 1 = include, 0 = exclude
);

// Limit and skip
db.users.find().limit(10).skip(20);  // Pagination

// Sort
db.users.find().sort({ age: -1 });  // -1 = descending, 1 = ascending
```

### Update

```javascript
// Update one document
db.users.updateOne(
  { email: "john@example.com" },
  { $set: { age: 31 } }
);

// Update many documents
db.users.updateMany(
  { age: { $lt: 18 } },
  { $set: { isMinor: true } }
);

// Replace entire document
db.users.replaceOne(
  { _id: ObjectId("...") },
  { name: "New Name", email: "new@example.com", age: 25 }
);

// Upsert (update or insert)
db.users.updateOne(
  { email: "new@example.com" },
  { $set: { name: "New User", age: 22 } },
  { upsert: true }
);
```

### Delete

```javascript
// Delete one
db.users.deleteOne({ email: "john@example.com" });

// Delete many
db.users.deleteMany({ age: { $lt: 18 } });

// Delete all documents in collection
db.users.deleteMany({});
```

---

## 3. Conditional Operators

### Comparison Operators

```javascript
// Greater than
db.users.find({ age: { $gt: 25 } });

// Greater than or equal
db.users.find({ age: { $gte: 25 } });

// Less than
db.users.find({ age: { $lt: 30 } });

// Less than or equal
db.users.find({ age: { $lte: 30 } });

// Not equal
db.users.find({ status: { $ne: "inactive" } });

// In array
db.users.find({ age: { $in: [25, 30, 35] } });

// Not in array
db.users.find({ age: { $nin: [25, 30, 35] } });
```

### Logical Operators

```javascript
// AND (implicit)
db.users.find({ age: { $gt: 25 }, country: "USA" });

// AND (explicit)
db.users.find({
  $and: [
    { age: { $gt: 25 } },
    { country: "USA" }
  ]
});

// OR
db.users.find({
  $or: [
    { age: { $lt: 18 } },
    { age: { $gt: 65 } }
  ]
});

// NOT
db.users.find({ age: { $not: { $gt: 25 } } });

// NOR
db.users.find({
  $nor: [
    { age: { $lt: 18 } },
    { status: "banned" }
  ]
});
```

### Element Operators

```javascript
// Field exists
db.users.find({ phone: { $exists: true } });

// Type checking
db.users.find({ age: { $type: "int" } });
db.users.find({ age: { $type: "string" } });
```

### Array Operators

```javascript
// Array contains value
db.users.find({ tags: "developer" });

// Array contains all values
db.users.find({ tags: { $all: ["developer", "javascript"] } });

// Array size
db.users.find({ tags: { $size: 3 } });

// Element match (complex array queries)
db.posts.find({
  comments: {
    $elemMatch: { author: "John", likes: { $gt: 10 } }
  }
});
```

---

## 4. Indexes

### What are Indexes?

**Indexes improve query performance by creating pointers to data.**

### Create Indexes

```javascript
// Single field index
db.users.createIndex({ email: 1 });  // 1 = ascending, -1 = descending

// Compound index (multiple fields)
db.users.createIndex({ country: 1, age: -1 });

// Unique index
db.users.createIndex({ email: 1 }, { unique: true });

// Text index (for full-text search)
db.articles.createIndex({ title: "text", content: "text" });

// Geospatial index
db.locations.createIndex({ coordinates: "2dsphere" });

// TTL index (auto-delete after time)
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }  // Delete after 1 hour
);
```

### View Indexes

```javascript
// List all indexes
db.users.getIndexes();

// Explain query execution
db.users.find({ email: "john@example.com" }).explain("executionStats");
```

### Drop Indexes

```javascript
// Drop specific index
db.users.dropIndex("email_1");

// Drop all indexes except _id
db.users.dropIndexes();
```

**When to use indexes:**

- ✅ Fields frequently used in queries
- ✅ Fields used in sorting
- ✅ Fields used in joins ($lookup)

**When NOT to use indexes:**

- ❌ Small collections (< 1000 documents)
- ❌ Fields with low cardinality (few unique values)
- ❌ Frequently updated fields (index overhead)

---

## 5. Data Normalization in MongoDB

### When to Normalize (Reference)

**Use references when:**

- Data is accessed separately
- Data is large
- Relationships are many-to-many

```javascript
// Normalized (Referenced)
// users collection
{
  _id: ObjectId("user1"),
  name: "John Doe",
  email: "john@example.com"
}

// posts collection
{
  _id: ObjectId("post1"),
  title: "My Post",
  authorId: ObjectId("user1"),  // Reference
  content: "..."
}

// Query requires join ($lookup)
db.posts.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "authorId",
      foreignField: "_id",
      as: "author"
    }
  }
]);
```

### When to Denormalize (Embed)

**Use embedding when:**

- Data is always accessed together
- 1-to-1 or 1-to-few relationships
- Data doesn't change frequently

```javascript
// Denormalized (Embedded)
{
  _id: ObjectId("post1"),
  title: "My Post",
  content: "...",
  author: {  // Embedded
    name: "John Doe",
    email: "john@example.com"
  },
  comments: [  // Embedded array
    { text: "Great post!", author: "Jane" },
    { text: "Thanks!", author: "Bob" }
  ]
}

// No join needed - single query
db.posts.findOne({ _id: ObjectId("post1") });
```

---

## 6. Joining Collections ($lookup)

```javascript
// Left outer join (like SQL LEFT JOIN)
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",           // Right collection
      localField: "customerId",    // Field in orders
      foreignField: "_id",         // Field in customers
      as: "customerInfo"           // Output array
    }
  }
]);

// Unwind to flatten array
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customerInfo"
    }
  },
  { $unwind: "$customerInfo" }  // Convert array to object
]);

// Advanced lookup with pipeline
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      let: { customerId: "$customerId" },
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$customerId"] } } },
        { $project: { name: 1, email: 1 } }
      ],
      as: "customer"
    }
  }
]);
```

---

## 7. Limit, Sort, Group

### Limit and Skip

```javascript
// Pagination
db.users.find()
  .sort({ createdAt: -1 })
  .skip(20)   // Skip first 20
  .limit(10); // Return next 10
```

### Sort

```javascript
// Ascending
db.users.find().sort({ age: 1 });

// Descending
db.users.find().sort({ age: -1 });

// Multiple fields
db.users.find().sort({ country: 1, age: -1 });
```

### Group (Aggregation)

```javascript
// Count by country
db.users.aggregate([
  {
    $group: {
      _id: "$country",           // Group by field
      count: { $sum: 1 },        // Count
      avgAge: { $avg: "$age" },  // Average
      minAge: { $min: "$age" },  // Minimum
      maxAge: { $max: "$age" }   // Maximum
    }
  }
]);

// Total sales by product
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.productId",
      totalSales: { $sum: "$items.quantity" },
      revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
    }
  }
]);
```

---

## 8. Aggregation Framework

### Aggregation Pipeline

**Process documents through stages:**

```javascript
db.orders.aggregate([
  // Stage 1: Match (filter)
  { $match: { status: "completed" } },

  // Stage 2: Unwind array
  { $unwind: "$items" },

  // Stage 3: Group and sum
  {
    $group: {
      _id: "$items.productId",
      totalQuantity: { $sum: "$items.quantity" },
      totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
    }
  },

  // Stage 4: Sort
  { $sort: { totalRevenue: -1 } },

  // Stage 5: Limit
  { $limit: 10 },

  // Stage 6: Lookup (join)
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "productInfo"
    }
  },

  // Stage 7: Project (shape output)
  {
    $project: {
      productName: { $arrayElemAt: ["$productInfo.name", 0] },
      totalQuantity: 1,
      totalRevenue: 1
    }
  }
]);
```

### Common Aggregation Operators

```javascript
// $match - filter documents
{ $match: { age: { $gte: 18 } } }

// $project - reshape documents
{ $project: { name: 1, email: 1, ageInMonths: { $multiply: ["$age", 12] } } }

// $group - group by field
{ $group: { _id: "$country", count: { $sum: 1 } } }

// $sort - sort documents
{ $sort: { age: -1 } }

// $limit - limit results
{ $limit: 10 }

// $skip - skip documents
{ $skip: 20 }

// $unwind - deconstruct array
{ $unwind: "$tags" }

// $lookup - join collections
{ $lookup: { from: "posts", localField: "_id", foreignField: "authorId", as: "posts" } }

// $addFields - add computed fields
{ $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } } }

// $count - count documents
{ $count: "totalUsers" }
```

---

## 9. Sharding

### What is Sharding?

**Horizontal partitioning of data across multiple servers.**

**Why use sharding:**

- Dataset too large for single server
- Read/write throughput exceeds single server capacity
- Horizontal scaling

**Shard key:** Field(s) used to distribute data

```javascript
// Enable sharding on database
sh.enableSharding("mydb");

// Shard collection by user_id
sh.shardCollection("mydb.users", { user_id: 1 });

// Compound shard key
sh.shardCollection("mydb.orders", { customerId: 1, orderDate: 1 });

// Hashed shard key (better distribution)
sh.shardCollection("mydb.logs", { _id: "hashed" });
```

**Shard key considerations:**

- High cardinality (many unique values)
- Even distribution
- Query pattern (avoid scatter-gather queries)

---

## 10. Replication

### What is Replication?

**Maintaining copies of data on multiple servers for redundancy and high availability.**

**Replica Set:** Group of MongoDB instances with same data

**Components:**

- **Primary**: Receives all writes
- **Secondary**: Replicates from primary
- **Arbiter**: Participates in elections (no data)

```javascript
// Initiate replica set
rs.initiate({
  _id: "myReplicaSet",
  members: [
    { _id: 0, host: "mongodb0.example.com:27017" },
    { _id: 1, host: "mongodb1.example.com:27017" },
    { _id: 2, host: "mongodb2.example.com:27017" }
  ]
});

// Add member
rs.add("mongodb3.example.com:27017");

// Check status
rs.status();

// Read from secondary (eventually consistent)
db.users.find().readPref("secondary");
```

**Benefits:**

- High availability (automatic failover)
- Data redundancy
- Read scaling (read from secondaries)

---

## 11. Backup and Restore

### Backup with mongodump

```bash
# Backup entire database
mongodump --db mydb --out /backup/

# Backup specific collection
mongodump --db mydb --collection users --out /backup/

# Backup with authentication
mongodump --uri="mongodb://user:pass@localhost:27017/mydb" --out /backup/

# Compressed backup
mongodump --db mydb --archive=/backup/mydb.archive --gzip
```

### Restore with mongorestore

```bash
# Restore database
mongorestore --db mydb /backup/mydb/

# Restore specific collection
mongorestore --db mydb --collection users /backup/mydb/users.bson

# Restore from archive
mongorestore --archive=/backup/mydb.archive --gzip

# Drop existing data before restore
mongorestore --db mydb --drop /backup/mydb/
```

### Backup with Atlas (Cloud)

```javascript
// Automated backups (snapshots)
// Configure in Atlas UI:
// - Point-in-time restore
// - Scheduled snapshots
// - Retention policies
```

---

## 12. Caching with Redis

### When to use Redis with MongoDB

```javascript
// Node.js example
const redis = require('redis');
const { MongoClient } = require('mongodb');

const redisClient = redis.createClient();
const mongoClient = new MongoClient('mongodb://localhost:27017');

async function getUser(userId) {
  // 1. Try cache first
  const cached = await redisClient.get(`user:${userId}`);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. Cache miss - query MongoDB
  const db = mongoClient.db('mydb');
  const user = await db.collection('users').findOne({ _id: userId });

  // 3. Store in cache (1 hour TTL)
  await redisClient.setEx(`user:${userId}`, 3600, JSON.stringify(user));

  return user;
}

// Invalidate cache on update
async function updateUser(userId, data) {
  const db = mongoClient.db('mydb');
  await db.collection('users').updateOne({ _id: userId }, { $set: data });

  // Invalidate cache
  await redisClient.del(`user:${userId}`);
}
```

---

## 13. Full-Text Search with ElasticSearch

### Why ElasticSearch with MongoDB?

**MongoDB text search is limited. ElasticSearch provides:**

- Advanced relevance scoring
- Fuzzy matching
- Synonyms
- Autocomplete
- Multi-language support

```javascript
// Sync MongoDB to ElasticSearch
const { MongoClient } = require('mongodb');
const { Client } = require('@elastic/elasticsearch');

const mongoClient = new MongoClient('mongodb://localhost:27017');
const esClient = new Client({ node: 'http://localhost:9200' });

// Watch MongoDB changes and sync to ElasticSearch
async function syncToElastic() {
  const db = mongoClient.db('mydb');
  const changeStream = db.collection('articles').watch();

  changeStream.on('change', async (change) => {
    if (change.operationType === 'insert') {
      await esClient.index({
        index: 'articles',
        id: change.fullDocument._id.toString(),
        document: {
          title: change.fullDocument.title,
          content: change.fullDocument.content,
          tags: change.fullDocument.tags
        }
      });
    }
  });
}

// Search with ElasticSearch
async function searchArticles(query) {
  const result = await esClient.search({
    index: 'articles',
    query: {
      multi_match: {
        query: query,
        fields: ['title^2', 'content']  // Boost title relevance
      }
    }
  });

  return result.hits.hits.map(hit => hit._source);
}
```

---

## 🎯 Interview Quick Tips

**Be ready to explain:**

- When to embed vs reference (normalization)
- How $lookup works (performance implications)
- Sharding vs replication (differences)
- Index types and when to use each
- Aggregation pipeline stages
- Backup strategies
- Why use Redis cache with MongoDB
- ElasticSearch vs MongoDB text search

**Practice these queries:**

- Find documents with array containing value
- Group and count by field
- Join two collections
- Create compound index
- Update nested document
- Aggregation with multiple stages

Good luck! 🚀
