import { useCallback } from "react";

import type { ChatMessage } from "@/entities/ai-assistant/chat-message";

import { useChatMessagesStore } from "../store/chatMessagesStore";

export function useChatMessagesManagement() {
  const { messages, addMessage, removeMessage, clearMessages } =
    useChatMessagesStore();

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      addMessage(userMessage);
    },
    [addMessage],
  );

  const addAssistantMessage = useCallback(
    (content: string) => {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: new Date(),
      };

      addMessage(assistantMessage);
    },
    [addMessage],
  );

  return {
    messages,
    sendMessage,
    addAssistantMessage,
    removeMessage,
    clearMessages,
  };
}
