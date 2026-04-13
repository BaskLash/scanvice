"use client"

import { useEffect, useRef } from "react"
import { trackEvent } from "@/lib/analytics"

interface BlogScrollTrackerProps {
  slug: string
}

export function BlogScrollTracker({ slug }: BlogScrollTrackerProps) {
  const milestonesRef = useRef<Record<number, boolean>>({ 25: false, 50: false, 75: false, 100: false })

  useEffect(() => {
    // Track page view
    trackEvent("page_view", "blog", slug)

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0

      const milestones = [25, 50, 75, 100]
      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !milestonesRef.current[milestone]) {
          milestonesRef.current[milestone] = true
          trackEvent("blog_scroll_depth", "engagement", `${slug}_${milestone}%`, milestone)
        }
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [slug])

  return null
}
