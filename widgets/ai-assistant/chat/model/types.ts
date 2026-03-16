export type UIMessageRole = "user" | "assistant";

export interface UIMessage {
  id: string;
  role: UIMessageRole;
  content: string;
  parts?: MessagePart[];
  timestamp?: Date;
}

export interface MessagePart {
  type: "text" | "tool-invocation" | "tool-result";
  text?: string;
  toolInvocation?: {
    toolName: string;
    state: "pending" | "result" | "error";
    result?: any;
  };
}

export interface SuggestedPrompt {
  icon: any;
  label: string;
  text: string;
  color: string;
}

export interface SlashCommand {
  command: string;
  description: string;
  icon: any;
}

export interface ChatState {
  messages: UIMessage[];
  input: string;
  isLoading: boolean;
  showCommands: boolean;
  selectedCommand: string | null;
}
