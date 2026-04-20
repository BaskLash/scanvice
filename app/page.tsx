import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ImpactSection } from "@/components/impact-section"
import { ProblemSections } from "@/components/problem-sections"
import { SolutionSection } from "@/components/solution-section"
import { TrustSection } from "@/components/trust-section"
import { CTASection } from "@/components/cta-section"
import { BlogPreview } from "@/components/blog-preview"
import { Footer } from "@/components/footer"
import { ScrollTracker } from "@/components/scroll-tracker"
import { FeaturedIn } from "@/components/featured-in"
import { SectionTracker } from "@/components/section-tracker"
import { EngagementTracker } from "@/components/engagement-tracker"

export default function Home() {
  return (
    <main className="min-h-screen">
      <ScrollTracker context="landing" />
      <EngagementTracker />
      <Header />
      <SectionTracker id="hero"><Hero /></SectionTracker>
      <SectionTracker id="featured_in"><FeaturedIn /></SectionTracker>
      <SectionTracker id="impact"><ImpactSection /></SectionTracker>
      <SectionTracker id="problem"><ProblemSections /></SectionTracker>
      <SectionTracker id="solution"><SolutionSection /></SectionTracker>
      <SectionTracker id="trust"><TrustSection /></SectionTracker>
      <SectionTracker id="cta_band"><CTASection /></SectionTracker>
      <SectionTracker id="blog_preview"><BlogPreview /></SectionTracker>
      <Footer />
    </main>
  )
}
