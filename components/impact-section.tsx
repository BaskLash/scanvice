"use client"

import { motion } from "framer-motion"

const painPoints = [
  "Receipts get lost.",
  "Ink fades.",
  "Spreadsheets grow.",
  "Stress builds.",
]

export function ImpactSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          {/* Pain points */}
          <div className="mb-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-10">
            {painPoints.map((point, index) => (
              <motion.span
                key={point}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="font-sans text-xl font-medium text-muted-foreground sm:text-2xl"
              >
                {point}
              </motion.span>
            ))}
          </div>

          {/* Relief statement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className="h-32 w-full max-w-lg rounded-full bg-primary/5 blur-3xl" />
            </div>
            <p className="font-sans text-3xl font-bold text-foreground sm:text-4xl">
              It doesn&apos;t have to be this way.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
