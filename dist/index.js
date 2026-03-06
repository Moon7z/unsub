#!/usr/bin/env node
import { Command } from 'commander';
import { notionCommand } from './commands/notion.js';
const program = new Command();
program
    .name('unsub')
    .description('CLI tool to migrate from SaaS to self-hosted alternatives')
    .version('0.1.0');
program
    .command('notion')
    .description('Migrate from Notion to self-hosted alternatives')
    .argument('<target>', 'Target platform (outline, appflowy, docmost)')
    .option('--token <token>', 'Notion Integration Token')
    .option('--url <url>', 'Target platform URL')
    .option('--api-key <key>', 'Target platform API Key')
    .option('--pages <ids>', 'Comma-separated page IDs to migrate')
    .option('--dry-run', 'Preview mode without actual migration')
    .option('--output <file>', 'Export migration report to file')
    .option('--concurrency <number>', 'Number of concurrent operations', '3')
    .action(notionCommand);
program.parse();
//# sourceMappingURL=index.js.map