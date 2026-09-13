import { motion, useInView } from "framer-motion"
import { Activity, BarChart3, Shield, Zap, Globe, Lock, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useRef } from "react"

interface Feature {
  icon: LucideIcon
  title: string
  description: string

  gradient: string
  iconBg: string
}

const features: Feature[] = [
  {
    icon: Activity,
    title: "Real-time Tracking",
    description:
      "Unified dashboard for all your wallets and exchanges. Updates every second via WebSocket connections.",
    gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent",
    iconBg: "from-emerald-500/30 to-emerald-500/10",
  },
  {
    icon: BarChart3,
    title: "Market Analysis",
    description: "Deep dive into market trends, signals, and liquidity. Advanced charting tools with 100+ indicators.",
    gradient: "from-blue-500/20 via-blue-500/10 to-transparent",
    iconBg: "from-blue-500/30 to-blue-500/10",
  },
  {
    icon: Shield,
    title: "Advanced Security",
    description:
      "We prioritize your privacy. API keys are encrypted client-side. Read-only access ensures your funds stay safe.",
    gradient: "from-purple-500/20 via-purple-500/10 to-transparent",
    iconBg: "from-purple-500/30 to-purple-500/10",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for performance. Sub-100ms response times with our globally distributed infrastructure.",
    gradient: "from-yellow-500/20 via-yellow-500/10 to-transparent",
    iconBg: "from-yellow-500/30 to-yellow-500/10",
  },
  {
    icon: Globe,
    title: "Multi-Chain Support",
    description: "Track assets across 50+ blockchain networks including Ethereum, Solana, Bitcoin, and more.",
    gradient: "from-cyan-500/20 via-cyan-500/10 to-transparent",
    iconBg: "from-cyan-500/30 to-cyan-500/10",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your data is encrypted end-to-end. We never sell your information or share it with third parties.",
    gradient: "from-rose-500/20 via-rose-500/10 to-transparent",
    iconBg: "from-rose-500/30 to-rose-500/10",
  },
]

const premiumEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" className="relative pb-20 overflow-hidden z-10">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(160_84%_39%/0.05)_0%,_transparent_60%)]" />
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: premiumEase }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-border/5 pointer-events-none"
        />
      </div>

      <div className="container relative mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: premiumEase}}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Features
            </span>
          </motion.div>
          <h2 className="mt-8  font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Professional Grade
            <span className="block gradient-text mt-2">Trading Tools</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Everything you need to manage your portfolio in one secure place. Built for speed, accuracy, and privacy.
          </p>
        </motion.div>

        <motion.div
          className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate= "visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
              },
            },
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease: premiumEase,
                  },
                },
              }}
            >
              <Card
                variant="feature"
                className="group relative h-full overflow-hidden p-2 hover:border-primary/40 transition-all duration-500"
              >
                {/* Animated gradient background on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-all duration-700`}
                  initial={false}
                />

                <motion.div
                  className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-2xl"
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.25, 0.4, 0.25],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: index * 0.4,
                    ease: "easeInOut",
                  }}
                />

                <CardContent className="relative p-0">
                  <motion.div
                    className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.iconBg} backdrop-blur-sm border border-white/10 shadow-lg`}
                    whileHover={{
                      scale: 1.1,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <feature.icon className="h-8 w-8 text-foreground" />
                  </motion.div>
                  <h3 className="font-display text-xl font-bold">{feature.title}</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{feature.description}</p>

                  {/* Learn more link */}
                  <motion.div
                    className="mt-6 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                    whileHover={{ x: 4 }}
                  >
                    Learn more
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    >
                      →
                    </motion.span>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
