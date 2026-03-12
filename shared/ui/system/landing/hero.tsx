import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge, Button } from "@/shared/ui";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-150 w-200 -translate-x-1/2 rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <Badge
            variant="outline"
            className="mb-6 gap-2 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Workforce Strategy
          </Badge>

          {/* Headline */}
          <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance">
            Build your hiring strategy from{" "}
            <span className="text-primary">real workload data</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl text-pretty">
            Map business processes to departments, measure employee capacity,
            and let AI reveal exactly where you need to hire next.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button size="lg" className="px-8 h-12 text-base" asChild>
              <Link href="/dashboard">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 h-12 text-base">
              Watch Demo
            </Button>
          </div>

          {/* Trusted By */}
          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Trusted by forward-thinking teams
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {["Deloitte", "McKinsey", "Accenture", "KPMG", "BCG"].map(
                (name) => (
                  <span
                    key={name}
                    className="text-sm font-semibold tracking-wide text-muted-foreground/50"
                  >
                    {name}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative mt-16 w-full max-w-5xl">
            <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-2xl shadow-primary/5">
              <Image
                src="/images/hero-dashboard.jpg"
                alt="StratOps dashboard showing department workload analysis, hiring pipeline, and team capacity metrics"
                width={1200}
                height={700}
                className="w-full"
                priority
              />
            </div>
            <div className="pointer-events-none absolute -bottom-8 left-1/2 h-32 w-3/4 -translate-x-1/2 rounded-full bg-primary/10 blur-[80px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
