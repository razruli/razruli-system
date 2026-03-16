export type ChatMessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  parts?: MessagePart[];
  timestamp: Date;
}

export interface MessagePart {
  type: "text" | "tool-invocation" | "tool-result";
  text?: string;
  toolInvocation?: {
    toolName: string;
    state: "pending" | "result" | "error";
    result?: unknown;
  };
}
