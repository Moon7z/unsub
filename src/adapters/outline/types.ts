export interface OutlineConfig {
  url: string;
  apiKey: string;
}

export interface OutlineCollection {
  id: string;
  name: string;
  description?: string;
}

export interface OutlineDocument {
  id: string;
  title: string;
  url: string;
  parentDocumentId?: string;
  collectionId?: string;
}

export interface CreateCollectionRequest {
  name: string;
  description?: string;
}

export interface CreateDocumentRequest {
  title: string;
  text: string;
  collectionId: string;
  parentDocumentId?: string;
}
