"use client";
import { useCallback, useRef } from "react";

/**
 * Debounce a callback function
 * @param callback - Function to debounce
 * @param delay - Delay in ms (default: 300ms)
 * @returns Debounced function that accepts same arguments as callback
 *
 * @example
 * const debouncedSearch = useDebounce((searchTerm: string) => {
 *   applySearch(searchTerm);
 * }, 300);
 *
 * debouncedSearch("user query");
 */
export function useDebounce<Args extends any[]>(
  callback: (...args: Args) => void,
  delay: number = 300,
): (...args: Args) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  return useCallback(
    (...args: Args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
}
