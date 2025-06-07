
"use client"

import Image from "next/image";
import { X } from "lucide-react";
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

interface BuyMeACoffeeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function BuyMeACoffeeDialog({ isOpen, onOpenChange }: BuyMeACoffeeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground border-2 border-primary rounded-lg shadow-xl">
        <DialogHeader className="pt-4">
          <DialogTitle className="text-center text-xl sm:text-2xl font-headline text-primary">Support TruthSleuth!</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground pt-2 text-xs sm:text-sm">
            If you find this tool helpful, consider buying me a coffee. <br />
            Your support is greatly appreciated! 🙏☕️
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4 sm:py-6">
          <div 
            className="relative w-[200px] h-[334px] sm:w-[250px] sm:h-[418px] border-2 border-primary/50 rounded-md overflow-hidden shadow-md bg-muted/20"
            data-ai-hint="payment QR code"
          >
            <Image
              src="/images/phonepe-qr.png" 
              alt="PhonePe QR Code"
              layout="fill"
              objectFit="contain"
              unoptimized  // Add this if you have issues with optimization for local images or prefer raw image
            />
          </div>
          <p className="text-sm sm:text-base text-foreground font-semibold">Scan to buy me a coffee</p>
        </div>
        <DialogFooter className="sm:justify-center pb-4">
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
