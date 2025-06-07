
"use client"

import Link from "next/link"
import Image from "next/image"; // Added Image import
import { Coffee, Moon, Settings, Sun } from "lucide-react" // Removed Terminal
import { useTheme } from "next-themes"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { BuyMeACoffeeDialog } from "./buy-me-a-coffee-dialog"

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isCoffeeModalOpen, setIsCoffeeModalOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Consistent placeholder to prevent layout shift & hydration issues
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-auto flex items-center space-x-2">
            <div className="h-8 w-8 bg-muted rounded-sm"></div> {/* Placeholder for logo */}
            <div className="flex flex-col">
              <div className="h-4 w-20 bg-muted rounded-sm mb-1"></div> {/* Placeholder for title */}
              <div className="h-3 w-40 bg-muted rounded-sm"></div> {/* Placeholder for subtitle */}
            </div>
          </div>
          <div className="h-8 w-8 bg-muted rounded-sm"></div> {/* Placeholder for settings button */}
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Link href="/" className="mr-auto flex items-center space-x-2">
            <Image 
              src="https://placehold.co/32x32.png" 
              alt="TruthSleuth Logo" 
              width={32} 
              height={32} 
              className="h-6 w-6 sm:h-8 sm:w-8" // Adjusted size for responsiveness
              data-ai-hint="company logo"
            />
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground hover:text-primary">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Open settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover border-primary/50">
                <DropdownMenuLabel className="text-muted-foreground">Appearance</DropdownMenuLabel>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="focus:bg-accent/50">
                  <div className="flex items-center justify-between w-full cursor-pointer">
                     <Label htmlFor="theme-toggle-dropdown" className="flex items-center cursor-pointer text-popover-foreground">
                        {theme === 'dark' ? <Moon className="mr-2 h-4 w-4 text-primary" /> : <Sun className="mr-2 h-4 w-4 text-primary" />}
                        Toggle Theme
                     </Label>
                     <Switch
                        id="theme-toggle-dropdown"
                        checked={theme === 'dark'}
                        onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
                     />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onSelect={() => setIsCoffeeModalOpen(true)} className="cursor-pointer focus:bg-accent/50 text-popover-foreground">
                  <Coffee className="mr-2 h-4 w-4 text-primary" />
                  <span>Buy me a coffee</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <BuyMeACoffeeDialog isOpen={isCoffeeModalOpen} onOpenChange={setIsCoffeeModalOpen} />
    </>
  )
}
