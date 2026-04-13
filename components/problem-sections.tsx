"use client"

import { motion } from "framer-motion"
import { Clock, FileX, Search, Calendar } from "lucide-react"

const problems = [
  {
    icon: Clock,
    title: "Manual entry is killing your time",
    description: "Every receipt means typing. Every line item means another chance for error. Hours vanish into spreadsheets while your real work waits.",
    accent: "primary",
  },
  {
    icon: FileX,
    title: "Paper receipts don't last",
    description: "Thermal paper fades. Coffee spills. Wallets lose things. By the time you need proof, the evidence has disappeared.",
    accent: "destructive",
  },
  {
    icon: Search,
    title: "You can't find anything when you need it",
    description: "That expense from three months ago? Good luck finding it in a shoebox of crumpled paper. Your financial history shouldn't be a treasure hunt.",
    accent: "chart-3",
  },
  {
    icon: Calendar,
    title: "Tax season becomes chaos",
    description: "The deadline approaches. Receipts are everywhere. Your accountant is waiting. Panic sets in. Every year, the same story.",
    accent: "accent",
  },
]

export function ProblemSections() {
  return (
    <section className="relative py-24 sm:py-32">
      {/* Background accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-destructive/3 blur-3xl" />
        <div className="absolute right-0 bottom-1/4 h-[600px] w-[600px] translate-x-1/2 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <span className="text-sm font-medium uppercase tracking-wider text-primary">The Problem</span>
          <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight sm:text-4xl">
            Receipt management is broken
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative"
            >
              <div className="relative rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:border-border/80 hover:shadow-lg hover:shadow-black/5">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 -z-10 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                  problem.accent === "primary" ? "from-primary/5" :
                  problem.accent === "destructive" ? "from-destructive/5" :
                  problem.accent === "chart-3" ? "from-blue-500/5" :
                  "from-accent/5"
                } to-transparent`} />

                <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg ${
                  problem.accent === "primary" ? "bg-primary/10 text-primary" :
                  problem.accent === "destructive" ? "bg-destructive/10 text-destructive" :
                  problem.accent === "chart-3" ? "bg-blue-500/10 text-blue-500" :
                  "bg-accent/10 text-accent"
                }`}>
                  <problem.icon className="h-6 w-6" />
                </div>

                <h3 className="mb-3 font-sans text-xl font-semibold text-foreground">
                  {problem.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
