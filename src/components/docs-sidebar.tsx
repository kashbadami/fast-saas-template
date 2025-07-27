"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { 
  ChevronRight, 
  FileText, 
  Home,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { type DocCategory } from "~/lib/docs";

interface DocsSidebarProps {
  categories: DocCategory[];
}

export function DocsSidebar({ categories }: DocsSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (slug: string) => {
    return pathname === `/docs/${slug}`;
  };
  
  const isOverviewActive = pathname === "/docs/overview" || pathname === "/docs";

  const SidebarContent = () => (
    <div className="py-6 pr-6 lg:py-8">
      <Link 
        href="/"
        className="flex items-center gap-2 px-2 mb-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        Back to Home
      </Link>

      {/* Overview Link */}
      <Link
        href="/docs/overview"
        onClick={() => setIsMobileOpen(false)}
        className={cn(
          "group flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors mb-6",
          isOverviewActive
            ? "bg-[#f97316]/10 text-[#f97316] font-medium"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <FileText className="h-4 w-4 shrink-0" />
        <span>Overview</span>
        {isOverviewActive && (
          <ChevronRight className="ml-auto h-4 w-4 shrink-0" />
        )}
      </Link>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.name}>
            <h4 className="mb-3 text-sm font-semibold text-muted-foreground px-2">
              {category.name}
            </h4>
            <div className="space-y-1">
              {category.docs.map((doc) => (
                <Link
                  key={doc.slug}
                  href={`/docs/${doc.slug}`}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "group flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                    isActive(doc.slug)
                      ? "bg-[#f97316]/10 text-[#f97316] font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="truncate">{doc.meta.title}</span>
                  {isActive(doc.slug) && (
                    <ChevronRight className="ml-auto h-4 w-4 shrink-0" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="sticky top-0 z-40 lg:hidden">
        <div className="flex h-16 items-center gap-4 border-b bg-background px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <span className="font-semibold">Documentation</span>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r">
        <ScrollArea className="h-full">
          <SidebarContent />
        </ScrollArea>
      </aside>

      {/* Mobile sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <aside className="fixed left-0 top-0 h-full w-64 border-r bg-background">
            <ScrollArea className="h-full">
              <SidebarContent />
            </ScrollArea>
          </aside>
        </div>
      )}
    </>
  );
}