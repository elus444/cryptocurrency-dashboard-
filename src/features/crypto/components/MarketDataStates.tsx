import { memo } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

// ─── Table Skeleton ────────────────────────────────────────────────────────

interface TableSkeletonProps {
  rows?: number
  columns?: number
}

/**
 * Skeleton placeholder for data tables.
 * Matches the table layout so there's zero layout shift when data arrives.
 */
export const TableSkeleton = memo(function TableSkeleton({
  rows = 8,
  columns = 7,
}: TableSkeletonProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-6 py-4">
                <Skeleton className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr
              key={rowIdx}
              className={`border-b border-border/30 ${rowIdx % 2 === 0 ? 'bg-background/50' : ''}`}
            >
              {/* First column: avatar + text */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </td>
              {/* Remaining columns: right-aligned bars */}
              {Array.from({ length: columns - 1 }).map((_, colIdx) => (
                <td key={colIdx} className="px-6 py-4">
                  <div className="flex justify-end">
                    <Skeleton
                      className="h-4"
                      style={{ width: `${50 + Math.random() * 40}px` }}
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

// ─── Card Skeleton ─────────────────────────────────────────────────────────

interface CardSkeletonProps {
  count?: number
}

/** Skeleton for summary stat cards (top of pages). */
export const StatCardsSkeleton = memo(function StatCardsSkeleton({
  count = 3,
}: CardSkeletonProps) {
  return (
    <div className={`grid gap-4 sm:grid-cols-${count}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} variant="glass" className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-32" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </Card>
      ))}
    </div>
  )
})

// ─── Error Fallback ────────────────────────────────────────────────────────

interface ErrorFallbackProps {
  error: Error | null
  onRetry: () => void
  title?: string
  description?: string
}

/**
 * Friendly error state with retry button.
 * Designed to slot directly into any card or page section.
 */
export const ErrorFallback = memo(function ErrorFallback({
  error,
  onRetry,
  title = 'Failed to load data',
  description,
}: ErrorFallbackProps) {
  const message =
    description ??
    (error?.message?.includes('429')
      ? "We've hit the API rate limit. Please wait a moment and try again."
      : error?.message?.includes('timed out')
        ? 'The request took too long. Check your connection and retry.'
        : 'Something went wrong while fetching live data. Please try again.')

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant="glass" className="border-destructive/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{message}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-5 gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
})

// ─── Empty State ───────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

/**
 * Displayed when a query succeeds but returns zero results.
 * Includes an optional CTA button.
 */
export const EmptyState = memo(function EmptyState({
  icon,
  title = 'No data available',
  description = "There's nothing to show here yet.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card variant="glass">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          {icon && (
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              {icon}
            </div>
          )}
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
          {actionLabel && onAction && (
            <Button size="sm" onClick={onAction} className="mt-5">
              {actionLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
})

// ─── Live Indicator ────────────────────────────────────────────────────────

interface LiveIndicatorProps {
  isRefetching: boolean
  dataUpdatedAt: number
}

/** Small badge showing "Live" pulse + last-updated timestamp. */
export const LiveIndicator = memo(function LiveIndicator({
  isRefetching,
  dataUpdatedAt,
}: LiveIndicatorProps) {
  const formattedTime = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full rounded-full bg-success opacity-75 ${
            isRefetching ? 'animate-ping' : 'animate-pulse'
          }`}
        />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
      </span>
      <span>{isRefetching ? 'Updating…' : formattedTime ? `Updated ${formattedTime}` : 'Live'}</span>
    </div>
  )
})
