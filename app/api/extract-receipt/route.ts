import { randomUUID } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import {
  ACCEPTED_MIME_TYPES,
  ExtractedReceipt,
  MAX_IMAGE_BYTES,
  RECEIPT_EXTRACTION_PROMPT,
} from "@/lib/receipt"

export const runtime = "nodejs"
export const maxDuration = 60

const RATE_LIMIT_MAX = 20
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const ANTHROPIC_TIMEOUT_MS = 30_000

type Bucket = { count: number; resetAt: number }
const ipBuckets = new Map<string, Bucket>()

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0].trim()
  return req.headers.get("x-real-ip") ?? "unknown"
}

function checkRateLimit(ip: string): { allowed: boolean; resetAt: number } {
  const now = Date.now()
  const bucket = ipBuckets.get(ip)
  if (!bucket || bucket.resetAt < now) {
    const resetAt = now + RATE_LIMIT_WINDOW_MS
    ipBuckets.set(ip, { count: 1, resetAt })
    return { allowed: true, resetAt }
  }
  if (bucket.count >= RATE_LIMIT_MAX) {
    return { allowed: false, resetAt: bucket.resetAt }
  }
  bucket.count += 1
  return { allowed: true, resetAt: bucket.resetAt }
}

function stripFences(raw: string): string {
  let text = raw.trim()
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "")
  }
  return text.trim()
}

/**
 * POST /api/extract-receipt
 *
 * Validates an inbound receipt image, calls Anthropic's vision-capable
 * Claude model, and returns structured JSON conforming to ExtractedReceipt.
 *
 * Validation rationale: this is the single funnel where extractions
 * happen. We log only metadata (size, duration, tokens, requestId) so
 * we can monitor cost and quality without retaining receipt content.
 */
export async function POST(req: NextRequest) {
  const requestId = randomUUID()
  const startedAt = Date.now()

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error(`[extract-receipt ${requestId}] missing ANTHROPIC_API_KEY`)
    return NextResponse.json(
      { success: false, error: "server_misconfigured", requestId },
      { status: 500 }
    )
  }

  const ip = getClientIp(req)
  const limit = checkRateLimit(ip)
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: "rate_limited", requestId, resetAt: limit.resetAt },
      { status: 429 }
    )
  }

  let imageBase64: string
  let mimeType: string

  try {
    const contentType = req.headers.get("content-type") ?? ""
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData()
      const file = form.get("image")
      if (!(file instanceof Blob)) {
        return NextResponse.json(
          { success: false, error: "missing_image", requestId },
          { status: 400 }
        )
      }
      mimeType = file.type
      const buf = Buffer.from(await file.arrayBuffer())
      if (buf.byteLength > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { success: false, error: "image_too_large", requestId },
          { status: 400 }
        )
      }
      imageBase64 = buf.toString("base64")
    } else {
      const body = (await req.json()) as { imageBase64?: string; mimeType?: string }
      if (!body.imageBase64 || !body.mimeType) {
        return NextResponse.json(
          { success: false, error: "missing_image", requestId },
          { status: 400 }
        )
      }
      mimeType = body.mimeType
      imageBase64 = body.imageBase64
      const approxBytes = Math.ceil((imageBase64.length * 3) / 4)
      if (approxBytes > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { success: false, error: "image_too_large", requestId },
          { status: 400 }
        )
      }
    }
  } catch {
    return NextResponse.json(
      { success: false, error: "invalid_request", requestId },
      { status: 400 }
    )
  }

  if (!ACCEPTED_MIME_TYPES.includes(mimeType as (typeof ACCEPTED_MIME_TYPES)[number])) {
    return NextResponse.json(
      { success: false, error: "unsupported_mime_type", requestId },
      { status: 400 }
    )
  }

  const claudeMime = mimeType === "image/heic" ? "image/jpeg" : mimeType

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), ANTHROPIC_TIMEOUT_MS)

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 2048,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: claudeMime, data: imageBase64 },
              },
              { type: "text", text: RECEIPT_EXTRACTION_PROMPT },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const errText = await response.text().catch(() => "")
      console.error(
        `[extract-receipt ${requestId}] anthropic ${response.status}: ${errText.slice(0, 300)}`
      )
      return NextResponse.json(
        { success: false, error: "extraction_failed", requestId },
        { status: 502 }
      )
    }

    const json = (await response.json()) as {
      content?: Array<{ type: string; text?: string }>
      usage?: { input_tokens?: number; output_tokens?: number }
    }
    const textBlock = json.content?.find((c) => c.type === "text")?.text
    if (!textBlock) {
      console.error(`[extract-receipt ${requestId}] empty content from anthropic`)
      return NextResponse.json(
        { success: false, error: "extraction_empty", requestId },
        { status: 502 }
      )
    }

    let parsed: ExtractedReceipt
    try {
      parsed = JSON.parse(stripFences(textBlock)) as ExtractedReceipt
    } catch (err) {
      console.error(
        `[extract-receipt ${requestId}] parse error:`,
        (err as Error).message,
        textBlock.slice(0, 300)
      )
      return NextResponse.json(
        { success: false, error: "parse_failed", requestId },
        { status: 502 }
      )
    }

    const durationMs = Date.now() - startedAt
    const approxKb = Math.round((imageBase64.length * 0.75) / 1024)
    console.log(
      `[extract-receipt ${requestId}] ok ${durationMs}ms image_kb=${approxKb} ` +
        `in_tokens=${json.usage?.input_tokens ?? "?"} out_tokens=${json.usage?.output_tokens ?? "?"}`
    )

    return NextResponse.json({ success: true, data: parsed, requestId })
  } catch (err) {
    const aborted = (err as Error).name === "AbortError"
    const durationMs = Date.now() - startedAt
    console.error(
      `[extract-receipt ${requestId}] ${aborted ? "timeout" : "error"} after ${durationMs}ms:`,
      (err as Error).message
    )
    return NextResponse.json(
      { success: false, error: aborted ? "timeout" : "extraction_failed", requestId },
      { status: aborted ? 504 : 500 }
    )
  } finally {
    clearTimeout(timeout)
  }
}
