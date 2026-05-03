"use client"

import { Clipboard, Download, FileJson, FileSpreadsheet, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { track } from "@/lib/analytics"
import type { ExtractedReceipt } from "@/lib/receipt"

type ExportType = "xlsx" | "csv" | "json" | "clipboard"

interface ExportButtonsProps {
  data: ExtractedReceipt
  requestId: string
}

function buildFilename(data: ExtractedReceipt, ext: string): string {
  const vendor = data.vendor.name?.replace(/[^\w-]+/g, "_").slice(0, 32) ?? "receipt"
  const date = data.transaction.date ?? new Date().toISOString().slice(0, 10)
  return `scanwise_${vendor}_${date}.${ext}`
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function flatten(data: ExtractedReceipt): Record<string, string | number | null> {
  return {
    vendor_name: data.vendor.name,
    vendor_address: data.vendor.address,
    vendor_vat_number: data.vendor.vat_number,
    vendor_phone: data.vendor.phone,
    transaction_date: data.transaction.date,
    transaction_time: data.transaction.time,
    receipt_number: data.transaction.receipt_number,
    payment_method: data.transaction.payment_method,
    subtotal: data.totals.subtotal,
    tax_amount: data.totals.tax_amount,
    tax_rate_percent: data.totals.tax_rate_percent,
    tip: data.totals.tip,
    total: data.totals.total,
    currency: data.totals.currency,
    category_guess: data.category_guess,
    confidence_overall: data.confidence.overall,
    line_items_count: data.line_items.length,
  }
}

function escapeCsvValue(v: unknown): string {
  if (v === null || v === undefined) return ""
  const s = String(v)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function toCsv(data: ExtractedReceipt): string {
  const flat = flatten(data)
  const headers = Object.keys(flat)
  const summaryHeader = headers.join(",")
  const summaryRow = headers.map((h) => escapeCsvValue(flat[h])).join(",")

  const lines: string[] = [summaryHeader, summaryRow]
  if (data.line_items.length > 0) {
    lines.push("")
    lines.push("description,quantity,unit_price,total_price")
    for (const item of data.line_items) {
      lines.push(
        [item.description, item.quantity, item.unit_price, item.total_price]
          .map(escapeCsvValue)
          .join(",")
      )
    }
  }
  return lines.join("\n")
}

function toClipboardTsv(data: ExtractedReceipt): string {
  const flat = flatten(data)
  const headers = Object.keys(flat)
  const headerLine = headers.join("\t")
  const valueLine = headers.map((h) => (flat[h] === null || flat[h] === undefined ? "" : String(flat[h]))).join("\t")
  return `${headerLine}\n${valueLine}`
}

async function buildXlsx(data: ExtractedReceipt): Promise<Blob> {
  const XLSX = await import("xlsx")
  const wb = XLSX.utils.book_new()

  const summary = flatten(data)
  const summarySheet = XLSX.utils.json_to_sheet([summary])
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary")

  if (data.line_items.length > 0) {
    const itemsSheet = XLSX.utils.json_to_sheet(data.line_items)
    XLSX.utils.book_append_sheet(wb, itemsSheet, "Line Items")
  }

  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer
  return new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
}

export function ExportButtons({ data, requestId }: ExportButtonsProps) {
  const handle = async (type: ExportType) => {
    track("scanwise_export_clicked", { export_type: type, request_id: requestId })
    try {
      if (type === "json") {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        downloadBlob(blob, buildFilename(data, "json"))
      } else if (type === "csv") {
        const blob = new Blob([toCsv(data)], { type: "text/csv;charset=utf-8" })
        downloadBlob(blob, buildFilename(data, "csv"))
      } else if (type === "xlsx") {
        const blob = await buildXlsx(data)
        downloadBlob(blob, buildFilename(data, "xlsx"))
      } else if (type === "clipboard") {
        await navigator.clipboard.writeText(toClipboardTsv(data))
      }
      track("scanwise_export_completed", { export_type: type, request_id: requestId })
    } catch (err) {
      track("scanwise_error_shown", {
        error_type: "export_failed",
        error_message: (err as Error).message,
        export_type: type,
      })
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="default" size="sm" onClick={() => handle("xlsx")} className="gap-2">
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
      <Button variant="outline" size="sm" onClick={() => handle("csv")} className="gap-2">
        <FileText className="h-4 w-4" />
        CSV
      </Button>
      <Button variant="outline" size="sm" onClick={() => handle("json")} className="gap-2">
        <FileJson className="h-4 w-4" />
        JSON
      </Button>
      <Button variant="outline" size="sm" onClick={() => handle("clipboard")} className="gap-2">
        <Clipboard className="h-4 w-4" />
        Copy
      </Button>
    </div>
  )
}
