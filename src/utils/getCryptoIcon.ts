/**
 * Returns the URL for a cryptocurrency icon from cryptoicons.org.
 * The icon silently disappears via onError if the symbol is not found.
 *
 * @param symbol - Ticker symbol (e.g. "BTC", "eth", "USDC")
 * @returns Fully-qualified icon URL at 32 px
 */
export function getCryptoIcon(symbol: string): string {
  return `https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/32`;
}
