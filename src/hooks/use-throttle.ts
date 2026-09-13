import { useRef } from "react"

/**
 * Hook for throttling frequently called functions (scroll, resize, etc)
 * Reduces CPU usage and improves scroll performance
 */
export const useThrottle = <T extends (...args: never[]) => unknown>(callback: T, delay = 300) => {
  const lastRun = useRef<number>(Date.now())

  return ((...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastRun.current >= delay) {
      lastRun.current = now
      callback(...args)
    }
  }) as T
}
