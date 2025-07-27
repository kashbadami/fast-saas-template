"use client";

import React from "react";
import { Check } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Section } from "~/components/ui/section";

type Plan = {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  isPopular?: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "For learning and prototyping",
    features: [
      "1 project",
      "NextAuth.js authentication",
      "PostgreSQL database",
      "tRPC API endpoints",
      "Vercel deployment ready",
      "Community support",
    ],
  },
  {
    name: "Professional",
    monthlyPrice: 29,
    yearlyPrice: 19,
    description: "For production apps",
    features: [
      "Unlimited projects",
      "Everything in Starter",
      "Advanced authentication providers",
      "Database migrations & backups",
      "Custom API integrations",
      "Priority email support",
      "Analytics dashboard",
      "Team collaboration (up to 5)",
    ],
    isPopular: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: 99,
    yearlyPrice: 79,
    description: "For teams and scale",
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "SSO/SAML authentication",
      "Advanced security features",
      "Custom deployment options",
      "Dedicated support engineer",
      "SLA guarantee",
      "Custom feature development",
      "White-label options",
    ],
  },
];

const Pricing = () => {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">("monthly");

  return (
    <Section
      id="pricing"
      className="bg-background"
      pill="Simple Pricing"
      title={<>Choose your <span className="font-playfair italic text-[#f97316]">perfect</span> plan</>}
      subtitle="Start free and scale as you grow. Upgrade or downgrade anytime."
    >
      <div>
        <div className="flex justify-center mb-10">
          <Tabs
            value={billingCycle}
            onValueChange={(value) => setBillingCycle(value as "monthly" | "yearly")}
            className="w-fit"
          >
            <TabsList className="h-12 rounded-full bg-muted px-1">
              <TabsTrigger
                value="monthly"
                className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className="rounded-full px-6 py-2.5 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Yearly
                <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                  Save 25%
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const isYearly = billingCycle === "yearly";
            const originalMonthlyPrice = plan.monthlyPrice;

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border bg-card p-8 shadow-sm ${
                  plan.isPopular ? "border-orange-200" : ""
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-semibold">{plan.name}</h3>
                  <p className="mt-2 text-muted-foreground">{plan.description}</p>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-5xl font-bold tracking-tight">
                      ${price}
                    </span>
                    <span className="ml-2 text-muted-foreground">
                      /{billingCycle === "monthly" ? "month" : "month"}
                    </span>
                    {isYearly && originalMonthlyPrice > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground line-through">
                        ${originalMonthlyPrice}
                      </span>
                    )}
                  </div>
                  {isYearly && price > 0 && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Billed ${price * 12} yearly
                    </p>
                  )}
                </div>

                <ul className="mb-8 flex-1 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                    plan.isPopular
                      ? "bg-[#f97316] text-white hover:bg-[#ea580c]"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {plan.monthlyPrice === 0 ? "Get Started Free" : "Get Started"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include source code access, lifetime updates, and a 14-day money-back guarantee.
          </p>
        </div>
      </div>
    </Section>
  );
};

export { Pricing };