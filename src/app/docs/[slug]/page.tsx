import { notFound } from "next/navigation";
import { getDocBySlug, getDocSlugs } from "~/lib/docs";
import { MarkdownRenderer } from "~/components/markdown-renderer";
import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface DocPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getDocSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  
  if (!doc) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: `${doc.meta.title} - Fast SaaS Documentation`,
    description: doc.meta.description ?? `Learn about ${doc.meta.title}`,
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  // Get navigation links
  const slugs = getDocSlugs();
  const currentIndex = slugs.indexOf(slug);
  const prevSlug = currentIndex > 0 ? slugs[currentIndex - 1] : null;
  const nextSlug = currentIndex < slugs.length - 1 ? slugs[currentIndex + 1] : null;
  
  const prevDoc = prevSlug ? getDocBySlug(prevSlug) : null;
  const nextDoc = nextSlug ? getDocBySlug(nextSlug) : null;

  return (
    <article>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/docs" className="hover:text-foreground transition-colors">
            Docs
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span>{doc.meta.category}</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{doc.meta.title}</h1>
        {doc.meta.description && (
          <p className="text-lg text-muted-foreground mt-2">
            {doc.meta.description}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="mb-16">
        <MarkdownRenderer content={doc.content} />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t pt-6">
        {prevDoc ? (
          <Button variant="ghost" asChild>
            <Link href={`/docs/${prevSlug}`} className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Previous</div>
                <div className="text-sm font-medium">{prevDoc.meta.title}</div>
              </div>
            </Link>
          </Button>
        ) : (
          <div />
        )}

        {nextDoc ? (
          <Button variant="ghost" asChild>
            <Link href={`/docs/${nextSlug}`} className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Next</div>
                <div className="text-sm font-medium">{nextDoc.meta.title}</div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </div>
    </article>
  );
}