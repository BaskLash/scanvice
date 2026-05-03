"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { ExtractedReceipt } from "@/lib/receipt"
import { formatDate, formatText } from "./format"

export function TransactionDetails({ transaction }: { transaction: ExtractedReceipt["transaction"] }) {
  return (
    <Card>
      <CardContent>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Transaction Details</h3>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
          <Row label="Date" value={formatDate(transaction.date)} />
          <Row label="Time" value={formatText(transaction.time)} />
          <Row label="Receipt #" value={formatText(transaction.receipt_number)} />
          <Row label="Payment" value={formatText(transaction.payment_method)} />
        </dl>
      </CardContent>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground break-words">{value}</dd>
    </div>
  )
}
