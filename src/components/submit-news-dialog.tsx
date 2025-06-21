
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { ref, push, set } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { analyzeNewsTruthfulness } from '@/ai/flows/analyze-news-truthfulness';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface SubmitNewsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const formSchema = z.object({
  title: z.string().min(10, { message: "Title must be at least 10 characters long." }).max(150, { message: "Title must be 150 characters or less." }),
  content: z.string().min(50, { message: "Content must be at least 50 characters long." }).max(2000, { message: "Content must be 2000 characters or less." }),
});

export function SubmitNewsDialog({ isOpen, onOpenChange }: SubmitNewsDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to submit news.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const analysisResult = await analyzeNewsTruthfulness({ newsText: values.content });

      const submissionsRef = ref(db, 'submissions');
      const newSubmissionRef = push(submissionsRef);
      const submissionId = newSubmissionRef.key;
      
      if (!submissionId) {
          throw new Error("Could not generate a submission ID.");
      }

      const newSubmission = {
        id: submissionId,
        title: values.title,
        content: values.content,
        submittedBy: user.id,
        submittedAt: new Date().toISOString(),
        aiScore: analysisResult.truthfulnessPercentage,
        upvotes: 0,
        downvotes: 0,
        evidence: [],
      };

      await set(newSubmissionRef, newSubmission);

      toast({ title: 'Success!', description: 'Your news submission has been added for community review.' });
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to submit news:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast({ variant: 'destructive', title: 'Submission Failed', description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!isSubmitting) {
            onOpenChange(open);
        }
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit News for Verification</DialogTitle>
          <DialogDescription>
            Provide the title and content of the news article. Our AI will perform an initial analysis, and then the community will weigh in.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                    <Input placeholder="Enter the news title" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                    <Textarea placeholder="Paste the news content here" {...field} rows={8} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Analyzing & Submitting...' : 'Submit'}
                </Button>
            </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
