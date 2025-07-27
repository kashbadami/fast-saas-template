import { getDocsByCategory } from "~/lib/docs";
import { DocsSidebar } from "~/components/docs-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = getDocsByCategory();

  return (
    <div className="flex min-h-screen">
      <DocsSidebar categories={categories} />
      <main className="flex-1">
        <div className="container max-w-4xl py-6 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}