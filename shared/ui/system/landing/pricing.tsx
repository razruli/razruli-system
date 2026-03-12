"use client";

import { Check } from "lucide-react";

import { Button } from "@/shared/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";

const plans = [
  {
    name: "Starter",
    description: "For small teams exploring workforce optimization",
    price: "$299",
    period: "per month",
    features: [
      "Up to 100 employees",
      "Process mapping for 5 departments",
      "Basic workload analytics",
      "Email support",
      "Standard reports",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Professional",
    description: "For growing teams with complex workforce needs",
    price: "$899",
    period: "per month",
    features: [
      "Up to 1,000 employees",
      "Unlimited process mapping",
      "Advanced workload analytics",
      "AI hiring recommendations",
      "Priority email + chat support",
      "Custom reporting",
      "Scenario modeling",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations with custom requirements",
    price: "Custom",
    period: "contact sales",
    features: [
      "Unlimited employees",
      "Unlimited processes",
      "Advanced AI features",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "Training & onboarding",
      "Advanced security options",
    ],
    cta: "Schedule Demo",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Pricing
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Simple, transparent pricing that scales with you
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col border-border/50 ${
                plan.highlighted
                  ? "border-primary/50 bg-gradient-to-b from-primary/5 to-card shadow-lg"
                  : "bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-display text-2xl">
                  {plan.name}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div>
                  <span className="font-display text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>

                <Button
                  size="lg"
                  className={plan.highlighted ? "" : "variant-outline"}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3 border-t border-border/30 pt-6">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 mx-auto max-w-2xl">
          <h3 className="text-center font-display text-2xl font-bold text-foreground mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            {[
              {
                q: "Can I change plans anytime?",
                a: "Yes, upgrade or downgrade your plan at any time. Changes take effect on your next billing date.",
              },
              {
                q: "Do you offer annual billing discounts?",
                a: "Yes, save 20% when you commit to annual billing on any plan.",
              },
              {
                q: "Is there a free trial?",
                a: "All plans include a 14-day free trial with full access to platform features.",
              },
            ].map((faq, i) => (
              <div key={i} className="space-y-2">
                <h4 className="font-semibold text-foreground">{faq.q}</h4>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
