export interface MigrationPageResult {
  notionId: string;
  notionTitle: string;
  outlineId?: string;
  outlineUrl?: string;
  status: 'success' | 'failed';
  imagesMigrated: number;
  warnings: string[];
  error?: string;
}

export interface MigrationSummary {
  total: number;
  succeeded: number;
  failed: number;
  duration: number;
}

export interface MigrationReport {
  summary: MigrationSummary;
  pages: MigrationPageResult[];
}

export class Reporter {
  private results: MigrationPageResult[] = [];
  private startTime: number = 0;

  start(): void {
    this.startTime = Date.now();
    this.results = [];
  }

  addResult(result: MigrationPageResult): void {
    this.results.push(result);
  }

  generateReport(): MigrationReport {
    const duration = (Date.now() - this.startTime) / 1000;
    const succeeded = this.results.filter(r => r.status === 'success').length;
    const failed = this.results.filter(r => r.status === 'failed').length;

    return {
      summary: {
        total: this.results.length,
        succeeded,
        failed,
        duration,
      },
      pages: this.results,
    };
  }

  async saveToFile(filePath: string): Promise<void> {
    const report = this.generateReport();
    const fs = await import('fs/promises');
    await fs.writeFile(filePath, JSON.stringify(report, null, 2), 'utf-8');
  }
}
