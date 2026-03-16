import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { UIMessage, ChatState } from "../model/types";

export const useChatStore = create<
  ChatState & {
    addMessage: (message: UIMessage) => void;
    setMessages: (messages: UIMessage[]) => void;
    setInput: (input: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    setShowCommands: (showCommands: boolean) => void;
    setSelectedCommand: (command: string | null) => void;
    clear: () => void;
  }
>(
  immer((set) => ({
    messages: [],
    input: "",
    isLoading: false,
    showCommands: false,
    selectedCommand: null,

    addMessage: (message: UIMessage) =>
      set((state) => {
        state.messages.push(message);
      }),

    setMessages: (messages: UIMessage[]) =>
      set((state) => {
        state.messages = messages;
      }),

    setInput: (input: string) =>
      set((state) => {
        state.input = input;
        state.showCommands = input === "/";
      }),

    setIsLoading: (isLoading: boolean) =>
      set((state) => {
        state.isLoading = isLoading;
      }),

    setShowCommands: (showCommands: boolean) =>
      set((state) => {
        state.showCommands = showCommands;
      }),

    setSelectedCommand: (command: string | null) =>
      set((state) => {
        state.selectedCommand = command;
      }),

    clear: () =>
      set({
        messages: [],
        input: "",
        isLoading: false,
        showCommands: false,
        selectedCommand: null,
      }),
  }))
);
