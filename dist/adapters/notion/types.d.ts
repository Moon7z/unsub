import type { BlockObjectResponse, PageObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints.js';
export interface NotionConfig {
    token: string;
}
export interface NotionPage {
    id: string;
    title: string;
    parentId: string | null;
    createdTime: string;
    lastEditedTime: string;
}
export interface NotionBlock {
    id: string;
    type: string;
    content: string;
    children?: NotionBlock[];
}
export interface NotionRichText {
    text: string;
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    code: boolean;
    link: string | null;
}
export type NotionBlockResponse = BlockObjectResponse;
export type NotionPageResponse = PageObjectResponse;
export type NotionRichTextResponse = RichTextItemResponse;
//# sourceMappingURL=types.d.ts.map