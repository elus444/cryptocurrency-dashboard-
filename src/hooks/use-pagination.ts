import { useMemo } from "react"

interface PaginationOptions<T> {
  items: T[]
  itemsPerPage: number
  currentPage: number
}

export function usePagination<T>({ items, itemsPerPage, currentPage }: PaginationOptions<T>) {
  return useMemo(() => {
    const totalPages = Math.ceil(items.length / itemsPerPage)
    const startIdx = (currentPage - 1) * itemsPerPage
    const endIdx = startIdx + itemsPerPage
    const currentItems = items.slice(startIdx, endIdx)

    return {
      currentItems,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    }
  }, [items, itemsPerPage, currentPage])
}
