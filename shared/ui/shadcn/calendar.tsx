"use client";

import * as React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/shared/lib/shadcn/utils/utils";
import { buttonVariants } from "@/shared/ui/shadcn/button";

export interface CalendarProps {
  mode?: "single" | "multiple" | "range";
  disabled?: boolean | ((date: Date) => boolean);
  selected?: Date | Date[] | { from?: Date; to?: Date };
  onSelect?: (
    date: Date | Date[] | { from?: Date; to?: Date } | undefined,
  ) => void;
  className?: string;
}

/**
 * Simple calendar component for date selection
 * Used in FilterDateRange for date picking
 */
export function Calendar({
  disabled,
  selected,
  onSelect,
  className,
}: CalendarProps) {
  const currentDate = new Date();
  const [displayMonth, setDisplayMonth] = React.useState(currentDate);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date: Date) => {
    if (typeof disabled === "function") {
      return disabled(date);
    }
    return disabled === true;
  };

  const isDateSelected = (date: Date) => {
    if (!selected) return false;

    if (selected instanceof Date) {
      return date.toDateString() === selected.toDateString();
    }

    if ("from" in selected && "to" in selected) {
      const from = selected.from;
      const to = selected.to;
      if (from && to) {
        return date >= from && date <= to;
      }
      if (from) {
        return date.toDateString() === from.toDateString();
      }
    }

    return false;
  };

  const days = [];
  const daysInMonth = getDaysInMonth(displayMonth);
  const firstDay = getFirstDayOfMonth(displayMonth);

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(displayMonth.getFullYear(), displayMonth.getMonth(), i));
  }

  const monthYear = displayMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className={cn("p-3", className)}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() =>
            setDisplayMonth(
              new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1),
            )
          }
          className={cn(buttonVariants({ variant: "ghost" }), "h-7 w-7 p-0")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium">{monthYear}</div>
        <button
          onClick={() =>
            setDisplayMonth(
              new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1),
            )
          }
          className={cn(buttonVariants({ variant: "ghost" }), "h-7 w-7 p-0")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-semibold text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-8" />;
          }

          const isDisabled = isDateDisabled(day);
          const isSelected = isDateSelected(day);
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <button
              key={day.toDateString()}
              onClick={() => !isDisabled && onSelect?.(day)}
              disabled={isDisabled}
              className={cn(
                "h-8 w-8 text-sm rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                isSelected && "bg-primary text-primary-foreground",
                isToday && !isSelected && "bg-accent",
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { Calendar as default };
