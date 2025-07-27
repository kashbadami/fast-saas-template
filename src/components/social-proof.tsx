"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Section } from "~/components/ui/section";
import { Card } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Star } from "lucide-react";
import * as Icons from "lucide-react";
import { content } from "~/lib/config";
import { Headline } from "~/components/ui/headline";


export function SocialProof() {
  return (
    <>
      {/* Stats Section */}
      <Section
        className="bg-muted/30"
        title={<Headline config={content.socialProof.stats.headline} />}
      >
        <div className="grid gap-8 md:grid-cols-3 mt-12">
          {content.socialProof.stats.items.map((stat, idx) => {
            const Icon = Icons[stat.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur p-6 text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f97316]/5 via-transparent to-[#1e40af]/5" />
                  <div className="relative">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#f97316]/10 text-[#f97316] mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="font-medium text-foreground mb-1">{stat.label}</div>
                    <div className="text-sm text-muted-foreground">{stat.description}</div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section
        pill={content.socialProof.testimonials.pill}
        title={<Headline config={content.socialProof.testimonials.headline} />}
        subtitle={content.socialProof.testimonials.subheadline}
      >
        <div className="grid gap-6 md:grid-cols-3 mt-12">
          {content.socialProof.testimonials.items.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-6 border-border/50 bg-card/50 backdrop-blur hover:shadow-lg transition-shadow duration-300">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating) as unknown[]].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#f97316] text-[#f97316]" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.author.image} alt={testimonial.author.name} />
                    <AvatarFallback>{testimonial.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.author.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.author.role} at {testimonial.author.company}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Logo Cloud Section */}
      <Section 
        className="bg-muted/20 overflow-hidden"
        title={<span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{content.socialProof.logos.title}</span>}
      >
        <div className="relative">
          {/* Gradient masks for infinite scroll effect */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
          
          {/* Animated logo carousel */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-16 items-center"
              animate={{
                x: [0, -1920],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {/* Duplicate the logos array for seamless loop */}
              {[...content.socialProof.logos.items, ...content.socialProof.logos.items, ...content.socialProof.logos.items, ...content.socialProof.logos.items].map((logo, idx) => (
                <motion.div
                  key={idx}
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="flex items-center gap-3 group">
                    <div className={`relative h-10 transition-all duration-300 opacity-80 group-hover:opacity-100 ${
                      logo.name === "Tailwind CSS" ? "w-32" : "w-24"
                    }`}>
                      <Image
                        src={logo.url}
                        alt={logo.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    {logo.showName && (
                      <span className="text-xl font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        {logo.name}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </Section>
    </>
  );
}