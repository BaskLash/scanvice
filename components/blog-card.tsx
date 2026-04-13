"use client"

import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { BlogPost } from "@/lib/blog"
import { trackEvent } from "@/lib/analytics"

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article>
      <Link 
        href={`/blog/${post.slug}`}
        className="group block"
        onClick={() => trackEvent("click", "blog", `blog_list_${post.slug}`)}
      >
        <div className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {post.category}
            </span>
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
          
          <h2 className="mb-3 font-sans text-xl font-semibold text-foreground transition-colors group-hover:text-primary sm:text-2xl">
            {post.title}
          </h2>
          
          <p className="mb-4 text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            Read more
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </article>
  )
}
