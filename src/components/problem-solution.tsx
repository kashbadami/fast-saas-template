"use client";

import * as Icons from "lucide-react";
import { FeatureCard } from "~/components/ui/feature-card";
import { Section } from "~/components/ui/section";
import { Headline } from "~/components/ui/headline";
import { content } from "~/lib/config";

export function ProblemSolution() {
  const { problemSolution } = content;
  const { problem, solution } = problemSolution;

  return (
    <>
      {/* Problem Section */}
      <Section
        className="bg-muted/20"
        pill={problem.pill}
        title={<Headline config={problem.headline} />}
        subtitle={problem.subheadline}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {problem.cards.map((card, idx) => {
            // @ts-ignore - Dynamic icon lookup
            const Icon = Icons[card.icon];
            return (
              <FeatureCard
                key={idx}
                icon={Icon}
                title={card.title}
                description={card.description}
                iconColor="text-red-500 border-red-500"
              />
            );
          })}
        </div>

        {/* Long-form problem description */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="prose dark:prose-invert prose-lg max-w-none">
            <h3 className="text-2xl font-semibold mb-6">{problem.longForm.title}</h3>
            
            <p className="text-muted-foreground leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: problem.longForm.intro }} />

            <div className="bg-muted/30 border-l-4 border-red-500 p-6 my-8">
              <p className="text-base italic">
                {problem.longForm.quote.text}
              </p>
              <p className="text-sm text-muted-foreground mt-2">— {problem.longForm.quote.author}</p>
            </div>

            <h4 className="text-xl font-semibold mt-8 mb-4">{problem.longForm.breakdown.title}</h4>
            
            <div className="space-y-6">
              {problem.longForm.breakdown.items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground">{item.title} ({item.duration})</h5>
                    <p className="text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-muted/20 rounded-lg p-8 mt-10">
              <h4 className="text-xl font-semibold mb-4">{problem.longForm.conclusion.title}</h4>
              <p className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: problem.longForm.conclusion.text }} />
              <p className="text-muted-foreground leading-relaxed mt-4" dangerouslySetInnerHTML={{ __html: problem.longForm.conclusion.cta }} />
            </div>
          </div>
        </div>
      </Section>

      {/* Solution Section */}
      <Section
        pill={solution.pill}
        title={<Headline config={solution.headline} />}
        subtitle={solution.subheadline}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {solution.cards.map((card, idx) => {
            // @ts-ignore - Dynamic icon lookup
            const Icon = Icons[card.icon];
            const colorClass = 
              card.color === "primary" ? "text-[#f97316] border-[#f97316]" :
              card.color === "blue" ? "text-[#1e40af] border-[#1e40af]" :
              card.color === "emerald" ? "text-emerald-500 border-emerald-500" :
              card.color === "purple" ? "text-purple-500 border-purple-500" :
              card.color === "rose" ? "text-rose-500 border-rose-500" :
              "text-indigo-500 border-indigo-500";
            
            return (
              <FeatureCard
                key={idx}
                icon={Icon}
                title={card.title}
                description={card.description}
                iconColor={colorClass}
                colSpan={card.colSpan}
              />
            );
          })}
        </div>
      </Section>
    </>
  );
}