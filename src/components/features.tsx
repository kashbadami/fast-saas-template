"use client";

import * as Icons from "lucide-react";
import { MoveRight } from "lucide-react";
import { Fragment } from "react";
import { Section } from "~/components/ui/section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { content } from "~/lib/config";
import { Headline } from "~/components/ui/headline";

const Features = () => {
  const { features } = content;
  
  // Map color names to gradient classes
  const getGradient = (color: string) => {
    switch (color) {
      case "primary": return "from-[#f97316]/20 to-[#f97316]/5";
      case "emerald": return "from-emerald-500/20 to-emerald-500/5";
      case "blue": return "from-[#1e40af]/20 to-[#1e40af]/5";
      case "purple": return "from-purple-500/20 to-purple-500/5";
      case "rose": return "from-rose-500/20 to-rose-500/5";
      case "teal": return "from-teal-500/20 to-teal-500/5";
      default: return "from-gray-500/20 to-gray-500/5";
    }
  };
  
  const getIconColor = (color: string) => {
    switch (color) {
      case "primary": return "text-[#f97316]";
      case "emerald": return "text-emerald-500";
      case "blue": return "text-[#1e40af]";
      case "purple": return "text-purple-500";
      case "rose": return "text-rose-500";
      case "teal": return "text-teal-500";
      default: return "text-gray-500";
    }
  };

  return (
    <Section
      id="features"
      className="bg-background overflow-hidden"
      pill={features.pill}
      title={<Headline config={features.headline} />}
      subtitle={features.subheadline}
    >
      <div className="mt-12">
        {/* Mobile view - simple carousel */}
        <div className="lg:hidden">
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {features.items.map((item, idx) => {
                const Icon = Icons[item.icon as keyof typeof Icons] as React.ComponentType<{ className?: string; strokeWidth?: number }>;
                return (
                  <CarouselItem key={idx} className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3">
                    <div className="h-full border border-border rounded-lg overflow-hidden transition-colors duration-300 hover:bg-muted/50">
                      {/* Image area with gradient and icon */}
                      <div className={cn(
                        "aspect-video flex items-center justify-center bg-gradient-to-br",
                        getGradient(item.color)
                      )}>
                        <Icon className={cn("h-16 w-16", getIconColor(item.color))} strokeWidth={1} />
                      </div>
                      <div className="px-6 py-6">
                        <div className="text-sm text-muted-foreground uppercase">
                          {item.category}
                        </div>
                        <h3 className="mt-2 text-lg font-semibold">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-8">
              <CarouselPrevious className="static translate-x-0 translate-y-0" />
              <CarouselNext className="static translate-x-0 translate-y-0" />
            </div>
          </Carousel>
        </div>

        {/* Desktop view - with sidebar */}
        <div className="hidden lg:grid gap-12 lg:grid-cols-3">
          {/* Left sidebar with feature links */}
          <div className="flex flex-col gap-6">
            {features.items.slice(0, 3).map((feature, idx) => (
              <Fragment key={idx}>
                <div className="flex flex-col gap-1">
                  <div className="font-mono text-sm text-muted-foreground uppercase">
                    {feature.category}
                  </div>
                  <a
                    href={`#feature-${idx}`}
                    className="group flex items-center gap-2 font-semibold"
                  >
                    {feature.title}
                    <MoveRight className="mt-0.5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
                {idx < 2 && <Separator />}
              </Fragment>
            ))}
            <a
              href="#features"
              className="group flex items-center gap-2 font-semibold text-[#f97316] mt-2"
            >
              View all features
              <MoveRight className="mt-0.5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Carousel with feature cards */}
          <div className="lg:col-span-2">
            <Carousel className="w-full">
              <CarouselContent className="-ml-4">
                {features.items.map((item, idx) => {
                  const Icon = Icons[item.icon as keyof typeof Icons] as React.ComponentType<{ className?: string; strokeWidth?: number }>;
                  return (
                    <CarouselItem key={idx} className="pl-4 basis-full md:basis-1/2">
                      <div className="h-full border border-border rounded-lg overflow-hidden transition-colors duration-300 hover:bg-muted/50">
                        {/* Image area with gradient and icon */}
                        <div className={cn(
                          "aspect-video flex items-center justify-center bg-gradient-to-br",
                          getGradient(item.color)
                        )}>
                          <Icon className={cn("h-16 w-16", getIconColor(item.color))} strokeWidth={1} />
                        </div>
                        <div className="px-6 py-8">
                          <div className="text-sm text-muted-foreground uppercase">
                            {item.category}
                          </div>
                          <h3 className="mt-2 text-xl font-semibold">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <div className="flex gap-4 mt-8">
                <CarouselPrevious className="static translate-x-0 translate-y-0" />
                <CarouselNext className="static translate-x-0 translate-y-0" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </Section>
  );
};

export { Features };