"use client"

import { cn } from "@/lib/utils"

interface ConfidenceIndicatorProps {
  value: number
  label?: string
}

export function ConfidenceIndicator({ value, label = "Confidence" }: ConfidenceIndicatorProps) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100)
  const tier = value >= 0.85 ? "high" : value >= 0.6 ? "medium" : "low"
  const dotColor =
    tier === "high" ? "bg-green-500" : tier === "medium" ? "bg-amber-500" : "bg-red-500"
  const textColor =
    tier === "high"
      ? "text-green-600 dark:text-green-400"
      : tier === "medium"
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400"

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={cn("h-2.5 w-2.5 rounded-full", dotColor)} aria-hidden />
      <span className="text-muted-foreground">{label}:</span>
      <span className={cn("font-medium", textColor)}>{pct}%</span>
    </div>
  )
}
