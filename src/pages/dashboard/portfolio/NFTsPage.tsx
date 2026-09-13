import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Grid3X3, 
  List, 
  Search, 
  Heart,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { NFTPlaceholder } from '@/components/nft/NFTPlaceholder';

const nfts = [
  {
    id: 1,
    name: 'Bored Ape #7234',
    collection: 'Bored Ape Yacht Club',
    floorPrice: 28.5,
    lastSale: 32.1,
    rarity: 'Rare',
    chain: 'Ethereum'
  },
  {
    id: 2,
    name: 'CryptoPunk #4892',
    collection: 'CryptoPunks',
    floorPrice: 45.2,
    lastSale: 52.0,
    rarity: 'Legendary',
    chain: 'Ethereum'
  },
  {
    id: 3,
    name: 'Azuki #1234',
    collection: 'Azuki',
    floorPrice: 12.8,
    lastSale: 15.5,
    rarity: 'Uncommon',
    chain: 'Ethereum'
  },
  {
    id: 4,
    name: 'Doodle #5678',
    collection: 'Doodles',
    floorPrice: 5.2,
    lastSale: 6.8,
    rarity: 'Common',
    chain: 'Ethereum'
  },
  {
    id: 5,
    name: 'DeGod #9012',
    collection: 'DeGods',
    floorPrice: 8.5,
    lastSale: 10.2,
    rarity: 'Rare',
    chain: 'Solana'
  },
  {
    id: 6,
    name: 'Moonbird #3456',
    collection: 'Moonbirds',
    floorPrice: 3.8,
    lastSale: 4.5,
    rarity: 'Uncommon',
    chain: 'Ethereum'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

export default function PortfolioNFTsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<'All' | 'Legendary' | 'Rare' | 'Uncommon' | 'Common'>('All');
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.collection.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = rarityFilter === 'All' || nft.rarity === rarityFilter;
    return matchesSearch && matchesRarity;
  });

  const totalValue = nfts.reduce((sum, nft) => sum + nft.floorPrice, 0);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Rare': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Uncommon': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-secondary text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="font-display text-2xl font-bold">NFT Collection</h1>
          <p className="text-muted-foreground">Your digital collectibles across all chains</p>
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
          <p className="text-sm text-muted-foreground">Total NFTs</p>
          <p className="mt-1 font-display text-2xl font-bold">{nfts.length}</p>
        </Card>
        <Card variant="glass" className="p-5">
          <p className="text-sm text-muted-foreground">Floor Value</p>
          <p className="mt-1 font-display text-2xl font-bold">{totalValue.toFixed(1)} ETH</p>
        </Card>
        <Card variant="glass" className="p-5">
          <p className="text-sm text-muted-foreground">Collections</p>
          <p className="mt-1 font-display text-2xl font-bold">{new Set(nfts.map(n => n.collection)).size}</p>
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
            placeholder="Search NFTs..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1">
          {(['All', 'Legendary', 'Rare', 'Uncommon', 'Common'] as const).map((rarity) => (
            <Button
              key={rarity}
              variant={rarityFilter === rarity ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRarityFilter(rarity)}
            >
              {rarity}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* NFT Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={viewMode === 'grid' 
          ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'space-y-3'
        }
      >
        {filteredNFTs.map((nft) => (
          <motion.div key={nft.id} variants={itemVariants}>
            <Card 
              variant="glass" 
              className="group overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden">
                <NFTPlaceholder name={nft.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute right-2 top-2 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80"
                    onClick={() => toggleFavorite(nft.id)}
                  >
                    <Heart 
                      className={`h-4 w-4 transition-colors ${favorites.includes(nft.id) ? 'fill-destructive text-destructive' : ''}`} 
                    />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge className={getRarityColor(nft.rarity)}>
                    {nft.rarity}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{nft.name}</h3>
                    <p className="text-sm text-muted-foreground">{nft.collection}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Floor Price</p>
                    <p className="font-medium">{nft.floorPrice} ETH</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {nft.chain}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
