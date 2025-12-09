export abstract class ReportTemplate {
  generateReport(): string {
    return `
    ${this.generateTitle()}
    ${this.generateContent()}
    ${this.generateFooter()}
    `;
  }

  protected abstract generateTitle(): string;
  protected abstract generateContent(): string;
  generateFooter(): string {
    return `Generated On: ${new Date().toLocaleDateString()}`;
  }
}
