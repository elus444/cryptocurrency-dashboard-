import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Building2, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    icon: Zap,
    description: 'Perfect for getting started with crypto tracking',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Track up to 5 wallets',
      'Basic portfolio analytics',
      'Price alerts (5 max)',
      'Community support',
      'Mobile app access',
    ],
    limitations: [
      'Limited historical data',
      'Basic charts only',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    icon: Sparkles,
    description: 'For serious traders who need advanced tools',
    monthlyPrice: 19,
    yearlyPrice: 190,
    features: [
      'Unlimited wallets & exchanges',
      'Advanced portfolio analytics',
      'Unlimited price alerts',
      'Priority support',
      'Full historical data',
      'Advanced charting (100+ indicators)',
      'Tax reporting tools',
      'API access',
      'Custom watchlists',
    ],
    limitations: [],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    icon: Building2,
    description: 'For institutions and professional trading desks',
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantees',
      'Advanced security features',
      'Team management',
      'White-label options',
      'Custom reporting',
      'On-premise deployment',
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
  {
    question: 'Can I switch plans at any time?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate the difference.',
  },
  {
    question: 'Is there a free trial for Pro?',
    answer: 'Yes! We offer a 14-day free trial of Pro with no credit card required. Experience all Pro features before committing.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and cryptocurrency payments including BTC, ETH, and USDC.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.',
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-20" />
          
          <div className="container relative mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl text-center"
            >
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Simple, Transparent{' '}
                <span className="text-primary">Pricing</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Choose the plan that fits your trading style. No hidden fees, cancel anytime.
              </p>

              {/* Billing Toggle */}
              <div className="mt-10 flex items-center justify-center gap-4">
                <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Monthly
                </span>
                <Switch
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                  className="data-[state=checked]:bg-primary"
                />
                <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Yearly
                </span>
                {isYearly && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary"
                  >
                    Save 17%
                  </motion.span>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <Card
                    variant={plan.popular ? 'gradient' : 'glass'}
                    className={`h-full p-6 transition-all hover:border-primary/50 ${
                      plan.popular ? 'border-primary/50 shadow-lg shadow-primary/10' : ''
                    }`}
                  >
                    <CardHeader className="p-0 pb-6">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          plan.popular ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                        }`}>
                          <plan.icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="font-display text-xl">{plan.name}</CardTitle>
                      </div>
                      <CardDescription className="mt-3">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold">
                            ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                          </span>
                          {plan.monthlyPrice > 0 && (
                            <span className="text-muted-foreground">
                              /{isYearly ? 'year' : 'month'}
                            </span>
                          )}
                        </div>
                        {isYearly && plan.monthlyPrice > 0 && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            ${Math.round(plan.yearlyPrice / 12)}/month billed annually
                          </p>
                        )}
                      </div>

                      <Link to={plan.name === 'Enterprise' ? '#' : '/register'}>
                        <Button
                          variant={plan.popular ? 'hero' : 'heroOutline'}
                          className="w-full gap-2"
                          size="lg"
                        >
                          {plan.cta}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>

                      <div className="mt-6 space-y-3">
                        {plan.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-3">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                        {plan.limitations.map((limitation) => (
                          <div key={limitation} className="flex items-start gap-3 opacity-50">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span className="text-sm">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="border-t border-border/30 bg-card/30 py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-muted-foreground">
                Have questions? We've got answers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-12 max-w-3xl space-y-4"
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="glass" className="p-6">
                    <h3 className="font-semibold">{faq.question}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-center"
            >
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Still Have Questions?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Our team is here to help you find the perfect plan for your needs.
              </p>
              <div className="mt-8">
                <Button variant="heroOutline" size="lg">
                  Contact Support
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
