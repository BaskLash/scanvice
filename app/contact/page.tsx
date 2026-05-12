import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ContactForm } from "@easycontact/react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Contact - ScanVice",
  description: "Get in touch with the ScanVice team. We're here to help with questions, feedback, and support.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-32 pb-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <h1 className="font-sans text-4xl font-bold tracking-tight sm:text-5xl">
            Contact us
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Questions, feedback, or need something from us? Drop us a message — we read every one.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <ContactForm projectId="acb052763dfad4b8bd161339" />
        </div>
      </section>

      <Footer />
    </main>
  )
}
