import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const blogRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        published: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.blog.create({
        data: {
          ...input,
          authorId: ctx.session.user.id,
        },
      });
    }),

  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        published: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.blog.findMany({
        take: input.limit,
        where: input.published !== undefined
          ? { published: input.published }
          : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  getPublished: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.blog.findUnique({
        where: { id: input.id },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        excerpt: z.string().optional(),
        published: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      
      const blog = await ctx.db.blog.findUnique({
        where: { id },
        select: { authorId: true },
      });

      if (!blog || blog.authorId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.blog.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const blog = await ctx.db.blog.findUnique({
        where: { id: input.id },
        select: { authorId: true },
      });

      if (!blog || blog.authorId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.blog.delete({
        where: { id: input.id },
      });
    }),
});