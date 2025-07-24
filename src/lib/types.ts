import { z } from 'zod';

export interface User {
  id: string;
  name: string;
  points: number;
  badges: string[];
}

export interface Evidence {
  id: string;
  userId: string;
  text: string;
  link?: string;
  submittedAt: string;
}

export interface NewsSubmission {
  id:string;
  title: string;
  content: string;
  submittedBy: string; // userId
  submittedAt: string;
  aiScore: number;
  upvotes: number;
  downvotes: number;
  evidence: Evidence[];
  upvotedBy?: { [key: string]: boolean };
  downvotedBy?: { [key: string]: boolean };
}

export interface Verification {
  id: string;
  summary: string;
  score: number;
  analyzedAt: string;
}


// AI Schema Types

export const AnalyzeNewsTruthfulnessInputSchema = z.object({
  newsText: z.string().describe('The news text to analyze for truthfulness.'),
});
export type AnalyzeNewsTruthfulnessInput = z.infer<typeof AnalyzeNewsTruthfulnessInputSchema>;

export const AnalyzeNewsTruthfulnessOutputSchema = z.object({
  truthfulnessPercentage: z
    .number()
    .min(0)
    .max(100)
    .describe('The percentage likelihood that the news is true.'),
  reason: z.string().optional().describe('The reasoning behind the truthfulness score.'),
  summary: z.string().describe('A brief, neutral summary of the news text, no more than 10 words.'),
});
export type AnalyzeNewsTruthfulnessOutput = z.infer<typeof AnalyzeNewsTruthfulnessOutputSchema>;


export const AnalyzeImageTruthfulnessInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo containing news article text, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type AnalyzeImageTruthfulnessInput = z.infer<typeof AnalyzeImageTruthfulnessInputSchema>;

export const AnalyzeImageTruthfulnessOutputSchema = z.object({
  truthfulnessPercentage: z
    .number()
    .describe('The likelihood the submitted content is true, expressed as a percentage (0-100).'),
});
export type AnalyzeImageTruthfulnessOutput = z.infer<typeof AnalyzeImageTruthfulnessOutputSchema>;


export const AnalyzeUrlTruthfulnessInputSchema = z.object({
  url: z.string().url().describe('The URL of the news article to analyze.'),
});
export type AnalyzeUrlTruthfulnessInput = z.infer<typeof AnalyzeUrlTruthfulnessInputSchema>;

export type AnalyzeUrlTruthfulnessOutput = AnalyzeNewsTruthfulnessOutput;
