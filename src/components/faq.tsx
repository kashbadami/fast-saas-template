"use client"

import { useState, useEffect } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import { cn } from "~/lib/utils"
import { Section } from "~/components/ui/section"

const faqs = [
  {
    category: "Getting Started",
    items: [
      {
        question: "What are the system requirements for this template?",
        answer: "You'll need Node.js 18.19 or later, npm or yarn, and PostgreSQL (or Docker to run it locally). The template works on macOS, Windows, and Linux."
      },
      {
        question: "How do I set up the project locally?",
        answer: "Clone the repository, copy .env.example to .env, fill in your environment variables, run npm install, start the database with ./start-database.sh (or use your own PostgreSQL), run npm run db:push to set up the schema, and finally npm run dev to start the development server."
      },
      {
        question: "What environment variables are required?",
        answer: "You need DATABASE_URL (PostgreSQL connection string), AUTH_SECRET (for NextAuth), and OAuth provider credentials (AUTH_DISCORD_ID and AUTH_DISCORD_SECRET by default). Additional variables can be added in src/env.js with Zod validation."
      },
      {
        question: "How do I add new dependencies?",
        answer: "Use npm install for regular dependencies. For UI components, use npx shadcn@latest add [component-name] to maintain consistency with the design system. All dependencies should be added through npm to ensure lock file integrity."
      }
    ]
  },
  {
    category: "Features",
    items: [
      {
        question: "What's included in this template?",
        answer: "The template includes Next.js 15 with App Router, tRPC for type-safe APIs, Prisma ORM with PostgreSQL, NextAuth.js v5 for authentication, Tailwind CSS v4 for styling, shadcn/ui components, and TypeScript with end-to-end type safety."
      },
      {
        question: "Can I customize the authentication providers?",
        answer: "Yes! The template comes with Discord OAuth by default, but NextAuth.js supports many providers including Google, GitHub, Email/Password, and more. Configure new providers in src/server/auth/config.ts."
      },
      {
        question: "How does the type-safe API work?",
        answer: "tRPC provides end-to-end type safety between your backend and frontend. Define procedures in src/server/api/routers/, and they're automatically typed on the client. No manual type definitions or API documentation needed!"
      },
      {
        question: "What database systems are supported?",
        answer: "PostgreSQL is the default and recommended database. However, Prisma supports MySQL, SQLite, SQL Server, and MongoDB. Change the provider in prisma/schema.prisma and update your connection string."
      }
    ]
  },
  {
    category: "Deployment",
    items: [
      {
        question: "Where can I deploy this application?",
        answer: "The template is optimized for Vercel (zero-config deployment), but also works on Railway, Render, Fly.io, or any platform supporting Node.js. For the database, use services like Neon, Supabase, or Railway PostgreSQL."
      },
      {
        question: "How do I set up environment variables in production?",
        answer: "Each deployment platform has its own way. On Vercel, use the Environment Variables section in project settings. Make sure to set DATABASE_URL, AUTH_SECRET (generate with openssl rand -base64 32), and your OAuth credentials."
      },
      {
        question: "Do I need to run database migrations in production?",
        answer: "Yes, for production use npm run db:migrate to create migration files that track schema changes. In development, npm run db:push is fine for rapid iteration. Always review migrations before applying to production."
      },
      {
        question: "How do I handle production builds?",
        answer: "Run npm run build to create an optimized production build. The build process type-checks your code, generates the Prisma client, and creates optimized bundles. Use npm run start to run the production server locally."
      }
    ]
  },
  {
    category: "Support",
    items: [
      {
        question: "Where can I find documentation?",
        answer: "Check the README.md for quick start, CLAUDE.md for AI assistant guidelines, and the inline code comments. For framework-specific docs, refer to Next.js, tRPC, Prisma, and NextAuth.js official documentation."
      },
      {
        question: "How do I report bugs or request features?",
        answer: "Open an issue on the GitHub repository with a clear description, steps to reproduce (for bugs), and any relevant code snippets. For features, explain the use case and how it would benefit other users."
      },
      {
        question: "Is there a community or Discord server?",
        answer: "Check the repository's README for community links. The T3 Stack community is also very helpful for questions about the underlying technologies. Join the discussions on GitHub for template-specific topics."
      },
      {
        question: "How often is the template updated?",
        answer: "The template aims to stay current with the latest stable versions of its dependencies. Major updates are released quarterly, with security patches applied as needed. Check the releases page for update notes."
      }
    ]
  },
  {
    category: "Billing",
    items: [
      {
        question: "What's the license for this template?",
        answer: "Check the LICENSE file in the repository for specific terms. Most SaaS templates use MIT or similar permissive licenses, allowing commercial use with attribution. Always verify the license before using in production."
      },
      {
        question: "Can I use this for commercial projects?",
        answer: "Yes, if the license permits (which most open-source templates do). You can modify, distribute, and use it in commercial applications. Just ensure you comply with any attribution requirements in the license."
      },
      {
        question: "Are there any usage limitations?",
        answer: "The template itself has no usage limitations beyond the license terms. However, be aware of rate limits and pricing for third-party services you integrate (databases, authentication providers, hosting platforms)."
      },
      {
        question: "Do you offer refunds or support packages?",
        answer: "As an open-source template, it's provided as-is without warranties. For professional support, consider hiring consultants familiar with the T3 Stack or reaching out to the community for guidance."
      }
    ]
  }
]

export function FAQ() {
  const [activeCategory, setActiveCategory] = useState("Getting Started")
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    
    checkDesktop()
    window.addEventListener("resize", checkDesktop)
    
    return () => window.removeEventListener("resize", checkDesktop)
  }, [])

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    
    const element = document.getElementById(category.toLowerCase().replace(/\s+/g, "-"))
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  useEffect(() => {
    if (!isDesktop) return

    const handleScroll = () => {
      const sections = faqs.map(faq => ({
        category: faq.category,
        element: document.getElementById(faq.category.toLowerCase().replace(/\s+/g, "-"))
      }))

      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveCategory(section.category)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDesktop])

  return (
    <Section
      id="faq"
      className="bg-muted/20"
      pill="FAQ"
      title={<><span className="font-playfair italic text-[#f97316]">Frequently</span> Asked Questions</>}
      subtitle="Everything you need to know about the Fast SaaS Template. Can't find what you're looking for? Feel free to open an issue on GitHub."
    >
      <div className="flex gap-8">
        {isDesktop && (
          <nav className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
                Categories
              </h3>
              <ul className="space-y-2">
                {faqs.map((faq) => (
                  <li key={faq.category}>
                    <button
                      onClick={() => handleCategoryClick(faq.category)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md transition-colors text-sm",
                        activeCategory === faq.category
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {faq.category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}

        <div className="flex-1 space-y-12">
          {faqs.map((faq) => (
            <div
              key={faq.category}
              id={faq.category.toLowerCase().replace(/\s+/g, "-")}
              className="scroll-mt-24"
            >
              <h3 className="text-2xl font-semibold mb-6">{faq.category}</h3>
              <Accordion type="single" collapsible className="space-y-4">
                {faq.items.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`${faq.category}-${index}`}
                    className="border rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      <span className="text-base font-medium">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}