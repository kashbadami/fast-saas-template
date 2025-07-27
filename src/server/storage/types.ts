/**
 * File storage types and interfaces
 */

export interface FileMetadata {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  url?: string;
  uploadedAt: Date;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface UploadOptions {
  /**
   * Override the file name
   */
  fileName?: string;
  
  /**
   * File content type
   */
  mimeType?: string;
  
  /**
   * Make file publicly accessible
   */
  public?: boolean;
  
  /**
   * Additional metadata to store
   */
  metadata?: Record<string, any>;
  
  /**
   * Expiration time for signed URLs (in seconds)
   */
  expiresIn?: number;
}

export interface StorageProvider {
  /**
   * Upload a file
   */
  upload(
    key: string,
    file: Buffer | Uint8Array | Blob | ReadableStream,
    options?: UploadOptions
  ): Promise<FileMetadata>;
  
  /**
   * Get a signed URL for file access
   */
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
  
  /**
   * Get a public URL (if file is public)
   */
  getPublicUrl(key: string): string;
  
  /**
   * Delete a file
   */
  delete(key: string): Promise<void>;
  
  /**
   * Check if file exists
   */
  exists(key: string): Promise<boolean>;
  
  /**
   * Get file metadata
   */
  getMetadata(key: string): Promise<FileMetadata | null>;
  
  /**
   * List files with optional prefix
   */
  list(prefix?: string, limit?: number): Promise<FileMetadata[]>;
}