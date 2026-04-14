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

export default function Home() {
  return (
    <main className="min-h-screen">
      <ScrollTracker />
      <Header />
      <Hero />
      <FeaturedIn />
      <ImpactSection />
      <ProblemSections />
      <SolutionSection />
      <TrustSection />
      <CTASection />
      <BlogPreview />
      <Footer />
    </main>
  )
}
