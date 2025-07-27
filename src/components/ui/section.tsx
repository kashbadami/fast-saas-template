import { cn } from "~/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  pill?: string;
  title: React.ReactNode;
  subtitle?: string;
  id?: string;
  titleClassName?: string;
}

export function Section({ 
  children, 
  className, 
  pill, 
  title, 
  subtitle,
  id,
  titleClassName
}: SectionProps) {
  return (
    <section id={id} className={cn("py-24", className)}>
      <div className="container max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="mx-auto flex flex-col items-center gap-4 text-center">
          {pill && (
            <div className="inline-flex items-center gap-2 bg-[#f97316]/10 border border-[#f97316]/30 text-[#f97316] rounded-full px-4 py-1.5 text-sm font-medium">
              {pill}
            </div>
          )}
          <h2 className={cn("text-4xl font-medium tracking-tight text-pretty md:text-6xl", titleClassName)}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-base text-muted-foreground md:text-lg max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        <div className="mt-12">
          {children}
        </div>
      </div>
    </section>
  );
}