/**
 * Report Web Vitals to analytics (optional integration).
 * Replace the body with your analytics provider (e.g. datadog, posthog).
 */
export const reportWebVitals = (_metric: { name: string; value: number }) => {
  // analytics.trackEvent('web_vital', { name: metric.name, value: metric.value })
}

/**
 * Prefetch resources for faster navigation.
 * Use sparingly to avoid excessive data transfer.
 */
export const prefetchRoute = (routePath: string) => {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "script";
      link.href = routePath;
      document.head.appendChild(link);
    });
  }
}

/**
 * Optimize image loading with lazy loading
 */
export const createOptimizedImageProps = (src: string, alt: string) => ({
  src,
  alt,
  loading: "lazy" as const,
  decoding: "async" as const,
})
