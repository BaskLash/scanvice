export const RECEIPT_EXTRACTION_PROMPT = `You are a receipt and invoice data extraction engine. You will be given an image of a receipt, invoice, or bill. Your task is to extract structured data from it and return it ONLY as valid JSON, with no preamble, no commentary, and no markdown code fences.

Return a JSON object with exactly the following schema:

{
  "vendor": {
    "name": string | null,
    "address": string | null,
    "vat_number": string | null,
    "phone": string | null
  },
  "transaction": {
    "date": string | null,
    "time": string | null,
    "receipt_number": string | null,
    "payment_method": string | null
  },
  "totals": {
    "subtotal": number | null,
    "tax_amount": number | null,
    "tax_rate_percent": number | null,
    "tip": number | null,
    "total": number | null,
    "currency": string | null
  },
  "line_items": [
    {
      "description": string,
      "quantity": number | null,
      "unit_price": number | null,
      "total_price": number | null
    }
  ],
  "category_guess": string | null,
  "confidence": {
    "overall": number,
    "vendor_name": number,
    "date": number,
    "total": number
  },
  "warnings": string[]
}

Rules:
- If a field is not visible or unreadable, return null. Never guess.
- Always normalize dates to ISO 8601 (YYYY-MM-DD).
- Always normalize currency to ISO 4217 codes (CHF, EUR, USD, GBP, etc.).
- Numeric fields must be numbers, not strings. Do not include currency symbols inside numeric values.
- The line_items array can be empty if no individual items are itemized on the receipt.
- If the image is clearly not a receipt or invoice, return all fields as null and add "non_receipt_image" to warnings.
- If the image is too blurry or low-quality to read reliably, still attempt extraction but lower the confidence scores and add "image_blurry" to warnings.
- Output ONLY the JSON object. No explanations, no markdown, no surrounding text.`

export interface ReceiptVendor {
  name: string | null
  address: string | null
  vat_number: string | null
  phone: string | null
}

export interface ReceiptTransaction {
  date: string | null
  time: string | null
  receipt_number: string | null
  payment_method: string | null
}

export interface ReceiptTotals {
  subtotal: number | null
  tax_amount: number | null
  tax_rate_percent: number | null
  tip: number | null
  total: number | null
  currency: string | null
}

export interface ReceiptLineItem {
  description: string
  quantity: number | null
  unit_price: number | null
  total_price: number | null
}

export interface ReceiptConfidence {
  overall: number
  vendor_name: number
  date: number
  total: number
}

export interface ExtractedReceipt {
  vendor: ReceiptVendor
  transaction: ReceiptTransaction
  totals: ReceiptTotals
  line_items: ReceiptLineItem[]
  category_guess: string | null
  confidence: ReceiptConfidence
  warnings: string[]
}

export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
] as const

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024
