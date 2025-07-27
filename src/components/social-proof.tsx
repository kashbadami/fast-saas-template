"use client";

import { motion } from "framer-motion";
import { Section } from "~/components/ui/section";
import { Card } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Star, Users, Zap, Trophy } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Active Developers",
    description: "Building amazing SaaS products",
  },
  {
    icon: Zap,
    value: "3 days",
    label: "Average Launch Time",
    description: "From idea to production",
  },
  {
    icon: Trophy,
    value: "500+",
    label: "Successful Launches",
    description: "And counting every day",
  },
];

const testimonials = [
  {
    content: "This template saved us months of development time. We launched our MVP in just 5 days and started getting customers immediately.",
    author: {
      name: "Sarah Chen",
      role: "Founder & CEO",
      company: "DataSync Pro",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/person1.jpeg",
    },
    rating: 5,
  },
  {
    content: "The authentication system alone would have taken us weeks to build. Everything just works out of the box. Incredible value.",
    author: {
      name: "Michael Rodriguez",
      role: "CTO",
      company: "CloudScale AI",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/person2.jpeg",
    },
    rating: 5,
  },
  {
    content: "We tried building from scratch twice before finding this. Now we're focused on our customers instead of infrastructure.",
    author: {
      name: "Emily Johnson",
      role: "Technical Lead",
      company: "FinFlow Solutions",
      image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/person3.jpeg",
    },
    rating: 5,
  },
];

const logos = [
  { 
    name: "Vercel", 
    url: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
    showName: true,
    className: "opacity-60 hover:opacity-100" 
  },
  { 
    name: "Stripe", 
    url: "https://images.ctfassets.net/fzn2n1nzq965/HTTOloNPhisV9P4hlMPNA/cacf1bb88b9fc492dfad34378d844280/Stripe_icon_-_square.svg?q=80&w=1082",
    showName: true,
    className: "opacity-60 hover:opacity-100" 
  },
  { 
    name: "Prisma", 
    url: "https://asset.brandfetch.io/idBBE3_R9e/idzL_5tH6B.jpg",
    showName: true,
    className: "opacity-60 hover:opacity-100" 
  },
  { 
    name: "AWS", 
    url: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    showName: false,
    className: "opacity-60 hover:opacity-100" 
  },
  { 
    name: "Next.js", 
    url: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png",
    showName: true,
    className: "opacity-60 hover:opacity-100" 
  },
  { 
    name: "Tailwind CSS", 
    url: "https://tailwindcss.com/_next/static/media/tailwindcss-logotype.a1069bda.svg",
    showName: false,
    className: "opacity-60 hover:opacity-100" 
  },
];

export function SocialProof() {
  return (
    <>
      {/* Stats Section */}
      <Section
        className="bg-muted/30"
        title={<>Trusted by <span className="font-playfair italic text-[#f97316]">thousands</span> of developers</>}
      >
        <div className="grid gap-8 md:grid-cols-3 mt-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
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
        pill="What Developers Say"
        title={<>Real stories from <span className="font-playfair italic text-[#1e40af]">real builders</span></>}
        subtitle="Join thousands of developers who've already launched their SaaS faster than they thought possible."
      >
        <div className="grid gap-6 md:grid-cols-3 mt-12">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full p-6 border-border/50 bg-card/50 backdrop-blur hover:shadow-lg transition-shadow duration-300">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#f97316] text-[#f97316]" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6">
                  "{testimonial.content}"
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
      <Section className="bg-muted/20 overflow-hidden">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Built with best-in-class tools
          </p>
        </div>
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
              {[...logos, ...logos, ...logos, ...logos].map((logo, idx) => (
                <motion.div
                  key={idx}
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="flex items-center gap-3 group">
                    <img
                      src={logo.url}
                      alt={logo.name}
                      className={`h-10 object-contain transition-all duration-300 opacity-80 group-hover:opacity-100 ${
                        logo.name === "Tailwind CSS" ? "w-32" : "w-auto"
                      }`}
                    />
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