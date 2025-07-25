
"use client";

import { useState, type ChangeEvent, type FormEvent, useEffect, useRef } from 'react';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { analyzeNewsTruthfulness } from '@/ai/flows/analyze-news-truthfulness';
import { analyzeImageTruthfulness } from '@/ai/flows/analyze-image-truthfulness';
import { analyzeUrlTruthfulness } from '@/ai/flows/analyze-url-truthfulness';
import type { AnalyzeNewsTruthfulnessOutput, AnalyzeImageTruthfulnessOutput, AnalyzeUrlTruthfulnessOutput } from '@/lib/types';
import TruthScoreDisplay from '@/components/truth-score-display';
import { FileCode2, ScanLine, Loader2, Binary, Link } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { db } from '@/lib/firebase';
import { ref, push, set } from 'firebase/database';

export default function TruthSleuthPage() {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'url'>('text');
  const [inputText, setInputText] = useState<string>('');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  
  type AnalysisResult = (AnalyzeNewsTruthfulnessOutput & { source: 'text' | 'url' }) | (AnalyzeImageTruthfulnessOutput & { source: 'image' });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [pageMounted, setPageMounted] = useState(false);

  const resultContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    setPageMounted(true);
  }, []);

  useEffect(() => {
    if (isMobile && (isLoading || error || analysisResult) && resultContainerRef.current) {
      resultContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [analysisResult, isLoading, error, isMobile]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image size should not exceed 10MB.');
        toast({
          variant: "destructive",
          title: "Upload Error",
          description: "Image size exceeds 10MB limit.",
        });
        setImageFile(null);
        setImageDataUrl(null);
        return;
      }
      setImageFile(file);
      setAnalysisResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageDataUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextAnalysis = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setError('Please enter some news text to analyze.');
      toast({ variant: "destructive", title: "Input Error", description: "News text cannot be empty." });
      return;
    }
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    try {
      const result = await analyzeNewsTruthfulness({ newsText: inputText });
      setAnalysisResult({ ...result, source: 'text' });
      
      // Save verification to database
      if (result.summary) {
        const verificationsRef = ref(db, 'verifications');
        const newVerificationRef = push(verificationsRef);
        await set(newVerificationRef, {
          summary: result.summary,
          score: result.truthfulnessPercentage,
          analyzedAt: new Date().toISOString()
        });
      }

    } catch (err) {
      console.error("Text analysis error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to analyze text: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: `Could not analyze the text. ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlAnalysis = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      setError('Please enter a URL to analyze.');
      toast({ variant: "destructive", title: "Input Error", description: "URL cannot be empty." });
      return;
    }
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    try {
      const result = await analyzeUrlTruthfulness({ url: inputUrl });
      setAnalysisResult({ ...result, source: 'url' });
      
      // Save verification to database
      if (result.summary) {
        const verificationsRef = ref(db, 'verifications');
        const newVerificationRef = push(verificationsRef);
        await set(newVerificationRef, {
          summary: result.summary,
          score: result.truthfulnessPercentage,
          analyzedAt: new Date().toISOString()
        });
      }

    } catch (err) {
      console.error("URL analysis error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to analyze URL: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: `Could not analyze the URL. ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageAnalysis = async (e: FormEvent) => {
    e.preventDefault();
    if (!imageDataUrl) {
      setError('Please upload an image to analyze.');
      toast({ variant: "destructive", title: "Input Error", description: "No image uploaded." });
      return;
    }
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    try {
      const result = await analyzeImageTruthfulness({ photoDataUri: imageDataUrl });
      setAnalysisResult({ ...result, source: 'image' });
    } catch (err) {
      console.error("Image analysis error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to analyze image: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: `Could not analyze the image. ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!pageMounted) {
    return null; 
  }

  return (
    <div className="container mx-auto flex flex-col items-center py-4 sm:py-6 md:py-10 px-2 sm:px-4 dynamic-hacker-bg flex-grow">
      <div className="w-full max-w-6xl flex flex-col md:flex-row md:gap-6 lg:gap-8">
        <Card className={cn(
          "border-2 border-primary rounded-md overflow-hidden bg-card/80 backdrop-blur-sm",
          (analysisResult || isLoading || error) ? "w-full md:w-2/5 lg:w-1/3 mb-6 md:mb-0" : "w-full mb-6"
        )}>
          <CardHeader className="border-b border-primary/50 p-3 sm:p-4 md:p-6">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-headline text-foreground">Engage Analysis Core</CardTitle>
            <CardDescription className="text-muted-foreground pt-1 text-xs sm:text-sm">
              Submit text-based intel, visual data, or a URL for veracity assessment.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'text' | 'image' | 'url')} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 bg-muted/30 border border-accent/30 rounded-sm">
                <TabsTrigger 
                  value="text" 
                  className="text-xs sm:text-sm py-1.5 sm:py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-[0_0_12px_hsla(var(--accent),0.7)] data-[state=active]:font-semibold rounded-sm"
                >
                  <FileCode2 className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-4 sm:w-4" /> Textual Input
                </TabsTrigger>
                <TabsTrigger 
                  value="image" 
                  className="text-xs sm:text-sm py-1.5 sm:py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-[0_0_12px_hsla(var(--accent),0.7)] data-[state=active]:font-semibold rounded-sm"
                >
                  <ScanLine className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-4 sm:w-4" /> Image Scan
                </TabsTrigger>
                <TabsTrigger 
                  value="url" 
                  className="text-xs sm:text-sm py-1.5 sm:py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-[0_0_12px_hsla(var(--accent),0.7)] data-[state=active]:font-semibold rounded-sm"
                >
                  <Link className="mr-1 sm:mr-1.5 h-3 w-3 sm:h-4 sm:w-4" /> URL Scan
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="text">
                <form onSubmit={handleTextAnalysis} className="space-y-3 sm:space-y-4 md:space-y-6">
                  <Textarea
                    placeholder="> Input data stream here..."
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      setError(null);
                      setAnalysisResult(null);
                    }}
                    rows={6}
                    className="text-xs sm:text-sm rounded-sm shadow-sm focus:ring-primary focus:border-primary bg-background/70 border-input placeholder-muted-foreground/70"
                    disabled={isLoading}
                  />
                  <Button type="submit" className="w-full text-sm py-2 sm:text-base sm:py-2.5 md:text-lg md:py-3 rounded-sm" disabled={isLoading || !inputText.trim()}>
                    {isLoading ? <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 animate-spin text-primary-foreground" /> : <Binary className="mr-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary-foreground" />}
                    Execute Analysis
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="image">
                <form onSubmit={handleImageAnalysis} className="space-y-3 sm:space-y-4 md:space-y-6">
                  <div>
                    <Label htmlFor="image-upload" className={`flex flex-col items-center justify-center w-full h-32 sm:h-40 md:h-48 border-2 border-input border-dashed rounded-sm cursor-pointer bg-background/70 hover:bg-muted/30 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <div className="flex flex-col items-center justify-center pt-4 pb-5">
                        <ScanLine className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 text-muted-foreground" />
                        <p className="mb-1 text-[10px] sm:text-xs text-muted-foreground"><span className="font-semibold text-foreground">Initiate Upload Sequence</span> or drag image</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Supported Formats: PNG, JPG, GIF (MAX PAYLOAD: 10MB)</p>
                      </div>
                    </Label>
                    <Input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isLoading} />
                  </div>

                  {imageDataUrl && !error && (
                    <div className="mt-2 sm:mt-3 border border-input rounded-sm p-1.5 sm:p-2 md:p-4 bg-muted/20">
                      <p className="text-[10px] sm:text-xs font-medium mb-1 sm:mb-1.5 text-foreground">Visual Data Preview:</p>
                      <div className="flex justify-center">
                         <NextImage src={imageDataUrl} alt="Uploaded preview" width={400} height={300} className="rounded-sm object-contain max-h-[120px] sm:max-h-[160px] md:max-h-[200px] lg:max-h-[300px]" />
                      </div>
                    </div>
                  )}
                  <Button type="submit" className="w-full text-sm py-2 sm:text-base sm:py-2.5 md:text-lg md:py-3 rounded-sm" disabled={isLoading || !imageDataUrl}>
                    {isLoading ? <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 animate-spin text-primary-foreground" /> : <Binary className="mr-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary-foreground" />}
                    Execute Analysis
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="url">
                <form onSubmit={handleUrlAnalysis} className="space-y-3 sm:space-y-4 md:space-y-6">
                  <Input
                    placeholder="https://example.com/news-article"
                    value={inputUrl}
                    onChange={(e) => {
                      setInputUrl(e.target.value);
                      setError(null);
                      setAnalysisResult(null);
                    }}
                    type="url"
                    className="text-xs sm:text-sm rounded-sm shadow-sm focus:ring-primary focus:border-primary bg-background/70 border-input placeholder-muted-foreground/70"
                    disabled={isLoading}
                  />
                  <Button type="submit" className="w-full text-sm py-2 sm:text-base sm:py-2.5 md:text-lg md:py-3 rounded-sm" disabled={isLoading || !inputUrl.trim()}>
                    {isLoading ? <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 animate-spin text-primary-foreground" /> : <Binary className="mr-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary-foreground" />}
                    Execute Analysis
                  </Button>
                </form>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>

        {(isLoading || error || analysisResult) && (
          <div ref={resultContainerRef} className="w-full md:w-3/5 lg:w-2/3">
            {isLoading && (
              <div className="mt-4 sm:mt-6 md:mt-0 text-center">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-primary animate-spin mx-auto" />
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground">ANALYZING DATAPACKET... STANDBY...</p>
              </div>
            )}

            {error && !isLoading && (
               <div className="mt-4 sm:mt-6 md:mt-0 p-2 sm:p-3 bg-destructive/20 border border-destructive rounded-sm text-center">
                  <p className="text-destructive font-medium text-xs sm:text-sm md:text-base">{error}</p>
               </div>
            )}
            
            {analysisResult && !isLoading && !error && (
              <TruthScoreDisplay 
                score={analysisResult.truthfulnessPercentage} 
                reason={analysisResult.source !== 'image' ? analysisResult.reason : undefined} 
              />
            )}
          </div>
        )}
      </div>
      <footer className="mt-6 sm:mt-8 md:mt-12 text-center text-muted-foreground text-[10px] sm:text-xs">
        <p>&copy; {new Date().getFullYear()} TruthSleuth Systems. // Secure Channel // For Authorized Eyes Only.</p>
      </footer>
    </div>
  );
}
