"use client";

import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, Badge } from "@/shared/ui";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";
import { Loader2, Sparkles } from "lucide-react";
import type { UIMessage } from "../model/types";

interface MessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 px-4 py-6">
      <div className="mx-auto max-w-3xl flex flex-col gap-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-3 py-3">
            <Avatar className="h-7 w-7 shrink-0 mt-0.5">
              <AvatarFallback className="bg-primary/15 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar className="h-7 w-7 shrink-0 mt-0.5">
        <AvatarFallback className={isUser ? "bg-accent text-accent-foreground" : "bg-primary/15 text-primary"}>
          {isUser ? "U" : <Sparkles className="h-3.5 w-3.5" />}
        </AvatarFallback>
      </Avatar>
      <div className={`flex-1 max-w-2xl ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block rounded-lg px-4 py-2 ${
            isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    </div>
  );
}
