export interface Iterator<T> {
  hasNext(): boolean;
  next(): T | null;
  current(): T | null;
  previous(): T | null;
  hasPrevious(): boolean;
  reset(): void;
}
