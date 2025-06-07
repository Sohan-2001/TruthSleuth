
"use client"

import Link from "next/link"
import { Terminal } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-auto flex items-center space-x-2">
          <Terminal className="h-6 w-6 text-primary" />
          <div className="flex flex-col">
            <span className="font-bold text-foreground">
              TruthSleuth
            </span>
            <span className="block text-[10px] sm:text-xs text-muted-foreground leading-tight">
              AI-Powered Disinformation Analysis Matrix
            </span>
          </div>
        </Link>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
