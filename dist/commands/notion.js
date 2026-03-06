import chalk from 'chalk';
import { Migrator } from '../core/migrator.js';
export async function notionCommand(target, options) {
    if (target !== 'outline') {
        console.error(chalk.red(`Target "${target}" is not supported yet. Currently only "outline" is available.`));
        process.exit(1);
    }
    const notionToken = options.token || process.env.NOTION_TOKEN;
    if (!notionToken) {
        console.error(chalk.red('Error: Notion token is required. Use --token or set NOTION_TOKEN environment variable.'));
        process.exit(1);
    }
    if (!options.dryRun) {
        const outlineUrl = options.url || process.env.OUTLINE_URL;
        const outlineApiKey = options.apiKey || process.env.OUTLINE_API_KEY;
        if (!outlineUrl) {
            console.error(chalk.red('Error: Outline URL is required. Use --url or set OUTLINE_URL environment variable.'));
            process.exit(1);
        }
        if (!outlineApiKey) {
            console.error(chalk.red('Error: Outline API Key is required. Use --api-key or set OUTLINE_API_KEY environment variable.'));
            process.exit(1);
        }
    }
    const pageIds = options.pages ? options.pages.split(',').map(p => p.trim()) : undefined;
    const concurrency = parseInt(options.concurrency || '3', 10);
    console.log(chalk.cyan('Starting Notion → Outline migration...'));
    console.log(chalk.gray(`  Target: ${target}`));
    console.log(chalk.gray(`  Pages: ${pageIds ? pageIds.length : 'all'}`));
    console.log(chalk.gray(`  Concurrency: ${concurrency}`));
    console.log(chalk.gray(`  Dry run: ${options.dryRun || false}`));
    console.log();
    const migrator = new Migrator({
        notionToken,
        outlineUrl: options.url || '',
        outlineApiKey: options.apiKey || '',
        concurrency,
        dryRun: options.dryRun || false,
    });
    try {
        await migrator.migrate(pageIds);
        if (!options.dryRun && options.output) {
            await migrator.saveReport(options.output);
            console.log(chalk.green(`\nMigration report saved to: ${options.output}`));
        }
        const report = migrator.getReport();
        console.log(chalk.cyan('\n--- Migration Summary ---'));
        console.log(chalk.gray(`Total: ${report.summary.total}`));
        console.log(chalk.green(`Succeeded: ${report.summary.succeeded}`));
        console.log(chalk.red(`Failed: ${report.summary.failed}`));
        console.log(chalk.gray(`Duration: ${report.summary.duration.toFixed(2)}s`));
        if (report.summary.failed > 0) {
            process.exit(1);
        }
    }
    catch (error) {
        console.error(chalk.red('\nMigration failed:'), error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}
//# sourceMappingURL=notion.js.map