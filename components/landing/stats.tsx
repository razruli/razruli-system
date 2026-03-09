import { Card, CardContent } from "@/shared/ui/shadcn/card";

const stats = [
  { value: "40%", label: "Reduction in mis-hires" },
  { value: "3x", label: "Faster headcount planning" },
  { value: "2,400+", label: "Processes mapped" },
  { value: "98%", label: "Customer satisfaction" },
];

export function Stats() {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 bg-muted/30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border-border/50 bg-card/60 backdrop-blur-sm text-center"
            >
              <CardContent className="pt-6 pb-6">
                <p className="font-display text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
