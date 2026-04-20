"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { track } from "@/lib/analytics"

const firedSections = new Set<string>()
const startTime = typeof performance !== "undefined" ? performance.now() : 0

export const sectionsViewed = firedSections

interface SectionTrackerProps {
  id: string
  children: ReactNode
  threshold?: number
  dwellMs?: number
  className?: string
}

/**
 * Wraps a page section and emits a `section_view` event the first time
 * the element is at least `threshold` visible for `dwellMs` continuously.
 * Fires once per page load (deduped via module-level Set).
 */
export function SectionTracker({
  id,
  children,
  threshold = 0.5,
  dwellMs = 1000,
  className,
}: SectionTrackerProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const dwellTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (firedSections.has(id) || !ref.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            if (dwellTimer.current) continue
            dwellTimer.current = setTimeout(() => {
              if (firedSections.has(id)) return
              firedSections.add(id)
              const timeToView = Math.round(
                (typeof performance !== "undefined" ? performance.now() : 0) - startTime
              )
              track("section_view", {
                section: id,
                time_to_view_ms: timeToView,
              })
              observer.disconnect()
            }, dwellMs)
          } else if (dwellTimer.current) {
            clearTimeout(dwellTimer.current)
            dwellTimer.current = null
          }
        }
      },
      { threshold: [threshold] }
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
      if (dwellTimer.current) clearTimeout(dwellTimer.current)
    }
  }, [id, threshold, dwellMs])

  return (
    <div ref={ref} data-section={id} className={className}>
      {children}
    </div>
  )
}
