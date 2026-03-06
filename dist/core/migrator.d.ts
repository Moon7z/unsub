import { Reporter } from './reporter.js';
export interface MigratorConfig {
    notionToken: string;
    outlineUrl: string;
    outlineApiKey: string;
    concurrency: number;
    dryRun: boolean;
}
export declare class Migrator {
    private notionClient;
    private notionParser;
    private outlineClient;
    private assetHandler;
    private reporter;
    private config;
    private collectionId;
    private pageIdMap;
    constructor(config: MigratorConfig);
    initialize(): Promise<void>;
    migrate(pages?: string[]): Promise<void>;
    private buildPageTree;
    private migratePage;
    private extractImageUrls;
    getReport(): ReturnType<Reporter['generateReport']>;
    saveReport(filePath: string): Promise<void>;
}
//# sourceMappingURL=migrator.d.ts.map