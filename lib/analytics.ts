declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export type EventParams = Record<string, string | number | boolean | undefined | null>

const MOBILE_BREAKPOINT = "(max-width: 768px)"

function getDevice(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop"
  return window.matchMedia(MOBILE_BREAKPOINT).matches ? "mobile" : "desktop"
}

export function track(eventName: string, params: EventParams = {}): void {
  if (typeof window === "undefined" || !window.gtag) return

  const payload: EventParams = {
    device: getDevice(),
    page_path: window.location.pathname,
    ...params,
  }

  for (const key of Object.keys(payload)) {
    if (payload[key] === undefined || payload[key] === null) {
      delete payload[key]
    }
  }

  window.gtag("event", eventName, payload)
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
