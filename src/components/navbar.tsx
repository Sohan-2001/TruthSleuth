
"use client"

import Link from "next/link"
import { Terminal } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-4 flex items-center space-x-2">
          <Terminal className="h-6 w-6 text-primary" />
          <div className="flex flex-col">
            <span className="font-bold sm:inline-block text-foreground">
              TruthSleuth
            </span>
            <span className="hidden sm:block text-xs text-muted-foreground">
              AI-Powered Disinformation Analysis Matrix
            </span>
          </div>
        </Link>
        {/* For smaller screens, show subtitle below title or in a more compact way if needed */}
        <p className="sm:hidden text-xs text-muted-foreground truncate">
          Disinformation Analysis Matrix
        </p>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
