interface NotionCommandOptions {
    token?: string;
    url?: string;
    apiKey?: string;
    pages?: string;
    dryRun?: boolean;
    output?: string;
    concurrency?: string;
}
export declare function notionCommand(target: string, options: NotionCommandOptions): Promise<void>;
export {};
//# sourceMappingURL=notion.d.ts.map