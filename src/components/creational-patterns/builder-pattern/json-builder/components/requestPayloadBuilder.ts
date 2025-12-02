type RequestPayload = {
  user?: { name: string; email: string };
  filters?: { country?: string; ageRange?: [number, number] };
  pagination?: { page: number; limit: number };
  include?: string[];
};

export class RequestPayloadBuilder {
  private readonly payload: RequestPayload = {};

  build() {
    return {...this.payload}
  }

  setUser(name: string, email: string) {
    this.payload.user = { name, email };
    return this;
  }

  setFilters(filters: { country?: string; ageRange?: [number, number] }) {
    this.payload.filters = filters;
    return this;
  }

  setPagination(page: number, limit: number) {
    this.payload.pagination = { page, limit };
    return this;
  }

  include(...fields: string[]) {
    this.payload.include = fields;
    return this;
  }
}
