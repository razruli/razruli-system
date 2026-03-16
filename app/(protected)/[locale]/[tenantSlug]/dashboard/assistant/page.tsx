"use client";

import { ChatInterface } from "@/widgets/ai-assistant/chat";
import { ArtifactContainer } from "@/widgets/ai-assistant/artifacts";

/**
 * Assistant Page - Clean Orchestration
 *
 * FSD Structure:
 * Page → Widgets → Features/Entities/Shared
 *
 * This page simply orchestrates two key widgets:
 * 1. ChatInterface - User conversation and message management
 * 2. ArtifactContainer - Display generated artifacts (analysis, reports, etc)
 *
 * All business logic, state management, and UI composition lives in widgets.
 * Pages are purely orchestrators.
 */
export default function AssistantPage() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] gap-0">
      {/* Main Chat Interface */}
      <div className="flex-1 min-w-0">
        <ChatInterface />
      </div>

      {/* Artifacts Sidebar */}
      <div className="w-96 hidden lg:flex border-l bg-background">
        <ArtifactContainer />
      </div>
    </div>
  );
}
