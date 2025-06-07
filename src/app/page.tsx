
"use client";

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { analyzeNewsTruthfulness, type AnalyzeNewsTruthfulnessOutput } from '@/ai/flows/analyze-news-truthfulness';
import { analyzeImageTruthfulness, type AnalyzeImageTruthfulnessOutput } from '@/ai/flows/analyze-image-truthfulness';
import TruthScoreDisplay from '@/components/truth-score-display';
import { FileText, ImageUp, Loader2, Search, ShieldCheck } from 'lucide-react';

export default function TruthSleuthPage() {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [inputText, setInputText] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  
  type AnalysisResult = (AnalyzeNewsTruthfulnessOutput & { source: 'text' }) | (AnalyzeImageTruthfulnessOutput & { source: 'image' });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-6 sm:py-10 px-4">
      <header className="mb-6 sm:mb-10 text-center">
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <ShieldCheck className="h-10 w-10 sm:h-12 sm:w-12 text-primary mr-2 sm:mr-3" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-foreground">TruthSleuth</h1>
        </div>
        <p className="mt-1 sm:mt-2 text-lg sm:text-xl text-muted-foreground">
          Your AI-powered assistant for detecting potentially misleading news.
        </p>
      </header>

      <Card className="w-full max-w-2xl shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="bg-card">
          <CardTitle className="text-xl sm:text-2xl font-headline text-center text-foreground">Analyze News Content</CardTitle>
          <CardDescription className="text-center text-muted-foreground pt-1 text-sm sm:text-base">
            Input text or upload an image to check its truthfulness.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'text' | 'image')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
              <TabsTrigger value="text" className="text-sm sm:text-base py-2 sm:py-2.5">
                <FileText className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Text Input
              </TabsTrigger>
              <TabsTrigger value="image" className="text-sm sm:text-base py-2 sm:py-2.5">
                <ImageUp className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Image Upload
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text">
              <form onSubmit={handleTextAnalysis} className="space-y-4 sm:space-y-6">
                <Textarea
                  placeholder="Paste your news article text here..."
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setError(null);
                    setAnalysisResult(null);
                  }}
                  rows={6}
                  sm-rows={8}
                  md-rows={10}
                  className="text-sm sm:text-base rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                  disabled={isLoading}
                />
                <Button type="submit" className="w-full text-base sm:text-lg py-2.5 sm:py-3 rounded-lg" disabled={isLoading || !inputText.trim()}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />}
                  Analyze Text
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="image">
              <form onSubmit={handleImageAnalysis} className="space-y-4 sm:space-y-6">
                <div>
                  <Label htmlFor="image-upload" className={`flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/20 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex flex-col items-center justify-center pt-4 sm:pt-5 pb-5 sm:pb-6">
                      <ImageUp className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 text-muted-foreground" />
                      <p className="mb-1.5 sm:mb-2 text-xs sm:text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF (MAX. 10MB)</p>
                    </div>
                  </Label>
                  <Input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isLoading} />
                </div>

                {imageDataUrl && !error && (
                  <div className="mt-3 sm:mt-4 border border-border rounded-lg p-2 sm:p-4 bg-muted/20 shadow-sm">
                    <p className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-foreground">Image Preview:</p>
                    <div className="flex justify-center">
                       <Image src={imageDataUrl} alt="Uploaded preview" width={400} height={300} className="rounded-md object-contain max-h-[200px] sm:max-h-[300px]" />
                    </div>
                  </div>
                )}
                <Button type="submit" className="w-full text-base sm:text-lg py-2.5 sm:py-3 rounded-lg" disabled={isLoading || !imageDataUrl}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />}
                  Analyze Image
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {isLoading && (
            <div className="mt-6 sm:mt-8 text-center">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-primary animate-spin mx-auto" />
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">Analyzing... Please wait.</p>
            </div>
          )}

          {error && !isLoading && (
             <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-center">
                <p className="text-destructive font-medium text-sm sm:text-base">{error}</p>
             </div>
          )}
          
          {analysisResult && !isLoading && !error && (
            <TruthScoreDisplay 
              score={analysisResult.truthfulnessPercentage} 
              reason={analysisResult.source === 'text' ? analysisResult.reason : undefined} 
            />
          )}
        </CardContent>
      </Card>
      <footer className="mt-8 sm:mt-12 text-center text-muted-foreground text-xs sm:text-sm">
        <p>&copy; {new Date().getFullYear()} TruthSleuth. For informational purposes only.</p>
      </footer>
    </div>
  );
}
