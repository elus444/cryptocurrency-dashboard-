import { Link } from 'react-router-dom';
import { ArrowRight, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  'No credit card required',
  '14-day free trial',
  'Cancel anytime',
  '24/7 support',
];

export function CTASection() {
  return (
    <section className="relative py-24 lg:py-32">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            Limited Time Offer
          </span>

          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Master your crypto wealth
            <span className="block text-primary mt-1">starting today.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-muted-foreground text-base sm:text-lg">
            Join 50,000+ traders who trust CryptoFolio for their daily analytics.
          </p>

          {/* Benefits */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <Button
                size="lg"
                className="gap-2 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
              >
                Start Free 14-Day Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="px-8 bg-card/50 border-border/50 hover:bg-card/80">
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Trust Indicator */}
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <div className="flex -space-x-2">
              {['A', 'B', 'C', 'D', 'E'].map((letter) => (
                <div
                  key={letter}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary/20 text-sm font-medium text-primary"
                >
                  {letter}
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center sm:items-start gap-0.5">
              <div className="flex items-center gap-0.5 text-warning">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">4.9/5</span> from 2,000+ reviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}