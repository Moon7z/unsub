import { NotionClient } from '../adapters/notion/client.js';
import { NotionParser } from '../adapters/notion/parser.js';
import { OutlineClient } from '../adapters/outline/client.js';
import { AssetHandler } from './assets.js';
import { Reporter, MigrationPageResult } from './reporter.js';
import type { NotionPage, NotionBlock } from '../adapters/notion/types.js';

export interface MigratorConfig {
  notionToken: string;
  outlineUrl: string;
  outlineApiKey: string;
  concurrency: number;
  dryRun: boolean;
}

export class Migrator {
  private notionClient: NotionClient;
  private notionParser: NotionParser;
  private outlineClient: OutlineClient;
  private assetHandler: AssetHandler;
  private reporter: Reporter;
  private config: MigratorConfig;
  private collectionId: string | null = null;
  private pageIdMap: Map<string, string> = new Map();

  constructor(config: MigratorConfig) {
    this.notionClient = new NotionClient({ token: config.notionToken });
    this.notionParser = new NotionParser();
    this.outlineClient = new OutlineClient({ url: config.outlineUrl, apiKey: config.outlineApiKey });
    this.assetHandler = new AssetHandler();
    this.reporter = new Reporter();
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.config.dryRun) {
      console.log('[Dry Run] Preview mode - no actual migration will occur');
      return;
    }

    console.log('Creating collection in Outline...');
    this.collectionId = (await this.outlineClient.createCollection({
      name: 'Migrated from Notion',
      description: 'Created by unsub migration tool',
    })).id;
  }

  async migrate(pages?: string[]): Promise<void> {
    this.reporter.start();
    
    console.log('Fetching pages from Notion...');
    const notionPages = await this.notionClient.getAllPages(pages);
    console.log(`Found ${notionPages.length} pages to migrate`);

    if (this.config.dryRun) {
      for (const page of notionPages) {
        console.log(`  - ${page.title} (${page.id})`);
      }
      return;
    }

    await this.initialize();

    const pageTree = this.buildPageTree(notionPages);
    const migratedIds: string[] = [];

    for (const page of pageTree) {
      try {
        const result = await this.migratePage(page, migratedIds);
        this.reporter.addResult(result);
      } catch (error) {
        this.reporter.addResult({
          notionId: page.id,
          notionTitle: page.title,
          status: 'failed',
          imagesMigrated: 0,
          warnings: [],
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  private buildPageTree(pages: NotionPage[]): NotionPage[] {
    const rootPages = pages.filter(p => !p.parentId || !pages.some(parent => parent.id === p.parentId));
    return rootPages;
  }

  private async migratePage(page: NotionPage, migratedIds: string[]): Promise<MigrationPageResult> {
    const warnings: string[] = [];
    let imagesMigrated = 0;

    console.log(`Migrating: ${page.title}`);

    const blocks = await this.notionClient.getPageBlocks(page.id);
    
    let markdown = this.notionParser.parseBlocksToMarkdown(blocks);

    const imageUrls = this.extractImageUrls(blocks);
    for (const url of imageUrls) {
      try {
        const asset = await this.assetHandler.downloadAsset(url);
        const uploadedUrl = await this.outlineClient.uploadAttachment(asset.buffer, asset.filename);
        markdown = markdown.replace(url, uploadedUrl);
        imagesMigrated++;
      } catch (error) {
        warnings.push(`Failed to upload image: ${url}`);
      }
    }

    const parentDocumentId = page.parentId && this.pageIdMap.has(page.parentId) 
      ? this.pageIdMap.get(page.parentId) 
      : undefined;

    const outlineDoc = await this.outlineClient.createDocument({
      title: page.title,
      text: markdown,
      collectionId: this.collectionId!,
      parentDocumentId,
    });

    this.pageIdMap.set(page.id, outlineDoc.id);
    migratedIds.push(page.id);

    return {
      notionId: page.id,
      notionTitle: page.title,
      outlineId: outlineDoc.id,
      outlineUrl: outlineDoc.url,
      status: 'success',
      imagesMigrated,
      warnings,
    };
  }

  private extractImageUrls(blocks: NotionBlock[]): string[] {
    const urls: string[] = [];
    
    for (const block of blocks) {
      if (block.type === 'image' && block.content) {
        urls.push(block.content);
      }
    }
    
    return urls;
  }

  getReport(): ReturnType<Reporter['generateReport']> {
    return this.reporter.generateReport();
  }

  async saveReport(filePath: string): Promise<void> {
    await this.reporter.saveToFile(filePath);
  }
}
