export class NotionParser {
    parseBlocksToMarkdown(blocks) {
        const lines = [];
        let listIndex = 0;
        let listType = null;
        for (const block of blocks) {
            const result = this.parseBlock(block, listIndex, listType);
            if (result.isListItem) {
                if (listType !== result.listType) {
                    listIndex = 0;
                    listType = result.listType;
                }
                listIndex++;
            }
            else {
                listIndex = 0;
                listType = null;
            }
            if (result.content) {
                lines.push(result.content);
            }
        }
        return lines.join('\n');
    }
    parseBlock(block, listIndex, listType) {
        const { type, content } = block;
        switch (type) {
            case 'paragraph':
                return { content, isListItem: false, listType: null };
            case 'heading_1':
                return { content: `# ${content}`, isListItem: false, listType: null };
            case 'heading_2':
                return { content: `## ${content}`, isListItem: false, listType: null };
            case 'heading_3':
                return { content: `### ${content}`, isListItem: false, listType: null };
            case 'bulleted_list_item':
                return { content: `- ${content}`, isListItem: true, listType: 'bulleted' };
            case 'numbered_list_item':
                return { content: `${listIndex}. ${content}`, isListItem: true, listType: 'numbered' };
            case 'to_do': {
                const checked = block.checked ?? false;
                return { content: `- [${checked ? 'x' : ' '}] ${content}`, isListItem: true, listType: 'bulleted' };
            }
            case 'code': {
                const language = block.language || '';
                return { content: `\`\`\`${language}\n${content}\n\`\`\``, isListItem: false, listType: null };
            }
            case 'quote':
                return { content: `> ${content}`, isListItem: false, listType: null };
            case 'callout': {
                const icon = block.icon?.emoji || '💡';
                return { content: `> ${icon} ${content}`, isListItem: false, listType: null };
            }
            case 'divider':
                return { content: '---', isListItem: false, listType: null };
            case 'image':
                return { content: `![image](${content})`, isListItem: false, listType: null };
            case 'bookmark': {
                const url = content;
                const title = block.caption?.[0]?.plain_text || url;
                return { content: `[${title}](${url})`, isListItem: false, listType: null };
            }
            case 'toggle': {
                const children = block.children;
                let result = `<details><summary>${content}</summary>\n`;
                if (children) {
                    result += this.parseBlocksToMarkdown(children);
                }
                result += '\n</details>';
                return { content: result, isListItem: false, listType: null };
            }
            case 'equation':
                return { content: `$${content}$`, isListItem: false, listType: null };
            case 'table': {
                const rows = block.rows || [];
                const tableContent = rows.map((row) => row.join(' | ')).join('\n');
                return { content: tableContent, isListItem: false, listType: null };
            }
            case 'video':
                return { content: `[Video](${content})`, isListItem: false, listType: null };
            case 'file':
                return { content: `[File](${content})`, isListItem: false, listType: null };
            default:
                return { content: content || `[Unsupported: ${type}]`, isListItem: false, listType: null };
        }
    }
}
//# sourceMappingURL=parser.js.map