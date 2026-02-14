import { useCallback, useEffect, useRef } from "react";

/**
 * Returns a stable debounced callback that always calls the latest version of `fn`.
 * The returned function has a `.cancel()` method to abort pending calls.
 * Automatically cancels on unmount.
 *
 * @param fn   The function to debounce.
 * @param delay Debounce delay in milliseconds (default 500).
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  fn: T,
  delay = 500,
) {
  const fnRef = useRef(fn);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Always keep the ref pointing at the latest function
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  // Cancel helper
  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // The stable debounced function
  const debounced = useCallback(
    (...args: Parameters<T>) => {
      cancel();
      timerRef.current = setTimeout(() => {
        fnRef.current(...args);
      }, delay);
    },
    [delay, cancel],
  );

  // Cleanup on unmount
  useEffect(() => {
    return cancel;
  }, [cancel]);

  return Object.assign(debounced, { cancel });
}
