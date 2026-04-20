"use client"

import { motion } from "framer-motion"
import { ScanLine, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { track } from "@/lib/analytics"

const SECTION = "cta_band"

export function CTASection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl"
        >
          {/* Background */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          
          {/* Pattern overlay */}
          <div 
            className="absolute inset-0 -z-10 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}
          />

          <div className="relative px-6 py-16 text-center sm:px-12 sm:py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur"
            >
              <ScanLine className="h-8 w-8 text-white" />
            </motion.div>

            <h2 className="font-sans text-3xl font-bold text-white sm:text-4xl">
              Ready to reclaim your time?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
              Start scanning receipts today. No credit card required. 
              Your first 3 scans are free, every day.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="group h-12 gap-2 bg-white px-6 text-primary hover:bg-white/90"
                onClick={() =>
                  track("cta_click", {
                    cta_id: "scan_now",
                    section: SECTION,
                    cta_position: "primary",
                    cta_label: "Scan Now",
                  })
                }
              >
                <ScanLine className="h-5 w-5" />
                Scan Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/30 px-6 text-white hover:bg-white/10"
                onClick={() =>
                  track("cta_click", {
                    cta_id: "try_it_free",
                    section: SECTION,
                    cta_position: "secondary",
                    cta_label: "Try It Free",
                  })
                }
              >
                Try It Free
              </Button>
            </div>

            {/* Usage limits note */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-white">3</span>
                <span className="text-sm text-white/70">free/day</span>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-white">+5</span>
                <span className="text-sm text-white/70">with account</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
