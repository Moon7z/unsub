export interface AssetInfo {
    originalUrl: string;
    buffer: Buffer;
    filename: string;
    mimeType: string;
}
export declare class AssetHandler {
    downloadAsset(url: string): Promise<AssetInfo>;
    private extractFilename;
    isImageUrl(url: string): boolean;
}
//# sourceMappingURL=assets.d.ts.map