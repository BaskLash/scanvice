declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent(
  action: string,
  category: string,
  label: string,
  value?: number
) {
  if (typeof window !== "undefined" && window.gtag) {
    const eventData: Record<string, unknown> = {
      event_category: category,
      event_label: label,
    }
    if (value !== undefined) {
      eventData.value = value
    }
    window.gtag("event", action, eventData)
  }
}

export function trackPageView(url: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    })
  }
}
