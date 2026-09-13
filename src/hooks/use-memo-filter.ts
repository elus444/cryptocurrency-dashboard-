import { useMemo } from "react"

export function useMemoFilter<T>(items: T[], searchQuery: string, filterFn: (item: T, query: string) => boolean) {
  return useMemo(() => {
    if (!searchQuery) return items
    return items.filter((item) => filterFn(item, searchQuery.toLowerCase()))
  }, [items, searchQuery, filterFn])
}
