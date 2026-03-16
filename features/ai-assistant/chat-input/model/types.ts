export interface SlashCommand {
  command: string;
  description: string;
  icon: any; // lucide-react icon component
}

export interface ChatInputState {
  input: string;
  showCommands: boolean;
}

export interface ChatInputModel extends ChatInputState {
  commands: SlashCommand[];
  setInput: (input: string) => void;
  setShowCommands: (show: boolean) => void;
  selectCommand: (command: string) => void;
  clearInput: () => void;
}
