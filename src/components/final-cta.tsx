import { FileCode, Github } from "lucide-react";
import Link from "next/link";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Section } from "~/components/ui/section";
import { Headline } from "~/components/ui/headline";
import { content } from "~/lib/config";

const FinalCta = () => {
  const { finalCta } = content;
  
  return (
    <Section
      id="get-started"
      pill={finalCta.badge}
      title={<Headline config={finalCta.headline} />}
      subtitle={finalCta.description}
    >
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link href={finalCta.primaryButton.href} target="_blank" rel="noopener noreferrer">
              {finalCta.primaryButton.text}
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={finalCta.secondaryButton.href}>
              {finalCta.secondaryButton.text}
            </Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          <Link
            href="/docs"
            className="group relative rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:border-[#f97316]/20"
          >
            <FileCode className="h-10 w-10 text-[#f97316] mb-4" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold mb-2">Documentation</h3>
            <p className="text-sm text-muted-foreground">
              Learn how to validate your business idea in 72 hours with our comprehensive guides
            </p>
            <span className="absolute inset-0" aria-hidden="true" />
          </Link>

          <Link
            href="https://github.com/kashbadami/fast-saas-template"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:border-[#f97316]/20"
          >
            <Github className="h-10 w-10 text-[#f97316] mb-4" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold mb-2">GitHub Repository</h3>
            <p className="text-sm text-muted-foreground">
              Clone the template and start building your SaaS today. Star us if you like it!
            </p>
            <span className="absolute inset-0" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Section>
  );
};

export { FinalCta };