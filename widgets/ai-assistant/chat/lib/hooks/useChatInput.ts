import { useCallback } from "react";
import { useChatStore } from "../store/chatStore";

export function useChatInput() {
  const { input, showCommands, setInput, setShowCommands } = useChatStore();

  const handleInputChange = useCallback(
    (value: string) => {
      setInput(value);
    },
    [setInput]
  );

  const handleSelectCommand = useCallback(
    (command: string) => {
      setInput(command + " ");
      setShowCommands(false);
    },
    [setInput, setShowCommands]
  );

  const clearInput = useCallback(() => {
    setInput("");
  }, [setInput]);

  return {
    input,
    showCommands,
    handleInputChange,
    handleSelectCommand,
    clearInput,
  };
}
