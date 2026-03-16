"use client";

import { useRef } from "react";
import { Send, AlertTriangle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import type { SlashCommand } from "../model/types";

interface InputAreaProps {
  input: string;
  showCommands: boolean;
  isLoading: boolean;
  commands: SlashCommand[];
  onInputChange: (value: string) => void;
  onSelectCommand: (command: string) => void;
  onSubmit: (text: string) => void;
  onShowCommands?: (show: boolean) => void;
}

export function InputArea({
  input,
  showCommands,
  isLoading,
  commands,
  onInputChange,
  onSelectCommand,
  onSubmit,
  onShowCommands,
}: InputAreaProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit(input);
        onInputChange("");
      }
    }
    if (e.key === "Escape") {
      onShowCommands?.(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Proactive insight banner */}
      {input === "" && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-2.5">
          <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
          <p className="text-xs text-foreground">
            <span className="font-semibold">Insight:</span> Your Engineering team is 12% over capacity. Consider hiring or redistributing workload.
          </p>
        </div>
      )}

      {/* Input with slash commands */}
      <Popover open={showCommands} onOpenChange={onShowCommands}>
        <PopoverTrigger asChild>
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your workforce... (Type / for commands)"
              className="w-full min-h-10 max-h-32 rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <Button
              onClick={() => {
                if (input.trim() && !isLoading) {
                  onSubmit(input);
                  onInputChange("");
                }
              }}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="absolute right-2 bottom-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </PopoverTrigger>

        {showCommands && (
          <PopoverContent className="p-0" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>No commands found</CommandEmpty>
                <CommandGroup>
                  {commands.map((cmd) => {
                    const Icon = cmd.icon;
                    return (
                      <CommandItem
                        key={cmd.command}
                        value={cmd.command}
                        onSelect={() => {
                          onSelectCommand(cmd.command);
                          onShowCommands?.(false);
                          inputRef.current?.focus();
                        }}
                        className="cursor-pointer"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{cmd.command}</p>
                          <p className="text-xs text-muted-foreground">{cmd.description}</p>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
