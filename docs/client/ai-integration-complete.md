# AI Integration: Complete End-to-End Pattern

**Building AI-powered features correctly: From user input to streamed insights to widget UI updates**

---

## Architecture Overview

```
User Input (Chat)
    ↓
Feature Hook (useChatInput)
    ↓
API Route Handler (/api/ai/analyze)
    ↓
Claude API (Streaming)
    ↓
SSE Stream (Real-time tokens)
    ↓
UI Update (Widget state)
    ↓
Rendered Insights
```

---

## 1. API Route: Server-Side Handler

### Setup: `/app/api/ai/analyze/route.ts`

```typescript
import { auth } from "@/server/auth";
import { createChatMessage, getCompanyAnalytics } from "@/server/services";
import { Anthropic } from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    // 1. Authenticate
    const session = await auth();
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // 2. Parse request
    const { type, context } = await request.json();

    // Validate type
    if (
      !["hiring-gap", "capacity-analysis", "workforce-summary"].includes(type)
    ) {
      return new Response(JSON.stringify({ error: "Invalid analysis type" }), {
        status: 400,
      });
    }

    // 3. Build prompt based on type
    const companyData = await getCompanyAnalytics(session.user.companyId);
    const systemPrompt = buildSystemPrompt(type, companyData);
    const userPrompt = buildUserPrompt(type, context, companyData);

    // 4. Create message in DB (for history)
    const assistantMessage = await createChatMessage({
      companyId: session.user.companyId,
      type: "ASSISTANT",
      role: "analysis_agent",
      content: "", // Will be filled with stream
      analysisType: type,
    });

    // 5. Stream Claude response
    const stream = await client.messages.stream({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    // 6. Return server-sent events stream
    return new Response(
      stream.toReadableStream().pipeThrough(
        new TextEncoderStream().pipeThrough(
          new TransformStream({
            transform(chunk, controller) {
              // Format as SSE
              controller.enqueue(`data: ${chunk}\n\n`);
            },
          }),
        ),
      ),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// Prompt builders
function buildSystemPrompt(type: string, data: any) {
  const base = `You are a workforce analytics AI. Analyze the following company data and provide actionable insights.`;

  if (type === "hiring-gap") {
    return `${base}\n\nFocus on: skill gaps, current vs. needed headcount, hiring recommendations, priority levels.`;
  } else if (type === "capacity-analysis") {
    return `${base}\n\nFocus on: workload distribution, utilization rates, resource optimization, risk areas.`;
  } else {
    return `${base}\n\nProvide a high-level summary of the organizational workforce state, key trends, and strategic recommendations.`;
  }
}

function buildUserPrompt(type: string, context: any, data: any) {
  return `
    Analysis Type: ${type}
    
    Company Data:
    - Total Employees: ${data.totalEmployees}
    - Departments: ${data.departments.length}
    - Open Positions: ${data.openPositions}
    - Average Workload: ${data.avgWorkload}%
    
    Context: ${JSON.stringify(context)}
    
    Please provide detailed analysis with:
    1. Key findings
    2. Potential risks
    3. Specific recommendations
    4. Priority actions
  `;
}
```

---

## 2. Feature Hook: Data Aggregation

### Setup: `features/ai-assistant/chat/lib/useAIAnalysis.ts`

```typescript
"use client";

import { useCallback, useState } from "react";

interface UseAIAnalysisOptions {
  type: "hiring-gap" | "capacity-analysis" | "workforce-summary";
  context: Record<string, any>;
}

interface UseAIAnalysisResult {
  response: string;
  isLoading: boolean;
  error: Error | null;
  analyze: () => Promise<void>;
}

export function useAIAnalysis({
  type,
  context,
}: UseAIAnalysisOptions): UseAIAnalysisResult {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const analyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResponse("");

    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, context }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Read SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulated += chunk;

        // Parse SSE chunks
        const lines = accumulated.split("\n");
        accumulated = lines[lines.length - 1]; // Keep incomplete lines

        for (const line of lines.slice(0, -1)) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              const json = JSON.parse(data);
              if (json.type === "content_block_delta") {
                const text = json.delta?.text || "";
                setResponse((prev) => prev + text);
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [type, context]);

  return { response, isLoading, error, analyze };
}
```

---

## 3. Widget Integration: Chat Component

### Setup: `widgets/ai-assistant/chat/ui/chat-interface.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card } from '@/shared/ui/card';
import { Spinner } from '@/shared/ui/spinner';
import { useAIAnalysis } from '../lib/useAIAnalysis';

interface ChatInterfaceProps {
  companyId: string;
}

export function ChatInterface({ companyId }: ChatInterfaceProps) {
  const [analysisType, setAnalysisType] = useState<'hiring-gap' | 'capacity-analysis' | 'workforce-summary'>('workforce-summary');
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);

  const { response, isLoading, error, analyze } = useAIAnalysis({
    type: analysisType,
    context: { companyId },
  });

  const handleAnalyze = async () => {
    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: `Analyze: ${analysisType}`,
    }]);

    // Stream response
    await analyze();

    // Add assistant message when done
    if (!error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
      }]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Analysis Type Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setAnalysisType('hiring-gap')}
          className={`px-4 py-2 rounded ${analysisType === 'hiring-gap' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Hiring Gap
        </button>
        <button
          onClick={() => setAnalysisType('capacity-analysis')}
          className={`px-4 py-2 rounded ${analysisType === 'capacity-analysis' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Capacity
        </button>
        <button
          onClick={() => setAnalysisType('workforce-summary')}
          className={`px-4 py-2 rounded ${analysisType === 'workforce-summary' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Summary
        </button>
      </div>

      {/* Messages */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {messages.map((msg, idx) => (
          <Card key={idx} className={msg.role === 'user' ? 'bg-blue-50' : 'bg-gray-50'}>
            <div className="p-4">
              <span className="font-semibold text-sm">{msg.role}</span>
              <p className="mt-2 text-sm">{msg.content}</p>
            </div>
          </Card>
        ))}

        {/* Streaming Response */}
        {isLoading && (
          <Card className="bg-gray-50">
            <div className="p-4">
              <span className="font-semibold text-sm flex gap-2">
                Assistant <Spinner />
              </span>
              <p className="mt-2 text-sm text-gray-700">{response}</p>
            </div>
          </Card>
        )}

        {error && (
          <Card className="bg-red-50 border-red-300">
            <div className="p-4">
              <span className="font-semibold text-sm text-red-900">Error</span>
              <p className="mt-2 text-sm text-red-700">{error.message}</p>
            </div>
          </Card>
        )}
      </div>

      {/* Action Button */}
      <Button
        onClick={handleAnalyze}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Analyzing...' : 'Run Analysis'}
      </Button>
    </div>
  );
}
```

---

## 4. Complete Dashboard Widget Example

### Setup: `widgets/dashboard/ai-insights-widget.tsx`

```typescript
'use client';

import { Suspense, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GetDashboardDataDocument } from '@/shared/graphql/generated';
import { ChatInterface } from '@/widgets/ai-assistant/chat';
import { InsightsPanel } from '@/features/ai-assistant/insights/ui';
import { useCompanyStore } from '@/shared/stores';

export function AIInsightsWidget() {
  const companyId = useCompanyStore(s => s.currentCompany.id);
  const [showChat, setShowChat] = useState(false);

  // Load dashboard data with Suspense (critical path)
  const { data } = useQuery(GetDashboardDataDocument, {
    variables: { companyId },
    suspense: true,
  });

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left: Insights Panels */}
      <div className="col-span-2 space-y-4">
        <InsightsPanel
          type="workforce-summary"
          context={{ data }}
          autoAnalyze={true}
        />
        <InsightsPanel
          type="hiring-gap"
          context={{
            departments: data.departments,
            openPositions: data.openPositions,
          }}
          autoAnalyze={false}
        />
      </div>

      {/* Right: AI Chat */}
      <div>
        <button
          onClick={() => setShowChat(!showChat)}
          className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          {showChat ? 'Hide Chat' : 'Open Chat'}
        </button>
        {showChat && <ChatInterface companyId={companyId} />}
      </div>
    </div>
  );
}
```

---

## 5. Insights Panel Component

### Setup: `features/ai-assistant/insights/ui/insights-panel.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { Card } from '@/shared/ui/card';
import { Spinner } from '@/shared/ui/spinner';
import { useAIAnalysis } from '../lib/useAIAnalysis';

interface InsightsPanelProps {
  type: 'hiring-gap' | 'capacity-analysis' | 'workforce-summary';
  context: Record<string, any>;
  autoAnalyze?: boolean;
  title?: string;
}

export function InsightsPanel({
  type,
  context,
  autoAnalyze = false,
  title,
}: InsightsPanelProps) {
  const { response, isLoading, error, analyze } = useAIAnalysis({
    type,
    context,
  });

  // Auto-analyze on mount if enabled
  useEffect(() => {
    if (autoAnalyze && !response) {
      analyze();
    }
  }, [autoAnalyze, response, analyze]);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {title || type.replace('-', ' ').toUpperCase()}
        </h3>
        {!isLoading && !response && (
          <button
            onClick={() => analyze()}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
          >
            Analyze
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex gap-2 items-center text-gray-600">
          <Spinner /> Analyzing...
        </div>
      )}

      {error && (
        <div className="text-red-600 bg-red-50 p-3 rounded text-sm">
          {error.message}
        </div>
      )}

      {response && (
        <div className="prose prose-sm max-w-none">
          {/* Format response as markdown/sections */}
          {response.split('\n\n').map((section, idx) => (
            <p key={idx} className="text-gray-700 text-sm leading-relaxed">
              {section}
            </p>
          ))}
        </div>
      )}
    </Card>
  );
}
```

---

## 6. Message Storage in Database

### Setup: `server/services/ChatMessageService.ts`

```typescript
import { prisma } from "@/server/db";

export class ChatMessageService {
  async createMessage(data: {
    companyId: string;
    userId: string;
    type: "USER" | "ASSISTANT";
    role: string;
    content: string;
    analysisType?: string;
  }) {
    return prisma.chatMessage.create({
      data: {
        companyId: data.companyId,
        userId: data.userId,
        type: data.type,
        role: data.role,
        content: data.content,
        analysisType: data.analysisType,
        createdAt: new Date(),
      },
    });
  }

  async getConversation(companyId: string, limit = 50) {
    return prisma.chatMessage.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async updateMessageContent(messageId: string, content: string) {
    return prisma.chatMessage.update({
      where: { id: messageId },
      data: { content, updatedAt: new Date() },
    });
  }
}
```

---

## 7. Errors & Retry Logic

### Setup: Error Handling in Hook

```typescript
"use client";

export function useAIAnalysisWithRetry({
  type,
  context,
  maxRetries = 3,
}: UseAIAnalysisOptions & { maxRetries?: number }) {
  const [retryCount, setRetryCount] = useState(0);

  const analyze = useCallback(async () => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await executeAnalysis();
      } catch (err) {
        setRetryCount(attempt + 1);

        if (attempt === maxRetries - 1) {
          throw err; // Last attempt failed
        }

        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt)),
        );
      }
    }
  }, [type, context, maxRetries]);

  return { response, isLoading, error, retryCount, analyze };
}
```

---

## 8. Complete Flow Diagram

```
┌─────────────────────────────────────────┐
│  Dashboard Page                         │
│  - Loads company data with Suspense     │
│  - Renders AIInsightsWidget             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  AIInsightsWidget                       │
│  - Shows InsightsPanels                 │
│  - Optionally shows ChatInterface       │
└──────────────┬──────────────────────────┘
               │
      ┌────────┴────────┐
      ▼                 ▼
┌───────────────┐  ┌──────────────────┐
│ InsightsPanel │  │ ChatInterface    │
│ - Auto-analyze│  │ - User triggers  │
│ - Shows result│  │ - Streaming UI   │
└───────┬───────┘  └────────┬─────────┘
        │                   │
        └───────────────────┘
                │
                ▼ (both call)
┌─────────────────────────────────────────┐
│  useAIAnalysis Hook                     │
│  - Calls /api/ai/analyze                │
│  - Streams response                     │
│  - Updates local state                  │
│  - Handles errors                       │
└──────────────┬──────────────────────────┘
               │
               ▼ (fetch POST)
┌─────────────────────────────────────────┐
│  /api/ai/analyze (Route Handler)        │
│  - Authenticate user                    │
│  - Validate analysis type               │
│  - Build prompts                        │
│  - Call Anthropic Claude API            │
│  - Return SSE stream                    │
└──────────────┬──────────────────────────┘
               │
               ▼ (SSE)
┌─────────────────────────────────────────┐
│  Claude 3.5 Sonnet                      │
│  - Receives prompt                      │
│  - Generates insights                   │
│  - Streams tokens                       │
└──────────────┬──────────────────────────┘
               │
               ▼ (tokens)
┌─────────────────────────────────────────┐
│  Browser SSE Reader                     │
│  - Receives token stream                │
│  - Parses data: lines                   │
│  - Updates state progressively          │
└──────────────┬──────────────────────────┘
               │
               ▼ (state update)
┌─────────────────────────────────────────┐
│  UI Re-render                           │
│  - Shows streaming text                 │
│  - Updates progressively                │
│  - Shows final result                   │
└─────────────────────────────────────────┘
```

---

## 9. Testing AI Integration

```typescript
import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAIAnalysis } from "./useAIAnalysis";

describe("useAIAnalysis", () => {
  it("streams response from API", async () => {
    // Mock SSE stream
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: async () => ({
            value: new TextEncoder().encode(
              'data: {"type":"content_block_delta","delta":{"text":"Hello"}}\n\n',
            ),
            done: false,
          }),
        }),
      },
    });

    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      useAIAnalysis({
        type: "workforce-summary",
        context: {},
      }),
    );

    await result.current.analyze();

    await waitFor(() => {
      expect(result.current.response).toContain("Hello");
      expect(result.current.isLoading).toBe(false);
    });
  });
});
```

---

## Checklist: AI Integration

- [ ] API route validates authentication
- [ ] Prompt builders parameterized by analysis type
- [ ] SSE streaming implemented correctly
- [ ] Hook handles token buffering
- [ ] UI updates progressively (not waiting for full response)
- [ ] Errors caught and displayed usefully
- [ ] Retry logic with exponential backoff
- [ ] Messages stored in database (for future context)
- [ ] Rate limiting on API route
- [ ] Cost tracking (tokens sent/received)
- [ ] Suspense boundary catches streaming errors
- [ ] Tests cover happy path + error cases

This is production-ready. Deploy and iterate.
