import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Grid3X3, 
  List,
  TrendingUp,
  TrendingDown,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { NFTPlaceholder } from '@/components/nft/NFTPlaceholder';

const nftCollections = [
  {
    id: 1,
    name: 'Bored Ape Yacht Club',
    floorPrice: 28.5,
    floorChange: 5.2,
    volume24h: 1234.5,
    volumeChange: 12.3,
    owners: 6432,
    items: 10000,
    chain: 'Ethereum'
  },
  {
    id: 2,
    name: 'CryptoPunks',
    floorPrice: 52.3,
    floorChange: -2.1,
    volume24h: 892.1,
    volumeChange: -5.4,
    owners: 3421,
    items: 10000,
    chain: 'Ethereum'
  },
  {
    id: 3,
    name: 'Azuki',
    floorPrice: 12.8,
    floorChange: 8.9,
    volume24h: 567.2,
    volumeChange: 23.5,
    owners: 5123,
    items: 10000,
    chain: 'Ethereum'
  },
  {
    id: 4,
    name: 'Pudgy Penguins',
    floorPrice: 9.2,
    floorChange: 15.3,
    volume24h: 456.7,
    volumeChange: 45.2,
    owners: 4521,
    items: 8888,
    chain: 'Ethereum'
  },
  {
    id: 5,
    name: 'DeGods',
    floorPrice: 8.5,
    floorChange: -3.2,
    volume24h: 234.5,
    volumeChange: -12.1,
    owners: 5892,
    items: 10000,
    chain: 'Solana'
  },
  {
    id: 6,
    name: 'Moonbirds',
    floorPrice: 3.8,
    floorChange: 2.1,
    volume24h: 123.4,
    volumeChange: 8.7,
    owners: 6234,
    items: 10000,
    chain: 'Ethereum'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function MarketsNFTsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [chainFilter, setChainFilter] = useState<'All' | 'Ethereum' | 'Solana'>('All');

  const filteredCollections = nftCollections.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChain = chainFilter === 'All' || c.chain === chainFilter;
    return matchesSearch && matchesChain;
  });

  const totalVolume = nftCollections.reduce((sum, c) => sum + c.volume24h, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="font-display text-2xl font-bold">NFT Markets</h1>
          <p className="text-muted-foreground">Explore top NFT collections across chains</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-border/50 p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-3"
      >
        <Card variant="glass" className="p-5">
          <p className="text-sm text-muted-foreground">24h Volume</p>
          <p className="mt-1 font-display text-2xl font-bold">{totalVolume.toFixed(1)} ETH</p>
        </Card>
        <Card variant="glass" className="p-5">
          <p className="text-sm text-muted-foreground">Collections Tracked</p>
          <p className="mt-1 font-display text-2xl font-bold">{nftCollections.length}</p>
        </Card>
        <Card variant="glass" className="p-5">
          <p className="text-sm text-muted-foreground">Avg Floor Price</p>
          <p className="mt-1 font-display text-2xl font-bold">
            {(nftCollections.reduce((sum, c) => sum + c.floorPrice, 0) / nftCollections.length).toFixed(2)} ETH
          </p>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search collections..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1">
          {(['All', 'Ethereum', 'Solana'] as const).map((chain) => (
            <Button
              key={chain}
              variant={chainFilter === chain ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChainFilter(chain)}
            >
              {chain}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Collections Grid/List */}
      {viewMode === 'grid' ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredCollections.map((collection) => (
            <motion.div key={collection.id} variants={itemVariants}>
              <Card 
                variant="glass" 
                className="group overflow-hidden transition-all duration-300 hover:border-primary/50"
              >
                <div className="relative h-40 overflow-hidden">
                  <NFTPlaceholder name={collection.name} className="rounded-t-lg" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <h3 className="font-display text-lg font-bold">{collection.name}</h3>
                    <Badge variant="outline" className="mt-1">{collection.chain}</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Floor Price</p>
                      <div className="flex items-center gap-1">
                        <p className="font-medium">{collection.floorPrice} ETH</p>
                        <span className={`text-xs ${collection.floorChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {collection.floorChange >= 0 ? '+' : ''}{collection.floorChange}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">24h Volume</p>
                      <div className="flex items-center gap-1">
                        <p className="font-medium">{collection.volume24h} ETH</p>
                        {collection.volumeChange >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-success" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-destructive" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Owners</p>
                      <p className="font-medium">{collection.owners.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Items</p>
                      <p className="font-medium">{collection.items.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card variant="glass">
          <CardContent className="p-0">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-border/30"
            >
              {filteredCollections.map((collection) => (
                <motion.div
                  key={collection.id}
                  variants={itemVariants}
                  className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg overflow-hidden">
                      <NFTPlaceholder name={collection.name} />
                    </div>
                    <div>
                      <p className="font-medium">{collection.name}</p>
                      <Badge variant="outline" className="mt-0.5 text-xs">{collection.chain}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Floor</p>
                      <p className="font-medium">{collection.floorPrice} ETH</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">24h Volume</p>
                      <p className="font-medium">{collection.volume24h} ETH</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Owners</p>
                      <p className="font-medium">{collection.owners.toLocaleString()}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
