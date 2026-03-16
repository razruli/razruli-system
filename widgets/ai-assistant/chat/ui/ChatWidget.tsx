"use client";

import { Sparkles, Send } from "lucide-react";

import { Separator } from "@/shared/ui";
import { ScrollArea, Avatar, AvatarFallback, Button } from "@/shared/ui";

import { useChatWidget } from "../model";

/**
 * ChatWidget UI - Uses widget model exclusively
 *
 * The model (lib/model/useChatWidget) orchestrates:
 * - features/ai-assistant/chat-message: Message history state
 * - features/ai-assistant/chat-input: Input draft state
 *
 * This UI component only consumes the widget's public API
 */
export function ChatWidget() {
  const {
    messages,
    input,
    bottomRef,
    handleInputChange,
    handleSubmit,
    handleKeyDown,
  } = useChatWidget();

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <p className="text-sm">Start a conversation...</p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                <AvatarFallback>
                  {msg.role === "user" ? (
                    "U"
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div
                className={`inline-block rounded-lg px-4 py-2 max-w-2xl ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <Separator />

      {/* Input */}
      <div className="p-4">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
              className="w-full min-h-10 max-h-32 rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <Button
              onClick={handleSubmit}
              disabled={!input.trim()}
              size="sm"
              className="absolute right-2 bottom-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
