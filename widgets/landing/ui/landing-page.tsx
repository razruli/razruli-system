import {
  AIAssistant,
  CTA,
  Features,
  Hero,
  HowItWorks,
  Pricing,
  Stats,
} from "@/shared/ui/system/landing";

export function LandingPage() {
  return (
    <>
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <AIAssistant />
        <Pricing />
        <CTA />
      </main>
    </>
  );
}
