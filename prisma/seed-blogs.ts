import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // First, check if we have a user to assign as author
  let user = await prisma.user.findFirst();
  
  if (!user) {
    // Create a default user for blog posts
    user = await prisma.user.create({
      data: {
        email: "blog@example.com",
        name: "Blog Author",
      },
    });
  }

  // Create 3 blog posts
  const blogs = [
    {
      title: "Getting Started with T3 Stack",
      content: "The T3 Stack is a powerful combination of technologies that provides type safety from your database to your frontend. It includes Next.js for the framework, TypeScript for type safety, tRPC for end-to-end typesafe APIs, Prisma for database management, and NextAuth.js for authentication. This stack is designed to move fast without sacrificing type safety.",
      excerpt: "Learn how the T3 Stack can help you build type-safe applications faster.",
      published: true,
      authorId: user.id,
    },
    {
      title: "Why Type Safety Matters",
      content: "Type safety is not just about catching errors at compile time - it's about building confidence in your codebase. When you have end-to-end type safety, refactoring becomes a breeze, onboarding new developers is easier, and you spend less time debugging runtime errors. The T3 Stack provides this safety from your database queries all the way to your React components.",
      excerpt: "Discover how type safety can transform your development workflow.",
      published: true,
      authorId: user.id,
    },
    {
      title: "Building Scalable SaaS Applications",
      content: "When building a SaaS application, you need a solid foundation that can scale with your business. The T3 Stack provides this foundation with its modular architecture, type safety, and excellent developer experience. From authentication to database management, every piece is designed to work together seamlessly while maintaining flexibility for future growth.",
      excerpt: "Essential tips for building SaaS applications that can scale.",
      published: true,
      authorId: user.id,
    },
  ];

  // Delete existing blogs to avoid duplicates
  await prisma.blog.deleteMany();

  // Create new blogs
  for (const blog of blogs) {
    await prisma.blog.create({
      data: blog,
    });
  }

  console.log("Successfully seeded 3 blog posts!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });