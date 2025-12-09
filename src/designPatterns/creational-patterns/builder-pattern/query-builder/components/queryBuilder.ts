export class QueryBuilder {
  private readonly params: Record<string, string | number | boolean> = {};

  searchTerm(term: string) {
    this.params.search = term;
    return this;
  }

  where(key: string, value: string | number | boolean) {
    this.params[key] = String(value);
    return this;
  }

  sort(field: string) {
    this.params.sort = field;
    return this;
  }

  order(direction: 'asc' | 'desc') {
    this.params.order = direction;
    return this;
  }

  paginate(page: number, limit: number) {
    this.params.page = page;
    this.params.limit = limit;
    return this;
  }

  build() {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(this.params)) {
      searchParams.append(key, String(value));
    }

    return `${searchParams.toString()}`;
  }
}
