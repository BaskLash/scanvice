"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { track } from "@/lib/analytics"
import type { ExtractedReceipt } from "@/lib/receipt"
import { AmountBreakdown } from "./amount-breakdown"
import { ConfidenceIndicator } from "./confidence-indicator"
import { ExportButtons } from "./export-buttons"
import { IntegrationButtons } from "./integration-buttons"
import { LineItemsTable } from "./line-items-table"
import { TransactionDetails } from "./transaction-details"
import { VendorCard } from "./vendor-card"
import { WarningsBanner } from "./warnings-banner"
import { formatCurrency, formatDate, formatText } from "./format"

interface ResultViewProps {
  data: ExtractedReceipt
  requestId: string
  onReset: () => void
}

export function ResultView({ data, requestId, onReset }: ResultViewProps) {
  useEffect(() => {
    track("scanwise_table_viewed", { request_id: requestId })
  }, [requestId])

  const isNonReceipt = data.warnings?.includes("non_receipt_image")
  const lowConfidence = (data.confidence?.overall ?? 0) < 0.6

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-3xl space-y-4 text-left"
    >
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Scan another
        </Button>
        <ConfidenceIndicator value={data.confidence?.overall ?? 0} />
      </div>

      {(data.warnings?.length ?? 0) > 0 && <WarningsBanner warnings={data.warnings} />}

      {isNonReceipt ? (
        <Card>
          <CardContent>
            <p className="text-sm text-foreground">
              This doesn&apos;t look like a receipt. Try uploading a clearer photo of a receipt or
              invoice.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Vendor
                  </p>
                  <h2 className="text-2xl font-bold text-foreground">
                    {formatText(data.vendor.name)}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(data.transaction.date)}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(data.totals.total, data.totals.currency)}
                  </p>
                  {data.category_guess && (
                    <Badge variant="secondary">{data.category_guess}</Badge>
                  )}
                </div>
              </div>

              {lowConfidence && (
                <p className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-900 dark:text-amber-100">
                  Low confidence — please verify the data below before exporting.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <VendorCard vendor={data.vendor} />
            <TransactionDetails transaction={data.transaction} />
          </div>

          <AmountBreakdown totals={data.totals} />

          <LineItemsTable items={data.line_items} currency={data.totals.currency} />
        </>
      )}

      <Card>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Export</h3>
            <ExportButtons data={data} requestId={requestId} />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Send to system</h3>
            <IntegrationButtons data={data} requestId={requestId} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
