import { useEffect, useMemo, useRef, useState } from "react"

/**
 * Hook for tracking component visibility in viewport.
 * Prevents rendering content until it's visible (lazy rendering).
 *
 * IMPORTANT: Pass a stable options object (or omit it entirely).
 * The hook memoises the init config internally so an inline object at the
 * call site does NOT cause an infinite re-subscription loop.
 */
export const useIntersection = (options?: IntersectionObserverInit) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Serialise options so the effect only re-runs when the values actually change,
  // not when the caller accidentally passes a new object reference each render.
  const stableOptions = useMemo(
    () => options,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options?.root, options?.rootMargin, options?.threshold]
  )

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target) // Stop observing once visible
      }
    }, stableOptions)

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [stableOptions])

  return { ref, isVisible }
}
