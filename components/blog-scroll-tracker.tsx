"use client"

import { useEffect, useRef } from "react"
import { track } from "@/lib/analytics"

interface BlogScrollTrackerProps {
  slug: string
}

const MILESTONES = [25, 50, 75, 100] as const

export function BlogScrollTracker({ slug }: BlogScrollTrackerProps) {
  const fired = useRef<Record<number, boolean>>({ 25: false, 50: false, 75: false, 100: false })

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0

        for (const milestone of MILESTONES) {
          if (pct >= milestone && !fired.current[milestone]) {
            fired.current[milestone] = true
            track("scroll_depth", { percent: milestone, context: "blog_post", slug })
          }
        }
        ticking = false
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [slug])

  return null
}
