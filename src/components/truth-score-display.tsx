"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TruthScoreDisplayProps {
  score: number;
  reason?: string;
}

const TruthScoreDisplay: FC<TruthScoreDisplayProps> = ({ score, reason }) => {
  let scoreTextColorClass = 'text-primary';
  let progressIndicatorClass = 'bg-primary';

  if (score < 40) {
    scoreTextColorClass = 'text-destructive';
    progressIndicatorClass = 'bg-destructive';
  } else if (score < 70) {
    scoreTextColorClass = 'text-warning';
    progressIndicatorClass = 'bg-warning';
  } else {
    scoreTextColorClass = 'text-success';
    progressIndicatorClass = 'bg-success';
  }

  return (
    <Card className="mt-8 w-full shadow-xl rounded-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-center text-foreground">Analysis Result</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-6">
          <p className="text-xl text-muted-foreground mb-1">Truthfulness Score:</p>
          <p className={`text-7xl font-bold my-2 ${scoreTextColorClass}`}>
            {score}%
          </p>
        </div>
        <Progress value={score} className={`w-full h-4 mb-6 rounded-full [&>div]:${progressIndicatorClass}`} />
        {reason && (
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-xl font-semibold mb-2 text-left text-foreground">Reasoning:</h3>
            <p className="text-base text-muted-foreground text-left whitespace-pre-wrap">{reason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TruthScoreDisplay;
