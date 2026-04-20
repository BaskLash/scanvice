"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ScanLine, Upload, Camera, X, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { track } from "@/lib/analytics"

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"]
const SECTION = "hero"

export function Hero() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const sourceRef = useRef<"upload" | "camera">("upload")

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const sizeKb = Math.round(file.size / 1024)
    const source = sourceRef.current

    if (file.size > MAX_FILE_SIZE_BYTES) {
      track("file_rejected", { reason: "too_large", file_type: file.type, file_size_kb: sizeKb, source, section: SECTION })
      return
    }
    if (file.type && !ALLOWED_TYPES.includes(file.type)) {
      track("file_rejected", { reason: "unsupported_type", file_type: file.type, file_size_kb: sizeKb, source, section: SECTION })
      return
    }

    setSelectedFile(file)
    track("file_selected", {
      source,
      file_type: file.type || "unknown",
      file_size_kb: sizeKb,
      is_image: file.type.startsWith("image/"),
      section: SECTION,
    })

    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (ev) => setPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    const sizeKb = Math.round(selectedFile.size / 1024)
    const source = sourceRef.current
    const startedAt = performance.now()

    setIsAnalyzing(true)
    track("analyze_started", {
      file_type: selectedFile.type || "unknown",
      file_size_kb: sizeKb,
      source,
      section: SECTION,
    })

    try {
      // Simulate analysis - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      track("analyze_completed", {
        duration_ms: Math.round(performance.now() - startedAt),
        file_type: selectedFile.type || "unknown",
        file_size_kb: sizeKb,
        source,
        section: SECTION,
        success: true,
      })

      // TODO: Handle analysis results
      alert("Receipt analyzed! In production, this would show extracted data.")
    } catch (err) {
      const error = err as Error
      track("analyze_failed", {
        duration_ms: Math.round(performance.now() - startedAt),
        error_message: error?.message ?? "unknown",
        file_type: selectedFile.type || "unknown",
        file_size_kb: sizeKb,
        source,
        section: SECTION,
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const clearFile = () => {
    track("file_cleared", { source: sourceRef.current, had_preview: preview !== null, section: SECTION })
    setSelectedFile(null)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (cameraInputRef.current) cameraInputRef.current.value = ""
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

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
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

          {/* Receipt Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 w-full max-w-lg mx-auto"
          >
            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
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
              {!selectedFile ? (
                <motion.div
                  key="upload-area"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-8 transition-colors hover:border-primary/50 hover:bg-secondary/50"
                >
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
                      <ScanLine className="h-8 w-8 text-primary" />
                    </div>
                    
                    <div className="text-center">
                      <p className="text-foreground font-medium">Upload or capture your receipt</p>
                      <p className="text-sm text-muted-foreground mt-1">JPG, PNG, or PDF supported</p>
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
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview-area"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border border-border bg-secondary/30 p-6"
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
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <ScanLine className="h-5 w-5" />
                          Analyze Receipt
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
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

          {/* Trust indicators */}
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
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">Scroll to learn more</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-8 w-5 rounded-full border-2 border-muted-foreground/30 p-1"
            >
              <div className="h-2 w-1 rounded-full bg-muted-foreground/50 mx-auto" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
