import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type StorageProvider, type FileMetadata, type UploadOptions } from "../types";

export interface S3StorageConfig {
  bucket: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string; // For S3-compatible services
  forcePathStyle?: boolean; // For MinIO and other S3-compatible services
  publicBaseUrl?: string; // Base URL for public files
}

export class S3StorageProvider implements StorageProvider {
  private client: S3Client;
  private bucket: string;
  private publicBaseUrl?: string;

  constructor(config: S3StorageConfig) {
    this.bucket = config.bucket;
    this.publicBaseUrl = config.publicBaseUrl;

    this.client = new S3Client({
      region: config.region ?? process.env.AWS_REGION ?? "us-east-1",
      credentials: config.accessKeyId && config.secretAccessKey
        ? {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          }
        : undefined,
      endpoint: config.endpoint,
      forcePathStyle: config.forcePathStyle,
    });
  }

  async upload(
    key: string,
    file: Buffer | Uint8Array | Blob | ReadableStream,
    options?: UploadOptions
  ): Promise<FileMetadata> {
    const body = file instanceof Blob ? Buffer.from(await file.arrayBuffer()) : file;
    
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body as Buffer | Uint8Array,
      ContentType: options?.mimeType,
      Metadata: options?.metadata as Record<string, string> | undefined,
      ACL: options?.public ? "public-read" : undefined,
    });

    await this.client.send(command);

    const metadata: FileMetadata = {
      id: key,
      fileName: options?.fileName ?? key.split("/").pop() ?? key,
      mimeType: options?.mimeType ?? "application/octet-stream",
      size: body instanceof Buffer ? body.length : 0,
      uploadedAt: new Date(),
      metadata: options?.metadata,
    };

    if (options?.public && this.publicBaseUrl) {
      metadata.url = this.getPublicUrl(key);
    }

    return metadata;
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }

  getPublicUrl(key: string): string {
    if (this.publicBaseUrl) {
      return `${this.publicBaseUrl}/${key}`;
    }
    
    // Default S3 public URL format
    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.client.send(command);
  }

  async exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  async getMetadata(key: string): Promise<FileMetadata | null> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.client.send(command);

      return {
        id: key,
        fileName: key.split("/").pop() ?? key,
        mimeType: response.ContentType ?? "application/octet-stream",
        size: response.ContentLength ?? 0,
        uploadedAt: response.LastModified ?? new Date(),
        metadata: response.Metadata,
      };
    } catch {
      return null;
    }
  }

  async list(prefix?: string, limit = 100): Promise<FileMetadata[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
      MaxKeys: limit,
    });

    const response = await this.client.send(command);
    
    return (response.Contents ?? []).map((object) => ({
      id: object.Key!,
      fileName: object.Key!.split("/").pop() ?? object.Key!,
      mimeType: "application/octet-stream",
      size: object.Size ?? 0,
      uploadedAt: object.LastModified ?? new Date(),
    }));
  }
}