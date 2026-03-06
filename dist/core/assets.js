import fetch from 'node-fetch';
import mime from 'mime-types';
export class AssetHandler {
    async downloadAsset(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to download asset: ${response.statusText}`);
        }
        const buffer = Buffer.from(await response.arrayBuffer());
        const filename = this.extractFilename(url);
        const mimeType = mime.lookup(filename) || 'application/octet-stream';
        return {
            originalUrl: url,
            buffer,
            filename,
            mimeType,
        };
    }
    extractFilename(url) {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const filename = pathParts[pathParts.length - 1];
            if (filename && filename.includes('.')) {
                return filename;
            }
            const ext = mime.extension(urlObj.searchParams.get('extension') || '') || 'bin';
            return `asset_${Date.now()}.${ext}`;
        }
        catch {
            return `asset_${Date.now()}`;
        }
    }
    isImageUrl(url) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        try {
            const urlObj = new URL(url);
            const path = urlObj.pathname.toLowerCase();
            return imageExtensions.some(ext => path.endsWith(ext));
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=assets.js.map