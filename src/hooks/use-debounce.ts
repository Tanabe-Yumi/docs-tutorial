import { useCallback, useRef } from "react";

export function useDebounce<
  T extends (...args: Parameters<T>) => ReturnType<T>,
>(callback: T, delay: number = 500) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      // 前のタイマーがあれば削除
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // delay(500ms) 後にコールバック関数を実行
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
}
