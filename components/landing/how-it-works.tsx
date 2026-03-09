import { Separator } from "@/shared/ui";
import { Card, CardContent } from "@/shared/ui/shadcn/card";

const steps = [
  {
    number: "01",
    title: "Map your processes",
    description:
      "Import or define every business process in your organization. Link each process to the departments and roles that execute it.",
  },
  {
    number: "02",
    title: "Measure workload",
    description:
      "Assign time and effort estimates per process. StratOps calculates true employee utilization across your entire operation.",
  },
  {
    number: "03",
    title: "Analyze capacity",
    description:
      "Instantly see which departments are over capacity, which are underutilized, and where the biggest bottlenecks lie.",
  },
  {
    number: "04",
    title: "Get AI recommendations",
    description:
      "Our AI assistant builds a prioritized hiring plan based on your workload data, growth targets, and budget constraints.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-muted/30" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            From process data to hiring strategy in four steps
          </h2>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card
              key={step.number}
              className="relative border-border/50 bg-card/50 backdrop-blur-sm"
            >
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-12 hidden h-px w-8 translate-x-full bg-border lg:block" />
              )}
              <CardContent className="pt-6">
                <span className="font-display text-4xl font-bold text-primary/20">
                  {step.number}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <Separator className="my-3 bg-border/50" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
