
"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TruthScoreDisplayProps {
  score: number;
  reason?: string;
}

const TruthScoreDisplay: FC<TruthScoreDisplayProps> = ({ score, reason }) => {
  let scoreTextColorClass = 'text-primary'; // Default to cyan (primary)
  let progressIndicatorClass = 'bg-primary';

  if (score < 40) {
    scoreTextColorClass = 'text-destructive'; // Red
    progressIndicatorClass = 'bg-destructive';
  } else if (score < 70) {
    scoreTextColorClass = 'text-warning'; // Yellow/Orange
    progressIndicatorClass = 'bg-warning';
  } else {
    scoreTextColorClass = 'text-success'; // Green
    progressIndicatorClass = 'bg-success';
  }

  return (
    <Card className="mt-6 sm:mt-8 w-full border-2 border-primary rounded-md bg-card/80 backdrop-blur-sm">
      <CardHeader className="p-4 sm:p-6 border-b border-primary/50">
        <CardTitle className="text-xl sm:text-2xl md:text-3xl font-headline text-center text-foreground">Veracity Assessment Protocol</CardTitle>
      </CardHeader>
      <CardContent className="text-center p-4 sm:p-6 pt-2 sm:pt-4">
        <div className="mb-4 sm:mb-6">
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-1">Confidence Index:</p>
          <p className={`text-5xl sm:text-6xl md:text-7xl font-bold my-1 sm:my-2 ${scoreTextColorClass}`}>
            {score}<span className="text-2xl sm:text-3xl md:text-4xl">%</span>
          </p>
        </div>
        <Progress value={score} className={`w-full h-3 sm:h-4 mb-4 sm:mb-6 rounded-sm bg-muted/50 border border-input [&>div]:${progressIndicatorClass}`} />
        {reason && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border/50">
            <h3 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2 text-left text-foreground">Threat Analysis Log:</h3>
            <p className="text-sm sm:text-base text-muted-foreground text-left whitespace-pre-wrap bg-muted/20 p-3 rounded-sm border border-input">{reason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TruthScoreDisplay;
