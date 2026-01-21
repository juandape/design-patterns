# Day 5: Mock Interview Challenges

## 🎯 Timed Challenges - Simulate Real Interview Conditions

**Instructions:**

1. Set a **strict timer** for each challenge
2. **No looking at solutions** until time is up
3. **Speak out loud** in English while coding
4. **Record yourself** if possible
5. After completing, review and compare with solutions

---

## Challenge 1: Full Stack Feature (45 min)

### Problem: Build a Simple Todo API with Next.js

**Requirements:**

- Create a Next.js App Router application
- Build API routes for CRUD operations
- Create a simple UI to display and add todos
- Use TypeScript
- Handle errors properly
- Add loading states

**Timer: 45 minutes**

**Features to implement:**

1. `GET /api/todos` - Get all todos
2. `POST /api/todos` - Create a new todo
3. `PUT /api/todos/[id]` - Update todo status
4. `DELETE /api/todos/[id]` - Delete todo
5. UI with list and form

**Files to create:**

- `app/api/todos/route.ts`
- `app/api/todos/[id]/route.ts`
- `app/todos/page.tsx`
- `components/TodoList.tsx`
- `types/todo.ts`

---

## Challenge 2: Algorithm Problem (30 min)

### Problem: LRU Cache Implementation

**Requirements:**
Implement a Least Recently Used (LRU) cache with the following methods:

- `get(key)`: Get value by key (return -1 if not found)
- `put(key, value)`: Set or update the value
- When cache is full, remove least recently used item
- Both operations should be O(1)

**Example:**

```javascript
const cache = new LRUCache(2); // capacity = 2

cache.put(1, 1);
cache.put(2, 2);
cache.get(1);      // returns 1
cache.put(3, 3);   // evicts key 2
cache.get(2);      // returns -1 (not found)
cache.put(4, 4);   // evicts key 1
cache.get(1);      // returns -1 (not found)
cache.get(3);      // returns 3
cache.get(4);      // returns 4
```

**Timer: 30 minutes**

**Hint:** Use a combination of HashMap and Doubly Linked List

---

## Challenge 3: React/TypeScript Component (35 min)

### Problem: Autocomplete Search Component

**Requirements:**

- Create a reusable autocomplete component
- Fetch suggestions from an API
- Debounce API calls (300ms)
- Handle loading and error states
- Keyboard navigation (up/down arrows, enter)
- TypeScript with proper types
- Accessible (ARIA labels)

**Features:**

1. Input field that triggers search
2. Dropdown with suggestions
3. Highlight matching text
4. Click or keyboard select
5. Show "No results" state
6. Show loading indicator

**Timer: 35 minutes**

---

## Challenge 4: Backend API Design (40 min)

### Problem: Authentication System

**Requirements:**
Design and implement a basic authentication system with:

- User registration
- User login (JWT)
- Protected routes middleware
- Password hashing (bcrypt)
- Input validation
- Error handling
- TypeScript

**Endpoints:**

1. `POST /api/auth/register` - Register new user
2. `POST /api/auth/login` - Login and get token
3. `GET /api/users/me` - Get current user (protected)
4. `POST /api/auth/refresh` - Refresh access token

**Timer: 40 minutes**

---

## Challenge 5: System Design Question (30 min)

### Problem: Design a URL Shortener

**Task:** Design a URL shortening service like bit.ly

**Requirements:**

1. Describe the architecture
2. Database schema
3. API endpoints
4. How to generate short URLs
5. How to handle collisions
6. How to scale the system
7. Analytics (optional)

**Discuss:**

- Data structures
- Algorithms
- Trade-offs
- Scalability
- Performance

**Format:** Written explanation with diagrams (draw.io, whiteboard)

**Timer: 30 minutes**

---

## Mock Interview Scenarios

### Scenario 1: Behavioral + Technical (60 min)

**Part 1: Behavioral (15 min)**
Practice answering these in English:

1. "Tell me about yourself and your experience as a developer"
2. "Describe a challenging project you worked on"
3. "How do you handle disagreements with team members?"
4. "Tell me about a time you had to learn something new quickly"
5. "Where do you see yourself in 5 years?"

**Part 2: Technical Questions (20 min)**
Answer these conceptual questions:

1. "Explain the difference between Server Components and Client Components in Next.js"
2. "How does the event loop work in Node.js?"
3. "What are the differences between SQL and NoSQL databases?"
4. "Explain CORS and how to handle it"
5. "What is the difference between authentication and authorization?"

**Part 3: Live Coding (25 min)**
Implement a debounce function from scratch and explain it

---

### Scenario 2: Pure Coding Interview (60 min)

**Problem 1 (20 min):** Two Sum
Given an array of integers and a target, return indices of two numbers that add up to target.

**Problem 2 (20 min):** Group Anagrams
Given an array of strings, group anagrams together.

**Problem 3 (20 min):** Implement a simple Promise.race()

---

### Scenario 3: Take-Home Challenge Review (45 min)

**Scenario:** You submitted a take-home project. The interviewer asks about it.

**Prepare to explain:**

1. Architecture decisions
2. Why you chose specific technologies
3. How you structured the code
4. How you would test it
5. How you would scale it
6. What you would improve with more time

**Practice with your own projects:**

- Pick one of your GitHub projects
- Prepare a 5-minute explanation
- Be ready to dive deep into any part
- Explain trade-offs you made

---

## Evaluation Rubric - Rate Yourself

### Communication (1-5)

- [ ] Explained thought process clearly
- [ ] Asked clarifying questions
- [ ] Spoke in English comfortably
- [ ] Used correct technical terms
- [ ] Engaged with interviewer

### Problem Solving (1-5)

- [ ] Understood the problem
- [ ] Identified edge cases
- [ ] Chose appropriate approach
- [ ] Optimized solution
- [ ] Handled errors

### Code Quality (1-5)

- [ ] Clean, readable code
- [ ] Good variable names
- [ ] Proper TypeScript types
- [ ] Handled edge cases
- [ ] Added comments where needed

### Technical Knowledge (1-5)

- [ ] Correct implementation
- [ ] Understood time/space complexity
- [ ] Knew relevant APIs/libraries
- [ ] Explained trade-offs
- [ ] Suggested improvements

**Total: \_\_\_/20**

**Goal:** Score 16+ consistently

---

## Common Interview Questions Bank

### JavaScript

1. What is closure? Give an example.
2. Explain async/await vs Promises
3. What is the event loop?
4. Difference between `map`, `forEach`, `filter`, `reduce`
5. What is hoisting?
6. Explain `this` keyword
7. What are arrow functions and how do they differ?
8. What is prototypal inheritance?
9. What are higher-order functions?
10. Explain debounce vs throttle

### TypeScript

1. What are generics?
2. Difference between `type` and `interface`?
3. What are utility types?
4. Explain conditional types
5. What is type narrowing?
6. How do you handle unknown types safely?
7. What are mapped types?
8. Explain `infer` keyword
9. What is `never` type used for?
10. How do you type a function that returns different types based on input?

### Node.js

1. How does Node.js handle concurrency?
2. What are streams?
3. Explain middleware in Express
4. How do you handle errors in async code?
5. What is the difference between `process.nextTick()` and `setImmediate()`?
6. How do you structure a Node.js application?
7. Explain JWT authentication
8. What are some security best practices?
9. How do you handle file uploads?
10. Explain caching strategies

### Next.js

1. App Router vs Pages Router?
2. Server Components vs Client Components?
3. Different rendering strategies (SSR, SSG, ISR)?
4. How does caching work?
5. What are Server Actions?
6. How do you optimize images?
7. How do you handle authentication?
8. Explain middleware in Next.js
9. How do you deploy Next.js?
10. How do you improve Core Web Vitals?

### React

1. What are hooks and why were they introduced?
2. Explain useEffect and its dependency array
3. What is the virtual DOM?
4. Explain reconciliation
5. What is prop drilling and how to avoid it?
6. Controlled vs uncontrolled components?
7. How does React.memo work?
8. What is the Context API?
9. Explain custom hooks
10. What are React Server Components?

### System Design

1. How would you design a chat application?
2. Design a social media feed
3. How would you implement real-time notifications?
4. Design a rate limiter
5. How would you scale a database?
6. Explain microservices architecture
7. How do you handle authentication across microservices?
8. Design a caching strategy
9. How would you implement infinite scroll?
10. Design a file upload system

---

## Day Before Interview Checklist

### Technical Prep

- [ ] Review all conceptual questions
- [ ] Practice 2-3 coding problems
- [ ] Review your resume/projects
- [ ] Prepare questions to ask interviewer
- [ ] Test your coding environment

### Logistics

- [ ] Test camera and microphone
- [ ] Test internet connection
- [ ] Prepare quiet workspace
- [ ] Have water nearby
- [ ] Charge devices
- [ ] Test screen sharing (if remote)

### Mental Prep

- [ ] Get good sleep (7-8 hours)
- [ ] Eat a proper meal
- [ ] Exercise or meditate
- [ ] Review "wins" - past successes
- [ ] Positive affirmations
- [ ] Relax - you're prepared!

---

## Interview Day Tips

### Morning Of

1. Wake up early, don't rush
2. Eat a good breakfast
3. Review notes (don't cram)
4. Warm up voice (practice speaking English)
5. Arrive/log in 10 minutes early

### During Interview

1. **Breathe** - Take your time
2. **Listen carefully** - Don't interrupt
3. **Ask questions** - Show engagement
4. **Think out loud** - Explain your process
5. **Stay positive** - Even if you make mistakes
6. **Be yourself** - Authentic is best

### After Interview

1. Send thank you email within 24 hours
2. Reflect on what went well
3. Note areas for improvement
4. Don't obsess over mistakes
5. Prepare for next round

---

## Sample Thank You Email

```
Subject: Thank you - [Position] Interview

Dear [Interviewer Name],

Thank you for taking the time to speak with me today about the Senior Full Stack Developer position at EPAM. I really enjoyed our discussion about [specific topic you discussed].

I'm particularly excited about [specific project or aspect of the role] and believe my experience with [relevant technology/project] would allow me to contribute meaningfully to the team.

The coding challenge was engaging, and it reinforced my interest in working with your team on [specific technology or problem domain].

Please let me know if you need any additional information from me. I look forward to hearing about the next steps.

Best regards,
[Your Name]
```

---

## Final Motivation

**Remember:**

- You've prepared thoroughly
- Your experience is valuable
- Mistakes are okay - show how you handle them
- Communication matters more than perfection
- Be confident but humble
- You belong here!

**"The expert in anything was once a beginner."**

---

## Emergency: If You're Stuck During Interview

### The 3-Step Recovery

1. **Acknowledge**: "Hmm, let me think about this differently..."
2. **Simplify**: "Let me start with a simpler version..."
3. **Communicate**: "Here's my thought process... [explain out loud]"

### Phrases to Buy Time

- "That's an interesting problem. Give me a moment to think..."
- "Let me break this down into smaller parts..."
- "I'm considering a few different approaches..."
- "Could we walk through an example together?"

---

**You're ready! Trust your preparation! 🚀**

**Good luck with EPAM! 💪**
