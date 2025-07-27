import { type LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";

interface BadgeItem {
  text: string;
  color: string;
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
  badges?: BadgeItem[];
  titleSize?: "default" | "large";
  descriptionSize?: "default" | "large";
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = "text-[#f97316] border-[#f97316]",
  className,
  colSpan = 1,
  rowSpan = 1,
  badges,
  titleSize = "default",
  descriptionSize = "default",
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-transform duration-300 hover:-translate-y-0.5",
        colSpan === 2 && "md:col-span-2",
        rowSpan === 2 && "lg:row-span-2",
        className
      )}
    >
      <div className="h-full bg-gradient-to-br from-slate-100/50 via-slate-50/30 to-transparent dark:from-slate-800/50 dark:via-slate-900/30 dark:to-transparent rounded-lg -m-6 p-6">
        <div className={cn("flex h-full flex-col", badges && "justify-between")}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 flex-shrink-0", iconColor)}>
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className={cn(
                "font-semibold text-foreground",
                titleSize === "large" && "text-2xl lg:text-3xl"
              )}>{title}</h3>
            </div>
            <p className={cn(
              "text-muted-foreground",
              descriptionSize === "default" ? "text-sm" : "text-base lg:text-lg leading-relaxed"
            )}>{description}</p>
          </div>
          {badges && badges.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <Badge
                  key={index}
                  className={cn(
                    "border-0 hover:opacity-80 transition-opacity",
                    badge.color
                  )}
                >
                  {badge.text}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}