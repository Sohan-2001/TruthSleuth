
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, query, limitToLast } from 'firebase/database';
import type { Verification } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface TrendingTopic {
  summary: string;
  count: number;
  averageScore: number;
}

const mockTrendingTopics: TrendingTopic[] = [
    { summary: 'Breakthrough in quantum computing announced.', count: 231, averageScore: 94 },
    { summary: 'Study finds microplastics in clouds.', count: 198, averageScore: 85 },
    { summary: 'Lost city discovered in Amazon rainforest.', count: 154, averageScore: 78 },
    { summary: 'Celebrity launches "oxygen-free" water.', count: 123, averageScore: 15 },
    { summary: 'Politician claims moon is made of cheese.', count: 99, averageScore: 2 },
    { summary: 'New e-vehicle charges in under 5 minutes.', count: 87, averageScore: 65 },
];


export default function TrendingPage() {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verificationsRef = ref(db, 'verifications');
    // Fetch last 1000 verifications to keep it manageable
    const recentVerificationsQuery = query(verificationsRef, limitToLast(1000));

    const unsubscribe = onValue(recentVerificationsQuery, (snapshot) => {
      if (snapshot.exists()) {
        const verificationsData = snapshot.val();
        const verificationList: Verification[] = Object.values(verificationsData);

        const topicsMap = new Map<string, { scores: number[], count: number }>();

        verificationList.forEach(verification => {
          if (!verification.summary) return;
          // Normalize summary to handle minor variations
          const normalizedSummary = verification.summary.trim().toLowerCase();
          if (topicsMap.has(normalizedSummary)) {
            const existing = topicsMap.get(normalizedSummary)!;
            existing.scores.push(verification.score);
            existing.count++;
          } else {
            topicsMap.set(normalizedSummary, { scores: [verification.score], count: 1 });
          }
        });

        const processedTopics: TrendingTopic[] = [];
        topicsMap.forEach((value, key) => {
          const averageScore = value.scores.reduce((a, b) => a + b, 0) / value.count;
          // Find original capitalization for display
          const originalSummary = verificationList.find(v => v.summary?.trim().toLowerCase() === key)?.summary || key;
          processedTopics.push({
            summary: originalSummary,
            count: value.count,
            averageScore: Math.round(averageScore),
          });
        });

        const sortedTopics = processedTopics
          .sort((a, b) => b.count - a.count)
          .slice(0, 20); // Show top 20 trending topics

        setTrendingTopics(sortedTopics);
      } else {
        setTrendingTopics([]);
      }
      setIsLoading(false);
    }, (error) => {
      console.error(error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-destructive';
    if (score < 70) return 'text-warning';
    return 'text-success';
  };
  
  const getProgressIndicatorClass = (score: number) => {
    if (score < 40) return 'bg-destructive';
    if (score < 70) return 'bg-warning';
    return 'bg-success';
  };

  const topicsToDisplay = trendingTopics.length > 0 || isLoading ? trendingTopics : mockTrendingTopics;

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-2">
        <TrendingUp className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold font-headline">Trending News</h1>
      </div>
      <p className="text-muted-foreground mb-8">Most frequently analyzed topics by the TruthSleuth community.</p>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Verified Topics</CardTitle>
          <CardDescription>Based on analyses submitted by our users and community.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic Summary</TableHead>
                  <TableHead className="text-center w-[150px]">Analyses</TableHead>
                  <TableHead className="text-right w-[250px]">Avg. Correctness</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topicsToDisplay.map((topic, index) => (
                  <TableRow key={`${topic.summary}-${index}`}>
                    <TableCell className="font-medium">{topic.summary}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{topic.count}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span className={cn('font-semibold w-12', getScoreColor(topic.averageScore))}>
                          {topic.averageScore}%
                        </span>
                        <Progress value={topic.averageScore} className="w-24 h-2" indicatorClassName={getProgressIndicatorClass(topic.averageScore)} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
