import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown,
  Flame,
  Rocket,
  Zap,
  ArrowUpRight,
  Clock,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCryptoIcon } from '@/utils/getCryptoIcon';

const trendingTokens = [
  { rank: 1, name: 'Pepe',      symbol: 'PEPE', price: 0.00001234, change: 156.7, volume: '1.2B', mentions: 45230 },
  { rank: 2, name: 'Bonk',      symbol: 'BONK', price: 0.0000234,  change: 89.3,  volume: '890M', mentions: 32100 },
  { rank: 3, name: 'Worldcoin', symbol: 'WLD',  price: 4.56,        change: 45.2,  volume: '567M', mentions: 28900 },
  { rank: 4, name: 'Render',    symbol: 'RNDR', price: 8.92,        change: 34.5,  volume: '234M', mentions: 19800 },
  { rank: 5, name: 'Injective', symbol: 'INJ',  price: 34.56,       change: 28.9,  volume: '189M', mentions: 15600 },
];

const topGainers = [
  { name: 'Pepe', symbol: 'PEPE', price: 0.00001234, change: 156.7, volume: '1.2B' },
  { name: 'Floki', symbol: 'FLOKI', price: 0.000234, change: 98.4, volume: '456M' },
  { name: 'Bonk', symbol: 'BONK', price: 0.0000234, change: 89.3, volume: '890M' },
  { name: 'Meme Coin', symbol: 'MEME', price: 0.0345, change: 67.8, volume: '234M' },
  { name: 'Shiba Inu', symbol: 'SHIB', price: 0.0000234, change: 45.6, volume: '678M' },
];

const topLosers = [
  { name: 'Terra Luna', symbol: 'LUNA', price: 0.89, change: -23.4, volume: '123M' },
  { name: 'FTT', symbol: 'FTT', price: 1.23, change: -18.9, volume: '45M' },
  { name: 'Celsius', symbol: 'CEL', price: 0.34, change: -15.6, volume: '23M' },
  { name: 'Voyager', symbol: 'VGX', price: 0.12, change: -12.3, volume: '12M' },
  { name: 'BlockFi', symbol: 'BFI', price: 0.05, change: -10.2, volume: '8M' },
];

const recentlyAdded = [
  { name: 'Jupiter', symbol: 'JUP', price: 1.23, change: 234.5, addedAt: '2h ago', chain: 'Solana' },
  { name: 'Pyth', symbol: 'PYTH', price: 0.45, change: 156.7, addedAt: '4h ago', chain: 'Solana' },
  { name: 'Jito', symbol: 'JTO', price: 3.45, change: 89.2, addedAt: '6h ago', chain: 'Solana' },
  { name: 'Tensor', symbol: 'TNSR', price: 1.89, change: 67.8, addedAt: '8h ago', chain: 'Solana' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export default function MarketsTrendingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            Trending Now
          </h1>
          <p className="text-muted-foreground">Hot tokens and market movers in real-time</p>
        </div>
        <Badge variant="outline" className="gap-1 w-fit">
          <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
          Updated just now
        </Badge>
      </motion.div>

      {/* Trending Tokens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="glass" className="p-6">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Most Discussed</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {trendingTokens.map((token, index) => (
                <motion.div
                  key={token.symbol}
                  variants={itemVariants}
                  className="flex items-center justify-between rounded-lg bg-secondary/30 p-4 transition-all hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                      {token.rank}
                    </div>
                    <img
                      src={getCryptoIcon(token.symbol)}
                      alt={token.symbol}
                      width={24}
                      height={24}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <div>
                      <p className="font-medium">{token.name}</p>
                      <p className="text-sm text-muted-foreground">{token.symbol}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-medium">${token.price < 0.01 ? token.price.toFixed(8) : token.price.toFixed(2)}</p>
                      <p className="text-sm text-success flex items-center justify-end gap-1">
                        <ArrowUpRight className="h-3 w-3" />
                        +{token.change}%
                      </p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-muted-foreground">Volume</p>
                      <p className="font-medium">${token.volume}</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" /> Mentions
                      </p>
                      <p className="font-medium">{token.mentions.toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gainers/Losers Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="gainers" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="gainers" className="gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              Top Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              Top Losers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gainers" className="mt-4">
            <Card variant="glass">
              <CardContent className="p-0">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-border/30"
                >
                  {topGainers.map((token, index) => (
                    <motion.div
                      key={token.symbol}
                      variants={itemVariants}
                      className="flex items-center justify-between p-4 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-6 text-center text-muted-foreground">{index + 1}</span>
                        <img
                          src={getCryptoIcon(token.symbol)}
                          alt={token.symbol}
                          width={32}
                          height={32}
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                        <div>
                          <p className="font-medium">{token.name}</p>
                          <p className="text-sm text-muted-foreground">{token.symbol}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-medium">${token.price < 0.01 ? token.price.toFixed(8) : token.price.toFixed(2)}</p>
                          <p className="text-sm text-success">+{token.change}%</p>
                        </div>
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-muted-foreground">Volume</p>
                          <p className="font-medium">${token.volume}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="losers" className="mt-4">
            <Card variant="glass">
              <CardContent className="p-0">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-border/30"
                >
                  {topLosers.map((token, index) => (
                    <motion.div
                      key={token.symbol}
                      variants={itemVariants}
                      className="flex items-center justify-between p-4 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-6 text-center text-muted-foreground">{index + 1}</span>
                        <img
                          src={getCryptoIcon(token.symbol)}
                          alt={token.symbol}
                          width={32}
                          height={32}
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                        <div>
                          <p className="font-medium">{token.name}</p>
                          <p className="text-sm text-muted-foreground">{token.symbol}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-medium">${token.price.toFixed(2)}</p>
                          <p className="text-sm text-destructive">{token.change}%</p>
                        </div>
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-muted-foreground">Volume</p>
                          <p className="font-medium">${token.volume}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Recently Added */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card variant="glass" className="p-6">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-lg">Recently Added</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid gap-3 sm:grid-cols-2">
              {recentlyAdded.map((token) => (
                <motion.div
                  key={token.symbol}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between rounded-lg bg-secondary/30 p-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getCryptoIcon(token.symbol)}
                      alt={token.symbol}
                      width={32}
                      height={32}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <div>
                      <p className="font-medium">{token.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {token.addedAt}
                        <Badge variant="outline" className="text-xs">{token.chain}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${token.price.toFixed(2)}</p>
                    <p className="text-sm text-success">+{token.change}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
