# File Storage Abstraction Layer

This template includes a flexible file storage abstraction that supports multiple providers out of the box.

## Configuration

Set the storage provider in your `.env` file:

```bash
# For local development
STORAGE_PROVIDER=console
UPLOAD_DIR=./uploads
UPLOAD_BASE_URL=http://localhost:3000/uploads

# For production with AWS S3
STORAGE_PROVIDER=s3
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_PUBLIC_URL=https://cdn.yourdomain.com # Optional CDN URL
```

## Usage in Your Application

### Basic File Upload

```typescript
import { storage } from "~/server/storage";

// In your tRPC router or server-side code
const file = await storage.upload(
  "user-avatars/123/profile.jpg",
  buffer,
  {
    mimeType: "image/jpeg",
    public: true,
  }
);
```

### Generate Signed URLs

```typescript
// Get a temporary signed URL (expires in 1 hour)
const url = await storage.getSignedUrl("private-docs/report.pdf", 3600);
```

### Delete Files

```typescript
await storage.delete("user-avatars/123/profile.jpg");
```

### Check if File Exists

```typescript
const exists = await storage.exists("user-avatars/123/profile.jpg");
```

## Example: User Avatar Upload

Here's a complete example of implementing user avatar uploads:

```typescript
// src/server/api/routers/user.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { storage } from "~/server/storage";

export const userRouter = createTRPCRouter({
  uploadAvatar: protectedProcedure
    .input(
      z.object({
        data: z.string(), // Base64 encoded image
        mimeType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const buffer = Buffer.from(input.data, "base64");
      
      // Upload to storage
      const key = `avatars/${userId}/${Date.now()}.jpg`;
      const file = await storage.upload(key, buffer, {
        mimeType: input.mimeType,
        public: true,
      });
      
      // Update user record
      await ctx.db.user.update({
        where: { id: userId },
        data: { image: file.url || storage.getPublicUrl(key) },
      });
      
      return { url: file.url };
    }),
});
```

## Supported Providers

### Console (Local Development)
- Stores files on local filesystem
- Useful for development without cloud dependencies
- Files are served via Next.js API routes

### AWS S3
- Production-ready cloud storage
- Supports S3-compatible services (MinIO, DigitalOcean Spaces, etc.)
- Automatic signed URL generation
- Public/private file support

### Adding Custom Providers

Create a new provider by implementing the `StorageProvider` interface:

```typescript
import { type StorageProvider } from "~/server/storage/types";

export class CustomStorageProvider implements StorageProvider {
  async upload(key: string, file: Buffer, options?: UploadOptions) {
    // Your implementation
  }
  
  // Implement other required methods...
}
```

Then use it:

```typescript
import { StorageService } from "~/server/storage";
import { CustomStorageProvider } from "./custom-provider";

const storage = new StorageService({
  provider: "custom",
  instance: new CustomStorageProvider(),
});
```