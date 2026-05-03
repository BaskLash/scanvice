"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { ExtractedReceipt } from "@/lib/receipt"
import { formatText } from "./format"

export function VendorCard({ vendor }: { vendor: ExtractedReceipt["vendor"] }) {
  return (
    <Card>
      <CardContent>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Vendor Details</h3>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <Row label="Name" value={formatText(vendor.name)} />
          <Row label="VAT Number" value={formatText(vendor.vat_number)} />
          <Row label="Address" value={formatText(vendor.address)} className="sm:col-span-2" />
          <Row label="Phone" value={formatText(vendor.phone)} />
        </dl>
      </CardContent>
    </Card>
  )
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground break-words">{value}</dd>
    </div>
  )
}
