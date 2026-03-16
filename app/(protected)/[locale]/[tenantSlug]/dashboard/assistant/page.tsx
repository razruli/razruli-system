"use client";

import { ChatWidget, ArtifactWidget } from "@/widgets/ai-assistant";

/**
 * Assistant Page - Clean Orchestration
 *
 * FSD Structure:
 * Page → Widgets → Features/Entities/Shared
 *
 * This page simply orchestrates two key widgets:
 * 1. ChatWidget - User conversation and message management
 * 2. ArtifactWidget - Display generated artifacts via modal
 *
 * All business logic, state management, and UI composition lives in widgets.
 * Pages are purely orchestrators.
 */
export default function AssistantPage() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* Main Chat Widget */}
      <div className="flex-1 min-w-0">
        <ChatWidget />
      </div>

      {/* Artifact Modal (rendered globally) */}
      <ArtifactWidget />
    </div>
  );
}
