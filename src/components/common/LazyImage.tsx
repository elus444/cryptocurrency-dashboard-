import { useEffect, useState } from "react"
import { createOptimizedImageProps } from "@/utils/performance"

interface LazyImageProps {
  src: string
  alt: string
  placeholder?: string
  className?: string
  onLoad?: () => void
}

/**
 * Lazy loading image component for better performance
 * Prevents loading images outside viewport until needed
 */
export const LazyImage = ({ src, alt, placeholder, className, onLoad }: LazyImageProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(placeholder || null)
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    if (!imageRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src)
          onLoad?.()
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: "50px" }, // Start loading 50px before entering viewport
    )

    observer.observe(imageRef)
    return () => observer.disconnect()
  }, [imageRef, src, onLoad])

  return (
    <img ref={setImageRef} {...createOptimizedImageProps(imageSrc || placeholder || src, alt)} className={className} />
  )
}
