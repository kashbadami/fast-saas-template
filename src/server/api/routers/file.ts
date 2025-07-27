import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { storage } from "~/server/storage";
import { TRPCError } from "@trpc/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
];

export const fileRouter = createTRPCRouter({
  uploadUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string().min(1),
        mimeType: z.string().refine((type) => ALLOWED_MIME_TYPES.includes(type), {
          message: "File type not allowed",
        }),
        size: z.number().max(MAX_FILE_SIZE, {
          message: "File size must be less than 10MB",
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const timestamp = Date.now();
      const key = `uploads/${userId}/${timestamp}-${input.fileName}`;

      // Create file record in database
      const file = await ctx.db.file.create({
        data: {
          key,
          fileName: input.fileName,
          mimeType: input.mimeType,
          size: input.size,
          uploadedById: userId,
        },
      });

      // Get signed upload URL
      const uploadUrl = await storage.getSignedUrl(key, 300); // 5 minutes

      return {
        fileId: file.id,
        uploadUrl,
        key,
      };
    }),

  confirmUpload: protectedProcedure
    .input(
      z.object({
        fileId: z.string(),
        key: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify file exists in storage
      const exists = await storage.exists(input.key);
      if (!exists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found in storage",
        });
      }

      // Get file metadata from storage
      const metadata = await storage.getMetadata(input.key);
      if (!metadata) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not retrieve file metadata",
        });
      }

      // Update file record with storage metadata
      const file = await ctx.db.file.update({
        where: { id: input.fileId },
        data: {
          size: metadata.size,
          url: storage.getPublicUrl(input.key),
        },
      });

      return file;
    }),

  delete: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Get file record
      const file = await ctx.db.file.findUnique({
        where: { id: input.fileId },
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      // Verify ownership
      if (file.uploadedById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to delete this file",
        });
      }

      // Delete from storage
      await storage.delete(file.key);

      // Delete from database
      await ctx.db.file.delete({
        where: { id: input.fileId },
      });

      return { success: true };
    }),

  getSignedUrl: protectedProcedure
    .input(
      z.object({
        fileId: z.string(),
        expiresIn: z.number().min(60).max(3600).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Get file record
      const file = await ctx.db.file.findUnique({
        where: { id: input.fileId },
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      // Verify ownership
      if (file.uploadedById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to access this file",
        });
      }

      // Generate signed URL
      const url = await storage.getSignedUrl(file.key, input.expiresIn ?? 3600);

      return {
        url,
        expiresIn: input.expiresIn ?? 3600,
      };
    }),

  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const files = await ctx.db.file.findMany({
        where: {
          uploadedById: ctx.session.user.id,
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (files.length > input.limit) {
        const nextItem = files.pop();
        nextCursor = nextItem!.id;
      }

      return {
        files,
        nextCursor,
      };
    }),

  // Direct upload for small files (base64 encoded)
  uploadDirect: protectedProcedure
    .input(
      z.object({
        fileName: z.string().min(1),
        mimeType: z.string().refine((type) => ALLOWED_MIME_TYPES.includes(type), {
          message: "File type not allowed",
        }),
        data: z.string(), // Base64 encoded file data
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Decode base64 data
      const buffer = Buffer.from(input.data, "base64");
      
      // Check file size
      if (buffer.length > MAX_FILE_SIZE) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "File size must be less than 10MB",
        });
      }

      const userId = ctx.session.user.id;
      const timestamp = Date.now();
      const key = `uploads/${userId}/${timestamp}-${input.fileName}`;

      // Upload to storage
      const fileMetadata = await storage.upload(key, buffer, {
        fileName: input.fileName,
        mimeType: input.mimeType,
        public: false,
      });

      // Create file record in database
      const file = await ctx.db.file.create({
        data: {
          key,
          fileName: input.fileName,
          mimeType: input.mimeType,
          size: fileMetadata.size,
          url: fileMetadata.url,
          uploadedById: userId,
        },
      });

      return file;
    }),
});