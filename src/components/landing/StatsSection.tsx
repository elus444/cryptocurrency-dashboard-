import { motion, useInView, useSpring, useTransform } from "framer-motion"
import { useRef, useEffect, useState } from "react"

const stats = [
  { value: 50000, suffix: "+", label: "Active Traders", icon: "👥" },
  { value: 2.5, suffix: "B+", label: "Assets Tracked", prefix: "$", icon: "💰" },
  { value: 50, suffix: "+", label: "Exchanges Supported", icon: "🔗" },
  { value: 99.9, suffix: "%", label: "Uptime Guarantee", icon: "⚡" },
]

function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number
  suffix?: string
  prefix?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const spring = useSpring(0, {
    mass: 1,
    stiffness: 50,
    damping: 15,
  })

  const display = useTransform(spring, (current) => {
    if (value >= 100) {
      return Math.floor(current).toLocaleString()
    }
    return current.toFixed(1)
  })

  const [displayValue, setDisplayValue] = useState("0")

  useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, spring, value])

  useEffect(() => {
    return display.on("change", (latest) => {
      setDisplayValue(latest)
    })
  }, [display])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}

const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/40 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(160_84%_39%/0.1)_0%,_transparent_60%)]" />

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px w-full bg-gradient-to-r from-transparent via-primary/15 to-transparent"
            style={{ top: `${30 + i * 20}%` }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container relative mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.12,
                ease: premiumEase,
              }}
              className="group relative"
            >
              <motion.div
                className="relative overflow-hidden rounded-3xl border border-border/20 bg-card/30 p-10 backdrop-blur-2xl transition-all duration-500 hover:border-primary/40 hover:bg-card/50"
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Glow on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{
                    background: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
                  }}
                />

                {/* Floating icon -- inset positive from the corner (not negative)
                    so the glyph sits fully inside the card's rounded-3xl bounds
                    instead of being clipped by its overflow-hidden. */}
                <motion.div
                  className="absolute right-6 top-6 text-6xl opacity-8 group-hover:opacity-15 transition-opacity"
                  animate={{
                    y: [-4, 4, -4],
                    rotate: [-3, 3, -3],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.4,
                    ease: "easeInOut",
                  }}
                >
                  {stat.icon}
                </motion.div>

                <div className="relative text-center">
                  <motion.p
                    className="font-display text-5xl font-bold tracking-tight text-foreground lg:text-6xl"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.25 + index * 0.12, duration: 0.5 }}
                  >
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                  </motion.p>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {stat.label}
                  </p>

                  {/* Underline decoration */}
                  <motion.div
                    className="mx-auto mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-primary/50 to-primary"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.4 + index * 0.12, duration: 0.5, ease: premiumEase }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
