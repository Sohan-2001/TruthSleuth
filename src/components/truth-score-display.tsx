
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
    <Card className="mt-4 sm:mt-6 w-full border-2 border-primary rounded-md bg-card/80 backdrop-blur-sm">
      <CardHeader className="p-3 sm:p-4 md:p-6 border-b border-primary/50">
        <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-headline text-center text-foreground">Veracity Assessment Protocol</CardTitle>
      </CardHeader>
      <CardContent className="text-center p-3 sm:p-4 md:p-6 pt-2 sm:pt-3 md:pt-4">
        <div className="mb-3 sm:mb-4 md:mb-6">
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-1">Confidence Index:</p>
          <p className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold my-1 sm:my-2 ${scoreTextColorClass}`}>
            {score}<span className="text-lg sm:text-xl md:text-2xl lg:text-3xl">%</span>
          </p>
        </div>
        <Progress value={score} className={`w-full h-2.5 sm:h-3 md:h-4 mb-3 sm:mb-4 md:mb-6 rounded-sm bg-muted/50 border border-input [&>div]:${progressIndicatorClass}`} />
        {reason && (
          <div className="mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 md:pt-6 border-t border-border/50">
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-1 sm:mb-1.5 md:mb-2 text-left text-foreground">Threat Analysis Log:</h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground text-left whitespace-pre-wrap bg-muted/20 p-2 sm:p-3 rounded-sm border border-input">{reason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TruthScoreDisplay;
