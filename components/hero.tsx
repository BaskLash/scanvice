"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ScanLine, Upload, Camera, X, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { track } from "@/lib/analytics"
import type { ExtractedReceipt } from "@/lib/receipt"
import { ResultView } from "@/components/result/result-view"

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"]
const SECTION = "hero"

type Status = "idle" | "extracting" | "result" | "error"

interface ResultState {
  data: ExtractedReceipt
  requestId: string
}

interface ErrorState {
  type: string
  message: string
}

export function Hero() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [result, setResult] = useState<ResultState | null>(null)
  const [error, setError] = useState<ErrorState | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const sourceRef = useRef<"upload" | "camera">("upload")

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const sizeKb = Math.round(file.size / 1024)
    const source = sourceRef.current

    track("scanwise_upload_started", { input_method: source })

    if (file.size > MAX_FILE_SIZE_BYTES) {
      track("scanwise_error_shown", {
        error_type: "file_too_large",
        error_message: `${sizeKb}kb exceeds 10mb limit`,
      })
      setError({ type: "file_too_large", message: "File is larger than 10 MB." })
      setStatus("error")
      return
    }
    if (file.type && !ALLOWED_TYPES.includes(file.type)) {
      track("scanwise_error_shown", {
        error_type: "unsupported_type",
        error_message: file.type,
      })
      setError({
        type: "unsupported_type",
        message: "Only JPG, PNG, WEBP, or HEIC images are supported.",
      })
      setStatus("error")
      return
    }

    setSelectedFile(file)
    setError(null)
    setStatus("idle")

    track("scanwise_upload_completed", {
      input_method: source,
      file_size_kb: sizeKb,
      file_type: file.type || "unknown",
    })

    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        const comma = result.indexOf(",")
        resolve(comma >= 0 ? result.slice(comma + 1) : result)
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })

  const handleAnalyze = async () => {
    if (!selectedFile) return

    const startedAt = performance.now()
    setStatus("extracting")
    setError(null)

    track("scanwise_extraction_started", {
      input_method: sourceRef.current,
      file_size_kb: Math.round(selectedFile.size / 1024),
    })

    try {
      const imageBase64 = await fileToBase64(selectedFile)
      const mimeType = selectedFile.type || "image/jpeg"

      const response = await fetch("/api/extract-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mimeType }),
      })

      const json = (await response.json()) as
        | { success: true; data: ExtractedReceipt; requestId: string }
        | { success: false; error: string; requestId: string }

      const durationMs = Math.round(performance.now() - startedAt)

      if (!response.ok || !json.success) {
        const errorType = "error" in json ? json.error : `http_${response.status}`
        track("scanwise_extraction_failed", {
          request_id: "requestId" in json ? json.requestId : undefined,
          error_type: errorType,
          duration_ms: durationMs,
        })
        track("scanwise_error_shown", {
          error_type: errorType,
          error_message: errorType,
        })
        setError({
          type: errorType,
          message:
            errorType === "rate_limited"
              ? "You've reached the free usage limit for this hour. Please try again later."
              : errorType === "timeout"
                ? "This is taking longer than expected. Please try again."
                : errorType === "unsupported_mime_type"
                  ? "That file type isn't supported. Try JPG, PNG, WEBP, or HEIC."
                  : "We couldn't extract the receipt. Please try a clearer photo.",
        })
        setStatus("error")
        return
      }

      track("scanwise_extraction_succeeded", {
        request_id: json.requestId,
        duration_ms: durationMs,
        confidence_overall: json.data.confidence?.overall ?? 0,
        currency: json.data.totals?.currency,
        total_amount: json.data.totals?.total,
        vendor_name_present: !!json.data.vendor?.name,
        line_items_count: json.data.line_items?.length ?? 0,
        category_guess: json.data.category_guess,
      })

      setResult({ data: json.data, requestId: json.requestId })
      setStatus("result")
    } catch (err) {
      const durationMs = Math.round(performance.now() - startedAt)
      const message = (err as Error).message || "network_error"
      track("scanwise_extraction_failed", {
        error_type: "network_error",
        error_message: message,
        duration_ms: durationMs,
      })
      track("scanwise_error_shown", {
        error_type: "network_error",
        error_message: message,
      })
      setError({
        type: "network_error",
        message: "We couldn't reach the server. Check your connection and try again.",
      })
      setStatus("error")
    }
  }

  const clearFile = () => {
    track("file_cleared", { source: sourceRef.current, had_preview: preview !== null, section: SECTION })
    setSelectedFile(null)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (cameraInputRef.current) cameraInputRef.current.value = ""
  }

  const reset = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    setStatus("idle")
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (cameraInputRef.current) cameraInputRef.current.value = ""
  }

  const handleRetry = () => {
    track("scanwise_retry_clicked", { previous_error_type: error?.type ?? "unknown" })
    reset()
  }

  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px'
          }}
        />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center w-full"
        >
          {status !== "result" && (
            <>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5"
              >
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground">AI-Powered Receipt Analysis</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mx-auto max-w-4xl font-sans text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              >
                <span className="text-balance">
                  Stop wasting hours{" "}
                  <span className="text-primary">on receipts.</span>
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl"
              >
                Capture, organize, and understand your expenses instantly — without typing a single line.
              </motion.p>
            </>
          )}

          {/* Receipt Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 w-full max-w-3xl mx-auto"
          >
            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Upload receipt file"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Capture receipt with camera"
            />

            <AnimatePresence mode="wait">
              {status === "result" && result ? (
                <ResultView
                  key="result-view"
                  data={result.data}
                  requestId={result.requestId}
                  onReset={reset}
                />
              ) : status === "extracting" ? (
                <motion.div
                  key="extracting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-border bg-secondary/30 p-10 max-w-lg mx-auto"
                >
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <div className="text-center">
                      <p className="text-foreground font-medium">Extracting your receipt…</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        This usually takes 3–8 seconds.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : status === "error" && error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border border-destructive/40 bg-destructive/5 p-8 max-w-lg mx-auto"
                >
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                      <X className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Something went wrong</p>
                      <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
                    </div>
                    <Button onClick={handleRetry} className="gap-2">
                      Try again
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ) : !selectedFile ? (
                <motion.div
                  key="upload-area"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-8 transition-colors hover:border-primary/50 hover:bg-secondary/50 max-w-lg mx-auto"
                >
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
                      <ScanLine className="h-8 w-8 text-primary" />
                    </div>

                    <div className="text-center">
                      <p className="text-foreground font-medium">Upload or capture your receipt</p>
                      <p className="text-sm text-muted-foreground mt-1">JPG, PNG, WEBP, or HEIC supported</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto h-12 gap-2 bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                        onClick={() => {
                          sourceRef.current = "upload"
                          fileInputRef.current?.click()
                          track("cta_click", {
                            cta_id: "upload_receipt",
                            section: SECTION,
                            cta_position: "primary",
                            cta_label: "Upload Receipt",
                          })
                        }}
                      >
                        <Upload className="h-5 w-5" />
                        Upload Receipt
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto h-12 gap-2 border-border hover:bg-secondary"
                        onClick={() => {
                          sourceRef.current = "camera"
                          cameraInputRef.current?.click()
                          track("cta_click", {
                            cta_id: "open_camera",
                            section: SECTION,
                            cta_position: "secondary",
                            cta_label: "Open Camera",
                          })
                        }}
                      >
                        <Camera className="h-5 w-5" />
                        Open Camera
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center max-w-xs">
                      Your receipt is processed using AI and is not stored on our servers. Data
                      shown on this page exists only in your browser.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview-area"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border border-border bg-secondary/30 p-6 max-w-lg mx-auto"
                >
                  <div className="flex flex-col items-center gap-4">
                    {/* File preview */}
                    <div className="relative">
                      {preview ? (
                        <div className="relative h-40 w-40 overflow-hidden rounded-xl border border-border">
                          <img
                            src={preview}
                            alt="Receipt preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-40 w-40 items-center justify-center rounded-xl border border-border bg-secondary">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <button
                        onClick={clearFile}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-transform hover:scale-110"
                        aria-label="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* File info */}
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    {/* Analyze button */}
                    <Button
                      size="lg"
                      className="group h-12 gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90"
                      onClick={handleAnalyze}
                    >
                      <ScanLine className="h-5 w-5" />
                      Analyze Receipt
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>

                    {/* Change file link */}
                    <button
                      onClick={clearFile}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Choose a different file
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {status === "idle" && !selectedFile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                3 free scans daily
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Swiss data protection
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
