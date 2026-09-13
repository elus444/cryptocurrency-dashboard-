import type React from "react"

import { memo } from "react"
import { motion } from "framer-motion"

interface VirtualTableRowProps {
  children: React.ReactNode
  index: number
  isEven: boolean
}

export const VirtualTableRow = memo(({ children, isEven }: VirtualTableRowProps) => (
  <motion.tr
    className={`border-b border-border/30 transition-colors hover:bg-accent/50 ${isEven ? "bg-background/50" : ""}`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.tr>
))

VirtualTableRow.displayName = "VirtualTableRow"
