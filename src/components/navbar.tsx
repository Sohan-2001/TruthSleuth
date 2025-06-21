
"use client"

import Link from "next/link"
import NextImage from "next/image";
import { Coffee, Menu, Moon, Settings, Sun } from "lucide-react"
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { BuyMeACoffeeDialog } from "./buy-me-a-coffee-dialog"

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isCoffeeModalOpen, setIsCoffeeModalOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);


  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <NextImage
              src="/favicon.ico"
              alt="TruthSleuth Logo"
              width={32}
              height={32}
              className="h-6 w-6 sm:h-8 sm:w-8"
              data-ai-hint="favicon"
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
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
             <Link
              href="/community"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Community
            </Link>
            <Link
              href="/leaderboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Leaderboard
            </Link>
          </nav>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground hover:text-primary">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Open settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-popover border-primary/50">
                <DropdownMenuLabel className="text-muted-foreground">Appearance</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="light" className="cursor-pointer focus:bg-accent/50 text-popover-foreground">
                    <Sun className="mr-2 h-4 w-4 text-primary" />
                    <span>Normal Theme</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark" className="cursor-pointer focus:bg-accent/50 text-popover-foreground">
                    <Moon className="mr-2 h-4 w-4 text-primary" />
                    <span>Hacker Theme</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onSelect={() => setIsCoffeeModalOpen(true)} className="cursor-pointer focus:bg-accent/50 text-popover-foreground">
                  <Coffee className="mr-2 h-4 w-4 text-primary" />
                  <span>Buy me a coffee</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground hover:text-primary">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Open Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                        <SheetTitle className="sr-only">Menu</SheetTitle>
                        <SheetDescription className="sr-only">A list of navigation links for the site.</SheetDescription>
                        <Link href="/" className="flex items-center space-x-2 mb-8">
                            <NextImage
                                src="/favicon.ico"
                                alt="TruthSleuth Logo"
                                width={32}
                                height={32}
                                className="h-8 w-8"
                                data-ai-hint="favicon"
                            />
                            <span className="font-bold text-foreground">TruthSleuth</span>
                        </Link>
                        <div className="flex flex-col space-y-3">
                            <SheetClose asChild>
                                <Link href="/community" className="transition-colors hover:text-foreground/80 text-foreground text-lg">
                                Community
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/leaderboard" className="transition-colors hover:text-foreground/80 text-foreground text-lg">
                                Leaderboard
                                </Link>
                            </SheetClose>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
          </div>
        </div>
      </header>
      <BuyMeACoffeeDialog isOpen={isCoffeeModalOpen} onOpenChange={setIsCoffeeModalOpen} />
    </>
  )
}
