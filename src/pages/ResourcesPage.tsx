import { motion } from 'framer-motion';
import { BookOpen, Video, FileText, MessageCircle, ExternalLink, ArrowRight, Newspaper, GraduationCap, Code } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { APP_NAME } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const resourceCategories = [
  {
    icon: BookOpen,
    title: 'Documentation',
    description: `Comprehensive guides to help you get the most out of ${APP_NAME}.`,
    link: '#',
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Step-by-step video guides for visual learners.',
    link: '#',
    color: 'bg-red-500/10 text-red-500',
  },
  {
    icon: Code,
    title: 'API Reference',
    description: 'Complete API documentation for developers.',
    link: '#',
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    icon: MessageCircle,
    title: 'Community',
    description: 'Join our Discord and connect with other traders.',
    link: '#',
    color: 'bg-green-500/10 text-green-500',
  },
];

const guides = [
  {
    title: `Getting Started with ${APP_NAME}`,
    description: 'Learn the basics of setting up your portfolio and connecting your first wallet.',
    category: 'Beginner',
    readTime: '5 min read',
    featured: true,
  },
  {
    title: 'Understanding Portfolio Analytics',
    description: 'Deep dive into the metrics and analytics that matter for your trading.',
    category: 'Intermediate',
    readTime: '8 min read',
    featured: true,
  },
  {
    title: 'Advanced Trading Strategies',
    description: `Learn how to use ${APP_NAME}'s tools for sophisticated trading strategies.`,
    category: 'Advanced',
    readTime: '12 min read',
    featured: false,
  },
  {
    title: 'Tax Reporting Guide',
    description: 'Everything you need to know about crypto taxes and how to generate reports.',
    category: 'Intermediate',
    readTime: '10 min read',
    featured: false,
  },
  {
    title: 'API Integration Tutorial',
    description: 'Connect your trading bots and custom applications using our API.',
    category: 'Developer',
    readTime: '15 min read',
    featured: false,
  },
  {
    title: 'Security Best Practices',
    description: 'Keep your portfolio and API keys secure with these essential tips.',
    category: 'Essential',
    readTime: '6 min read',
    featured: true,
  },
];

const blogPosts = [
  {
    title: 'The Future of DeFi Portfolio Tracking',
    excerpt: 'Exploring emerging trends in decentralized finance and how they impact portfolio management.',
    date: 'Mar 28, 2026',
    author: 'Research Team',
    image: '📊',
  },
  {
    title: 'Market Analysis: Q1 2026 Recap',
    excerpt: 'A comprehensive look at the crypto market performance in the first quarter of 2026.',
    date: 'Mar 22, 2026',
    author: 'Market Analyst',
    image: '📈',
  },
  {
    title: 'NFT Portfolio Management Tips',
    excerpt: 'How to track and value your NFT collection alongside traditional crypto assets.',
    date: 'Mar 15, 2026',
    author: 'Product Team',
    image: '🖼️',
  },
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

export default function ResourcesPage() {
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
                <GraduationCap className="h-4 w-4" />
                Learn & Grow
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Resources & <span className="text-primary">Learning</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Everything you need to master crypto portfolio management. From beginner guides to advanced strategies.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Resource Categories */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {resourceCategories.map((category) => (
                <motion.a
                  key={category.title}
                  href={category.link}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Card variant="glass" className="h-full p-6 transition-all hover:border-primary/50">
                    <CardContent className="p-0">
                      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${category.color}`}>
                        <category.icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-display text-lg font-semibold">{category.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                      <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Explore <ExternalLink className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Guides */}
        <section className="border-y border-border/30 bg-card/30 py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-3xl font-bold tracking-tight">
                    Popular Guides
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Master {APP_NAME} with our step-by-step tutorials
                  </p>
                </div>
                <Button variant="heroOutline" className="hidden gap-2 sm:flex">
                  View All Guides <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {guides.map((guide) => (
                <motion.div key={guide.title} variants={itemVariants}>
                  <Card variant="glass" className="group h-full p-6 transition-all hover:border-primary/50 cursor-pointer">
                    <CardContent className="p-0">
                      <div className="mb-4 flex items-center gap-2">
                        <Badge variant={guide.featured ? 'default' : 'secondary'} className="text-xs">
                          {guide.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{guide.readTime}</span>
                      </div>
                      <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-primary">
                        {guide.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {guide.description}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                        Read Guide <ArrowRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-8 text-center sm:hidden">
              <Button variant="heroOutline" className="gap-2">
                View All Guides <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex items-center gap-3">
                <Newspaper className="h-6 w-6 text-primary" />
                <h2 className="font-display text-3xl font-bold tracking-tight">
                  Latest from the Blog
                </h2>
              </div>
              <p className="mt-2 text-muted-foreground">
                Insights, analysis, and updates from the {APP_NAME} team
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-8 lg:grid-cols-3"
            >
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.title}
                  variants={itemVariants}
                  className="group cursor-pointer"
                >
                  <div className="mb-4 flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-6xl">
                    {post.image}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.author}</span>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="border-t border-border/30 bg-card/30 py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-center"
            >
              <FileText className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Stay Updated
              </h2>
              <p className="mt-4 text-muted-foreground">
                Get the latest guides, market insights, and product updates delivered to your inbox.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 rounded-lg border border-border bg-background px-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-80"
                />
                <Button variant="hero" size="lg">
                  Subscribe
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                No spam, unsubscribe anytime.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
