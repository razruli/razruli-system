import { create } from "zustand";

import type { ChatMessage } from "@/entities/ai-assistant/chat-message";

interface ChatMessagesState {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  removeMessage: (messageId: string) => void;
  clearMessages: () => void;
}

export const useChatMessagesStore = create<ChatMessagesState>((set) => ({
  messages: [],

  addMessage: (message: ChatMessage) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setMessages: (messages: ChatMessage[]) =>
    set({
      messages,
    }),

  removeMessage: (messageId: string) =>
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== messageId),
    })),

  clearMessages: () =>
    set({
      messages: [],
    }),
}));
