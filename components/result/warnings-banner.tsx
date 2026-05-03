"use client"

import { AlertTriangle } from "lucide-react"

const WARNING_LABELS: Record<string, string> = {
  image_blurry: "The image was difficult to read. Please double-check the values below.",
  partial_receipt: "Only part of the receipt was visible. Some fields may be missing.",
  non_receipt_image: "This doesn't look like a receipt. Try a clearer photo of a receipt or invoice.",
  multiple_receipts_detected: "Multiple receipts detected. Only the most prominent one was extracted.",
}

function labelFor(code: string): string {
  return WARNING_LABELS[code] ?? code.replace(/_/g, " ")
}

export function WarningsBanner({ warnings }: { warnings: string[] }) {
  if (!warnings || warnings.length === 0) return null
  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <ul className="space-y-1 text-sm text-amber-900 dark:text-amber-100">
          {warnings.map((w) => (
            <li key={w}>{labelFor(w)}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
