import { getDocsByCategory } from "~/lib/docs";
import { DocCard } from "~/components/doc-card";
import { Button } from "~/components/ui/button";
import { Home, Rocket } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Documentation - Fast SaaS Template",
  description: "Learn how to use the Fast SaaS Template to build and launch your SaaS quickly",
};

export default function DocsOverviewPage() {
  const categories = getDocsByCategory();

  return (
    <div>
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Documentation
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about building with the Fast SaaS Template.
          From quick starts to advanced features.
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button asChild>
            <Link href="/docs/getting-started">
              <Rocket className="mr-2 h-4 w-4" />
              Get Started
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3 mb-12">
        <Card className="group p-6 hover:shadow-lg transition-all hover:border-[#f97316]/20">
          <Link href="/docs/getting-started" className="block">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#f97316]/10 text-[#f97316]">
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Quick Start</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Get your SaaS up and running in minutes
            </p>
          </Link>
        </Card>

        <Card className="group p-6 hover:shadow-lg transition-all hover:border-[#f97316]/20">
          <Link href="/docs/google-auth-setup" className="block">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#1e40af]/10 text-[#1e40af]">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Authentication</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Set up secure user authentication
            </p>
          </Link>
        </Card>

        <Card className="group p-6 hover:shadow-lg transition-all hover:border-[#f97316]/20">
          <Link href="/docs/file-storage" className="block">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Storage</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              File uploads with S3 and cloud storage
            </p>
          </Link>
        </Card>
      </div>

      {/* All Docs by Category */}
      <div className="space-y-12">
        {categories.map((category) => (
          <div key={category.name}>
            <h2 className="text-2xl font-semibold tracking-tight mb-6 pb-2 border-b">
              {category.name}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.docs.map((doc) => (
                <DocCard key={doc.slug} doc={doc} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t text-center">
        <p className="text-sm text-muted-foreground">
          Can&apos;t find what you&apos;re looking for?{" "}
          <Link href="https://github.com/yourusername/fast-saas-template/issues" className="text-[#f97316] hover:underline">
            Open an issue
          </Link>{" "}
          on GitHub.
        </p>
      </div>
    </div>
  );
}

// Import missing icons
import { Card } from "~/components/ui/card";
import { Shield, Database } from "lucide-react";