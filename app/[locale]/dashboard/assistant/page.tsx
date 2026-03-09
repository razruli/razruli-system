"use client";

import { useState, useRef, useEffect } from "react";

// import { useChat } from "@ai-sdk/react";
// import { DefaultChatTransport } from "ai";
// import type { UIMessage } from "ai";

type UIMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  parts?: any[];
};
import {
  Send,
  Sparkles,
  BrainCircuit,
  BarChart3,
  Users,
  GitCompare,
  AlertTriangle,
  Lightbulb,
  RotateCcw,
  Square,
  Loader2,
  FileBarChart,
} from "lucide-react";

import {
  WorkloadAnalysisArtifact,
  HiringRecommendationsArtifact,
  TeamComparisonArtifact,
  ReportArtifact,
  ArtifactLoading,
} from "@/components/assistant/artifacts";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui";
import { Card, CardContent } from "@/shared/ui/shadcn/card";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

const suggestedPrompts = [
  {
    icon: AlertTriangle,
    label: "Critical Alert",
    text: "Which departments are critically overloaded right now?",
    color: "text-destructive",
  },
  {
    icon: BarChart3,
    label: "Workload Analysis",
    text: "/analyze all departments utilization",
    color: "text-primary",
  },
  {
    icon: Users,
    label: "Hiring Plan",
    text: "/suggest-hires for Engineering with moderate budget",
    color: "text-chart-2",
  },
  {
    icon: GitCompare,
    label: "Compare Teams",
    text: "/compare Engineering vs Marketing on efficiency, workload, growth",
    color: "text-chart-3",
  },
  {
    icon: FileBarChart,
    label: "Executive Report",
    text: "/report executive quarterly summary",
    color: "text-chart-4",
  },
  {
    icon: Lightbulb,
    label: "Strategy Advice",
    text: "Based on current workload data, what hiring decisions should I prioritize this quarter?",
    color: "text-chart-5",
  },
];

const slashCommands = [
  {
    command: "/analyze",
    description: "Analyze department workload",
    icon: BarChart3,
  },
  {
    command: "/suggest-hires",
    description: "Get hiring recommendations",
    icon: Users,
  },
  {
    command: "/compare",
    description: "Compare teams side by side",
    icon: GitCompare,
  },
  {
    command: "/report",
    description: "Generate a KPI report",
    icon: FileBarChart,
  },
];

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [showCommands, setShowCommands] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  //   const { messages, sendMessage, status, setMessages } = useChat({
  //     transport: new DefaultChatTransport({ api: "/api/assistant" }),
  //   });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleInputChange(value: string) {
    setInput(value);
    setShowCommands(value === "/");
  }

  function handleSubmit(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || isLoading) return;
    // TODO: Implement AI message handling
    setInput("");
    setShowCommands(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setShowCommands(false);
    }
  }

  function handleSelectCommand(command: string) {
    setInput(command + " ");
    setShowCommands(false);
    inputRef.current?.focus();
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* Chat messages area */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-3xl flex flex-col gap-1">
          {messages.length === 0 && (
            <EmptyState onSelectPrompt={handleSubmit} />
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {isLoading &&
            messages.length > 0 &&
            messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3 py-3">
                <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                  <AvatarFallback className="bg-primary/15 text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <Separator />

      {/* Input area */}
      <div className="p-4">
        <div className="mx-auto max-w-3xl flex flex-col gap-3">
          {/* Proactive insight banner */}
          {messages.length === 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-2.5">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
              <p className="text-xs text-foreground">
                <span className="font-semibold">Alert:</span> Engineering is at
                94% capacity with 3 pending process assignments.{" "}
                <button
                  className="text-primary hover:underline font-medium"
                  onClick={() =>
                    handleSubmit(
                      "Analyze Engineering department workload and suggest hiring plan",
                    )
                  }
                >
                  Analyze and suggest hires
                </button>
              </p>
            </div>
          )}

          {/* Slash commands popup */}
          {showCommands && (
            <Card className="border-border/60">
              <CardContent className="p-2">
                <p className="text-xs text-muted-foreground px-2 py-1 mb-1">
                  Quick Commands
                </p>
                {slashCommands.map((cmd) => (
                  <button
                    key={cmd.command}
                    onClick={() => handleSelectCommand(cmd.command)}
                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    <cmd.icon className="h-4 w-4 text-primary" />
                    <span className="font-mono text-xs font-medium text-primary">
                      {cmd.command}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {cmd.description}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Input box */}
          <div className="relative flex items-end gap-2 rounded-xl border border-border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring/20 focus-within:border-primary/40 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about workload, hiring strategy, or type / for commands..."
              className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[40px] max-h-[120px]"
              rows={1}
              disabled={isLoading}
            />
            <div className="flex items-center gap-1 shrink-0">
              {isLoading ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Square className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Stop generating</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <>
                  {messages.length > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground"
                            onClick={() => setMessages([])}
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>New conversation</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <Button
                    size="icon"
                    className="h-8 w-8"
                    disabled={!input.trim()}
                    onClick={() => handleSubmit()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          <p className="text-center text-[10px] text-muted-foreground">
            StratOps AI can make mistakes. Verify critical data before acting.
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Empty state with suggested prompts ---
function EmptyState({
  onSelectPrompt,
}: {
  onSelectPrompt: (text: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 pt-12 pb-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
        <BrainCircuit className="h-8 w-8 text-primary" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground font-display">
          StratOps AI Assistant
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-md">
          Your workforce strategy advisor. Analyze workload, get hiring
          recommendations, compare teams, and generate reports.
        </p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 w-full max-w-xl">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt.label}
            onClick={() => onSelectPrompt(prompt.text)}
            className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-3.5 text-left hover:bg-accent/50 hover:border-primary/20 transition-all group"
          >
            <prompt.icon
              className={`h-4 w-4 mt-0.5 shrink-0 ${prompt.color}`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                {prompt.label}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                {prompt.text}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
        <span className="text-xs text-muted-foreground">Quick:</span>
        {slashCommands.map((cmd) => (
          <Badge
            key={cmd.command}
            variant="outline"
            className="text-[10px] font-mono cursor-pointer hover:bg-accent transition-colors"
            onClick={() => onSelectPrompt(cmd.command + " ")}
          >
            {cmd.command}
          </Badge>
        ))}
      </div>
    </div>
  );
}

// --- Message bubble ---
function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 py-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <Avatar className="h-7 w-7 shrink-0 mt-0.5">
          <AvatarFallback className="bg-primary/15 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`flex flex-col gap-2 max-w-[85%] ${isUser ? "items-end" : ""}`}
      >
        {(message.parts || []).map((part, index) => {
          if (part.type === "text") {
            if (!part.text) return null;
            return (
              <div
                key={index}
                className={
                  isUser
                    ? "rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                    : "text-sm text-foreground leading-relaxed max-w-none"
                }
              >
                {isUser ? part.text : <FormattedMarkdown text={part.text} />}
              </div>
            );
          }

          if (part.type === "tool-invocation") {
            const { toolName, state } = part.toolInvocation;

            // Loading states
            if (state === "call" || state === "partial-call") {
              const loadingMessages: Record<string, string> = {
                analyzeWorkload: "Analyzing workload data...",
                suggestHires: "Generating hiring recommendations...",
                compareTeams: "Comparing teams...",
                generateReport: "Generating report...",
              };
              return (
                <ArtifactLoading
                  key={index}
                  message={loadingMessages[toolName] ?? "Processing..."}
                />
              );
            }

            // Render results
            if (state === "result") {
              const output = part.toolInvocation.result;

              switch (toolName) {
                case "analyzeWorkload":
                  return (
                    <WorkloadAnalysisArtifact
                      key={index}
                      data={output.data}
                      insights={output.insights}
                      metric={output.metric}
                    />
                  );

                case "suggestHires":
                  return (
                    <HiringRecommendationsArtifact
                      key={index}
                      recommendations={output.recommendations}
                      summary={output.summary}
                      budget={output.budget}
                    />
                  );

                case "compareTeams":
                  return (
                    <TeamComparisonArtifact
                      key={index}
                      comparison={output.comparison}
                      metrics={output.metrics}
                    />
                  );

                case "generateReport":
                  return (
                    <ReportArtifact
                      key={index}
                      kpis={output.kpis}
                      reportType={output.reportType}
                      timeframe={output.timeframe}
                    />
                  );

                default:
                  return null;
              }
            }
          }

          return null;
        })}
      </div>

      {isUser && (
        <Avatar className="h-7 w-7 shrink-0 mt-0.5">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
            JD
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

// --- Simple markdown formatter ---
function FormattedMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="flex flex-col gap-0.5">
      {lines.map((line, i) => {
        // Bold
        const boldFormatted = line.replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-semibold text-foreground">$1</strong>',
        );

        // Headers
        if (line.startsWith("### "))
          return (
            <h4
              key={i}
              className="font-semibold text-foreground mt-3 mb-1 text-sm"
            >
              {line.replace("### ", "")}
            </h4>
          );
        if (line.startsWith("## "))
          return (
            <h3 key={i} className="font-semibold text-foreground mt-3 mb-1">
              {line.replace("## ", "")}
            </h3>
          );

        // List items
        if (line.startsWith("- ") || line.startsWith("* "))
          return (
            <li
              key={i}
              className="ml-4 list-disc text-sm"
              dangerouslySetInnerHTML={{
                __html: boldFormatted.replace(/^[-*]\s/, ""),
              }}
            />
          );

        // Numbered list
        if (/^\d+\.\s/.test(line))
          return (
            <li
              key={i}
              className="ml-4 list-decimal text-sm"
              dangerouslySetInnerHTML={{
                __html: boldFormatted.replace(/^\d+\.\s/, ""),
              }}
            />
          );

        // Empty line
        if (!line.trim()) return <br key={i} />;

        // Regular paragraph
        return (
          <p
            key={i}
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: boldFormatted }}
          />
        );
      })}
    </div>
  );
}
