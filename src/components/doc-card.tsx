import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { FileText, ArrowRight } from "lucide-react";
import { type Doc } from "~/lib/docs";

interface DocCardProps {
  doc: Doc;
}

export function DocCard({ doc }: DocCardProps) {
  return (
    <Link href={`/docs/${doc.slug}`}>
      <Card className="group h-full transition-all hover:shadow-lg hover:border-[#f97316]/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <FileText className="h-8 w-8 text-[#f97316] mb-2" />
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <CardTitle className="text-lg">{doc.meta.title}</CardTitle>
          {doc.meta.description && (
            <CardDescription className="mt-2">
              {doc.meta.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {doc.meta.category}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}