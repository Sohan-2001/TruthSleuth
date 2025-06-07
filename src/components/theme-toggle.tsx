
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label" // Label might not be needed if used in dropdown context

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Consistent placeholder to prevent layout shift
    return <div className="flex items-center space-x-2 h-[24px] w-[76px]" />; 
  }

  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className={`h-5 w-5 transition-colors ${isDark ? 'text-muted-foreground' : 'text-primary'}`} />
      <Switch
        id="theme-toggle-main" // Changed ID to avoid conflict if multiple instances
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
      />
      <Moon className={`h-5 w-5 transition-colors ${isDark ? 'text-primary' : 'text-muted-foreground'}`} />
    </div>
  )
}
