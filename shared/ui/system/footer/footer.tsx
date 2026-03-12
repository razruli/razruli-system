import { Separator } from "@/shared/ui";

const footerLinks = {
  Product: ["Features", "Pricing", "AI Assistant", "Integrations", "Changelog"],
  Company: ["About", "Blog", "Careers", "Press"],
  Resources: ["Documentation", "Help Center", "API Reference", "Community"],
  Legal: ["Privacy", "Terms", "Security", "GDPR"],
};

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-primary-foreground"
                >
                  <path
                    d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm14 3a3 3 0 11-6 0 3 3 0 016 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                StratOps
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI-powered workforce strategy platform. Build hiring plans backed
              by real workload data.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-sm font-semibold text-foreground">
                {category}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">
            {"2026 StratOps. All rights reserved."}
          </p>
          <div className="flex items-center gap-6">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
