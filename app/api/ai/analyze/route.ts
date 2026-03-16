import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { getSession } from "better-auth/api";

// import { getSession } from "@/server/auth/auth";
import { prisma } from "@/server/db/prisma/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 60;

interface AnalysisRequest {
  type:
    | "hiring-gap"
    | "data-insights"
    | "capacity-analysis"
    | "workforce-summary";
  context?: Record<string, unknown>;
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = (await request.json()) as AnalysisRequest;
    const { type, context } = body;

    // Get actor/company context
    const actor = await prisma.actor.findUnique({
      where: { userId: session.user.id },
      include: { company: true },
    });

    if (!actor) {
      return new Response("Actor not found", { status: 404 });
    }

    const company = actor.company;
    let systemPrompt = "";
    let userMessage = "";

    // Build context-specific prompts
    switch (type) {
      case "hiring-gap":
        systemPrompt = buildHiringGapPrompt(company);
        userMessage = `Analyze hiring gaps and provide recommendations based on this context: ${JSON.stringify(context)}`;
        break;

      case "data-insights":
        systemPrompt = buildDataInsightsPrompt(company);
        userMessage = `Generate insights from the provided data: ${JSON.stringify(context)}`;
        break;

      case "capacity-analysis":
        systemPrompt = buildCapacityAnalysisPrompt(company);
        userMessage = `Analyze capacity utilization: ${JSON.stringify(context)}`;
        break;

      case "workforce-summary":
        systemPrompt = buildWorkforceSummaryPrompt(company);
        userMessage = `Provide workforce summary: ${JSON.stringify(context)}`;
        break;

      default:
        return new Response("Unknown analysis type", { status: 400 });
    }

    // Stream response using Vercel AI SDK
    const result = streamText({
      model: anthropic("claude-3-5-sonnet-20241022"),
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
      temperature: 0.7,
    });

    // Return streaming response
    return result.toDataStream();
  } catch (error) {
    console.error("[AI Analysis Error]", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

function buildHiringGapPrompt(company: any): string {
  return `You are an expert HR consultant for ${company.name}. 
Analyze hiring gaps, skill requirements, and provide specific recommendations for recruitment strategy.
Use data-driven insights and consider department workload, capacity utilization, and skill gaps.
Provide actionable recommendations with priority levels (High/Medium/Low).
Format: Clear sections with bullet points.`;
}

function buildDataInsightsPrompt(company: any): string {
  return `You are a workforce analytics expert for ${company.name}.
Generate meaningful insights from employee and departmental data.
Focus on patterns, trends, and anomalies.
Provide context-aware recommendations for organizational improvements.
Consider department performance, employee distribution, and workload patterns.`;
}

function buildCapacityAnalysisPrompt(company: any): string {
  return `You are a capacity planning specialist for ${company.name}.
Analyze workload distribution, capacity utilization rates, and resource allocation.
Identify bottlenecks and over/under-utilized areas.
Provide recommendations for load balancing and resource optimization.`;
}

function buildWorkforceSummaryPrompt(company: any): string {
  return `You are a workforce analyst for ${company.name}.
Create comprehensive yet concise summaries of workforce composition, key metrics, and trends.
Highlight important statistics and emerging patterns.
Provide context and business implications.`;
}
