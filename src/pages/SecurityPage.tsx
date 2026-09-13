import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server, Key, CheckCircle2, ShieldCheck, Fingerprint } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { APP_NAME } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const securityFeatures = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'All data is encrypted using AES-256 military-grade encryption both in transit and at rest.',
  },
  {
    icon: Eye,
    title: 'Read-Only Access',
    description: 'We never request withdrawal permissions. Your funds remain in your full control at all times.',
  },
  {
    icon: Key,
    title: 'Client-Side Encryption',
    description: 'API keys are encrypted on your device before being transmitted. We never see your raw keys.',
  },
  {
    icon: Server,
    title: 'SOC 2 Compliant',
    description: 'Our infrastructure meets SOC 2 Type II standards for security, availability, and confidentiality.',
  },
  {
    icon: Fingerprint,
    title: 'Two-Factor Authentication',
    description: 'Protect your account with hardware keys, authenticator apps, or SMS verification.',
  },
  {
    icon: ShieldCheck,
    title: 'Regular Security Audits',
    description: 'Independent third-party audits ensure our security measures meet the highest standards.',
  },
];

const certifications = [
  { name: 'SOC 2 Type II', status: 'Certified' },
  { name: 'GDPR Compliant', status: 'Compliant' },
  { name: 'ISO 27001', status: 'Certified' },
  { name: 'PCI DSS', status: 'Level 1' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SecurityPage() {
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
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
                <Shield className="h-4 w-4" />
                Enterprise-Grade Security
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Your Security is Our{' '}
                <span className="text-primary">Top Priority</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                We employ multiple layers of security to ensure your data and assets remain protected.
                From encryption to compliance, we've got you covered.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Security Features Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {securityFeatures.map((feature, index) => (
                <motion.div key={feature.title} variants={itemVariants}>
                  <Card variant="glass" className="group h-full p-6 transition-all hover:border-primary/50">
                    <CardContent className="p-0">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How We Protect You */}
        <section className="border-y border-border/30 bg-card/30 py-24">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  How We Protect Your Data
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Every interaction with {APP_NAME} is designed with security in mind.
                  Here's what happens behind the scenes.
                </p>
                
                <div className="mt-8 space-y-4">
                  {[
                    'All API keys encrypted before leaving your browser',
                    'Zero-knowledge architecture for sensitive data',
                    'Automatic session timeouts and re-authentication',
                    'Real-time threat monitoring and intrusion detection',
                    'Regular penetration testing by security experts',
                  ].map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-foreground">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm">
                  <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
                  <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
                  
                  <div className="relative space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Encryption Status</p>
                        <p className="text-sm text-primary">AES-256 Active</p>
                      </div>
                    </div>
                    
                    <div className="h-px bg-border/50" />
                    
                    <div className="space-y-3">
                      {certifications.map((cert) => (
                        <div key={cert.name} className="flex items-center justify-between rounded-lg bg-background/50 px-4 py-3">
                          <span className="text-sm font-medium">{cert.name}</span>
                          <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                            {cert.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
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
                Ready to Get Started Securely?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Join thousands of traders who trust {APP_NAME} with their portfolio management.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/register">
                  <Button variant="hero" size="lg">
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="heroOutline" size="lg">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
