import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const integrations = [
  { name: 'Ethereum', logo: '⟠' },
  { name: 'Bitcoin', logo: '₿' },
  { name: 'Solana', logo: '◎' },
  { name: 'Polygon', logo: '⬡' },
  { name: 'Avalanche', logo: '▲' },
  { name: 'Arbitrum', logo: '◆' },
  { name: 'Optimism', logo: '⬤' },
  { name: 'BNB Chain', logo: '◈' },
];

export function IntegrationsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-16 lg:py-24 border-t border-border/20" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Integrations
          </span>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Multi-chain support
          </h2>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className="flex items-center gap-2 rounded-xl bg-card/50 border border-border/30 px-4 py-2.5 transition-colors duration-200 hover:bg-card/80 hover:border-border/50"
            >
              <span className="text-xl">{integration.logo}</span>
              <span className="font-medium text-sm">{integration.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}