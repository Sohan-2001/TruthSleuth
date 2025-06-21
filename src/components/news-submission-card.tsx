
"use client";

import { useState } from 'react';
import type { NewsSubmission, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Link as LinkIcon, Plus } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { Input } from '@/components/ui/input';
import { mockUsers } from '@/lib/mock-data';

interface NewsSubmissionCardProps {
  submission: Omit<NewsSubmission, 'submittedBy' | 'evidence'> & { 
    submittedBy: User | undefined,
    evidence: (Omit<NewsSubmission['evidence'][0], 'userId'> & { userId: User | undefined })[]
  };
}

export function NewsSubmissionCard({ submission }: NewsSubmissionCardProps) {
  const { title, content, submittedBy, submittedAt, upvotes, downvotes, evidence } = submission;
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);

  const voteTotal = upvotes + downvotes;
  const upvotePercentage = voteTotal > 0 ? (upvotes / voteTotal) * 100 : 50;

  const getVoteBadgeColor = () => {
    if (upvotePercentage > 75) return 'bg-success text-success-foreground';
    if (upvotePercentage < 25) return 'bg-destructive text-destructive-foreground';
    return 'bg-warning text-warning-foreground';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs pt-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={submittedBy?.avatarUrl} alt={submittedBy?.name} />
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
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowBigUp className="h-5 w-5 text-green-500" />
            <span>{upvotes}</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowBigDown className="h-5 w-5 text-red-500" />
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
              {evidence.map(e => (
                <div key={e.id} className="text-xs p-3 bg-muted/50 rounded-md">
                  <p className="font-semibold">{mockUsers.find(u => u.id === e.userId)?.name}</p>
                  <p className="text-muted-foreground mt-1">{e.text}</p>
                  {e.link && (
                    <Link href={e.link} target="_blank" className="text-primary hover:underline flex items-center gap-1 mt-1">
                      <LinkIcon className="h-3 w-3" />
                      Source Link
                    </Link>
                  )}
                </div>
              ))}
              <Separator />
               <div className="pt-2">
                 <Button variant="outline" size="sm" onClick={() => setShowEvidenceForm(!showEvidenceForm)}>
                   <Plus className="mr-2 h-4 w-4"/>
                   Add Evidence
                 </Button>
                 {showEvidenceForm && (
                    <div className="mt-4 space-y-2">
                        <Textarea placeholder="Share your evidence or source..." />
                        <Input placeholder="Optional: link to source" />
                        <Button size="sm">Submit Evidence</Button>
                    </div>
                 )}
               </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
