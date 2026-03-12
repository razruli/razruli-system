import { ArrowRight } from "lucide-react";

import { Button } from "@/shared/ui";
import { Card, CardContent } from "@/shared/ui/shadcn/card";

export function CTA() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-muted/30" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-100 w-150 -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm py-12">
          <CardContent className="flex flex-col items-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
              Stop guessing. Start building your workforce strategy with data.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Join hundreds of operations leaders who use StratOps to make
              confident, AI-backed hiring decisions.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Button size="lg" className="px-8 h-12 text-base">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 h-12 text-base"
              >
                Schedule a Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
