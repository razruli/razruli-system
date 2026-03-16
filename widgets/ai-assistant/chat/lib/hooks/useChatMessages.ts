import { useCallback } from "react";
import { useChatStore } from "../store/chatStore";
import { UIMessage } from "../../model/types";

export function useChatMessages() {
  const { messages, addMessage, setMessages, isLoading } = useChatStore();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      // Add user message
      const userMessage: UIMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      addMessage(userMessage);

      // TODO: Call AI endpoint to generate assistant response
      // For now, this is a placeholder
      console.log("[Chat] Sending message:", content);
    },
    [isLoading, addMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  const removeMessage = useCallback(
    (messageId: string) => {
      setMessages(messages.filter((m) => m.id !== messageId));
    },
    [messages, setMessages]
  );

  return {
    messages,
    sendMessage,
    clearMessages,
    removeMessage,
  };
}
