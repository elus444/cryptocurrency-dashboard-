import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownUp, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCryptoIcon } from '@/utils/getCryptoIcon';
import { toast } from 'sonner';

const tokens = [
  { symbol: 'ETH',  name: 'Ethereum', balance: 12.5,   price: 3180.00 },
  { symbol: 'USDC', name: 'USD Coin', balance: 25000,   price: 1.00 },
  { symbol: 'BTC',  name: 'Bitcoin',  balance: 0.5,     price: 67120.00 },
];

export default function TradeSwapPage() {
  const [fromAmount, setFromAmount] = useState('1.0');
  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(1);
  const [isSwapping, setIsSwapping] = useState(false);

  const fromToken = tokens[fromIndex];
  const toToken = tokens[toIndex];

  const parsedFrom = parseFloat(fromAmount);
  const toAmount = Number.isFinite(parsedFrom)
    ? (parsedFrom * fromToken.price / toToken.price).toFixed(2)
    : '0.00';

  const handleSwapDirection = () => {
    setFromIndex(toIndex);
    setToIndex(fromIndex);
    setFromAmount(toAmount);
  };

  const handleSwap = async () => {
    if (!Number.isFinite(parsedFrom) || parsedFrom <= 0) return;
    setIsSwapping(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSwapping(false);
    toast.success(`Swapped ${fromAmount} ${fromToken.symbol} → ${toAmount} ${toToken.symbol}`, {
      description: 'Transaction submitted to the network.',
    });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold">Swap</h1>
        <p className="text-muted-foreground">Trade tokens instantly at the best rates</p>
      </motion.div>

      <div className="mx-auto max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card variant="glass" className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg">Swap Tokens</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              {/* From */}
              <div className="rounded-xl bg-secondary/50 p-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>From</span>
                  <span>Balance: {fromToken.balance} {fromToken.symbol}</span>
                </div>
                <div className="flex gap-3">
                  <Input value={fromAmount} onChange={(e) => setFromAmount(e.target.value)} className="text-2xl font-bold bg-transparent border-0 p-0 h-auto" />
                  <Button variant="outline" className="gap-2 shrink-0">
                    <img
                      src={getCryptoIcon(fromToken.symbol)}
                      alt={fromToken.symbol}
                      width={20}
                      height={20}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    {fromToken.symbol}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">≈ ${Number.isFinite(parsedFrom) ? (parsedFrom * fromToken.price).toLocaleString() : '0'}</p>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-2 relative z-10">
                <Button variant="outline" size="icon" className="rounded-full bg-background" onClick={handleSwapDirection}>
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </div>

              {/* To */}
              <div className="rounded-xl bg-secondary/50 p-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>To</span>
                  <span>Balance: {toToken.balance} {toToken.symbol}</span>
                </div>
                <div className="flex gap-3">
                  <Input value={toAmount} readOnly className="text-2xl font-bold bg-transparent border-0 p-0 h-auto" />
                  <Button variant="outline" className="gap-2 shrink-0">
                    <img
                      src={getCryptoIcon(toToken.symbol)}
                      alt={toToken.symbol}
                      width={20}
                      height={20}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    {toToken.symbol}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">≈ ${parseFloat(toAmount).toLocaleString()}</p>              </div>

              {/* Rate Info */}
              <div className="rounded-lg bg-secondary/30 p-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Rate</span><span>1 {fromToken.symbol} = {(fromToken.price / toToken.price).toFixed(2)} {toToken.symbol}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Network Fee</span><span>~$2.50</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Price Impact</span><span className="text-success">&lt;0.01%</span></div>
              </div>

              <Button className="w-full gap-2" size="lg" onClick={() => void handleSwap()} disabled={isSwapping || !Number.isFinite(parsedFrom) || parsedFrom <= 0}>
                <Zap className="h-4 w-4" />
                {isSwapping ? 'Submitting…' : 'Swap Now'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
