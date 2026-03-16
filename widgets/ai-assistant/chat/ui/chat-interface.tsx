"use client";

import { Separator } from "@/shared/ui/separator";
import { useChatMessages } from "../lib/hooks/useChatMessages";
import { useChatInput } from "../lib/hooks/useChatInput";
import { useSlashCommands } from "../lib/hooks/useSlashCommands";
import { MessageList } from "./message-list";
import { InputArea } from "./input-area";
import { SuggestedPrompts } from "./suggested-prompts";

export function ChatInterface() {
  const { messages, sendMessage, clearMessages } = useChatMessages();
  const { input, showCommands, handleInputChange, handleSelectCommand, clearInput } = useChatInput();
  const commands = useSlashCommands();

  const handleSubmit = (text: string) => {
    sendMessage(text);
    clearInput();
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* Messages */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="max-w-2xl w-full space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">AI Workforce Assistant</h1>
              <p className="text-muted-foreground">
                Ask questions about your team, get insights, and get recommendations
              </p>
            </div>
            <SuggestedPrompts onSelect={handleSubmit} />
          </div>
        </div>
      ) : (
        <MessageList messages={messages} isLoading={false} />
      )}

      <Separator />

      {/* Input */}
      <div className="p-4">
        <div className="mx-auto max-w-3xl">
          <InputArea
            input={input}
            showCommands={showCommands}
            isLoading={false}
            commands={commands}
            onInputChange={handleInputChange}
            onSelectCommand={handleSelectCommand}
            onSubmit={handleSubmit}
            onShowCommands={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
