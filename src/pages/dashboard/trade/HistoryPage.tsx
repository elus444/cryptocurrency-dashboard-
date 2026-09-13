import { motion } from 'framer-motion';
import { ArrowLeftRight, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCryptoIcon } from '@/utils/getCryptoIcon';

const swapHistory = [
  { id: 1, from: { symbol: 'ETH',  amount: 2.5   }, to: { symbol: 'USDC', amount: 8642  }, date: '2026-04-07 14:32', status: 'completed' },
  { id: 2, from: { symbol: 'BTC',  amount: 0.1   }, to: { symbol: 'ETH',  amount: 2.8   }, date: '2026-04-06 09:15', status: 'completed' },
  { id: 3, from: { symbol: 'SOL',  amount: 100   }, to: { symbol: 'USDC', amount: 17890 }, date: '2026-04-05 18:45', status: 'completed' },
  { id: 4, from: { symbol: 'USDC', amount: 5000  }, to: { symbol: 'ETH',  amount: 1.45  }, date: '2026-04-04 11:20', status: 'pending'   },
];

export default function TradeHistoryPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold">Trade History</h1>
        <p className="text-muted-foreground">View all your past swaps and trades</p>
      </motion.div>

      <Card variant="glass">
        <CardContent className="p-0 divide-y divide-border/30">
          {swapHistory.map((swap, i) => (
            <motion.div key={swap.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <ArrowLeftRight className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    <img
                      src={getCryptoIcon(swap.from.symbol)}
                      alt={swap.from.symbol}
                      width={18}
                      height={18}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <span>{swap.from.amount} {swap.from.symbol}</span>
                    <span className="text-muted-foreground">→</span>
                    <img
                      src={getCryptoIcon(swap.to.symbol)}
                      alt={swap.to.symbol}
                      width={18}
                      height={18}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <span>{swap.to.amount} {swap.to.symbol}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{swap.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={swap.status === 'completed' ? 'default' : 'secondary'}>{swap.status}</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink className="h-4 w-4" /></Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
