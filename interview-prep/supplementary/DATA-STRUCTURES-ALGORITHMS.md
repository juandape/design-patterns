# Data Structures & Algorithms - EPAM Interview Prep

> **Target**: EPAM Round 2 - Coding Interview
> **Focus**: Common DS&A patterns for senior full stack developer position

---

## Table of Contents

1. [Big O Notation](#big-o-notation)
2. [Arrays & Strings](#arrays-strings)
3. [Hash Tables](#hash-tables)
4. [Linked Lists](#linked-lists)
5. [Stacks & Queues](#stacks-queues)
6. [Trees & Binary Search Trees](#trees-bst)
7. [Graphs](#graphs)
8. [Sorting Algorithms](#sorting)
9. [Searching Algorithms](#searching)
10. [Dynamic Programming](#dynamic-programming)
11. [Common Patterns](#common-patterns)

---

## Big O Notation

### Time Complexity

```typescript
// O(1) - Constant
function getFirst(arr: number[]): number {
  return arr[0];
}

// O(log n) - Logarithmic (binary search)
function binarySearch(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}

// O(n) - Linear
function findMax(arr: number[]): number {
  let max = arr[0];
  for (const num of arr) {
    if (num > max) max = num;
  }
  return max;
}

// O(n log n) - Linearithmic (merge sort, quick sort)
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

// O(n²) - Quadratic (nested loops)
function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// O(2^n) - Exponential (naive fibonacci)
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// O(n!) - Factorial (permutations)
function permutations(arr: number[]): number[][] {
  if (arr.length <= 1) return [arr];

  const result: number[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of permutations(rest)) {
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}
```

### Space Complexity

```typescript
// O(1) - Constant space
function sum(arr: number[]): number {
  let total = 0; // Only one variable
  for (const num of arr) {
    total += num;
  }
  return total;
}

// O(n) - Linear space
function double(arr: number[]): number[] {
  const result = []; // New array of size n
  for (const num of arr) {
    result.push(num * 2);
  }
  return result;
}

// O(n) - Recursive call stack
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // n recursive calls
}
```

---

## Arrays & Strings

### Two Pointers Pattern

```typescript
// Problem: Check if string is palindrome
function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }

  return true;
}

// Problem: Two sum (sorted array)
function twoSum(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }

  return [];
}

// Problem: Remove duplicates from sorted array
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;

  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }

  return slow + 1;
}
```

### Sliding Window Pattern

```typescript
// Problem: Maximum sum subarray of size k
function maxSumSubarray(arr: number[], k: number): number {
  let maxSum = 0;
  let windowSum = 0;

  // Initial window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;

  // Slide window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

// Problem: Longest substring without repeating characters
function lengthOfLongestSubstring(s: string): number {
  const seen = new Map<string, number>();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    if (seen.has(char) && seen.get(char)! >= left) {
      left = seen.get(char)! + 1;
    }

    seen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

// Problem: Minimum window substring
function minWindow(s: string, t: string): string {
  const need = new Map<string, number>();
  for (const char of t) {
    need.set(char, (need.get(char) || 0) + 1);
  }

  const window = new Map<string, number>();
  let left = 0, right = 0;
  let valid = 0;
  let start = 0, len = Infinity;

  while (right < s.length) {
    const char = s[right];
    right++;

    if (need.has(char)) {
      window.set(char, (window.get(char) || 0) + 1);
      if (window.get(char) === need.get(char)) {
        valid++;
      }
    }

    while (valid === need.size) {
      if (right - left < len) {
        start = left;
        len = right - left;
      }

      const leftChar = s[left];
      left++;

      if (need.has(leftChar)) {
        if (window.get(leftChar) === need.get(leftChar)) {
          valid--;
        }
        window.set(leftChar, window.get(leftChar)! - 1);
      }
    }
  }

  return len === Infinity ? '' : s.substring(start, start + len);
}
```

### Array Manipulation

```typescript
// Problem: Rotate array
function rotate(nums: number[], k: number): void {
  k = k % nums.length;
  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
}

function reverse(nums: number[], start: number, end: number): void {
  while (start < end) {
    [nums[start], nums[end]] = [nums[end], nums[start]];
    start++;
    end--;
  }
}

// Problem: Product of array except self
function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array(n).fill(1);

  // Left products
  let left = 1;
  for (let i = 0; i < n; i++) {
    result[i] = left;
    left *= nums[i];
  }

  // Right products
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= right;
    right *= nums[i];
  }

  return result;
}

// Problem: Merge intervals
function merge(intervals: number[][]): number[][] {
  intervals.sort((a, b) => a[0] - b[0]);

  const result: number[][] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    const current = intervals[i];

    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      result.push(current);
    }
  }

  return result;
}
```

---

## Hash Tables

### Basic Operations

```typescript
// Using Map (preferred in modern JS)
const map = new Map<string, number>();

// Set
map.set('key', 42); // O(1)

// Get
map.get('key'); // 42 - O(1)

// Has
map.has('key'); // true - O(1)

// Delete
map.delete('key'); // O(1)

// Size
map.size; // 0

// Iterate
for (const [key, value] of map) {
  console.log(key, value);
}

// Using Object
const obj: Record<string, number> = {};
obj['key'] = 42;
obj['key']; // 42
delete obj['key'];
Object.keys(obj).length; // 0
```

### Common Patterns

```typescript
// Problem: Two sum
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }

  return [];
}

// Problem: Group anagrams
function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();

  for (const str of strs) {
    const key = str.split('').sort().join('');
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(str);
  }

  return Array.from(map.values());
}

// Problem: First unique character
function firstUniqChar(s: string): number {
  const freq = new Map<string, number>();

  for (const char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  for (let i = 0; i < s.length; i++) {
    if (freq.get(s[i]) === 1) {
      return i;
    }
  }

  return -1;
}

// Problem: Subarray sum equals K
function subarraySum(nums: number[], k: number): number {
  const map = new Map<number, number>();
  map.set(0, 1);

  let sum = 0;
  let count = 0;

  for (const num of nums) {
    sum += num;
    if (map.has(sum - k)) {
      count += map.get(sum - k)!;
    }
    map.set(sum, (map.get(sum) || 0) + 1);
  }

  return count;
}
```

---

## Linked Lists

### Implementation

```typescript
class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

class LinkedList {
  head: ListNode | null = null;

  // Add to end - O(n)
  append(val: number): void {
    const newNode = new ListNode(val);

    if (!this.head) {
      this.head = newNode;
      return;
    }

    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
  }

  // Add to beginning - O(1)
  prepend(val: number): void {
    const newNode = new ListNode(val, this.head);
    this.head = newNode;
  }

  // Delete node - O(n)
  delete(val: number): void {
    if (!this.head) return;

    if (this.head.val === val) {
      this.head = this.head.next;
      return;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.val === val) {
        current.next = current.next.next;
        return;
      }
      current = current.next;
    }
  }

  // Search - O(n)
  find(val: number): ListNode | null {
    let current = this.head;
    while (current) {
      if (current.val === val) return current;
      current = current.next;
    }
    return null;
  }
}
```

### Common Patterns

```typescript
// Problem: Reverse linked list
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let current = head;

  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
}

// Problem: Detect cycle (Floyd's algorithm)
function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;

    if (slow === fast) return true;
  }

  return false;
}

// Problem: Find middle node
function middleNode(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }

  return slow;
}

// Problem: Merge two sorted lists
function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let current = dummy;

  while (l1 && l2) {
    if (l1.val < l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }

  current.next = l1 || l2;

  return dummy.next;
}

// Problem: Remove Nth node from end
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let slow: ListNode | null = dummy;
  let fast: ListNode | null = dummy;

  // Move fast n+1 steps ahead
  for (let i = 0; i <= n; i++) {
    fast = fast!.next;
  }

  // Move both until fast reaches end
  while (fast) {
    slow = slow!.next;
    fast = fast.next;
  }

  // Remove node
  slow!.next = slow!.next!.next;

  return dummy.next;
}
```

---

## Stacks & Queues

### Stack Implementation

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

// Problem: Valid parentheses
function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{'
  };

  for (const char of s) {
    if (char in pairs) {
      if (stack.pop() !== pairs[char]) {
        return false;
      }
    } else {
      stack.push(char);
    }
  }

  return stack.length === 0;
}

// Problem: Min stack
class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];

  push(val: number): void {
    this.stack.push(val);
    const min = this.minStack.length === 0
      ? val
      : Math.min(val, this.minStack[this.minStack.length - 1]);
    this.minStack.push(min);
  }

  pop(): void {
    this.stack.pop();
    this.minStack.pop();
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    return this.minStack[this.minStack.length - 1];
  }
}
```

### Queue Implementation

```typescript
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  front(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

// Problem: Implement queue using stacks
class MyQueue {
  private stack1: number[] = [];
  private stack2: number[] = [];

  push(x: number): void {
    this.stack1.push(x);
  }

  pop(): number {
    this.peek();
    return this.stack2.pop()!;
  }

  peek(): number {
    if (this.stack2.length === 0) {
      while (this.stack1.length > 0) {
        this.stack2.push(this.stack1.pop()!);
      }
    }
    return this.stack2[this.stack2.length - 1];
  }

  empty(): boolean {
    return this.stack1.length === 0 && this.stack2.length === 0;
  }
}
```

---

## Trees & Binary Search Trees

### Implementation

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

class BST {
  root: TreeNode | null = null;

  insert(val: number): void {
    this.root = this.insertNode(this.root, val);
  }

  private insertNode(node: TreeNode | null, val: number): TreeNode {
    if (!node) return new TreeNode(val);

    if (val < node.val) {
      node.left = this.insertNode(node.left, val);
    } else {
      node.right = this.insertNode(node.right, val);
    }

    return node;
  }

  search(val: number): boolean {
    return this.searchNode(this.root, val);
  }

  private searchNode(node: TreeNode | null, val: number): boolean {
    if (!node) return false;
    if (node.val === val) return true;

    return val < node.val
      ? this.searchNode(node.left, val)
      : this.searchNode(node.right, val);
  }
}
```

### Tree Traversals

```typescript
// Inorder (Left, Root, Right) - gives sorted for BST
function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];

  function traverse(node: TreeNode | null): void {
    if (!node) return;
    traverse(node.left);
    result.push(node.val);
    traverse(node.right);
  }

  traverse(root);
  return result;
}

// Preorder (Root, Left, Right)
function preorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];

  function traverse(node: TreeNode | null): void {
    if (!node) return;
    result.push(node.val);
    traverse(node.left);
    traverse(node.right);
  }

  traverse(root);
  return result;
}

// Postorder (Left, Right, Root)
function postorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];

  function traverse(node: TreeNode | null): void {
    if (!node) return;
    traverse(node.left);
    traverse(node.right);
    result.push(node.val);
  }

  traverse(root);
  return result;
}

// Level order (BFS)
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];

  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const level: number[] = [];
    const size = queue.length;

    for (let i = 0; i < size; i++) {
      const node = queue.shift()!;
      level.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(level);
  }

  return result;
}
```

### Common Problems

```typescript
// Problem: Maximum depth
function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// Problem: Validate BST
function isValidBST(root: TreeNode | null, min = -Infinity, max = Infinity): boolean {
  if (!root) return true;

  if (root.val <= min || root.val >= max) return false;

  return isValidBST(root.left, min, root.val) &&
         isValidBST(root.right, root.val, max);
}

// Problem: Lowest common ancestor
function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode
): TreeNode | null {
  if (!root || root === p || root === q) return root;

  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  if (left && right) return root;
  return left || right;
}

// Problem: Serialize and deserialize
function serialize(root: TreeNode | null): string {
  const result: (number | null)[] = [];

  function dfs(node: TreeNode | null): void {
    if (!node) {
      result.push(null);
      return;
    }
    result.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }

  dfs(root);
  return JSON.stringify(result);
}

function deserialize(data: string): TreeNode | null {
  const values: (number | null)[] = JSON.parse(data);
  let index = 0;

  function dfs(): TreeNode | null {
    if (index >= values.length) return null;

    const val = values[index++];
    if (val === null) return null;

    const node = new TreeNode(val);
    node.left = dfs();
    node.right = dfs();
    return node;
  }

  return dfs();
}
```

---

## Sorting Algorithms

### Quick Sort - O(n log n) average, O(n²) worst

```typescript
function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);

  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// In-place version
function quickSortInPlace(arr: number[], left = 0, right = arr.length - 1): void {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSortInPlace(arr, left, pivotIndex - 1);
    quickSortInPlace(arr, pivotIndex + 1, right);
  }
}

function partition(arr: number[], left: number, right: number): number {
  const pivot = arr[right];
  let i = left - 1;

  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}
```

### Merge Sort - O(n log n)

```typescript
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}
```

---

## Dynamic Programming

### Classic Problems

```typescript
// Problem: Fibonacci (memoization)
function fibonacci(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;

  const result = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  memo.set(n, result);
  return result;
}

// Problem: Coin change
function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i >= coin) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Problem: Longest increasing subsequence
function lengthOfLIS(nums: number[]): number {
  const dp = new Array(nums.length).fill(1);

  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }

  return Math.max(...dp);
}

// Problem: 0/1 Knapsack
function knapsack(weights: number[], values: number[], capacity: number): number {
  const n = weights.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          values[i - 1] + dp[i - 1][w - weights[i - 1]]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[n][capacity];
}
```

---

## Interview Tips

1. **Clarify the problem**: Ask about edge cases, constraints
2. **Think out loud**: Explain your thought process
3. **Start with brute force**: Then optimize
4. **Consider trade-offs**: Time vs space complexity
5. **Test your code**: Walk through with examples
6. **Practice common patterns**: Two pointers, sliding window, DFS/BFS
7. **Know Big O**: Of all solutions you propose
8. **Use meaningful names**: Even in interviews

**Common Mistakes to Avoid**:

- Not handling edge cases (empty array, null, single element)
- Off-by-one errors in loops
- Forgetting to return values
- Not considering negative numbers, duplicates
- Inefficient string concatenation (use array.join())

Good luck! 🚀
