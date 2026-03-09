import {
  BarChart3,
  Brain,
  GitBranch,
  Layers,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/shadcn/card";

const features = [
  {
    icon: GitBranch,
    title: "Process Mapping",
    description:
      "Define every business process and automatically link it to the departments and roles responsible for execution.",
  },
  {
    icon: BarChart3,
    title: "Workload Analytics",
    description:
      "Measure real capacity per employee. Identify bottlenecks, overloaded teams, and underutilized resources in real time.",
  },
  {
    icon: Users,
    title: "Department Structure",
    description:
      "Model your organizational hierarchy. Set headcount targets, define roles, and track capacity at every level.",
  },
  {
    icon: Brain,
    title: "AI Hiring Advisor",
    description:
      "Our AI analyzes workload gaps and recommends exactly which roles to hire, when, and in what priority order.",
  },
  {
    icon: Layers,
    title: "Scenario Planning",
    description:
      "Simulate growth scenarios. See how adding new processes or clients impacts your workforce requirements.",
  },
  {
    icon: TrendingUp,
    title: "Strategic Reporting",
    description:
      "Generate board-ready reports that justify hiring decisions with hard data on process coverage and team utilization.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            What we do
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Everything you need to build a data-driven workforce strategy
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            From process mapping to AI-powered hiring recommendations, StratOps
            gives operations leaders full visibility into their workforce needs.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border-border/50 bg-card transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
            >
              <CardHeader>
                <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="font-display text-lg">
                  {feature.title}
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
