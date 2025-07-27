import { type StorageProvider, type FileMetadata, type UploadOptions } from "../types";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface ConsoleStorageConfig {
  uploadDir?: string;
  baseUrl?: string;
}

/**
 * Console storage provider for local development
 * Stores files locally and logs operations
 */
export class ConsoleStorageProvider implements StorageProvider {
  private uploadDir: string;
  private baseUrl: string;
  private files = new Map<string, FileMetadata>();

  constructor(config: ConsoleStorageConfig = {}) {
    this.uploadDir = config.uploadDir ?? path.join(process.cwd(), "uploads");
    this.baseUrl = config.baseUrl ?? "http://localhost:3000/uploads";
    
    // Ensure upload directory exists
    void this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async upload(
    key: string,
    file: Buffer | Uint8Array | Blob | ReadableStream,
    options?: UploadOptions
  ): Promise<FileMetadata> {
    console.log(`[Storage] Uploading file: ${key}`);

    // Convert file to Buffer
    let buffer: Buffer;
    if (file instanceof Blob) {
      buffer = Buffer.from(await file.arrayBuffer());
    } else if (file instanceof ReadableStream) {
      const chunks: Uint8Array[] = [];
      const reader = file.getReader();
      
      while (true) {
        const { done, value } = await reader.read() as { done: boolean; value: Uint8Array };
        if (done) break;
        chunks.push(value);
      }
      
      buffer = Buffer.concat(chunks);
    } else {
      buffer = Buffer.from(file);
    }

    // Save file locally
    const filePath = path.join(this.uploadDir, key);
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    const metadata: FileMetadata = {
      id: key,
      fileName: options?.fileName ?? key.split("/").pop() ?? key,
      mimeType: options?.mimeType ?? "application/octet-stream",
      size: buffer.length,
      uploadedAt: new Date(),
      metadata: options?.metadata,
      url: `${this.baseUrl}/${key}`,
    };

    this.files.set(key, metadata);
    
    console.log(`[Storage] File uploaded successfully:`, metadata);
    return metadata;
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    // For local development, just return the public URL with a token
    const token = crypto.randomBytes(16).toString("hex");
    const expiry = new Date(Date.now() + expiresIn * 1000).getTime();
    
    const url = `${this.baseUrl}/${key}?token=${token}&expires=${expiry}`;
    console.log(`[Storage] Generated signed URL for ${key}: ${url}`);
    
    return url;
  }

  getPublicUrl(key: string): string {
    return `${this.baseUrl}/${key}`;
  }

  async delete(key: string): Promise<void> {
    console.log(`[Storage] Deleting file: ${key}`);
    
    const filePath = path.join(this.uploadDir, key);
    try {
      await fs.unlink(filePath);
      this.files.delete(key);
      console.log(`[Storage] File deleted successfully: ${key}`);
    } catch (error) {
      console.error(`[Storage] Error deleting file ${key}:`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    const filePath = path.join(this.uploadDir, key);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async getMetadata(key: string): Promise<FileMetadata | null> {
    // Check in-memory cache first
    if (this.files.has(key)) {
      return this.files.get(key)!;
    }

    // Check if file exists on disk
    const filePath = path.join(this.uploadDir, key);
    try {
      const stats = await fs.stat(filePath);
      
      const metadata: FileMetadata = {
        id: key,
        fileName: key.split("/").pop() ?? key,
        mimeType: "application/octet-stream",
        size: stats.size,
        uploadedAt: stats.birthtime,
        url: `${this.baseUrl}/${key}`,
      };
      
      return metadata;
    } catch {
      return null;
    }
  }

  async list(prefix?: string, limit = 100): Promise<FileMetadata[]> {
    console.log(`[Storage] Listing files with prefix: ${prefix ?? "none"}`);
    
    const results: FileMetadata[] = [];
    
    // List from in-memory cache
    for (const [key, metadata] of this.files.entries()) {
      if (!prefix || key.startsWith(prefix)) {
        results.push(metadata);
        if (results.length >= limit) break;
      }
    }
    
    console.log(`[Storage] Found ${results.length} files`);
    return results;
  }
}