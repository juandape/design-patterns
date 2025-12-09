import { ReportTemplate } from '../ReportTemplate';

export class SalesReport extends ReportTemplate {
  private readonly sales: number;

  constructor(sales: number) {
    super();
    this.sales = sales;
  }

  protected generateTitle(): string {
    return 'Sales Report';
  }

  protected generateContent(): string {
    return `Total Sales: ${this.sales}`;
  }
}
