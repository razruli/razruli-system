"use client";

import { useState, useEffect } from "react";

import { Sparkles, Send, Bot, User } from "lucide-react";
import Image from "next/image";

import { Badge, Button } from "@/shared/ui";
import { Card, CardContent, CardHeader } from "@/shared/ui/shadcn/card";

const demoConversation = [
  {
    role: "user" as const,
    text: "Which department is most over-capacity right now?",
  },
  {
    role: "assistant" as const,
    text: "Based on your current workload data, the Customer Success team is operating at 127% capacity. They manage 14 processes with only 8 FTEs. I recommend hiring 2 additional Customer Success Managers to bring utilization to a healthy 89%.",
  },
  {
    role: "user" as const,
    text: "What would happen if we onboard 3 new enterprise clients?",
  },
  {
    role: "assistant" as const,
    text: "Adding 3 enterprise clients would increase workload by ~340 hours/month across 4 departments. You would need: 1 Solutions Engineer, 2 Support Specialists, and 1 Account Manager. Estimated annual cost: $380K. Want me to build a phased hiring timeline?",
  },
];

export function AIAssistant() {
  const [visibleMessages, setVisibleMessages] = useState(0);

  useEffect(() => {
    if (visibleMessages < demoConversation.length) {
      const timer = setTimeout(() => {
        setVisibleMessages((prev) => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [visibleMessages]);

  return (
    <section id="ai-assistant" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text side */}
          <div>
            <Badge
              variant="outline"
              className="gap-2 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered
            </Badge>

            <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
              Your strategic workforce advisor, always on call
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
              Ask questions in plain language. Get instant answers backed by
              your real organizational data. The AI assistant understands your
              processes, headcount, and workload to deliver actionable hiring
              insights.
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              {[
                "Natural language queries about workforce capacity",
                "Scenario modeling for growth and restructuring",
                "Automated hiring priority recommendations",
                "Budget-aware staffing suggestions",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      className="h-3 w-3 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Button className="mt-8">
              Try AI Assistant
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Chat demo side */}
          <div className="relative">
            <Card className="border-border/50 shadow-2xl shadow-primary/5 overflow-hidden">
              {/* Chat header */}
              <CardHeader className="flex-row items-center gap-3 border-b border-border/50 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    StratOps AI
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Workforce Strategy Assistant
                  </p>
                </div>
                <div className="flex h-2 w-2 rounded-full bg-emerald-500" />
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex flex-col gap-4 py-5 min-h-85">
                {demoConversation
                  .slice(0, visibleMessages)
                  .map((msg, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""} animate-in fade-in slide-in-from-bottom-2 duration-500`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          msg.role === "user" ? "bg-muted" : "bg-primary/10"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <Bot className="h-3.5 w-3.5 text-primary" />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] rounded-xl px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
              </CardContent>

              {/* Input bar */}
              <div className="border-t border-border/50 px-5 py-3">
                <div className="flex items-center gap-2 rounded-lg border border-input bg-muted/50 px-4 py-2.5">
                  <span className="flex-1 text-sm text-muted-foreground">
                    Ask about your workforce...
                  </span>
                  <Send className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Card>

            {/* Background image peek */}
            <div className="absolute -bottom-4 -right-4 -z-10 hidden h-full w-full rounded-xl lg:block">
              <Image
                src="/images/ai-assistant.jpg"
                alt=""
                fill
                className="rounded-xl object-cover opacity-20 blur-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
