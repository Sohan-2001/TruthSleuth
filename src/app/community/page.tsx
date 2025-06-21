
import { NewsSubmissionCard } from '@/components/news-submission-card';
import { mockSubmissions, mockUsers } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function CommunityPage() {
  const submissionsWithUsers = mockSubmissions.map(submission => {
    const user = mockUsers.find(u => u.id === submission.submittedBy);
    return { ...submission, submittedBy: user };
  }).sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold font-headline">Community Verification</h1>
          <p className="text-muted-foreground mt-2">Help verify news submitted by the community. Upvote facts, downvote fiction.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Submit News
        </Button>
      </div>

      <div className="space-y-6">
        {submissionsWithUsers.map(submission => (
          <NewsSubmissionCard key={submission.id} submission={submission} />
        ))}
      </div>
    </div>
  );
}
