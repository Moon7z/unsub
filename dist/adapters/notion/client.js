import { Client } from '@notionhq/client';
export class NotionClient {
    client;
    config;
    constructor(config) {
        this.client = new Client({ auth: config.token });
        this.config = config;
    }
    async getAllPages(pageIds) {
        const pages = [];
        const response = await this.client.search({
            filter: { property: 'object', value: 'page' },
        });
        for (const page of response.results) {
            if (page.object !== 'page')
                continue;
            const pageObj = page;
            const id = pageObj.id;
            if (pageIds && pageIds.length > 0 && !pageIds.includes(id)) {
                continue;
            }
            const title = this.extractTitle(pageObj);
            const parentId = this.extractParentId(pageObj);
            pages.push({
                id,
                title,
                parentId,
                createdTime: pageObj.created_time,
                lastEditedTime: pageObj.last_edited_time,
            });
        }
        return pages;
    }
    extractTitle(page) {
        const properties = page.properties;
        if (!properties)
            return 'Untitled';
        for (const key of Object.keys(properties)) {
            const prop = properties[key];
            if (prop.type === 'title' && prop.title) {
                return prop.title.map((t) => t.plain_text).join('') || 'Untitled';
            }
        }
        return 'Untitled';
    }
    extractParentId(page) {
        const parent = page.parent;
        if (!parent)
            return null;
        if (parent.type === 'page_id')
            return parent.page_id;
        if (parent.type === 'database_id')
            return parent.database_id;
        return null;
    }
    async getPageBlocks(pageId) {
        const blocks = [];
        let cursor;
        do {
            const response = await this.client.blocks.children.list({
                block_id: pageId,
                start_cursor: cursor,
            });
            for (const block of response.results) {
                const parsedBlock = this.parseBlock(block);
                if (parsedBlock) {
                    blocks.push(parsedBlock);
                }
            }
            cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
        } while (cursor);
        return blocks;
    }
    parseBlock(block) {
        const type = block.type;
        const blockData = block[type];
        if (!blockData)
            return null;
        let content = '';
        switch (type) {
            case 'paragraph':
                content = this.parseRichText(blockData.rich_text);
                break;
            case 'heading_1':
            case 'heading_2':
            case 'heading_3':
                content = this.parseRichText(blockData.rich_text);
                break;
            case 'bulleted_list_item':
                content = this.parseRichText(blockData.rich_text);
                break;
            case 'numbered_list_item':
                content = this.parseRichText(blockData.rich_text);
                break;
            case 'to_do':
                content = this.parseRichText(blockData.rich_text);
                break;
            case 'code':
                content = blockData.rich_text?.[0]?.plain_text || '';
                break;
            case 'quote':
                content = this.parseRichText(blockData.rich_text);
                break;
            case 'callout':
                content = this.parseRichText(blockData.rich_text);
                break;
            case 'divider':
                content = '';
                break;
            case 'image':
                content = blockData.file?.url || blockData.external?.url || '';
                break;
            case 'bookmark':
                content = blockData.url || '';
                break;
            case 'toggle':
                content = this.parseRichText(blockData.rich_text);
                break;
            case 'equation':
                content = blockData.expression || '';
                break;
            case 'table':
                content = `Table (${blockData.table_width?.columns || 0} cols x ${blockData.table_width?.rows || 0} rows)`;
                break;
            case 'video':
                content = blockData.file?.url || blockData.external?.url || '';
                break;
            case 'file':
                content = blockData.file?.url || blockData.external?.url || '';
                break;
            default:
                content = `[Unsupported block: ${type}]`;
        }
        const result = {
            id: block.id,
            type,
            content,
        };
        return result;
    }
    parseRichText(richText) {
        if (!richText || !Array.isArray(richText))
            return '';
        return richText.map((item) => {
            let text = item.plain_text || '';
            if (item.annotations?.bold)
                text = `**${text}**`;
            if (item.annotations?.italic)
                text = `*${text}*`;
            if (item.annotations?.strikethrough)
                text = `~~${text}~~`;
            if (item.annotations?.code)
                text = `\`${text}\``;
            if (item.href)
                text = `[${text}](${item.href})`;
            return text;
        }).join('');
    }
    async downloadFile(url) {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to download file: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
}
//# sourceMappingURL=client.js.map