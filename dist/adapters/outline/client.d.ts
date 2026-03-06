import type { OutlineConfig, OutlineCollection, OutlineDocument, CreateCollectionRequest, CreateDocumentRequest } from './types.js';
export declare class OutlineClient {
    private baseUrl;
    private headers;
    constructor(config: OutlineConfig);
    createCollection(request: CreateCollectionRequest): Promise<OutlineCollection>;
    createDocument(request: CreateDocumentRequest): Promise<OutlineDocument>;
    uploadAttachment(file: Buffer, filename: string): Promise<string>;
    testConnection(): Promise<boolean>;
}
//# sourceMappingURL=client.d.ts.map