import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "~/trpc/server";

export default async function BlogDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const blog = await api.blog.getById({ id: params.id });

  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mx-auto px-4 py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm font-medium hover:underline"
        >
          ← Back to home
        </Link>
        
        <article className="mx-auto max-w-4xl">
          <header className="mb-8">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-300">
              <span>By {blog.author.name ?? "Anonymous"}</span>
              <span>•</span>
              <time dateTime={blog.createdAt.toISOString()}>
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </header>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <div className="whitespace-pre-wrap">{blog.content}</div>
          </div>
        </article>
      </div>
    </main>
  );
}