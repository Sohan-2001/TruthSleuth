
"use client";

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import type { User, NewsSubmission as NewsSubmissionType, Evidence } from '@/lib/types';
import { NewsSubmissionCard } from '@/components/news-submission-card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SubmitNewsDialog } from '@/components/submit-news-dialog';
import { mockUsers, mockSubmissions } from '@/lib/mock-data';

export type HydratedSubmission = Omit<NewsSubmissionType, 'submittedBy' | 'evidence'> & {
  submittedBy: User | undefined;
  evidence: (Omit<Evidence, 'userId'> & { user: User | undefined })[];
};

export default function CommunityPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<NewsSubmissionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  useEffect(() => {
    // Attempt to load from cache first
    try {
      const cachedUsers = localStorage.getItem('community_users');
      const cachedSubmissions = localStorage.getItem('community_submissions');
      const cacheTimestamp = localStorage.getItem('community_cache_timestamp');
      
      if (cachedUsers && cachedSubmissions && cacheTimestamp) {
        const isCacheFresh = new Date().getTime() - Number(cacheTimestamp) < 5 * 60 * 1000; // 5 minutes
        if (isCacheFresh) {
          setUsers(JSON.parse(cachedUsers));
          setSubmissions(JSON.parse(cachedSubmissions));
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error reading from localStorage", error);
    }
    
    // Set up Firebase listeners
    const usersRef = ref(db, 'users');
    const submissionsRef = ref(db, 'submissions');
    const recentSubmissionsQuery = query(submissionsRef, orderByChild('submittedAt'), limitToLast(20));
    
    let usersLoaded = false;
    let submissionsLoaded = false;

    const checkLoading = () => {
      // Only update loading state if it's currently true
      if (isLoading && usersLoaded && submissionsLoaded) {
        setIsLoading(false);
      }
    };

    const usersUnsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const usersArray = data ? Object.values(data) : [];
      setUsers(usersArray as User[]);
      usersLoaded = true;
      checkLoading();
      
      try {
        localStorage.setItem('community_users', JSON.stringify(usersArray));
      } catch (error) {
        console.error("Error writing users to localStorage", error);
      }
    }, (error) => {
      console.error("Firebase users read failed:", error);
      usersLoaded = true;
      checkLoading();
    });

    const submissionsUnsubscribe = onValue(recentSubmissionsQuery, (snapshot) => {
      const submissionList: NewsSubmissionType[] = [];
      snapshot.forEach(childSnapshot => {
        const sub = childSnapshot.val();
        submissionList.push({
          ...sub,
          evidence: sub.evidence ? Object.values(sub.evidence) : [],
        });
      });
      setSubmissions(submissionList);
      submissionsLoaded = true;
      checkLoading();
      
      try {
        localStorage.setItem('community_submissions', JSON.stringify(submissionList));
        localStorage.setItem('community_cache_timestamp', new Date().getTime().toString());
      } catch (error) {
        console.error("Error writing submissions to localStorage", error);
      }
    }, (error) => {
      console.error("Firebase submissions read failed:", error);
      submissionsLoaded = true;
      checkLoading();
    });

    return () => {
      usersUnsubscribe();
      submissionsUnsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hydratedSubmissions: HydratedSubmission[] = useMemo(() => {
    const useMocks = users.length === 0 && submissions.length === 0 && !isLoading;
    
    const finalUsers = useMocks ? mockUsers : users;
    const finalSubmissions = useMocks ? mockSubmissions : submissions;

    if (finalUsers.length === 0 || finalSubmissions.length === 0) return [];

    const usersMap = new Map(finalUsers.map(u => [u.id, u]));

    return finalSubmissions
      .map(submission => {
        const hydratedEvidence = (submission.evidence || []).map(e => ({
          ...e,
          user: usersMap.get(e.userId)
        }));
        
        return {
          ...submission,
          submittedBy: usersMap.get(submission.submittedBy),
          evidence: hydratedEvidence
        };
      })
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  }, [users, submissions, isLoading]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold font-headline">Community Verification</h1>
            <p className="text-muted-foreground mt-2">Help verify news submitted by the community. Upvote facts, downvote fiction.</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-block">
                  <Button disabled={!user} onClick={() => user && setIsSubmitDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Submit News
                  </Button>
                </div>
              </TooltipTrigger>
              {!user && (
                <TooltipContent>
                  <p>You must be logged in to submit news.</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-6">
          {hydratedSubmissions.length > 0 ? (
            hydratedSubmissions.map(submission => (
              <NewsSubmissionCard key={submission.id} submission={submission} />
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg">
              <p className="font-semibold">No community submissions yet.</p>
              <p className="text-sm mt-1">Be the first to submit a story for verification!</p>
            </div>
          )}
        </div>
      </div>
      <SubmitNewsDialog isOpen={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen} />
    </>
  );
}
