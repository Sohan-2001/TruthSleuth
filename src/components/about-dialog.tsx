
"use client"

import { X, Bot, Users, TrendingUp, Trophy, Palette, Link as LinkIcon, ScanLine, FileCode2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface AboutDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const features = [
    {
      icon: Bot,
      title: "AI-Powered Analysis",
      description: "Get an instant truthfulness score for news text, images, or URLs.",
      children: [
        { icon: FileCode2, text: "Text Analysis" },
        { icon: ScanLine, text: "Image Analysis" },
        { icon: LinkIcon, text: "URL Scraping & Analysis" },
      ],
    },
    {
      icon: Users,
      title: "Community Verification",
      description: "Submit news for peer review, vote on submissions, and provide evidence.",
    },
    {
      icon: TrendingUp,
      title: "Trending Topics",
      description: "Discover what news is currently being scrutinized by the community.",
    },
    {
      icon: Trophy,
      title: "Leaderboard",
      description: "Earn points for your contributions and climb the ranks.",
    },
    {
      icon: Palette,
      title: "Dual Themes",
      description: "Switch between a clean 'Normal' theme and a retro 'Hacker' theme.",
    },
];

export function AboutDialog({ isOpen, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card text-card-foreground border-2 border-primary rounded-lg shadow-xl">
        <DialogHeader className="pt-2">
          <DialogTitle className="text-center text-xl sm:text-2xl font-headline text-primary">About TruthSleuth</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground pt-2 text-xs sm:text-sm">
            TruthSleuth is an AI-powered platform designed to combat misinformation by providing tools for media verification and fostering a community of fact-checkers.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto px-2">
            <h3 className="text-lg font-semibold text-center text-foreground">Key Features</h3>
            <ul className="space-y-3 text-sm">
                {features.map((feature) => (
                    <li key={feature.title} className="flex items-start gap-3 p-3 bg-muted/30 rounded-md border border-border">
                        <feature.icon className="h-5 w-5 mt-1 text-accent flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-foreground">{feature.title}</p>
                            <p className="text-muted-foreground text-xs">{feature.description}</p>
                            {feature.children && (
                                <ul className="mt-2 space-y-1 pl-2">
                                    {feature.children.map(child => (
                                       <li key={child.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                                           <child.icon className="h-3 w-3" />
                                           <span>{child.text}</span>
                                       </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        <DialogFooter className="sm:justify-center pb-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 hover:text-primary focus-visible:ring-primary"
            >
              <X className="mr-2 h-4 w-4" /> Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
