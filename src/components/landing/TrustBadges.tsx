import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const exchanges = [
  { name: 'Binance', icon: '🟡' },
  { name: 'Coinbase', icon: '🔵' },
  { name: 'Kraken', icon: '🔷' },
  { name: 'MetaMask', icon: '🦊' },
  { name: 'Ledger', icon: '🔐' },
  { name: 'Phantom', icon: '👻' },
];

export function TrustBadges() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="relative border-y border-border/20 bg-card/20 py-20 overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(160_84%_39%/0.05)_0%,_transparent_50%)]" />
      
      {/* Animated gradient line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Trusted by Pro Traders & Institutions Worldwide
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-8"
        >
          {exchanges.map((exchange, index) => (
            <motion.div
              key={exchange.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: 0.3 + index * 0.08,
                ease: [0.23, 1, 0.32, 1]
              }}
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-3 rounded-2xl border border-border/20 bg-card/40 px-7 py-5 backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:bg-card/60 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
            >
              <motion.span 
                className="text-3xl transition-transform duration-300 group-hover:scale-110"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
              >
                {exchange.icon}
              </motion.span>
              <span className="font-display font-semibold text-foreground/90 text-lg">
                {exchange.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-10 text-center md:gap-20"
        >
          {[
            { value: '$2.5B+', label: 'Assets Tracked' },
            { value: '50K+', label: 'Active Users' },
            { value: '99.9%', label: 'Uptime' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="relative group"
            >
              <motion.p 
                className="font-display text-3xl font-bold gradient-text"
                whileHover={{ scale: 1.05 }}
              >
                {stat.value}
              </motion.p>
              <p className="mt-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              
              {/* Divider */}
              {i < 2 && (
                <div className="absolute -right-10 md:-right-12 top-1/2 -translate-y-1/2 h-10 w-px bg-border/30 hidden md:block" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
