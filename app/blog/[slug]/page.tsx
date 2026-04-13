import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import { getAllSlugs, getPostBySlug } from "@/lib/blog"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogScrollTracker } from "@/components/blog-scroll-tracker"
import { BlogContent } from "@/components/blog-content"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
  if (!post) {
    return {
      title: "Post Not Found - ScanVice",
    }
  }

  return {
    title: `${post.title} - ScanVice Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <BlogScrollTracker slug={post.slug} />
      <Header />
      
      <article className="pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link 
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>

          <header className="mb-12">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {post.category}
              </span>
            </div>

            <h1 className="font-sans text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{post.author.name}</div>
                  <div className="text-xs">{post.author.role}</div>
                </div>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </div>
            </div>
          </header>

          <BlogContent content={post.content} />

          <footer className="mt-16 border-t border-border pt-8">
            <div className="rounded-xl bg-secondary/50 p-6 sm:p-8">
              <h3 className="font-sans text-lg font-semibold">Ready to simplify your receipt management?</h3>
              <p className="mt-2 text-muted-foreground">
                Start scanning receipts with ScanVice today. No credit card required.
              </p>
              <Link 
                href="/#solution"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get Started Free
              </Link>
            </div>
          </footer>
        </div>
      </article>

      <Footer />
    </main>
  )
}
