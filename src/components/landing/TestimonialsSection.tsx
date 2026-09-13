import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useRef } from 'react';
import { APP_NAME } from '@/lib/constants';

const testimonials = [
  {
    quote:
      "Finally, a dashboard that handles my complexity well. The API integrations are stable, and the real-time updates are the best I've seen. Game changer for my trading workflow.",
    author: 'Alex M.',
    role: 'Full-time Trader',
    rating: 5,
    avatar: 'A',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
  },
  {
    quote:
      "No more manual tracking - I retired my spreadsheets. Clean UI, lightning fast, real-time portfolio sync and a great mobile experience! Highly recommend.",
    author: 'Sarah K.',
    role: 'Crypto Fund Manager',
    rating: 5,
    avatar: 'S',
    gradient: 'from-blue-500/20 to-blue-500/5',
  },
  {
    quote:
      `I've tried CoinTracker, Koinly, all of them. ${APP_NAME} is hands down the best professional trading interface I've used. The analytics are incredibly detailed.`,
    author: 'David R.',
    role: 'DeFi Investor',
    rating: 5,
    avatar: 'D',
    gradient: 'from-purple-500/20 to-purple-500/5',
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(160_84%_39%/0.05)_0%,_transparent_50%)]" />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Testimonials
            </span>
          </motion.div>
          <h2 className="mt-8 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Loved by Traders
            <span className="block gradient-text mt-2">Worldwide</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            See what our users have to say about their experience with {APP_NAME}
          </p>
        </motion.div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                ease: [0.23, 1, 0.32, 1]
              }}
            >
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="glass" className="group relative h-full overflow-hidden p-8 hover:border-primary/40 transition-all duration-500">
                  {/* Gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                  
                  {/* Quote Icon */}
                  <motion.div
                    initial={{ opacity: 0.1 }}
                    whileHover={{ opacity: 0.2, scale: 1.1, rotate: 10 }}
                    className="absolute right-6 top-6"
                  >
                    <Quote className="h-16 w-16 text-primary/20" />
                  </motion.div>

                  <CardContent className="relative p-0">
                    {/* Stars */}
                    <div className="mb-6 flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0, rotate: -180 }}
                          animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                          transition={{ delay: 0.3 + index * 0.1 + i * 0.05 }}
                        >
                          <Star className="h-5 w-5 fill-warning text-warning" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="mb-8 text-foreground/90 leading-relaxed text-lg">
                      "{testimonial.quote}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-primary/10 text-lg font-bold text-primary border border-primary/20"
                        whileHover={{ scale: 1.1 }}
                      >
                        {testimonial.avatar}
                      </motion.div>
                      <div>
                        <p className="font-semibold text-lg">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-12 text-center md:gap-20"
        >
          {[
            { value: '4.9/5', label: 'Average Rating' },
            { value: '2,000+', label: 'Reviews' },
            { value: '50,000+', label: 'Happy Users' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="relative"
            >
              <p className="font-display text-4xl font-bold gradient-text">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
