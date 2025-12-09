import { ReportTemplate } from '../ReportTemplate';

export class UserReport extends ReportTemplate {
  private readonly users: number;

  constructor(users: number) {
    super();
    this.users = users;
  }

  protected generateTitle(): string {
    return 'User Report';
  }

  protected generateContent(): string {
    return `Total Users: ${this.users}`;
  }
}
