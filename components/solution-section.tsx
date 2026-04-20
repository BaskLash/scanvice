"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ScanLine, Sparkles, FolderSearch, LineChart, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { track } from "@/lib/analytics"

const SECTION = "solution"

const features = [
  {
    id: "scan_instantly",
    icon: ScanLine,
    title: "Scan receipts instantly",
    description: "Point, capture, done. Your phone camera becomes a powerful scanner.",
  },
  {
    id: "extract_data",
    icon: Sparkles,
    title: "Extract data automatically",
    description: "AI reads every line — vendor, date, items, totals. No typing required.",
  },
  {
    id: "store_search",
    icon: FolderSearch,
    title: "Store & search securely",
    description: "Everything organized and searchable. Find any receipt in seconds.",
  },
  {
    id: "expense_overview",
    icon: LineChart,
    title: "Real-time expense overview",
    description: "See where your money goes. Track spending patterns at a glance.",
  },
]

const HOVER_THRESHOLD_MS = 500

export function SolutionSection() {
  return (
    <section id="solution" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/30 via-background to-background" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <span className="text-sm font-medium uppercase tracking-wider text-accent">The Solution</span>
          <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight sm:text-4xl">
            Meet <span className="text-primary">ScanVice</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Your AI-powered receipt assistant that turns chaos into clarity.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        {/* Visual demo section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-20"
        >
          <div className="relative rounded-2xl border border-border bg-card p-8 sm:p-12">
            {/* Gradient overlay */}
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Before/After visual */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  {/* Before */}
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-lg bg-destructive/10 blur" />
                    <div className="relative rounded-lg border border-border bg-secondary p-4">
                      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-destructive">Before</div>
                      <div className="space-y-2">
                        <div className="h-3 w-full rounded bg-muted-foreground/20" />
                        <div className="h-3 w-3/4 rounded bg-muted-foreground/20" />
                        <div className="h-3 w-5/6 rounded bg-muted-foreground/20" />
                        <div className="h-3 w-2/3 rounded bg-muted-foreground/20 opacity-50" />
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <svg className="h-3 w-3 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Faded, unreadable
                      </div>
                    </div>
                  </div>

                  {/* After */}
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-lg bg-accent/10 blur" />
                    <div className="relative rounded-lg border border-accent/30 bg-secondary p-4">
                      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-accent">After</div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vendor:</span>
                          <span className="text-foreground">Coffee Shop</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="text-foreground">Apr 10, 2026</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total:</span>
                          <span className="font-semibold text-primary">$12.50</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs text-accent">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Digitized & searchable
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text content */}
              <div>
                <h3 className="font-sans text-2xl font-bold sm:text-3xl">
                  From paper chaos to <span className="text-primary">digital clarity</span>
                </h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  ScanVice uses advanced AI to extract every detail from your receipts — even faded or crumpled ones. Your financial data becomes organized, searchable, and always accessible.
                </p>
                <Button
                  className="mt-6 group gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() =>
                    track("cta_click", {
                      cta_id: "try_it_free",
                      section: SECTION,
                      cta_position: "inline",
                      cta_label: "Try It Free",
                    })
                  }
                >
                  Try It Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  feature: (typeof features)[number]
  index: number
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const viewedRef = useRef(false)
  const hoverFiredRef = useRef(false)
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const onViewportEnter = () => {
    if (viewedRef.current) return
    viewedRef.current = true
    track("feature_card_view", {
      section: SECTION,
      feature_id: feature.id,
      feature_index: index,
    })
  }

  const onPointerEnter = () => {
    if (hoverFiredRef.current) return
    hoverTimerRef.current = setTimeout(() => {
      hoverFiredRef.current = true
      track("feature_card_hover", {
        section: SECTION,
        feature_id: feature.id,
        feature_index: index,
      })
    }, HOVER_THRESHOLD_MS)
  }

  const onPointerLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      onViewportEnter={onViewportEnter}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div className="relative h-full rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
          <feature.icon className="h-5 w-5" />
        </div>
        <h3 className="mb-2 font-sans text-lg font-semibold text-foreground">
          {feature.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}
