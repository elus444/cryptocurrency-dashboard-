import { motion, useInView } from 'framer-motion';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

const features = [
  {
    title: 'Cross-Chain Aggregation',
    description: 'Automatically detect tokens across ETH, SOL, BTC, and 35+ other chains.',
  },
  {
    title: 'Tax Optimization',
    description: 'Real-time tax harvesting suggestions to minimize liabilities legally.',
  },
  {
    title: 'Whale Watching',
    description: 'Follow smart money movements and get alerted on major wallet transfers.',
  },
  {
    title: 'DeFi Tracking',
    description: 'Monitor your staked assets, LP positions, and yield farming rewards.',
  },
];

export function WealthSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-card/30 via-background to-card/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_hsl(160_84%_39%/0.08)_0%,_transparent_50%)]" />

      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              className="inline-flex mb-8"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary backdrop-blur-xl">
                <Sparkles className="h-4 w-4" />
                Total Wealth Management
              </span>
            </motion.div>

            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Complete Clarity
              <motion.span 
                className="block gradient-text-premium mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
              >
                Over Your Wealth
              </motion.span>
            </h2>
            
            <motion.p 
              className="mt-8 text-lg text-muted-foreground leading-relaxed"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              Stop switching between apps. Get a holistic view of your DeFi,
              CeFi, and NFT holdings in a single, powerful interface.
            </motion.p>

            <div className="mt-10 space-y-5">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.4 + index * 0.1,
                    ease: [0.23, 1, 0.32, 1]
                  }}
                  className="group flex gap-4"
                >
                  <motion.div 
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-lg">{feature.title}</h4>
                    <p className="mt-1 text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="mt-10"
            >
              <Link to="/register">
                <motion.div
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex"
                >
                  <Button variant="hero" size="lg" className="gap-3">
                    Get Started Free
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Chart Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-8 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-chart-2/20 opacity-40 blur-3xl animate-pulse" />
            
            <motion.div 
              className="relative overflow-hidden rounded-3xl border border-border/30 bg-card/60 p-8 backdrop-blur-2xl"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.4 }}
            >
              {/* Chart Tabs */}
              <div className="mb-8 flex gap-2 border-b border-border/30 pb-6">
                {['Overview', 'Tokens', 'Top Movers', 'Alerts'].map((tab, i) => (
                  <motion.button
                    key={tab}
                    initial={{ opacity: 0, y: -10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                      i === 0 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </motion.button>
                ))}
              </div>

              {/* Portfolio Stats */}
              <div className="mb-8 grid grid-cols-2 gap-4">
                {[
                  { label: 'Total Value', value: '$1,248,892' },
                  { label: '30d Change', value: '+24.3%', positive: true },
                ].map((stat, i) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="rounded-2xl bg-card/50 p-6 border border-border/20"
                    whileHover={{ scale: 1.02, borderColor: 'hsl(var(--primary) / 0.3)' }}
                  >
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <p className={`mt-2 font-display text-3xl font-bold ${stat.positive ? 'text-success' : ''}`}>
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Chart */}
              <div className="relative h-56">
                <svg viewBox="0 0 400 150" className="h-full w-full">
                  {/* Grid Lines */}
                  {[0, 1, 2, 3].map((i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={i * 50}
                      x2="400"
                      y2={i * 50}
                      stroke="hsl(var(--border))"
                      strokeWidth="1"
                      opacity="0.15"
                    />
                  ))}

                  {/* Gradient Fill */}
                  <defs>
                    <linearGradient id="wealthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--chart-2))" />
                    </linearGradient>
                  </defs>

                  {/* Area Fill */}
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    d="M 0 120 Q 40 110 80 100 T 160 70 T 240 50 T 320 35 T 400 20 L 400 150 L 0 150 Z"
                    fill="url(#wealthGradient)"
                  />

                  {/* Chart Line */}
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 2, ease: 'easeInOut', delay: 0.8 }}
                    d="M 0 120 Q 40 110 80 100 T 160 70 T 240 50 T 320 35 T 400 20"
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Current Value Dot */}
                  <motion.circle
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 2.5, type: "spring" }}
                    cx="400"
                    cy="20"
                    r="8"
                    fill="hsl(var(--primary))"
                    className="animate-pulse"
                  />
                  <motion.circle
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 2.5, type: "spring" }}
                    cx="400"
                    cy="20"
                    r="16"
                    fill="hsl(var(--primary))"
                    opacity="0.3"
                  />
                </svg>
              </div>

              {/* Asset Distribution */}
              <div className="mt-6 flex items-center justify-between text-sm">
                {[
                  { color: 'bg-chart-1', label: 'BTC 43%' },
                  { color: 'bg-chart-2', label: 'ETH 25%' },
                  { color: 'bg-chart-3', label: 'Others 32%' },
                ].map((item, i) => (
                  <motion.div 
                    key={item.label}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 2.5 + i * 0.1 }}
                  >
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="text-muted-foreground font-medium">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
