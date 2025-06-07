
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
    <Card className="mt-6 sm:mt-8 w-full shadow-xl rounded-xl">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl md:text-3xl font-headline text-center text-foreground">Analysis Result</CardTitle>
      </CardHeader>
      <CardContent className="text-center p-4 sm:p-6 pt-0">
        <div className="mb-4 sm:mb-6">
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-1">Truthfulness Score:</p>
          <p className={`text-5xl sm:text-6xl md:text-7xl font-bold my-1 sm:my-2 ${scoreTextColorClass}`}>
            {score}%
          </p>
        </div>
        <Progress value={score} className={`w-full h-3 sm:h-4 mb-4 sm:mb-6 rounded-full [&>div]:${progressIndicatorClass}`} />
        {reason && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
            <h3 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2 text-left text-foreground">Reasoning:</h3>
            <p className="text-sm sm:text-base text-muted-foreground text-left whitespace-pre-wrap">{reason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TruthScoreDisplay;
