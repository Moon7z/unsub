import fetch from 'node-fetch';
import type { OutlineConfig, OutlineCollection, OutlineDocument, CreateCollectionRequest, CreateDocumentRequest } from './types.js';

export class OutlineClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config: OutlineConfig) {
    this.baseUrl = config.url.replace(/\/$/, '');
    this.headers = {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async createCollection(request: CreateCollectionRequest): Promise<OutlineCollection> {
    const response = await fetch(`${this.baseUrl}/api/collections.create`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        name: request.name,
        description: request.description || '',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create collection: ${response.status} - ${error}`);
    }

    const data = await response.json() as any;
    return {
      id: data.data.id,
      name: data.data.name,
      description: data.data.description,
    };
  }

  async createDocument(request: CreateDocumentRequest): Promise<OutlineDocument> {
    const response = await fetch(`${this.baseUrl}/api/documents.create`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        title: request.title,
        text: request.text,
        collectionId: request.collectionId,
        parentDocumentId: request.parentDocumentId || null,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to create document: ${response.status} - ${error}`);
    }

    const data = await response.json() as any;
    return {
      id: data.data.id,
      title: data.data.title,
      url: `${this.baseUrl}/doc/${data.data.id}`,
      parentDocumentId: request.parentDocumentId,
      collectionId: request.collectionId,
    };
  }

  async uploadAttachment(file: Buffer, filename: string): Promise<string> {
    const formData = new FormData();
    
    const blob = new Blob([file]);
    formData.append('file', blob, filename);

    const response = await fetch(`${this.baseUrl}/api/attachments.create`, {
      method: 'POST',
      headers: {
        'Authorization': this.headers['Authorization'],
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to upload attachment: ${response.status} - ${error}`);
    }

    const data = await response.json() as any;
    return data.data.url;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/collections.list`, {
        method: 'GET',
        headers: this.headers,
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
