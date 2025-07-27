import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface DocMeta {
  title: string;
  description?: string;
  order?: number;
  category?: string;
}

export interface Doc {
  slug: string;
  meta: DocMeta;
  content: string;
}

export interface DocCategory {
  name: string;
  docs: Doc[];
}

const docsDirectory = path.join(process.cwd(), "docs");

export function getDocSlugs(): string[] {
  try {
    const files = fs.readdirSync(docsDirectory);
    return files
      .filter((file) => file.endsWith(".md"))
      .map((file) => {
        // Remove .md extension and ensure kebab-case
        const slug = file.replace(/\.md$/, "");
        // Convert SNAKE_CASE to kebab-case if needed
        return slug.toLowerCase().replace(/_/g, "-");
      });
  } catch (error) {
    console.error("Error reading docs directory:", error);
    return [];
  }
}

export function getDocBySlug(slug: string): Doc | null {
  try {
    const fullPath = path.join(docsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      meta: {
        title: (data.title as string | undefined) ?? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        description: data.description as string | undefined,
        order: (data.order as number | undefined) ?? 999,
        category: (data.category as string | undefined) ?? "General",
      },
      content,
    };
  } catch (error) {
    console.error(`Error reading doc ${slug}:`, error);
    return null;
  }
}

export function getAllDocs(): Doc[] {
  const slugs = getDocSlugs();
  const docs = slugs
    .map((slug) => getDocBySlug(slug))
    .filter((doc): doc is Doc => doc !== null)
    .sort((a, b) => (a.meta.order ?? 999) - (b.meta.order ?? 999));

  return docs;
}

export function getDocsByCategory(): DocCategory[] {
  const docs = getAllDocs();
  const categories = new Map<string, Doc[]>();

  docs.forEach((doc) => {
    const category = doc.meta.category ?? "General";
    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category)!.push(doc);
  });

  // Sort categories and convert to array
  const categoryOrder = ["Getting Started", "Features", "API", "General"];
  
  return Array.from(categories.entries())
    .map(([name, docs]) => ({ name, docs }))
    .sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.name);
      const bIndex = categoryOrder.indexOf(b.name);
      
      if (aIndex === -1 && bIndex === -1) {
        return a.name.localeCompare(b.name);
      }
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
}