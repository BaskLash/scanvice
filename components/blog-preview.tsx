"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { getAllPosts } from "@/lib/blog"
import { track } from "@/lib/analytics"

const SECTION = "blog_preview"

export function BlogPreview() {
  const posts = getAllPosts().slice(0, 3)

  return (
    <section className="relative py-24 sm:py-32 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <span className="text-sm font-medium uppercase tracking-wider text-primary">Blog</span>
            <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight sm:text-4xl">
              Latest insights
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80 sm:flex"
            onClick={() =>
              track("nav_click", {
                link_text: "View all articles",
                link_url: "/blog",
                section: SECTION,
              })
            }
          >
            View all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group block h-full"
                onClick={() =>
                  track("blog_card_click", {
                    section: SECTION,
                    slug: post.slug,
                    category: post.category,
                    position: index,
                  })
                }
              >
                <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="mb-3 font-sans text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  
                  <p className="mb-4 flex-1 text-sm text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
            onClick={() =>
              track("nav_click", {
                link_text: "View all articles",
                link_url: "/blog",
                section: SECTION,
              })
            }
          >
            View all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
