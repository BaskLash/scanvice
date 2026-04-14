"use client"

import { useEffect, useCallback, useState } from "react"
import { motion } from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ExternalLink } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

const featuredSites = [
  {
    name: "ITXoft",
    url: "https://itxoft-organic-seo-growth.site/i-was-at-the-point-of-giving-up-on-seo-after-numerous-failed-attempts-until-a-colleague-mentioned-itxoft-as-a-great-way-to-get-high-quality-contextual-links-well-i-took-the-plunge-and-received-amazing/",
    logo: "ITX",
  },
  {
    name: "ITXoft (SEO)",
    url: "https://itxoft-cost-effective-seo-services.site/i-was-at-the-point-of-giving-up-on-seo-after-numerous-failed-attempts-until-a-colleague-mentioned-itxoft-as-a-great-way-to-get-high-quality-contextual-links-well-i-took-the-plunge-and-received-amazing/",
    logo: "ITX",
  },
  {
    name: "Seodaro",
    url: "https://seodaro.com/competing-in-seo-seodaro-13463/",
    logo: "SD",
  },
  {
    name: "Affordable SEO Solutions",
    url: "https://itxoft-affordable-seo-solutions.site/i-was-at-the-point-of-giving-up-on-seo-after-numerous-failed-attempts-until-a-colleague-mentioned-itxoft-as-a-great-way-to-get-high-quality-contextual-links-well-i-took-the-plunge-and-received-amazing/",
    logo: "ITX",
  },
  {
    name: "Grow Your Website",
    url: "https://grow-your.website/boost-ahrefs-dr-moz-da-majestic-tf-high-authority-backlinks-all-niches-1184/",
    logo: "GYW",
  },
  {
    name: "RG Links",
    url: "http://rglinks.org/authority-backlink-solutions-gambling-crypto-casino-1867/",
    logo: "RG",
  },
  {
    name: "Zoldex Links",
    url: "https://zoldexlinks.shop/organic-traffic-with-seo-backlinks-985-2/",
    logo: "ZL",
  },
  {
    name: "Side Enhancer",
    url: "https://sideenhancer.online/authority-backlink-solutions-gambling-crypto-casino-1867/",
    logo: "SE",
  },
  {
    name: "PrimeSEO",
    url: "https://primeseo.xyz/boost-website-ranking-high-quality-seo-backlinks-2060/",
    logo: "PS",
  },
]

function FeaturedCard({ site }: { site: (typeof featuredSites)[number] }) {
  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("click", "featured_in", site.name)}
      className="group relative flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-card/50 px-5 transition-all duration-300 hover:border-primary/30 hover:bg-card sm:h-24 sm:w-52"
    >
      <span className="font-sans text-lg font-semibold tracking-tight text-muted-foreground transition-colors duration-300 group-hover:text-foreground sm:text-xl">
        {site.name}
      </span>
      <ExternalLink className="absolute right-3 top-3 h-3.5 w-3.5 text-muted-foreground/0 transition-all duration-300 group-hover:text-muted-foreground/60" />
    </a>
  )
}

export function FeaturedIn() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      dragFree: true,
    },
    [Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })]
  )

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <section className="relative overflow-hidden border-t border-border/30 py-16 sm:py-20">
      {/* Subtle background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-48 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center sm:mb-12"
        >
          <p className="mb-2 font-mono text-sm uppercase tracking-widest text-primary">
            As seen in
          </p>
          <h2 className="font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Featured In
          </h2>
        </motion.div>

        {/* Desktop: grid layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="hidden lg:block"
        >
          <div className="flex flex-wrap items-center justify-center gap-4">
            {featuredSites.map((site, index) => (
              <motion.div
                key={site.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
              >
                <FeaturedCard site={site} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mobile/tablet: carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="lg:hidden"
        >
          <div className="relative">
            {/* Fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent" />

            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex gap-4">
                {featuredSites.map((site) => (
                  <div key={site.name} className="min-w-0 shrink-0">
                    <FeaturedCard site={site} />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation dots */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canScrollPrev}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground disabled:opacity-30"
                aria-label="Previous"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <span className="font-mono text-xs text-muted-foreground">
                Swipe to explore
              </span>
              <button
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canScrollNext}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground disabled:opacity-30"
                aria-label="Next"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
