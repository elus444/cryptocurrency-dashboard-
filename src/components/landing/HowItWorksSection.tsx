import { motion } from 'framer-motion';
import { Wallet, Link2, LineChart, Shield } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Wallet,
    title: 'Connect Your Wallets',
    description: 'Link your wallets and exchange accounts securely. We support 50+ exchanges and all major blockchain networks.',
  },
  {
    step: '02',
    icon: Link2,
    title: 'Sync Your Portfolio',
    description: 'Our system automatically detects and imports all your assets, transactions, and NFTs in real-time.',
  },
  {
    step: '03',
    icon: LineChart,
    title: 'Track & Analyze',
    description: 'Get deep insights into your portfolio performance with advanced charts, analytics, and AI-powered recommendations.',
  },
  {
    step: '04',
    icon: Shield,
    title: 'Stay Secure',
    description: 'Your data is encrypted end-to-end. We use read-only API access and never have access to your funds.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            How It Works
          </span>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Get Started in Minutes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Four simple steps to take control of your crypto portfolio
          </p>
        </motion.div>

        <div className="relative mt-16">
          {/* Connecting Line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-border via-primary/50 to-border lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => {
              const isRight = index === 2 || index === 3;
              const prevIsRight = index > 0 ? (index - 1 === 2 || index - 1 === 3) : false;
              const canOverlap = index > 0 && isRight !== prevIsRight;

              return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: isRight ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-12 ${canOverlap ? 'lg:mt-[-60px]' : index > 0 ? 'lg:mt-8' : ''}`}
              >
                <div className={`${isRight ? 'lg:col-start-2 lg:text-left' : 'lg:col-start-1 lg:text-right'}`}>
                  <div className={`inline-block w-full max-w-lg ${isRight ? 'lg:ml-12' : 'lg:mr-12'}`}>
                    <div className="group relative w-full overflow-hidden rounded-2xl border border-border/30 bg-card/40 p-8 backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:bg-card/60">
                      {/* Step Number */}
                      <div className="absolute right-4 top-4 font-display text-6xl font-bold text-primary/10">
                        {step.step}
                      </div>
                      
                      <div className={`flex items-start gap-4 relative z-10 ${!isRight ? 'lg:flex-row-reverse lg:text-right' : ''}`}>
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                          <step.icon className="h-7 w-7" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-xl font-semibold">{step.title}</h3>
                          <p className="mt-2 text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Dot */}
                <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: index * 0.1 + 0.1 }}
                    className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-background bg-primary shadow-lg shadow-primary/30"
                  >
                    <span className="font-display text-sm font-bold text-primary-foreground">{step.step}</span>
                  </motion.div>
                </div>
              </motion.div>
            )})}
          </div>
        </div>
      </div>
    </section>
  );
}
