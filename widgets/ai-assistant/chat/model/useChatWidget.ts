"use client";

import { useCallback, useEffect, useRef } from "react";

import { useArtifactsManagement } from "@/features/ai-assistant/artifact";
import { useChatInputManagement } from "@/features/ai-assistant/chat-input";
import { useChatMessagesManagement } from "@/features/ai-assistant/chat-message";
import { useSession } from "@/shared/lib/auth";

/**
 * Widget Model: Orchestrates chat-message + chat-input features
 *
 * This hook combines feature logic for the ChatWidget:
 * - Message display + input submit coordination
 * - Auto-scroll behavior
 * - Keyboard handling
 * - AI analysis request + artifact creation
 *
 * Widget UI consumes ONLY this hook, not feature hooks directly
 */
export function useChatWidget() {
  const { data: session } = useSession();
  const { messages, sendMessage, addAssistantMessage } =
    useChatMessagesManagement();
  const { input, handleInputChange, clearInput } = useChatInputManagement();
  const { createArtifact } = useArtifactsManagement();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Orchestrate feature interactions
  const handleSubmit = useCallback(async () => {
    if (!input.trim()) return;
    if (!session?.user?.id) {
      console.error("No user session");
      return;
    }

    sendMessage(input);
    const userQuery = input;
    clearInput();

    try {
      // Call AI analysis endpoint
      console.log("[Chat Widget] Calling AI endpoint...");
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "data-insights",
          context: { userQuery },
          userId: session.user.id,
        }),
      });

      console.log(
        "[Chat Widget] Response status:",
        response.status,
        response.ok,
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} ${errorText}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Read response as text
      const fullResponse = await response.text();

      console.log(
        "[Chat Widget] Response received, length:",
        fullResponse.length,
      );
      console.log(
        "[Chat Widget] Response preview:",
        fullResponse.substring(0, 300),
      );
      console.log("[Chat Widget] Response (full):", fullResponse);

      if (!fullResponse || !fullResponse.trim()) {
        console.error("[Chat Widget] Empty response detail:", {
          length: fullResponse?.length,
          content: fullResponse,
        });
        throw new Error("Empty response from AI");
      }

      // Add assistant message
      addAssistantMessage(fullResponse);

      // Create artifact from response
      const artifact = {
        id: `artifact-${Date.now()}`,
        type: "report" as const,
        title: `AI Analysis - ${new Date().toLocaleString()}`,
        content: fullResponse,
        generatedAt: new Date(),
      };

      createArtifact(artifact);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "AI analysis failed";
      console.error("[Chat Widget Error]", err);
      addAssistantMessage(`Error: ${errorMsg}`);
    }
  }, [
    input,
    session?.user?.id,
    sendMessage,
    clearInput,
    addAssistantMessage,
    createArtifact,
  ]);

  // Handle Enter key in textarea
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return {
    messages,
    input,
    bottomRef,
    handleInputChange,
    handleSubmit,
    handleKeyDown,
  };
}
