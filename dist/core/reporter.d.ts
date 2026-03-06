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
export declare class Reporter {
    private results;
    private startTime;
    start(): void;
    addResult(result: MigrationPageResult): void;
    generateReport(): MigrationReport;
    saveToFile(filePath: string): Promise<void>;
}
//# sourceMappingURL=reporter.d.ts.map