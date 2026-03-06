import type { NotionConfig, NotionPage, NotionBlock } from './types.js';
export declare class NotionClient {
    private client;
    private config;
    constructor(config: NotionConfig);
    getAllPages(pageIds?: string[]): Promise<NotionPage[]>;
    private extractTitle;
    private extractParentId;
    getPageBlocks(pageId: string): Promise<NotionBlock[]>;
    private parseBlock;
    private parseRichText;
    downloadFile(url: string): Promise<Buffer>;
}
//# sourceMappingURL=client.d.ts.map