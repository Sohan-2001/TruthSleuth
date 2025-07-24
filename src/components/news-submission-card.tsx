
"use client";

import { useState } from 'react';
import type { NewsSubmission, User, Evidence } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Link as LinkIcon, Plus, Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { push, ref, set, runTransaction } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';

type HydratedEvidence = Omit<Evidence, 'userId'> & { user: User | undefined };

interface NewsSubmissionCardProps {
  submission: Omit<NewsSubmission, 'submittedBy' | 'evidence'> & {
    id: string;
    upvotes: number;
    downvotes: number;
    upvotedBy?: { [key: string]: boolean };
    downvotedBy?: { [key: string]: boolean };
    submittedBy: User | undefined;
    evidence: HydratedEvidence[];
  };
}

export function NewsSubmissionCard({ submission }: NewsSubmissionCardProps) {
  const { title, content, submittedBy, submittedAt, upvotes, downvotes, evidence } = submission;
  const { user } = useAuth();
  const { toast } = useToast();

  const [isVoting, setIsVoting] = useState(false);
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [evidenceText, setEvidenceText] = useState('');
  const [evidenceLink, setEvidenceLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to vote.',
      });
      return;
    }
    setIsVoting(true);
    const submissionRef = ref(db, `submissions/${submission.id}`);

    try {
      await runTransaction(submissionRef, (currentData) => {
        if (currentData) {
          currentData.upvotedBy = currentData.upvotedBy || {};
          currentData.downvotedBy = currentData.downvotedBy || {};
          currentData.upvotes = currentData.upvotes || 0;
          currentData.downvotes = currentData.downvotes || 0;

          const userId = user.id;
          const hasUpvoted = currentData.upvotedBy[userId];
          const hasDownvoted = currentData.downvotedBy[userId];

          if (voteType === 'up') {
            if (hasUpvoted) {
              currentData.upvotes--;
              delete currentData.upvotedBy[userId];
            } else {
              currentData.upvotes++;
              currentData.upvotedBy[userId] = true;
              if (hasDownvoted) {
                currentData.downvotes--;
                delete currentData.downvotedBy[userId];
              }
            }
          } else { // voteType === 'down'
            if (hasDownvoted) {
              currentData.downvotes--;
              delete currentData.downvotedBy[userId];
            } else {
              currentData.downvotes++;
              currentData.downvotedBy[userId] = true;
              if (hasUpvoted) {
                currentData.upvotes--;
                delete currentData.upvotedBy[userId];
              }
            }
          }
        }
        return currentData;
      });
    } catch (error) {
      console.error('Vote transaction failed: ', error);
      toast({
        variant: 'destructive',
        title: 'Vote Failed',
        description: 'Could not update your vote. Please try again.',
      });
    } finally {
      setIsVoting(false);
    }
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceText.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const evidenceRef = ref(db, `submissions/${submission.id}/evidence`);
      const newEvidenceRef = push(evidenceRef);
      await set(newEvidenceRef, {
        id: newEvidenceRef.key,
        userId: user.id,
        text: evidenceText,
        link: evidenceLink || null,
        submittedAt: new Date().toISOString()
      });

      toast({ title: 'Success', description: 'Your evidence has been submitted.' });
      setEvidenceText('');
      setEvidenceLink('');
      setShowEvidenceForm(false);
    } catch (error) {
      console.error("Failed to submit evidence:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to submit evidence.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const voteTotal = upvotes + downvotes;
  const upvotePercentage = voteTotal > 0 ? (upvotes / voteTotal) * 100 : 50;

  const getVoteBadgeColor = () => {
    if (upvotePercentage > 75) return 'bg-success text-success-foreground';
    if (upvotePercentage < 25) return 'bg-destructive text-destructive-foreground';
    return 'bg-warning text-warning-foreground';
  };
  
  const userHasUpvoted = user && submission.upvotedBy && submission.upvotedBy[user.id];
  const userHasDownvoted = user && submission.downvotedBy && submission.downvotedBy[user.id];


  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs pt-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback>{submittedBy?.name.charAt(0) ?? 'U'}</AvatarFallback>
          </Avatar>
          <span>Submitted by <span className="font-semibold text-foreground">{submittedBy?.name ?? 'Anonymous'}</span></span>
          <span>&bull;</span>
          <span>{new Date(submittedAt).toLocaleDateString()}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{content}</p>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => handleVote('up')} disabled={!user || isVoting}>
            <ArrowBigUp className={cn("h-5 w-5 text-green-500", userHasUpvoted && "fill-current")} />
            <span>{upvotes}</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => handleVote('down')} disabled={!user || isVoting}>
            <ArrowBigDown className={cn("h-5 w-5 text-red-500", userHasDownvoted && "fill-current")} />
            <span>{downvotes}</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
            <Badge className={cn(getVoteBadgeColor())}>
                {Math.round(upvotePercentage)}% Verified
            </Badge>
        </div>
      </CardFooter>
      <Accordion type="single" collapsible className="w-full bg-background px-4">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4" />
              <span>Evidence & Discussion ({evidence.length})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {evidence.length > 0 ? evidence.map(e => (
                <div key={e.id} className="text-xs p-3 bg-muted/50 rounded-md">
                  <p className="font-semibold">{e.user?.name ?? 'Anonymous'}</p>
                  <p className="text-muted-foreground mt-1">{e.text}</p>
                  {e.link && (
                    <Link href={e.link} target="_blank" className="text-primary hover:underline flex items-center gap-1 mt-1">
                      <LinkIcon className="h-3 w-3" />
                      Source Link
                    </Link>
                  )}
                </div>
              )) : <p className="text-xs text-muted-foreground text-center">No evidence submitted yet.</p>}
              <Separator />
               <div className="pt-2">
                 <Button variant="outline" size="sm" onClick={() => setShowEvidenceForm(!showEvidenceForm)} disabled={!user}>
                   <Plus className="mr-2 h-4 w-4"/>
                   Add Evidence
                 </Button>
                 {showEvidenceForm && user && (
                    <form onSubmit={handleAddEvidence} className="mt-4 space-y-2">
                        <Textarea 
                          placeholder="Share your evidence or source..." 
                          value={evidenceText} 
                          onChange={e => setEvidenceText(e.target.value)} 
                          required 
                          disabled={isSubmitting}
                        />
                        <Input 
                          placeholder="Optional: link to source" 
                          value={evidenceLink} 
                          onChange={e => setEvidenceLink(e.target.value)} 
                          disabled={isSubmitting}
                        />
                        <Button size="sm" type="submit" disabled={isSubmitting || !evidenceText.trim()}>
                           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                           {isSubmitting ? "Submitting..." : "Submit Evidence"}
                        </Button>
                    </form>
                 )}
                 {!user && showEvidenceForm && (
                   <p className="text-xs text-muted-foreground mt-2">Please log in to add evidence.</p>
                 )}
               </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
