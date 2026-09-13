import { Link } from "react-router-dom"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Play, Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState, memo } from "react"
import type { Variants } from "framer-motion"

// ─── Animation Variants ───────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const stagger: Variants = {
  show: {
    transition: { staggerChildren: 0.1 },
  },
}

// ─── Sidebar Preview ──────────────────────────────────────────────────────
// Interactive accordion sidebar shown inside the dashboard mock-up.

const sidebarMenu = [
  { label: "Dashboard", items: ["Overview", "Activity", "Performance"] },
  { label: "Portfolio",  items: ["Holdings", "Allocations", "History"]  },
  { label: "Markets",    items: ["Prices", "Trends", "Top Gainers"]     },
  { label: "Settings",   items: ["Profile", "Security", "Preferences"]  },
]

function SidebarPreview() {
  const [openSection, setOpenSection] = useState("Dashboard")

  return (
    <div className="rounded-xl bg-sidebar/60 p-4 space-y-3">
      {sidebarMenu.map((section) => {
        const isOpen = openSection === section.label

        return (
          <div key={section.label}>
            <button
              onClick={() => setOpenSection(isOpen ? "" : section.label)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-sidebar-accent/60 transition"
            >
              {section.label}
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden pl-3"
                >
                  {section.items.map((item) => (
                    <div
                      key={item}
                      className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-sidebar-accent/40 rounded-md"
                    >
                      {item}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

// ─── Dashboard Preview ────────────────────────────────────────────────────
// Decorative mock-up of the dashboard shown in the Hero section.

const STAT_CARDS = ["$1,248,892", "+$23,456", "47 Assets"]
const CHART_BARS = [40, 55, 70, 50, 80, 60, 90]

const DashboardPreview = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "0px" }}
    transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
    className="relative mx-auto mt-16 lg:mt-20 max-w-5xl"
  >
    {/* Gentle floating loop */}
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/90 p-4 sm:p-6 backdrop-blur shadow-xl">
        {/* Window chrome dots */}
        <div className="mb-4 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-destructive/60" />
          <div className="h-3 w-3 rounded-full bg-warning/60" />
          <div className="h-3 w-3 rounded-full bg-success/60" />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {/* Sidebar (hidden on mobile) */}
          <div className="hidden md:block">
            <SidebarPreview />
          </div>

          {/* Main content area */}
          <div className="col-span-3 space-y-4">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {STAT_CARDS.map((value, i) => (
                <motion.div
                  key={value}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl bg-card/80 p-4 border border-border/20"
                >
                  <p className="text-sm font-bold">{value}</p>
                </motion.div>
              ))}
            </div>

            {/* Bar chart */}
            <div className="h-44 rounded-xl bg-card/80 p-4 flex items-end gap-1.5">
              {CHART_BARS.map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                  className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
))

DashboardPreview.displayName = "DashboardPreview"

// ─── Hero Section ─────────────────────────────────────────────────────────

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // Subtle parallax on scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, 60])

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 pb-20">
      <motion.div style={{ y }} className="container mx-auto px-4">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-4xl text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-6 inline-flex">
            <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" /> v2.0 Now Live
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} className="text-5xl font-bold">
            Track All Your Wallets
            <span className="block text-primary mt-2">in One Crypto App</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-xl text-muted-foreground"
          >
            Track, trade, and manage crypto across 50+ exchanges.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-10 flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="px-8 gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Button variant="outline" size="lg" className="gap-2">
              <Play className="h-4 w-4" /> Watch Demo
            </Button>
          </motion.div>
        </motion.div>

        <DashboardPreview />
      </motion.div>
    </section>
  )
}
