"use client"

import { useEffect, useRef } from "react"
import { getSessionCounters, track } from "@/lib/analytics"

/**
 * Fires once on `pagehide`/`beforeunload` so we can measure how complete
 * a session was — total events, extractions, and which integrations
 * the user clicked. Pairs with the per-event `scanwise_*` stream to
 * reconstruct funnels.
 */
export function ScanwiseSessionTracker() {
  const startedAt = useRef<number>(performance.now())
  const sentRef = useRef(false)

  useEffect(() => {
    track("scanwise_page_view", {
      page_path: window.location.pathname,
      referrer: document.referrer || null,
    })

    const flush = () => {
      if (sentRef.current) return
      sentRef.current = true
      const c = getSessionCounters()
      track("scanwise_session_summary", {
        events_count: c.events_count,
        session_duration_ms: Math.round(performance.now() - startedAt.current),
        extractions_completed: c.extractions_completed,
        integrations_clicked: c.integrations_clicked,
      })
    }

    const onVisibility = () => {
      if (document.hidden) flush()
    }

    window.addEventListener("pagehide", flush)
    window.addEventListener("beforeunload", flush)
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      window.removeEventListener("pagehide", flush)
      window.removeEventListener("beforeunload", flush)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  return null
}
