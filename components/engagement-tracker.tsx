"use client"

import { useEffect } from "react"
import { track } from "@/lib/analytics"
import { sectionsViewed } from "./section-tracker"

const IDLE_THRESHOLD_MS = 30_000

/**
 * Mounts once per page. Tracks total active time (excluding tab-hidden
 * and idle intervals), max scroll percentage, and which sections were
 * viewed. Emits a single `engagement_time` event when the page is hidden
 * or unloaded.
 */
export function EngagementTracker() {
  useEffect(() => {
    let activeMs = 0
    let lastTick = performance.now()
    let lastInteraction = performance.now()
    let maxScrollPct = 0
    let isVisible = !document.hidden
    let sent = false

    const measureScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0
      if (pct > maxScrollPct) maxScrollPct = pct
    }

    const tick = () => {
      const now = performance.now()
      const delta = now - lastTick
      lastTick = now
      if (isVisible && now - lastInteraction < IDLE_THRESHOLD_MS) {
        activeMs += delta
      }
    }

    const onInteraction = () => {
      lastInteraction = performance.now()
    }

    const onVisibility = () => {
      tick()
      isVisible = !document.hidden
      if (document.hidden) flush()
    }

    const flush = () => {
      if (sent) return
      sent = true
      tick()
      track("engagement_time", {
        total_active_ms: Math.round(activeMs),
        max_scroll_pct: maxScrollPct,
        sections_viewed_count: sectionsViewed.size,
        sections_viewed: Array.from(sectionsViewed).join(","),
      })
    }

    const interval = setInterval(tick, 1000)
    const scrollHandler = () => {
      measureScroll()
      onInteraction()
    }

    measureScroll()
    window.addEventListener("scroll", scrollHandler, { passive: true })
    window.addEventListener("click", onInteraction, { passive: true })
    window.addEventListener("keydown", onInteraction, { passive: true })
    window.addEventListener("pointermove", onInteraction, { passive: true })
    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("pagehide", flush)
    window.addEventListener("beforeunload", flush)

    return () => {
      clearInterval(interval)
      window.removeEventListener("scroll", scrollHandler)
      window.removeEventListener("click", onInteraction)
      window.removeEventListener("keydown", onInteraction)
      window.removeEventListener("pointermove", onInteraction)
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("pagehide", flush)
      window.removeEventListener("beforeunload", flush)
    }
  }, [])

  return null
}
