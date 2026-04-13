"use client"

import { useEffect, useRef } from "react"
import { trackEvent } from "@/lib/analytics"

export function ScrollTracker() {
  const milestonesRef = useRef<Record<number, boolean>>({ 25: false, 50: false, 75: false, 100: false })

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0

      const milestones = [25, 50, 75, 100]
      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !milestonesRef.current[milestone]) {
          milestonesRef.current[milestone] = true
          trackEvent("scroll_depth", "engagement", `${milestone}%`, milestone)
        }
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return null
}
