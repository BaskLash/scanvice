"use client"

import Link from "next/link"
import { ScanLine, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
              <ScanLine className="h-5 w-5 text-primary" />
            </div>
            <span className="font-sans text-xl font-bold tracking-tight">
              Scan<span className="text-primary">Vice</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link 
              href="#solution" 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => trackEvent("click", "nav", "solution_link")}
            >
              Solution
            </Link>
            <Link 
              href="/blog" 
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => trackEvent("click", "nav", "blog_link")}
            >
              Blog
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => trackEvent("click", "nav", "sign_in_click")}
            >
              Sign In
            </Button>
            <Button 
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => trackEvent("click", "nav", "get_started_click")}
            >
              Get Started
            </Button>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              <Link 
                href="#solution" 
                className="text-sm text-muted-foreground"
                onClick={() => {
                  trackEvent("click", "nav", "solution_link_mobile")
                  setMobileMenuOpen(false)
                }}
              >
                Solution
              </Link>
              <Link 
                href="/blog" 
                className="text-sm text-muted-foreground"
                onClick={() => {
                  trackEvent("click", "nav", "blog_link_mobile")
                  setMobileMenuOpen(false)
                }}
              >
                Blog
              </Link>
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => trackEvent("click", "nav", "sign_in_click_mobile")}
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  className="bg-primary text-primary-foreground"
                  onClick={() => trackEvent("click", "nav", "get_started_click_mobile")}
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
