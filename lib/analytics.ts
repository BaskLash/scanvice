declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: Record<string, unknown>[]
  }
}

export type EventValue = string | number | boolean | string[] | number[] | undefined | null
export type EventParams = Record<string, EventValue>

const MOBILE_BREAKPOINT = "(max-width: 768px)"
const SESSION_KEY = "scanwise_session_id"

function getDevice(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop"
  return window.matchMedia(MOBILE_BREAKPOINT).matches ? "mobile" : "desktop"
}

function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Returns a stable session identifier persisted in sessionStorage.
 * Used to group analytics events for the same browsing session
 * (validation phase has no auth, so this is our only session signal).
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr"
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY)
    if (existing) return existing
    const id = generateUuid()
    window.sessionStorage.setItem(SESSION_KEY, id)
    return id
  } catch {
    return "no-session-storage"
  }
}

interface SessionCounters {
  events_count: number
  extractions_completed: number
  integrations_clicked: string[]
  started_at: number
}

const sessionCounters: SessionCounters = {
  events_count: 0,
  extractions_completed: 0,
  integrations_clicked: [],
  started_at: typeof performance !== "undefined" ? performance.now() : 0,
}

export function getSessionCounters(): Readonly<SessionCounters> {
  return sessionCounters
}

/**
 * Single funnel for analytics events. Pushes to GTM `dataLayer` and to
 * `gtag` (GA4) when present. Always attaches `session_id` and ISO
 * `timestamp` so events can be reconstructed into per-session timelines.
 *
 * Validation rationale: this build's purpose is to measure which
 * features users care about. Every interaction must go through this
 * single helper so we can change/add events in one place.
 */
export function track(eventName: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return

  const enriched: EventParams = {
    session_id: getOrCreateSessionId(),
    timestamp: new Date().toISOString(),
    device: getDevice(),
    page_path: window.location.pathname,
    ...params,
  }

  for (const key of Object.keys(enriched)) {
    if (enriched[key] === undefined || enriched[key] === null) {
      delete enriched[key]
    }
  }

  sessionCounters.events_count += 1
  if (eventName === "scanwise_extraction_succeeded") {
    sessionCounters.extractions_completed += 1
  }
  if (eventName === "scanwise_integration_clicked") {
    const id = enriched.integration_id
    if (typeof id === "string") sessionCounters.integrations_clicked.push(id)
  }

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: eventName, ...enriched })

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, enriched)
  }
}

export function trackPageView(url: string): void {
  if (typeof window === "undefined" || !window.gtag) return
  window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, { page_path: url })
}

/**
 * Backwards-compat shim. Prefer `track(eventName, params)` for new call sites.
 */
export function trackEvent(
  action: string,
  category: string,
  label: string,
  value?: number
): void {
  track(action, { event_category: category, event_label: label, value })
}
