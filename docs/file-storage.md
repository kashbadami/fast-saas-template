---
title: File Storage
description: Learn how to use the file storage abstraction layer for uploads and cloud storage
category: Features
order: 4
---

# File Storage Guide

The Fast SaaS Template includes a powerful file storage abstraction layer that allows you to easily integrate file uploads and management into your application. It supports multiple storage providers and can be easily extended.

## Overview

The file storage system provides:
- **Provider Abstraction**: Switch between local and cloud storage with configuration
- **Type Safety**: Full TypeScript support with proper types
- **Multiple Providers**: Console (local) and S3 (AWS/compatible) out of the box
- **Signed URLs**: Generate temporary access URLs for private files
- **Metadata Support**: Store custom metadata with your files
- **Database Integration**: Track uploaded files in your database

## Quick Start

### 1. Configure Your Storage Provider

Update your `.env` file based on your environment:

#### Local Development (Console Provider)
```bash
STORAGE_PROVIDER=console
UPLOAD_DIR=./uploads
UPLOAD_BASE_URL=http://localhost:3000/api/files
```

#### Production (AWS S3)
```bash
STORAGE_PROVIDER=s3
AWS_S3_BUCKET=my-app-uploads
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_PUBLIC_URL=https://cdn.myapp.com # Optional: CDN URL
```

### 2. Basic Usage

```typescript
import { storage } from "~/server/storage";

// Upload a file
const fileMetadata = await storage.upload(
  "uploads/documents/report.pdf",
  fileBuffer,
  {
    mimeType: "application/pdf",
    fileName: "Q4 Report.pdf",
    metadata: { userId: "user123" }
  }
);

// Get a signed URL (temporary access)
const url = await storage.getSignedUrl("uploads/documents/report.pdf", 3600);

// Delete a file
await storage.delete("uploads/documents/report.pdf");
```

## Complete Examples

### User Avatar Upload

Here's a complete example implementing user avatar uploads with tRPC:

```typescript
// src/server/api/routers/user.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { storage } from "~/server/storage";
import { TRPCError } from "@trpc/server";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const userRouter = createTRPCRouter({
  uploadAvatar: protectedProcedure
    .input(
      z.object({
        data: z.string(), // Base64 encoded image
        mimeType: z.string().refine(
          (type) => ALLOWED_IMAGE_TYPES.includes(type),
          "Invalid image type"
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const buffer = Buffer.from(input.data, "base64");
      
      // Validate file size
      if (buffer.length > MAX_FILE_SIZE) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "File size must be less than 5MB",
        });
      }
      
      // Delete old avatar if exists
      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        select: { image: true },
      });
      
      if (user?.image) {
        // Extract key from old URL and delete
        const oldKey = user.image.split("/").slice(-3).join("/");
        await storage.delete(oldKey).catch(() => {
          // Ignore errors when deleting old avatar
        });
      }
      
      // Upload new avatar
      const key = `avatars/${userId}/${Date.now()}.jpg`;
      const file = await storage.upload(key, buffer, {
        mimeType: input.mimeType,
        public: true,
      });
      
      // Update user record
      await ctx.db.user.update({
        where: { id: userId },
        data: { 
          image: file.url || storage.getPublicUrl(key) 
        },
      });
      
      return { 
        url: file.url || storage.getPublicUrl(key) 
      };
    }),
    
  removeAvatar: protectedProcedure
    .mutation(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      
      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        select: { image: true },
      });
      
      if (user?.image) {
        // Extract key from URL and delete
        const key = user.image.split("/").slice(-3).join("/");
        await storage.delete(key);
        
        // Clear from database
        await ctx.db.user.update({
          where: { id: userId },
          data: { image: null },
        });
      }
      
      return { success: true };
    }),
});
```

### Document Management System

Example of building a document management feature:

```typescript
// src/server/api/routers/documents.ts
export const documentsRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        data: z.string(), // Base64
        mimeType: z.string(),
        folderId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const buffer = Buffer.from(input.data, "base64");
      
      // Generate unique key
      const timestamp = Date.now();
      const sanitizedName = input.fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const key = `documents/${userId}/${timestamp}-${sanitizedName}`;
      
      // Upload to storage
      const fileMetadata = await storage.upload(key, buffer, {
        fileName: input.fileName,
        mimeType: input.mimeType,
        metadata: {
          uploadedBy: userId,
          folderId: input.folderId,
        },
      });
      
      // Save to database
      const document = await ctx.db.document.create({
        data: {
          key,
          fileName: input.fileName,
          mimeType: input.mimeType,
          size: fileMetadata.size,
          userId,
          folderId: input.folderId,
        },
      });
      
      return document;
    }),
    
  getDownloadUrl: protectedProcedure
    .input(z.object({ documentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const document = await ctx.db.document.findFirst({
        where: {
          id: input.documentId,
          userId: ctx.session.user.id,
        },
      });
      
      if (!document) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found",
        });
      }
      
      // Generate signed URL valid for 1 hour
      const url = await storage.getSignedUrl(document.key, 3600);
      
      return { url, fileName: document.fileName };
    }),
});
```

### React Component for File Upload

```tsx
// src/components/file-upload-zone.tsx
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "~/trpc/react";
import { Loader2, Upload } from "lucide-react";

interface FileUploadZoneProps {
  onUploadComplete?: (document: any) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

export function FileUploadZone({ 
  onUploadComplete,
  accept = {
    'application/pdf': ['.pdf'],
    'image/*': ['.png', '.jpg', '.jpeg', '.gif']
  },
  maxSize = 10 * 1024 * 1024 // 10MB
}: FileUploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  
  const uploadMutation = api.documents.upload.useMutation({
    onSuccess: (data) => {
      onUploadComplete?.(data);
    },
  });
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const data = base64.split(',')[1];
        
        await uploadMutation.mutateAsync({
          fileName: file.name,
          data,
          mimeType: file.type,
        });
        
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      console.error('Upload failed:', error);
    }
  }, [uploadMutation]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });
  
  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
        ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}
      `}
    >
      <input {...getInputProps()} disabled={isUploading} />
      
      {isUploading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p>Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm">
            {isDragActive
              ? "Drop the file here"
              : "Drag & drop a file here, or click to select"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Max file size: {maxSize / 1024 / 1024}MB
          </p>
        </div>
      )}
    </div>
  );
}
```

## Storage Providers

### Console Provider (Local Development)

The console provider stores files locally and is perfect for development:

```typescript
// Automatically configured when STORAGE_PROVIDER=console
// Files are stored in the directory specified by UPLOAD_DIR
// Files can be served through a Next.js API route
```

### S3 Provider (Production)

The S3 provider supports AWS S3 and S3-compatible services:

```typescript
// Supports:
// - AWS S3
// - MinIO
// - DigitalOcean Spaces
// - Backblaze B2 (S3 compatible API)
// - Any S3-compatible service
```

Configuration for S3-compatible services:
```bash
# MinIO example
STORAGE_PROVIDER=s3
AWS_S3_BUCKET=my-bucket
AWS_S3_ENDPOINT=http://localhost:9000
AWS_S3_FORCE_PATH_STYLE=true
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
```

## Creating Custom Providers

You can create custom storage providers for other services:

```typescript
// src/server/storage/providers/cloudinary.ts
import { type StorageProvider, type FileMetadata } from "../types";

export class CloudinaryProvider implements StorageProvider {
  async upload(key: string, file: Buffer, options?: UploadOptions): Promise<FileMetadata> {
    // Implement Cloudinary upload
  }
  
  async getSignedUrl(key: string, expiresIn?: number): Promise<string> {
    // Generate Cloudinary signed URL
  }
  
  async delete(key: string): Promise<void> {
    // Delete from Cloudinary
  }
  
  // Implement other required methods...
}

// Use in your application
import { StorageService } from "~/server/storage";
const storage = new StorageService({
  provider: "custom",
  instance: new CloudinaryProvider(config),
});
```

## Best Practices

### 1. File Organization
```typescript
// Use a consistent key structure
const key = `${resourceType}/${userId}/${timestamp}-${filename}`;
// Examples:
// avatars/user123/1698765432-profile.jpg
// documents/user123/1698765432-report.pdf
// uploads/tenant456/images/1698765432-logo.png
```

### 2. Security
```typescript
// Always validate file types and sizes
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

// Use signed URLs for sensitive files
const signedUrl = await storage.getSignedUrl(key, 300); // 5 minutes
```

### 3. Error Handling
```typescript
try {
  await storage.upload(key, file);
} catch (error) {
  if (error.code === 'NoSuchBucket') {
    // Handle missing bucket
  } else if (error.code === 'AccessDenied') {
    // Handle permission issues
  }
  // Log and handle appropriately
}
```

### 4. Cleanup
```typescript
// Delete old files when uploading new ones
if (oldFileKey) {
  await storage.delete(oldFileKey).catch(() => {
    // Log but don't fail the operation
  });
}

// Implement cleanup jobs for orphaned files
```

## Database Integration

Track uploaded files in your database for better management:

```prisma
model File {
  id          String   @id @default(cuid())
  key         String   @unique
  fileName    String
  mimeType    String
  size        Int
  url         String?
  metadata    Json?
  
  uploadedBy  User     @relation(fields: [uploadedById], references: [id])
  uploadedById String
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([uploadedById])
}
```

## Troubleshooting

### Local Development Issues

**Files not accessible**
- Ensure `UPLOAD_DIR` exists and is writable
- Check that your Next.js app can serve static files

**Console provider not working**
- Verify `STORAGE_PROVIDER=console` in `.env`
- Check file permissions on upload directory

### S3 Issues

**Access Denied errors**
- Verify IAM permissions include `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`
- Check bucket policies and CORS configuration

**Signed URLs not working**
- Ensure your AWS credentials have `s3:GetObject` permission
- Check if bucket requires specific headers

### General Tips

1. **Enable debug logging**:
```typescript
// The console provider logs all operations by default
// For S3, enable AWS SDK logging:
process.env.AWS_SDK_LOAD_CONFIG = '1';
```

2. **Test uploads locally first**:
```bash
STORAGE_PROVIDER=console npm run dev
```

3. **Validate configuration**:
```typescript
// Add to your app startup
if (env.STORAGE_PROVIDER === 's3' && !env.AWS_S3_BUCKET) {
  throw new Error('S3 bucket required when using S3 provider');
}
```

## Migration Guide

If you're migrating from direct S3 usage to this abstraction:

```typescript
// Before
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const s3 = new S3Client({...});
await s3.send(new PutObjectCommand({...}));

// After
import { storage } from "~/server/storage";
await storage.upload(key, file, options);
```

The abstraction handles all the complexity while maintaining flexibility.