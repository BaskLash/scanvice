"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { ExtractedReceipt } from "@/lib/receipt"
import { formatCurrency, formatNumber } from "./format"

export function LineItemsTable({
  items,
  currency,
}: {
  items: ExtractedReceipt["line_items"]
  currency: string | null
}) {
  if (!items || items.length === 0) return null
  return (
    <Card>
      <CardContent>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Line Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Description</th>
                <th className="py-2 pr-4 text-right font-medium">Qty</th>
                <th className="py-2 pr-4 text-right font-medium">Unit</th>
                <th className="py-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b border-border/50 last:border-0">
                  <td className="py-2 pr-4 align-top text-foreground">{item.description}</td>
                  <td className="py-2 pr-4 text-right align-top text-foreground">
                    {formatNumber(item.quantity)}
                  </td>
                  <td className="py-2 pr-4 text-right align-top text-foreground">
                    {formatCurrency(item.unit_price, currency)}
                  </td>
                  <td className="py-2 text-right align-top font-medium text-foreground">
                    {formatCurrency(item.total_price, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
