export interface State {
  next(): void
  prev(): void
  getStatus(): string
}