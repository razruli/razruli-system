import { useCallback, useState } from "react";

import type { SlashCommand } from "../../model";
import { SLASH_COMMANDS } from "../config";

export function useChatInputManagement() {
  const [input, setInput] = useState("");
  const [showCommands, setShowCommands] = useState(false);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    setShowCommands(value === "/");
  }, []);

  const handleSelectCommand = useCallback((command: string) => {
    setInput(command + " ");
    setShowCommands(false);
  }, []);

  const clearInput = useCallback(() => {
    setInput("");
  }, []);

  return {
    input,
    showCommands,
    commands: SLASH_COMMANDS as SlashCommand[],
    handleInputChange,
    handleSelectCommand,
    clearInput,
  };
}
