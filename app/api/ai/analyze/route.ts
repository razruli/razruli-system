import { streamText } from "ai";

import { getModel, getModelConfig } from "@/server/ai/model-provider";
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
  userId?: string; // Pass userId from client
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalysisRequest;
    const { type, context, userId } = body;

    if (!userId) {
      return new Response("Unauthorized - no user ID", { status: 401 });
    }

    // Get actor/company context (optional for MVP)
    let company: any = null;
    try {
      const actor = await prisma.actor.findUnique({
        where: { userId },
        include: { company: true },
      });
      if (actor) {
        company = actor.company;
      }
    } catch (err) {
      console.warn(
        "[AI Analysis] Actor lookup failed, using generic context",
        err,
      );
    }

    // Use generic context if actor not found
    if (!company) {
      company = {
        name: "Your Company",
        id: userId, // Use userId as fallback ID
      };
    }

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

    // Get model with automatic fallback logic
    let modelConfig;
    try {
      modelConfig = getModelConfig();
    } catch (err) {
      console.error("[AI Route] Model provider error:", err);
      return new Response(
        "AI model provider not configured. " +
          "Set AI_GATEWAY_API_KEY (Vercel AI Gateway) or GROQ_API_KEY (fallback) in .env.local. " +
          "See https://vercel.com/docs/ai for setup instructions.",
        { status: 500 },
      );
    }

    let model;
    try {
      const modelData = await getModel();
      model = modelData.model;
    } catch (err) {
      console.error("[AI Route] Failed to initialize model:", err);
      return new Response("Failed to initialize AI model provider", {
        status: 500,
      });
    }

    const result = streamText({
      model: model,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
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
