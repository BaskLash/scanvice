"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { ExtractedReceipt } from "@/lib/receipt"
import { formatCurrency } from "./format"

export function AmountBreakdown({ totals }: { totals: ExtractedReceipt["totals"] }) {
  const { subtotal, tax_amount, tax_rate_percent, tip, total, currency } = totals
  return (
    <Card>
      <CardContent>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Amount Breakdown</h3>
        <dl className="space-y-2 text-sm">
          {subtotal !== null && subtotal !== undefined && (
            <Row label="Subtotal" value={formatCurrency(subtotal, currency)} />
          )}
          {tax_amount !== null && tax_amount !== undefined && (
            <Row
              label={
                tax_rate_percent !== null && tax_rate_percent !== undefined
                  ? `Tax (${tax_rate_percent}%)`
                  : "Tax"
              }
              value={formatCurrency(tax_amount, currency)}
            />
          )}
          {tip !== null && tip !== undefined && (
            <Row label="Tip" value={formatCurrency(tip, currency)} />
          )}
          <div className="border-t border-border pt-2">
            <Row
              label="Total"
              value={formatCurrency(total, currency)}
              emphasize
            />
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}

function Row({
  label,
  value,
  emphasize = false,
}: {
  label: string
  value: string
  emphasize?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className={emphasize ? "font-medium text-foreground" : "text-muted-foreground"}>
        {label}
      </dt>
      <dd className={emphasize ? "text-base font-semibold text-foreground" : "font-medium text-foreground"}>
        {value}
      </dd>
    </div>
  )
}
